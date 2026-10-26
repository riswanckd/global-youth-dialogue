import mongoose, { Document, Schema } from 'mongoose';

export interface IPasswordReset extends Document {
  userId: mongoose.Types.ObjectId;
  email?: string;
  tokenHash: string;
  expiresAt: Date;
  used: boolean;
  attempts?: number;
  createdAt: Date;
}

const PasswordResetSchema = new Schema<IPasswordReset>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    email: { type: String, lowercase: true, trim: true, index: true },
    tokenHash: { type: String, required: true, index: true },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
    used: { type: Boolean, default: false },
    attempts: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export const PasswordReset = mongoose.model<IPasswordReset>('PasswordReset', PasswordResetSchema);

