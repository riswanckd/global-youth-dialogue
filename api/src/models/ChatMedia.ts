import mongoose, { Document, Schema } from 'mongoose';

export interface IChatMedia extends Document {
  messageId: mongoose.Types.ObjectId;
  conversationUserId: mongoose.Types.ObjectId;
  encryptedData: Buffer;
  iv: string;
  authTag: string;
  mimeType: string;
  size: number;
  fileName?: string;
  createdAt: Date;
}

const ChatMediaSchema = new Schema<IChatMedia>(
  {
    messageId: {
      type: Schema.Types.ObjectId,
      ref: 'Message',
      required: true,
      index: true,
    },
    conversationUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    encryptedData: {
      type: Buffer,
      required: true,
    },
    iv: {
      type: String,
      required: true,
    },
    authTag: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    fileName: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const ChatMedia = mongoose.model<IChatMedia>('ChatMedia', ChatMediaSchema);
