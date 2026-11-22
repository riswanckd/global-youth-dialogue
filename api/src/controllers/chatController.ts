import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Message, MessageType } from '../models/Message';
import { ChatMedia } from '../models/ChatMedia';
import { User } from '../models/User';
import { encryptText, decryptText, encryptBuffer, decryptBuffer } from '../utils/chatEncryption';
import { ROLES } from '../constants/roles';

// MIME validation whitelist
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm'];
const ALLOWED_AUDIO_TYPES = ['audio/webm', 'audio/mp3', 'audio/mpeg', 'audio/ogg', 'audio/wav', 'audio/x-m4a', 'audio/m4a'];

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_AUDIO_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_VIDEO_SIZE = 15 * 1024 * 1024; // 15 MB

/**
 * Basic XSS sanitizer for chat text
 */
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
 * Helper to resolve the Super Admin user
 */
async function getSuperAdminUser() {
  const superAdmin = await User.findOne({
    $or: [{ role: ROLES.SUPER_ADMIN }, { email: 'admin@thegyde.in' }],
  });
  if (superAdmin) return superAdmin;

  // Fallback to first ADMIN
  const anyAdmin = await User.findOne({ role: ROLES.ADMIN });
  if (anyAdmin) return anyAdmin;

  throw new Error('System Super Administrator account is currently unavailable.');
}

/**
 * GET /api/chat/messages
 * Retrieves user's personal thread with the Super Admin
 */
export async function getMemberMessages(req: Request, res: Response) {
  try {
    const user = req.user!;
    const userId = user._id;

    // Fetch all messages in the conversation
    const messages = await Message.find({ conversationUserId: userId })
      .sort({ createdAt: 1 })
      .lean();

    // Mark any unread messages from admin as read
    await Message.updateMany(
      { conversationUserId: userId, receiverId: userId, isRead: false },
      { $set: { isRead: true } }
    );

    // Decrypt messages on the fly right before sending over HTTPS
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
      mediaUrl: msg.encryptedMediaKey ? `/api/chat/media/${msg._id}` : null,
      isRead: msg.isRead,
      createdAt: msg.createdAt,
    }));

    // Calculate unread count (incoming to user)
    const unreadCount = 0; // Since we just marked them as read

    res.status(200).json({
      success: true,
      data: {
        messages: decryptedMessages,
        hasSeenChatSpotlight: !!user.hasSeenChatSpotlight,
        unreadCount,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to retrieve messages' });
  }
}

/**
 * POST /api/chat/send
 * Sends a message from Member/Presenter to Super Admin
 */
export async function sendMemberMessage(req: Request, res: Response) {
  try {
    const user = req.user!;
    const { content = '', messageType = 'TEXT', mediaBase64, mediaMimeType, mediaDuration, fileName } = req.body;

    const type = (messageType || 'TEXT').toUpperCase() as MessageType;
    if (!['TEXT', 'IMAGE', 'VIDEO', 'VOICE'].includes(type)) {
      return res.status(400).json({ success: false, error: 'Invalid message type' });
    }

    if (type === 'TEXT' && (!content || !content.trim())) {
      return res.status(400).json({ success: false, error: 'Message content cannot be empty' });
    }

    const superAdmin = await getSuperAdminUser();
    const sanitizedContent = sanitizeText(content);

    let encryptedMediaKey: string | null = null;
    let savedMediaMime: string | null = null;
    let mediaSize: number | null = null;
    let mediaBuffer: Buffer | null = null;

    // Handle media processing if attached
    if (type !== 'TEXT') {
      if (!mediaBase64) {
        return res.status(400).json({ success: false, error: 'Media payload is required for this message type' });
      }

      // Extract raw base64 data if data URI prefix is present
      const base64Data = mediaBase64.replace(/^data:[a-zA-Z0-9\/\-+.]+;base64,/, '');
      mediaBuffer = Buffer.from(base64Data, 'base64');
      mediaSize = mediaBuffer.length;

      // Validate MIME type & file limits
      if (type === 'IMAGE') {
        if (!ALLOWED_IMAGE_TYPES.includes(mediaMimeType)) {
          return res.status(400).json({ success: false, error: 'Only JPEG, PNG, and WebP images are allowed' });
        }
        if (mediaSize > MAX_IMAGE_SIZE) {
          return res.status(400).json({ success: false, error: 'Image size exceeds 5MB limit' });
        }
      } else if (type === 'VOICE') {
        if (!ALLOWED_AUDIO_TYPES.includes(mediaMimeType)) {
          return res.status(400).json({ success: false, error: 'Unsupported voice format' });
        }
        if (mediaSize > MAX_AUDIO_SIZE) {
          return res.status(400).json({ success: false, error: 'Voice note exceeds 5MB limit' });
        }
      } else if (type === 'VIDEO') {
        if (!ALLOWED_VIDEO_TYPES.includes(mediaMimeType)) {
          return res.status(400).json({ success: false, error: 'Only MP4 and WebM videos are allowed' });
        }
        if (mediaSize > MAX_VIDEO_SIZE) {
          return res.status(400).json({ success: false, error: 'Video exceeds 15MB limit' });
        }
      }

      savedMediaMime = mediaMimeType;
    }

    // Encrypt content with AES-256-GCM
    const { ciphertext, iv, authTag } = encryptText(sanitizedContent || `[${type}]`);

    // Create Message document
    const message = new Message({
      conversationUserId: user._id,
      senderId: user._id,
      senderRole: user.role,
      receiverId: superAdmin._id,
      messageType: type,
      encryptedContent: ciphertext,
      encryptedMediaKey: type !== 'TEXT' ? 'stored_encrypted' : null,
      mediaMimeType: savedMediaMime,
      mediaDuration: mediaDuration ? Number(mediaDuration) : null,
      mediaSize,
      iv,
      authTag,
      isRead: false,
    });

    await message.save();

    // If media exists, encrypt buffer and store in private ChatMedia collection
    if (mediaBuffer && savedMediaMime) {
      const encrypted = encryptBuffer(mediaBuffer);
      const chatMedia = new ChatMedia({
        messageId: message._id,
        conversationUserId: user._id,
        encryptedData: encrypted.encryptedBuffer,
        iv: encrypted.iv,
        authTag: encrypted.authTag,
        mimeType: savedMediaMime,
        size: mediaSize,
        fileName: fileName || `${type.toLowerCase()}_${Date.now()}`,
      });
      await chatMedia.save();
    }

    const responseData = {
      id: message._id.toString(),
      conversationUserId: user._id.toString(),
      senderId: user._id.toString(),
      senderRole: user.role,
      receiverId: superAdmin._id.toString(),
      messageType: type,
      content: sanitizedContent || `[${type}]`,
      hasMedia: type !== 'TEXT',
      mediaMimeType: savedMediaMime,
      mediaDuration: message.mediaDuration,
      mediaSize,
      mediaUrl: type !== 'TEXT' ? `/api/chat/media/${message._id}` : null,
      isRead: false,
      createdAt: message.createdAt,
    };

    res.status(201).json({ success: true, data: responseData });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to send message' });
  }
}

/**
 * PATCH /api/chat/spotlight-seen
 * Updates hasSeenChatSpotlight = true for the authenticated user
 */
export async function markSpotlightSeen(req: Request, res: Response) {
  try {
    const user = req.user!;
    await User.findByIdAndUpdate(user._id, { $set: { hasSeenChatSpotlight: true } });
    res.status(200).json({ success: true, message: 'Spotlight onboarding marked as completed' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to update spotlight status' });
  }
}

/**
 * GET /api/chat/media/:messageId
 * Authenticated proxy serving decrypted media strictly to conversation owner or SUPER_ADMIN
 */
export async function getMediaStream(req: Request, res: Response) {
  try {
    const user = req.user!;
    const messageId = String(req.params.messageId);

    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      return res.status(400).json({ success: false, error: 'Invalid message ID' });
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ success: false, error: 'Media not found' });
    }

    // Strict RBAC clearance: only SUPER_ADMIN or conversation owner
    const isSuperAdmin = user.role === ROLES.SUPER_ADMIN || user.email === 'admin@thegyde.in';
    const isOwner = user._id.toString() === message.conversationUserId.toString();

    if (!isSuperAdmin && !isOwner) {
      return res.status(403).json({ success: false, error: 'Access denied: You are not authorized to view this media' });
    }

    const chatMedia = await ChatMedia.findOne({ messageId: message._id });
    if (!chatMedia) {
      return res.status(404).json({ success: false, error: 'Media stream file not found in secure storage' });
    }

    // Decrypt binary buffer in memory
    const decryptedBuffer = decryptBuffer(chatMedia.encryptedData, chatMedia.iv, chatMedia.authTag);

    // Enforce strict zero-caching security headers
    res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate, max-age=0, s-maxage=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Content-Type', message.mediaMimeType || chatMedia.mimeType || 'application/octet-stream');
    res.setHeader('Content-Length', decryptedBuffer.length);

    res.status(200).send(decryptedBuffer);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to stream media' });
  }
}
