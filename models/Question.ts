import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion extends Document {
  user: mongoose.Types.ObjectId;
  text: string;
  answer?: string;
  answeredBy?: mongoose.Types.ObjectId;
  status: 'pending' | 'answered';
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema<IQuestion>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true, trim: true },
  answer: { type: String, default: '' },
  answeredBy: { type: Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['pending', 'answered'], default: 'pending' },
}, { timestamps: true });

export default mongoose.models.Question || mongoose.model<IQuestion>('Question', QuestionSchema);
