import mongoose, { Document, Schema } from 'mongoose';

export interface IQuran extends Document {
  surahNumber: number;
  surahName: string;
  surahNameArabic: string;
  surahNameEnglish: string;
  ayahs: Array<{
    ayahNumber: number;
    arabicText: string;
    englishTranslation: string;
    banglaTranslation: string;
    audioUrl?: string;
  }>;
  totalAyahs: number;
  revelationPlace: 'makkah' | 'madinah';
  createdAt: Date;
  updatedAt: Date;
}

const QuranSchema = new Schema<IQuran>({
  surahNumber: {
    type: Number,
    required: [true, 'Surah number is required'],
    unique: true,
  },
  surahName: {
    type: String,
    required: [true, 'Surah name is required'],
  },
  surahNameArabic: {
    type: String,
    required: [true, 'Arabic surah name is required'],
  },
  surahNameEnglish: {
    type: String,
    required: [true, 'English surah name is required'],
  },
  ayahs: [{
    ayahNumber: {
      type: Number,
      required: true,
    },
    arabicText: {
      type: String,
      required: true,
    },
    englishTranslation: {
      type: String,
      required: true,
    },
    banglaTranslation: {
      type: String,
      required: true,
    },
    audioUrl: {
      type: String,
      default: '',
    },
  }],
  totalAyahs: {
    type: Number,
    required: [true, 'Total ayahs is required'],
  },
  revelationPlace: {
    type: String,
    enum: ['makkah', 'madinah'],
    required: [true, 'Revelation place is required'],
  },
}, {
  timestamps: true,
});

export default mongoose.models.Quran || mongoose.model<IQuran>('Quran', QuranSchema);
