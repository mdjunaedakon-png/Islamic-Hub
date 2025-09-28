'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface BookingButtonProps {
  videoId: string;
  videoTitle: string;
  videoDescription: string;
  videoThumbnail: string;
  videoUrl: string;
  videoCategory: string;
  videoDuration: number;
  videoAuthor: {
    _id: string;
    name: string;
    email: string;
  };
  size?: 'sm' | 'md' | 'lg';
}

export default function BookingButton({
  videoId,
  videoTitle,
  videoDescription,
  videoThumbnail,
  videoUrl,
  videoCategory,
  videoDuration,
  videoAuthor,
  size = 'md',
}: BookingButtonProps) {
  const [isBooked, setIsBooked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingDate, setBookingDate] = useState('');
  const [notes, setNotes] = useState('');
  const [reminderDate, setReminderDate] = useState('');

  useEffect(() => {
    const checkBookingStatus = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/bookings?videoId=${videoId}`);
        const data = await response.json();
        if (response.ok) {
          const userBooking = data.bookings.find((booking: any) => booking.video === videoId);
          if (userBooking) {
            setIsBooked(true);
            setBookingId(userBooking._id);
          }
        }
      } catch (error) {
        console.error('Error checking booking status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkBookingStatus();
  }, [videoId]);

  const handleBookingToggle = async () => {
    if (isBooked && bookingId) {
      // Cancel booking
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setIsBooked(false);
        setBookingId(null);
        toast.success('Booking cancelled!');
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to cancel booking');
      }
    } else {
      // Show booking modal
      setShowBookingModal(true);
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingDate) {
      toast.error('Please select a booking date');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoId,
          bookingDate,
          notes,
          reminderDate: reminderDate || null,
        }),
      });

      const data = await response.json();
      if (response.ok || response.status === 201) {
        setIsBooked(true);
        setBookingId(data.booking._id);
        setShowBookingModal(false);
        setBookingDate('');
        setNotes('');
        setReminderDate('');
        toast.success('Video booked successfully!');
      } else if (response.status === 401) {
        toast.error('Please login to book videos.');
      } else {
        toast.error(data.error || 'Failed to book video');
      }
    } catch (error) {
      console.error('Error booking video:', error);
      toast.error('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const buttonClasses = `
    flex items-center justify-center gap-2 rounded-lg transition-colors
    ${size === 'sm' ? 'p-2 text-sm' : size === 'lg' ? 'px-4 py-2 text-lg' : 'px-3 py-1.5 text-base'}
    ${isBooked
      ? 'bg-green-600 text-white hover:bg-green-700'
      : 'bg-blue-600 text-white hover:bg-blue-700'}
    ${loading ? 'opacity-70 cursor-not-allowed' : ''}
  `;

  const iconSize = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5';

  return (
    <>
      <button onClick={handleBookingToggle} className={buttonClasses} disabled={loading}>
        {isBooked ? (
          <>
            <CheckCircle className={iconSize} />
            {size !== 'sm' && 'Booked'}
          </>
        ) : (
          <>
            <Calendar className={iconSize} />
            {size !== 'sm' && 'Book Video'}
          </>
        )}
      </button>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Book Video
            </h3>
            
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Booking Date *
                </label>
                <input
                  type="datetime-local"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Add any notes about this booking..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Reminder Date (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={reminderDate}
                  onChange={(e) => setReminderDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Booking...' : 'Book Video'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
