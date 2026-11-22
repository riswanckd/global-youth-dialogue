import mongoose, { Document, Schema } from 'mongoose';

export type MessageType = 'TEXT' | 'IMAGE' | 'VIDEO' | 'VOICE';

export interface IMessage extends Document {
  conversationUserId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  senderRole: string;
  receiverId: mongoose.Types.ObjectId;
  messageType: MessageType;
  encryptedContent: string;
  encryptedMediaKey?: string;
  mediaMimeType?: string;
  mediaDuration?: number;
  mediaSize?: number;
  iv: string;
  authTag: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    conversationUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    senderRole: {
      type: String,
      required: true,
      enum: ['MEMBER', 'PRESENTER', 'SUPER_ADMIN', 'ADMIN', 'COORDINATOR'],
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    messageType: {
      type: String,
      required: true,
      enum: ['TEXT', 'IMAGE', 'VIDEO', 'VOICE'],
      default: 'TEXT',
    },
    encryptedContent: {
      type: String,
      required: true,
    },
    encryptedMediaKey: {
      type: String,
      default: null,
    },
    mediaMimeType: {
      type: String,
      default: null,
    },
    mediaDuration: {
      type: Number,
      default: null,
    },
    mediaSize: {
      type: Number,
      default: null,
    },
    iv: {
      type: String,
      required: true,
    },
    authTag: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, any>) {
        delete ret.__v;
        ret.id = ret._id?.toString();
        delete ret._id;
        return ret;
      },
    },
  }
);

// Composite indexes for efficient querying
MessageSchema.index({ conversationUserId: 1, createdAt: 1 });
MessageSchema.index({ receiverId: 1, isRead: 1 });

export const Message = mongoose.model<IMessage>('Message', MessageSchema);
