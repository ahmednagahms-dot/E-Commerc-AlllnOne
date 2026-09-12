import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { FiSearch, FiTrash2, FiPlus, FiMessageSquare } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import DashboardLayout from '../components/layout/DashboardLayout';
// 1. المسار اتصلح هنا
import PageLoader from "../components/ui/sessionLoader/PageLoader";

const BASE_URL = 'https://e-commerce-api-3wara.vercel.app';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token') || localStorage.getItem('userToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const StarRating = ({ rating, setRating, isInteractive = false }) => {
  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          className={`text-lg transition-colors ${
            isInteractive ? 'cursor-pointer' : 'cursor-default'
          } ${star <= rating ? 'text-yellow-400' : 'text-gray-200'}`}
          onClick={() => isInteractive && setRating && setRating(star)}
        />
      ))}
    </div>
  );
};

const AddReviewModal = ({ isOpen, onClose, products, onReviewAdded }) => {
  const [rating, setRating] = useState(5);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  if (!isOpen) return null;

  const onSubmit = async (data) => {
    try {
      const response = await fetch(`${BASE_URL}/products/${data.productId}/reviews`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          rating,
          comment: data.comment,
        }),
      });

      if (response.ok) {
        reset();
        setRating(5);
        onReviewAdded();
        onClose();
        toast.success("Review added successfully!");
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to add review');
      }
    } catch (error) {
      console.error('Failed to add review:', error);
      toast.error("Failed to add review. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
        <div className="flex justify-between items-center pb-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">Add Review</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <IoClose size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product
            </label>
            <select
              {...register('productId', { required: 'Please select a product' })}
              className="w-full bg-gray-50 border-0 rounded-lg p-2.5 text-sm shadow-inner focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
            >
              <option value="">Select a product...</option>
              {products.map((product) => (
                <option
                  key={product._id || product.id}
                  value={product._id || product.id}
                >
                  {product.title || product.name}
                </option>
              ))}
            </select>
            {errors.productId && (
              <p className="text-red-500 text-xs mt-1">
                {errors.productId.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rating
            </label>
            <StarRating rating={rating} setRating={setRating} isInteractive={true} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Comment
            </label>
            <textarea
              {...register('comment', { required: 'Comment is required' })}
              rows="4"
              placeholder="Write your review..."
              className="w-full bg-gray-50 border-0 rounded-lg p-2.5 text-sm shadow-inner focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
            ></textarea>
            {errors.comment && (
              <p className="text-red-500 text-xs mt-1">{errors.comment.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg shadow hover:bg-indigo-700 transition disabled:opacity-60"
            >
              {isSubmitting ? 'Adding...' : 'Add Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center">
        <h3 className="text-lg font-semibold text-gray-800">Delete Review</h3>
        <p className="text-sm text-gray-500 mt-2">
          Are you sure you want to delete this review? This action cannot be undone.
        </p>
        <div className="flex justify-center space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg shadow hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const Reviews = () => {
  // 2. ضفنا حالة التحميل هنا
  const [loading, setLoading] = useState(true);
  
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  const fetchData = async () => {
    // 3. بنشغل التحميل أول ما يبدأ يكلم الـ API
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/products`, {
        headers: getAuthHeaders(),
      });
      const resData = await response.json();

      const productsList = Array.isArray(resData)
        ? resData
        : resData.data || resData.products || [];

      setProducts(productsList);

      let extractedReviews = [];
      productsList.forEach((prod) => {
        if (prod.reviews && Array.isArray(prod.reviews)) {
          prod.reviews.forEach((r) => {
            extractedReviews.push({
              ...r,
              productName: prod.title || prod.name || 'Product',
              productId: prod._id || prod.id,
            });
          });
        }
      });

      if (extractedReviews.length === 0) {
        const promises = productsList.map(async (prod) => {
          const pId = prod._id || prod.id;
          try {
            const revRes = await fetch(`${BASE_URL}/products/${pId}/reviews`, {
              headers: getAuthHeaders(),
            });
            const revData = await revRes.json();
            const list = Array.isArray(revData)
              ? revData
              : revData.data || revData.reviews || [];

            return list.map((r) => ({
              ...r,
              productName: prod.title || prod.name || 'Product',
              productId: pId,
            }));
          } catch (err) {
            console.error(`Failed to fetch reviews for product ${pId}`, err);
            return [];
          }
        });

        const results = await Promise.all(promises);
        extractedReviews = results.flat();
      }

      console.log('Fetched Reviews successfully:', extractedReviews);
      setReviews(extractedReviews);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      // 4. بنقفل التحميل أول ما يخلص خالص سواء جاب الداتا أو ضرب إيرور
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async () => {
    if (!selectedReview) return;
    try {
      await fetch(
        `${BASE_URL}/products/${selectedReview.productId}/reviews/${
          selectedReview._id || selectedReview.id
        }`,
        {
          method: 'DELETE',
          headers: getAuthHeaders(),
        }
      );
      setIsDeleteModalOpen(false);
      setSelectedReview(null);
      fetchData(); // ده هيشغل اللودينج الشبح تاني وهو بيجيب الداتا الجديدة، شكلها هيبقى احترافي!
    } catch (error) {
      console.error('Error deleting review:', error);
       toast.error("Failed to load reviews.");
    }
  };

  const filteredReviews = reviews.filter(
    (r) =>
      (r.user?.name || r.customerName || 'ADMIN')
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (r.productName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length
        ).toFixed(1)
      : '0.0';

  return (
    <DashboardLayout>
      {/* 5. الشرط بتاعنا اهوه */}
      {loading ? (
        <PageLoader text="Loading reviews..." />
      ) : (
        <div className="animate-fade-in p-6 max-w-7xl mx-auto space-y-6 w-full">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-indigo-600 tracking-wider uppercase">
                CATALOG
              </span>
              <h1 className="text-2xl font-bold text-gray-900 mt-1">Reviews</h1>
              <p className="text-sm text-gray-500">
                Customer reviews across all products. {reviews.length} reviews total.
              </p>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition"
            >
              <FiPlus size={16} />
              <span>Add Review</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-xl shadow-sm flex items-center space-x-4">
              <div className="p-3 bg-yellow-50 text-yellow-500 rounded-lg">
                <FaStar size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{avgRating}</div>
                <div className="text-xs text-gray-500">Average Rating</div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-sm flex items-center space-x-4">
              <div className="p-3 bg-blue-50 text-blue-500 rounded-lg">
                <FiMessageSquare size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {reviews.length}
                </div>
                <div className="text-xs text-gray-500">Total Reviews</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <FiSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by customer or product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white shadow-sm rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Product</th>
                  <th className="py-3.5 px-4">Rating</th>
                  <th className="py-3.5 px-4">Comment</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredReviews.length > 0 ? (
                  filteredReviews.map((review) => (
                    <tr
                      key={review._id || review.id}
                      className="hover:bg-gray-50/50 transition"
                    >
                      <td className="py-3.5 px-4 font-medium text-gray-900">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-green-100 text-green-800">
                          {review.user?.name || review.customerName || 'ADMIN'} ✓
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-gray-600">
                        {review.productName}
                      </td>
                      <td className="py-3.5 px-4">
                        <StarRating rating={review.rating} />
                      </td>
                      <td className="py-3.5 px-4 text-gray-500 max-w-xs truncate">
                        {review.comment}
                      </td>
                      <td className="py-3.5 px-4 text-gray-500">
                        {formatDate(review.createdAt || review.date)}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedReview(review);
                            setIsDeleteModalOpen(true);
                          }}
                          className="text-red-400 hover:text-red-600 transition"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-6 text-gray-400">
                      No reviews found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <AddReviewModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            products={products}
            onReviewAdded={fetchData}
          />

          <DeleteConfirmModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDelete}
          />
        </div>
      )}
    </DashboardLayout>
  );
};

export default Reviews;