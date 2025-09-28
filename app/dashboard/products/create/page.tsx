'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  ShoppingBag, 
  Image, 
  Tag, 
  ArrowLeft,
  Save,
  X,
  DollarSign
} from 'lucide-react';
import toast from 'react-hot-toast';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function CreateProductPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    images: '',
    category: 'books',
    stock: '',
    sku: '',
    weight: '',
    features: '',
    tags: '',
    featured: false,
  });
  const router = useRouter();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        
        if (data.user.role !== 'admin') {
          router.push('/');
          toast.error('Access denied. Admin privileges required.');
        }
      } else {
        router.push('/auth/login');
      }
    } catch (error) {
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      console.log('📦 Form submission started with data:', formData);
      
      // Client-side validation
      if (!formData.name.trim()) {
        toast.error('Product name is required');
        setCreating(false);
        return;
      }
      if (!formData.description.trim()) {
        toast.error('Product description is required');
        setCreating(false);
        return;
      }
      if (!formData.price || parseFloat(formData.price) <= 0) {
        toast.error('Product price must be greater than 0');
        setCreating(false);
        return;
      }
      if (!formData.images.trim()) {
        toast.error('At least one product image is required');
        setCreating(false);
        return;
      }
      if (!formData.sku.trim()) {
        toast.error('Product SKU is required');
        setCreating(false);
        return;
      }
      
      const imagesArray = formData.images.split(',').map(img => img.trim()).filter(img => img);
      const featuresArray = formData.features.split(',').map(feature => feature.trim()).filter(feature => feature);
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      const requestData = {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : 0,
        stock: formData.stock ? parseInt(formData.stock) : 0,
        weight: formData.weight ? parseFloat(formData.weight) : 0,
        images: imagesArray,
        features: featuresArray,
        tags: tagsArray,
      };
      
      console.log('📦 Sending request data:', requestData);
      
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      console.log('📦 API response:', { status: response.status, data });

      if (response.ok) {
        toast.success('Product created successfully!');
        console.log('📦 Product created, redirecting to dashboard');
        router.push('/dashboard');
      } else {
        console.error('📦 Product creation failed:', data);
        toast.error(data.error || 'Failed to create product');
      }
    } catch (error) {
      console.error('📦 Form submission error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  <Plus className="w-8 h-8 text-primary-600" />
                  Add Product
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Add new Islamic products to the store
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter product name"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="input-field"
                placeholder="Describe the product in detail"
              />
            </div>

            {/* Price and Original Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Price ($) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    id="price"
                    name="price"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="29.99"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Original Price ($)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    id="originalPrice"
                    name="originalPrice"
                    min="0"
                    step="0.01"
                    value={formData.originalPrice}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="39.99"
                  />
                </div>
              </div>
            </div>

            {/* Images */}
            <div>
              <label htmlFor="images" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Product Images (URLs) *
              </label>
              <div className="relative">
                <Image className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  id="images"
                  name="images"
                  required
                  value={formData.images}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="https://images.unsplash.com/photo-1.jpg, https://images.unsplash.com/photo-2.jpg"
                />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Separate image URLs with commas
              </p>
            </div>

            {/* Category and SKU */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="books">Islamic Books</option>
                  <option value="clothing">Islamic Clothing</option>
                  <option value="prayer_mats">Prayer Mats</option>
                  <option value="tasbih">Tasbih & Dhikr</option>
                  <option value="perfumes">Perfumes</option>
                  <option value="jewelry">Islamic Jewelry</option>
                </select>
              </div>

              <div>
                <label htmlFor="sku" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  SKU *
                </label>
                <input
                  type="text"
                  id="sku"
                  name="sku"
                  required
                  value={formData.sku}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="PROD-001"
                />
              </div>
            </div>

            {/* Stock and Weight */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  required
                  min="0"
                  value={formData.stock}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="100"
                />
              </div>

              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  min="0"
                  step="0.1"
                  value={formData.weight}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="0.5"
                />
              </div>
            </div>

            {/* Features */}
            <div>
              <label htmlFor="features" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Features
              </label>
              <input
                type="text"
                id="features"
                name="features"
                value={formData.features}
                onChange={handleChange}
                className="input-field"
                placeholder="Hardcover, Arabic text, English translation (comma separated)"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Separate features with commas
              </p>
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tags
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="quran, holy book, translation (comma separated)"
                />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Separate tags with commas
              </p>
            </div>

            {/* Featured */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="featured" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Featured Product
              </label>
            </div>

            {/* Product Preview */}
            {formData.name && formData.description && formData.price && (
              <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Product Preview
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    {formData.images && (
                      <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 overflow-hidden">
                        <img
                          src={formData.images.split(',')[0].trim()}
                          alt="Product preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {formData.name}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      {formData.description}
                    </p>
                    <div className="flex items-center gap-4 mb-3">
                      <span className="text-2xl font-bold text-primary-600">
                        ${formData.price}
                      </span>
                      {formData.originalPrice && parseFloat(formData.originalPrice) > parseFloat(formData.price) && (
                        <span className="text-lg text-gray-500 line-through">
                          ${formData.originalPrice}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300 text-sm px-2 py-1 rounded">
                        {formData.category}
                      </span>
                      {formData.featured && (
                        <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 text-sm px-2 py-1 rounded">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      SKU: {formData.sku} | Stock: {formData.stock || 0}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => router.back()}
                className="btn-secondary flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={creating}
                className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {creating ? 'Creating...' : 'Create Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
