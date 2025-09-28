import mongoose, { Document, Schema } from 'mongoose';

export interface IVideo extends Document {
  title: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  category: 'lecture' | 'nasheed' | 'dawah';
  duration: number;
  views: number;
  likes: mongoose.Types.ObjectId[];
  dislikes: mongoose.Types.ObjectId[];
  bookmarks: mongoose.Types.ObjectId[];
  author: mongoose.Types.ObjectId;
  comments: Array<{
    _id: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    text: string;
    createdAt: Date;
    likes: number;
    replies: Array<{
      _id: mongoose.Types.ObjectId;
      user: mongoose.Types.ObjectId;
      text: string;
      createdAt: Date;
    }>;
  }>;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const VideoSchema = new Schema<IVideo>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
  },
  videoUrl: {
    type: String,
    required: [true, 'Video URL is required'],
  },
  thumbnail: {
    type: String,
    required: [true, 'Thumbnail is required'],
  },
  category: {
    type: String,
    enum: ['lecture', 'nasheed', 'dawah'],
    required: [true, 'Category is required'],
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
  },
  views: {
    type: Number,
    default: 0,
  },
  likes: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    default: [],
  },
  dislikes: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    default: [],
  },
  bookmarks: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    default: [],
  },
  tags: {
    type: [{
      type: String,
      trim: true,
    }],
    default: [],
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  comments: {
    type: [{
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      text: {
        type: String,
        required: true,
        trim: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      likes: {
        type: Number,
        default: 0,
      },
      replies: [{
        user: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        text: {
          type: String,
          required: true,
          trim: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      }],
    }],
    default: [],
  },
}, {
  timestamps: true,
});

export default mongoose.models.Video || mongoose.model<IVideo>('Video', VideoSchema);
