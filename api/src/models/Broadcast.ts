import mongoose, { Document, Schema } from 'mongoose';

export type BroadcastAudience = 'ALL' | 'MEMBERS' | 'PRESENTERS' | 'CO_ADMINS' | 'SPECIFIC_USERS';

export interface IBroadcast extends Document {
  subject: string;
  message: string;
  targetAudience: BroadcastAudience;
  targetUserIds?: mongoose.Types.ObjectId[];
  sentBy: mongoose.Types.ObjectId;
  deliveryStats: {
    totalRecipients: number;
    emailsSent: number;
    pushSent: number;
    inAppCreated: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const BroadcastSchema = new Schema<IBroadcast>(
  {
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    targetAudience: {
      type: String,
      required: true,
      enum: ['ALL', 'MEMBERS', 'PRESENTERS', 'CO_ADMINS', 'SPECIFIC_USERS'],
      default: 'ALL',
      index: true,
    },
    targetUserIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        index: true,
      },
    ],
    sentBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    deliveryStats: {
      totalRecipients: { type: Number, default: 0 },
      emailsSent: { type: Number, default: 0 },
      pushSent: { type: Number, default: 0 },
      inAppCreated: { type: Number, default: 0 },
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

BroadcastSchema.index({ createdAt: -1 });

export const Broadcast = mongoose.model<IBroadcast>('Broadcast', BroadcastSchema);
