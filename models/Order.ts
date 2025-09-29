import mongoose, { Schema, Document, Model } from 'mongoose';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface OrderDocument extends Document {
  user: mongoose.Types.ObjectId;
  items: OrderItem[];
  total: number;
  paymentMethod: 'bkash' | 'cod';
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  shipping: {
    name: string;
    phone: string;
    address: string;
    city: string;
    notes?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<OrderItem>({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String, required: true },
});

const OrderSchema = new Schema<OrderDocument>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: { type: [OrderItemSchema], required: true },
  total: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['bkash', 'cod'], required: true },
  status: { type: String, enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
  shipping: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    notes: { type: String },
  },
}, { timestamps: true });

const Order: Model<OrderDocument> = mongoose.models.Order || mongoose.model<OrderDocument>('Order', OrderSchema);
export default Order;
