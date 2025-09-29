export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

const STORAGE_KEY = 'islamic-hub-cart-v2';

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event('cart:updated'));
}

export function addToCart(item: CartItem) {
  const cart = getCart();
  const idx = cart.findIndex((i) => i.productId === item.productId);
  if (idx >= 0) {
    cart[idx].quantity += item.quantity;
  } else {
    cart.push(item);
  }
  saveCart(cart);
}

export function updateQuantity(productId: string, quantity: number) {
  const cart = getCart();
  const idx = cart.findIndex((i) => i.productId === productId);
  if (idx >= 0) {
    cart[idx].quantity = Math.max(1, quantity);
    saveCart(cart);
  }
}

export function removeFromCart(productId: string) {
  const cart = getCart().filter((i) => i.productId !== productId);
  saveCart(cart);
}

export function clearCart() {
  saveCart([]);
}

export function getCartCount(): number {
  return getCart().reduce((sum, i) => sum + i.quantity, 0);
}

export function getCartTotal(): number {
  return getCart().reduce((sum, i) => sum + i.price * i.quantity, 0);
}
