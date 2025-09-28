import mongoose, { Document, Schema } from 'mongoose';

export interface IHadith extends Document {
  collectionName: 'bukhari' | 'muslim' | 'tirmidhi' | 'abu_dawud' | 'nasai' | 'ibn_majah';
  hadithNumber: string;
  arabicText: string;
  englishTranslation: string;
  banglaTranslation: string;
  narrator: string;
  chapter: string;
  book: string;
  volume?: string;
  page?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const HadithSchema = new Schema<IHadith>({
  collectionName: {
    type: String,
    enum: ['bukhari', 'muslim', 'tirmidhi', 'abu_dawud', 'nasai', 'ibn_majah'],
    required: [true, 'Collection name is required'],
  },
  hadithNumber: {
    type: String,
    required: [true, 'Hadith number is required'],
  },
  arabicText: {
    type: String,
    required: [true, 'Arabic text is required'],
  },
  englishTranslation: {
    type: String,
    required: [true, 'English translation is required'],
  },
  banglaTranslation: {
    type: String,
    required: [true, 'Bangla translation is required'],
  },
  narrator: {
    type: String,
    required: [true, 'Narrator is required'],
  },
  chapter: {
    type: String,
    required: [true, 'Chapter is required'],
  },
  book: {
    type: String,
    required: [true, 'Book is required'],
  },
  volume: {
    type: String,
    default: '',
  },
  page: {
    type: String,
    default: '',
  },
  tags: [{
    type: String,
    trim: true,
  }],
}, {
  timestamps: true,
});

export default mongoose.models.Hadith || mongoose.model<IHadith>('Hadith', HadithSchema);
