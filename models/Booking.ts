import mongoose, { Document, Schema } from 'mongoose';

export interface IBooking extends Document {
  user: mongoose.Types.ObjectId;
  video: mongoose.Types.ObjectId;
  videoTitle: string;
  videoDescription: string;
  videoThumbnail: string;
  videoUrl: string;
  videoCategory: string;
  videoDuration: number;
  videoAuthor: {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
  };
  bookingDate: Date;
  status: 'active' | 'completed' | 'cancelled';
  notes?: string;
  reminderDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required'],
  },
  video: {
    type: Schema.Types.ObjectId,
    ref: 'Video',
    required: [true, 'Video is required'],
  },
  videoTitle: {
    type: String,
    required: [true, 'Video title is required'],
  },
  videoDescription: {
    type: String,
    required: [true, 'Video description is required'],
  },
  videoThumbnail: {
    type: String,
    required: [true, 'Video thumbnail is required'],
  },
  videoUrl: {
    type: String,
    required: [true, 'Video URL is required'],
  },
  videoCategory: {
    type: String,
    required: [true, 'Video category is required'],
  },
  videoDuration: {
    type: Number,
    required: [true, 'Video duration is required'],
  },
  videoAuthor: {
    _id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  bookingDate: {
    type: Date,
    required: [true, 'Booking date is required'],
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active',
  },
  notes: {
    type: String,
    default: '',
  },
  reminderDate: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});

// Create compound index to prevent duplicate bookings
BookingSchema.index({ user: 1, video: 1 }, { unique: true });

export default mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);
