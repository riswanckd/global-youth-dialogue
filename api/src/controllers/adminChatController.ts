import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Message, MessageType } from '../models/Message';
import { ChatMedia } from '../models/ChatMedia';
import { User } from '../models/User';
import { encryptText, decryptText, encryptBuffer } from '../utils/chatEncryption';
import { ROLES } from '../constants/roles';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime', 'video/ogg', 'video/x-m4v'];
const ALLOWED_AUDIO_TYPES = [
  'audio/webm',
  'audio/mp3',
  'audio/mpeg',
  'audio/ogg',
  'audio/wav',
  'audio/x-m4a',
  'audio/m4a',
  'audio/mp4',
  'audio/aac',
  'audio/x-wav',
  'audio/3gpp',
];
const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/zip',
  'application/x-zip-compressed',
];

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_AUDIO_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_VIDEO_SIZE = 25 * 1024 * 1024; // 25 MB
const MAX_DOCUMENT_SIZE = 20 * 1024 * 1024; // 20 MB

function sanitizeText(input: string): string {
  if (!input) return '';
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}

/**
 * GET /api/admin/chat/conversations
 * Strictly Super Admin: Returns all conversations with preview and unread counts
 */
export async function getAdminConversations(req: Request, res: Response) {
  try {
    const adminUser = req.user!;

    // Find all unique conversation users
    const conversationUserIds = await Message.distinct('conversationUserId');

    const conversations = await Promise.all(
      conversationUserIds.map(async (cUserId) => {
        const participant = await User.findById(cUserId)
          .select('name email role avatar country flag status')
          .lean();

        if (!participant) return null;

        // Fetch latest message
        const lastMsg = await Message.findOne({ conversationUserId: cUserId })
          .sort({ createdAt: -1 })
          .lean();

        if (!lastMsg) return null;

        // Decrypt preview or show media tag
        let preview = '';
        if (lastMsg.messageType === 'IMAGE') preview = '[Image]';
        else if (lastMsg.messageType === 'VIDEO') preview = '[Video]';
        else if (lastMsg.messageType === 'VOICE') preview = '[Voice Note]';
        else if (lastMsg.messageType === 'DOCUMENT') preview = `[Document: ${lastMsg.fileName || 'File'}]`;
        else {
          preview = decryptText(lastMsg.encryptedContent, lastMsg.iv, lastMsg.authTag);
        }

        // Count unread messages sent by this user to the admin
        const unreadCount = await Message.countDocuments({
          conversationUserId: cUserId,
          senderId: { $ne: adminUser._id },
          isRead: false,
        });

        return {
          userId: participant._id.toString(),
          user: {
            id: participant._id.toString(),
            name: participant.name,
            email: participant.email,
            role: participant.role,
            avatar: participant.avatar,
            country: participant.country,
            flag: participant.flag,
            status: participant.status,
          },
          lastMessage: {
            id: lastMsg._id.toString(),
            messageType: lastMsg.messageType,
            preview,
            senderId: lastMsg.senderId.toString(),
            senderRole: lastMsg.senderRole,
            createdAt: lastMsg.createdAt,
            isRead: lastMsg.isRead,
          },
          unreadCount,
        };
      })
    );

    // Filter out nulls and sort by latest message date descending
    const validConversations = conversations
      .filter((c): c is NonNullable<typeof c> => c !== null)
      .sort((a, b) => new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime());

    // Total unread count across all conversations
    const totalUnread = validConversations.reduce((acc, curr) => acc + curr.unreadCount, 0);

    res.status(200).json({
      success: true,
      data: {
        conversations: validConversations,
        totalUnread,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to fetch conversations' });
  }
}

/**
 * GET /api/admin/chat/messages/:userId
 * Strictly Super Admin: Fetches full decrypted history and marks as read
 */
export async function getAdminConversationMessages(req: Request, res: Response) {
  try {
    const adminUser = req.user!;
    const userId = String(req.params.userId);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, error: 'Invalid user ID' });
    }

    const participant = await User.findById(userId)
      .select('name email role avatar country flag status createdAt')
      .lean();

    if (!participant) {
      return res.status(404).json({ success: false, error: 'Community member not found' });
    }

    // Mark messages sent by this user as read
    await Message.updateMany(
      { conversationUserId: userId, senderId: { $ne: adminUser._id }, isRead: false },
      { $set: { isRead: true } }
    );

    // Fetch all messages in the thread
    const messages = await Message.find({ conversationUserId: userId })
      .sort({ createdAt: 1 })
      .lean();

    const decryptedMessages = messages.map((msg) => ({
      id: msg._id.toString(),
      conversationUserId: msg.conversationUserId.toString(),
      senderId: msg.senderId.toString(),
      senderRole: msg.senderRole,
      receiverId: msg.receiverId.toString(),
      messageType: msg.messageType,
      content: decryptText(msg.encryptedContent, msg.iv, msg.authTag),
      hasMedia: !!msg.encryptedMediaKey,
      mediaMimeType: msg.mediaMimeType,
      mediaDuration: msg.mediaDuration,
      mediaSize: msg.mediaSize,
      fileName: msg.fileName,
      mediaUrl: msg.encryptedMediaKey ? `/api/chat/media/${msg._id}` : null,
      isRead: msg.isRead,
      createdAt: msg.createdAt,
    }));

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: participant._id.toString(),
          name: participant.name,
          email: participant.email,
          role: participant.role,
          avatar: participant.avatar,
          country: participant.country,
          flag: participant.flag,
          status: participant.status,
          joinedAt: (participant as any).createdAt,
        },
        messages: decryptedMessages,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to fetch conversation messages' });
  }
}

/**
 * POST /api/admin/chat/reply/:userId
 * Strictly Super Admin: Sends an encrypted reply to a specific community member
 */
export async function sendAdminReply(req: Request, res: Response) {
  try {
    const adminUser = req.user!;
    const userId = String(req.params.userId);
    const { content = '', messageType = 'TEXT', mediaBase64, mediaMimeType, mediaDuration, fileName } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, error: 'Invalid user ID' });
    }

    const recipient = await User.findById(userId);
    if (!recipient) {
      return res.status(404).json({ success: false, error: 'Target user not found' });
    }

    const type = (messageType || 'TEXT').toUpperCase() as MessageType;
    if (!['TEXT', 'IMAGE', 'VIDEO', 'VOICE', 'DOCUMENT'].includes(type)) {
      return res.status(400).json({ success: false, error: 'Invalid message type' });
    }

    if (type === 'TEXT' && (!content || !content.trim())) {
      return res.status(400).json({ success: false, error: 'Reply text cannot be empty' });
    }

    const sanitizedContent = sanitizeText(content);
    let savedMediaMime: string | null = null;
    let mediaSize: number | null = null;
    let mediaBuffer: Buffer | null = null;

    if (type !== 'TEXT') {
      if (!mediaBase64) {
        return res.status(400).json({ success: false, error: 'Media payload required' });
      }

      const base64Data = mediaBase64.includes(';base64,')
        ? mediaBase64.split(';base64,')[1]
        : mediaBase64.replace(/^data:[^,]+,/, '');
      mediaBuffer = Buffer.from(base64Data, 'base64');
      mediaSize = mediaBuffer.length;

      const rawMime = (mediaMimeType || '').toLowerCase();
      const cleanMime = rawMime.split(';')[0].trim();

      if (type === 'IMAGE') {
        if (!ALLOWED_IMAGE_TYPES.includes(cleanMime)) {
          return res.status(400).json({ success: false, error: 'Only JPEG, PNG, WebP, and GIF images are allowed' });
        }
        if (mediaSize > MAX_IMAGE_SIZE) {
          return res.status(400).json({ success: false, error: 'Image size exceeds 10MB' });
        }
      } else if (type === 'VOICE') {
        if (!ALLOWED_AUDIO_TYPES.includes(cleanMime)) {
          return res.status(400).json({ success: false, error: 'Unsupported audio format' });
        }
        if (mediaSize > MAX_AUDIO_SIZE) {
          return res.status(400).json({ success: false, error: 'Voice file exceeds 10MB' });
        }
      } else if (type === 'VIDEO') {
        if (!ALLOWED_VIDEO_TYPES.includes(cleanMime)) {
          return res.status(400).json({ success: false, error: 'Only MP4, WebM, and QuickTime videos are allowed' });
        }
        if (mediaSize > MAX_VIDEO_SIZE) {
          return res.status(400).json({ success: false, error: 'Video file exceeds 25MB' });
        }
      } else if (type === 'DOCUMENT') {
        if (!ALLOWED_DOCUMENT_TYPES.includes(cleanMime) && !cleanMime.startsWith('application/') && !cleanMime.startsWith('text/')) {
          return res.status(400).json({ success: false, error: 'Unsupported document format' });
        }
        if (mediaSize > MAX_DOCUMENT_SIZE) {
          return res.status(400).json({ success: false, error: 'Document exceeds 20MB' });
        }
      }

      savedMediaMime = cleanMime;
    }

    const { ciphertext, iv, authTag } = encryptText(sanitizedContent || `[${type}]`);

    const message = new Message({
      conversationUserId: recipient._id,
      senderId: adminUser._id,
      senderRole: ROLES.SUPER_ADMIN,
      receiverId: recipient._id,
      messageType: type,
      encryptedContent: ciphertext,
      encryptedMediaKey: type !== 'TEXT' ? 'stored_encrypted' : null,
      mediaMimeType: savedMediaMime,
      mediaDuration: mediaDuration ? Number(mediaDuration) : null,
      mediaSize,
      fileName: fileName || `${type.toLowerCase()}_reply_${Date.now()}`,
      iv,
      authTag,
      isRead: false,
    });

    await message.save();

    if (mediaBuffer && savedMediaMime) {
      const encrypted = encryptBuffer(mediaBuffer);
      const chatMedia = new ChatMedia({
        messageId: message._id,
        conversationUserId: recipient._id,
        encryptedData: encrypted.encryptedBuffer,
        iv: encrypted.iv,
        authTag: encrypted.authTag,
        mimeType: savedMediaMime,
        size: mediaSize,
        fileName: fileName || `${type.toLowerCase()}_reply_${Date.now()}`,
      });
      await chatMedia.save();
    }

    const responseData = {
      id: message._id.toString(),
      conversationUserId: recipient._id.toString(),
      senderId: adminUser._id.toString(),
      senderRole: ROLES.SUPER_ADMIN,
      receiverId: recipient._id.toString(),
      messageType: type,
      content: sanitizedContent || `[${type}]`,
      hasMedia: type !== 'TEXT',
      mediaMimeType: savedMediaMime,
      mediaDuration: message.mediaDuration,
      mediaSize,
      fileName: message.fileName,
      mediaUrl: type !== 'TEXT' ? `/api/chat/media/${message._id}` : null,
      isRead: false,
      createdAt: message.createdAt,
    };

    res.status(201).json({ success: true, data: responseData });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to send admin reply' });
  }
}
