import mongoose, { Document, Schema } from 'mongoose';

export interface INoticeReadReceipt extends Document {
  noticeId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  readAt: Date;
}

const NoticeReadReceiptSchema = new Schema<INoticeReadReceipt>(
  {
    noticeId: {
      type: Schema.Types.ObjectId,
      ref: 'Broadcast',
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    readAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

// Ensure a user can only have one read receipt per notice
NoticeReadReceiptSchema.index({ noticeId: 1, userId: 1 }, { unique: true });

export const NoticeReadReceipt = mongoose.model<INoticeReadReceipt>(
  'NoticeReadReceipt',
  NoticeReadReceiptSchema
);
