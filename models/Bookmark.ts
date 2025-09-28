import mongoose, { Document, Schema } from 'mongoose';

export interface IBookmark extends Document {
  user: mongoose.Types.ObjectId;
  contentType: 'video' | 'news' | 'hadith' | 'quran' | 'product';
  contentId: string;
  contentTitle: string;
  contentDescription?: string;
  contentImage?: string;
  contentUrl?: string;
  metadata?: {
    surahNumber?: number;
    ayahNumber?: number;
    hadithNumber?: string;
    collectionName?: string;
    narrator?: string;
    chapter?: string;
    category?: string;
    author?: string;
    duration?: number;
    views?: number;
    likes?: number;
    price?: number;
    stock?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const BookmarkSchema = new Schema<IBookmark>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required'],
  },
  contentType: {
    type: String,
    enum: ['video', 'news', 'hadith', 'quran', 'product'],
    required: [true, 'Content type is required'],
  },
  contentId: {
    type: String,
    required: [true, 'Content ID is required'],
  },
  contentTitle: {
    type: String,
    required: [true, 'Content title is required'],
  },
  contentDescription: {
    type: String,
    default: '',
  },
  contentImage: {
    type: String,
    default: '',
  },
  contentUrl: {
    type: String,
    default: '',
  },
  metadata: {
    surahNumber: {
      type: Number,
      default: null,
    },
    ayahNumber: {
      type: Number,
      default: null,
    },
    hadithNumber: {
      type: String,
      default: '',
    },
    collectionName: {
      type: String,
      default: '',
    },
    narrator: {
      type: String,
      default: '',
    },
    chapter: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      default: '',
    },
    author: {
      type: String,
      default: '',
    },
    duration: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      default: 0,
    },
    stock: {
      type: Number,
      default: 0,
    },
  },
}, {
  timestamps: true,
});

// Create compound index to prevent duplicate bookmarks
BookmarkSchema.index({ user: 1, contentType: 1, contentId: 1 }, { unique: true });

export default mongoose.models.Bookmark || mongoose.model<IBookmark>('Bookmark', BookmarkSchema);
