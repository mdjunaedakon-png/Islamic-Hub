'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Edit, 
  Trash2, 
  ArrowUp, 
  ArrowDown,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';

interface NavbarItem {
  _id: string;
  title: string;
  titleBengali: string;
  href: string;
  type: 'main' | 'location' | 'dropdown';
  parentId?: {
    _id: string;
    title: string;
    titleBengali: string;
  };
  order: number;
  isActive: boolean;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function NavbarManagementPage() {
  const [navbarItems, setNavbarItems] = useState<NavbarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingItem, setEditingItem] = useState<NavbarItem | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const [formData, setFormData] = useState({
    title: '',
    titleBengali: '',
    href: '',
    type: 'main' as 'main' | 'location' | 'dropdown',
    parentId: '',
    order: 0,
    isActive: true,
    icon: '',
  });

  const router = useRouter();

  useEffect(() => {
    fetchNavbarItems();
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        if (data.user?.role !== 'admin') {
          router.push('/');
        }
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      router.push('/');
    }
  };

  const fetchNavbarItems = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/navbar');
      if (response.ok) {
        const data = await response.json();
        setNavbarItems(data.navbarItems);
      }
    } catch (error) {
      toast.error('Error fetching navbar items');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingItem ? `/api/navbar/${editingItem._id}` : '/api/navbar';
      const method = editingItem ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          parentId: formData.parentId || null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(editingItem ? 'Navbar item updated successfully!' : 'Navbar item created successfully!');
        setShowCreateForm(false);
        setEditingItem(null);
        resetForm();
        fetchNavbarItems();
      } else {
        toast.error(data.error || 'Failed to save navbar item');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  };

  const handleEdit = (item: NavbarItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      titleBengali: item.titleBengali,
      href: item.href,
      type: item.type,
      parentId: item.parentId?._id || '',
      order: item.order,
      isActive: item.isActive,
      icon: item.icon || '',
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this navbar item?')) {
      return;
    }

    try {
      const response = await fetch(`/api/navbar/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Navbar item deleted successfully!');
        fetchNavbarItems();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to delete navbar item');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  };

  const handleToggleActive = async (item: NavbarItem) => {
    try {
      const response = await fetch(`/api/navbar/${item._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...item,
          isActive: !item.isActive,
        }),
      });

      if (response.ok) {
        toast.success('Navbar item status updated!');
        fetchNavbarItems();
      } else {
        toast.error('Failed to update navbar item status');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      titleBengali: '',
      href: '',
      type: 'main',
      parentId: '',
      order: 0,
      isActive: true,
      icon: '',
    });
  };

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const getParentItems = () => {
    return navbarItems.filter(item => item.type === 'main' || item.type === 'dropdown');
  };

  const getChildItems = (parentId: string) => {
    return navbarItems.filter(item => item.parentId?._id === parentId);
  };

  const groupedItems = navbarItems.reduce((acc, item) => {
    if (item.type === 'main' || item.type === 'dropdown') {
      acc[item._id] = {
        parent: item,
        children: getChildItems(item._id),
      };
    }
    return acc;
  }, {} as Record<string, { parent: NavbarItem; children: NavbarItem[] }>);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Navbar Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage news page navigation items
              </p>
            </div>
            
            <button
              onClick={() => {
                setShowCreateForm(true);
                setEditingItem(null);
                resetForm();
              }}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Navbar Item
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Create/Edit Form */}
        {showCreateForm && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              {editingItem ? 'Edit Navbar Item' : 'Create New Navbar Item'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title (English) *
                  </label>
                  <input
                    type="text"
                    id="title"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="input-field"
                    placeholder="e.g., Home, National"
                  />
                </div>

                <div>
                  <label htmlFor="titleBengali" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title (Bengali) *
                  </label>
                  <input
                    type="text"
                    id="titleBengali"
                    required
                    value={formData.titleBengali}
                    onChange={(e) => setFormData({ ...formData, titleBengali: e.target.value })}
                    className="input-field"
                    placeholder="e.g., প্রচ্ছদ, জাতীয়"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="href" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Link *
                  </label>
                  <input
                    type="text"
                    id="href"
                    required
                    value={formData.href}
                    onChange={(e) => setFormData({ ...formData, href: e.target.value })}
                    className="input-field"
                    placeholder="e.g., /news?category=local"
                  />
                </div>

                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Type *
                  </label>
                  <select
                    id="type"
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="input-field"
                  >
                    <option value="main">Main Navigation</option>
                    <option value="location">Location</option>
                    <option value="dropdown">Dropdown Parent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="parentId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Parent Item (for dropdown items)
                  </label>
                  <select
                    id="parentId"
                    value={formData.parentId}
                    onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                    className="input-field"
                  >
                    <option value="">No Parent</option>
                    {getParentItems().map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.titleBengali} ({item.title})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="order" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Order
                  </label>
                  <input
                    type="number"
                    id="order"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    className="input-field"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="icon" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Icon (optional)
                </label>
                <input
                  type="text"
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="input-field"
                  placeholder="e.g., Home, MapPin"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Active
                </label>
              </div>

              <div className="flex items-center gap-4">
                <button type="submit" className="btn-primary">
                  {editingItem ? 'Update Item' : 'Create Item'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingItem(null);
                    resetForm();
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Navbar Items List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Navbar Items ({navbarItems.length})
            </h2>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {Object.values(groupedItems).map(({ parent, children }) => (
              <div key={parent._id}>
                {/* Parent Item */}
                <div className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => toggleExpanded(parent._id)}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                      >
                        {expandedItems.has(parent._id) ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>
                      
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          parent.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {parent.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          parent.type === 'main' ? 'bg-blue-100 text-blue-800' :
                          parent.type === 'location' ? 'bg-purple-100 text-purple-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {parent.type}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {parent.titleBengali} ({parent.title})
                      </span>
                      <span className="text-sm text-gray-500">
                        {parent.href}
                      </span>
                      <span className="text-sm text-gray-500">
                        Order: {parent.order}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleToggleActive(parent)}
                        className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
                        title={parent.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {parent.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleEdit(parent)}
                        className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(parent._id)}
                        className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Child Items */}
                {expandedItems.has(parent._id) && children.length > 0 && (
                  <div className="bg-gray-50 dark:bg-gray-700 pl-12">
                    {children.map((child) => (
                      <div key={child._id} className="p-4 border-b border-gray-200 dark:border-gray-600 last:border-b-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              child.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {child.isActive ? 'Active' : 'Inactive'}
                            </span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {child.titleBengali} ({child.title})
                            </span>
                            <span className="text-sm text-gray-500">
                              {child.href}
                            </span>
                            <span className="text-sm text-gray-500">
                              Order: {child.order}
                            </span>
                          </div>

                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleToggleActive(child)}
                              className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
                              title={child.isActive ? 'Deactivate' : 'Activate'}
                            >
                              {child.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => handleEdit(child)}
                              className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(child._id)}
                              className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
