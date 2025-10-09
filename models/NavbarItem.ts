import mongoose, { Document, Schema } from 'mongoose';

export interface INavbarItem extends Document {
  title: string;
  titleBengali: string;
  href: string;
  type: 'main' | 'location' | 'dropdown';
  parentId?: mongoose.Types.ObjectId;
  order: number;
  isActive: boolean;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
}

const NavbarItemSchema = new Schema<INavbarItem>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  titleBengali: {
    type: String,
    required: [true, 'Bengali title is required'],
    trim: true,
  },
  href: {
    type: String,
    required: [true, 'Href is required'],
    trim: true,
  },
  type: {
    type: String,
    enum: ['main', 'location', 'dropdown'],
    required: [true, 'Type is required'],
  },
  parentId: {
    type: Schema.Types.ObjectId,
    ref: 'NavbarItem',
    default: null,
  },
  order: {
    type: Number,
    required: [true, 'Order is required'],
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  icon: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

// Index for efficient querying
NavbarItemSchema.index({ type: 1, order: 1 });
NavbarItemSchema.index({ parentId: 1, order: 1 });

export default mongoose.models.NavbarItem || mongoose.model<INavbarItem>('NavbarItem', NavbarItemSchema);
