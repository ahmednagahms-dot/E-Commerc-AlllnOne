import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, SlidersHorizontal, Star, Plus } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import Pagination from "../components/ui/Pagination";
import api from "../api/axios";

const LIMIT = 9;

export default function Products() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [productToDelete, setProductToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const categories = ["electronics", "phones", "fashion", "home", "beauty", "sports"];

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/products/search", {
        params: {
          search: search || undefined,
          category: category || undefined,
          sort: sortBy || undefined,
          page: currentPage,
          limit: LIMIT,
        },
      });
      setItems(response.data.products || []);
      setTotalProducts(response.data.totalProducts || 0);
      setTotalPages(response.data.totalPages || 1);
      setError(null);
    } catch (err) {
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, category, sortBy]);

  const handleSearch = () => {
    setSearch(searchText.trim());
    setCurrentPage(1);
    // لو أصلاً في صفحة 1، الـ useEffect مش هيتفعل بتغيير الصفحة، فنستدعيها يدويًا
    if (currentPage === 1) fetchProducts();
  };

  const changeFeatured = async (item) => {
    const newValue = !item.featured;
    setItems((prev) => prev.map((x) => (x._id === item._id ? { ...x, featured: newValue } : x)));

    try {
      const formData = new FormData();
      formData.append("featured", newValue);
      await api.patch(`/products/update/${item._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (err) {
      // رجّع القيمة لو فشل التحديث
      setItems((prev) => prev.map((x) => (x._id === item._id ? { ...x, featured: !newValue } : x)));
      alert("Failed to update featured status.");
    }
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    try {
      setDeleting(true);
      await api.delete(`/products/${productToDelete._id}`);
      setProductToDelete(null);
      fetchProducts();
    } catch (err) {
      alert("Failed to delete product.");
    } finally {
      setDeleting(false);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setSearchText("");
    setCategory("");
    setSortBy("");
    setCurrentPage(1);
  };

  const featuredCount = items.filter((item) => item.featured).length;
  const inStockCount = items.filter((item) => item.stock > 0).length;
  const outStockCount = items.filter((item) => item.stock <= 0).length;

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#F5F6F8] -m-6 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center mb-7">
          <div>
            <h1 className="text-3xl font-bold text-[#172033]">Products</h1>
            <p className="text-[#697386] mt-1">{totalProducts} products total</p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/dashboard/products/new")}
            className="flex items-center gap-2 bg-[#263653] hover:bg-[#1D2A43] text-white px-5 py-3 rounded-xl transition"
          >
            <Plus size={18} />
            <span>Add Product</span>
          </button>
        </div>

        {/* Stats — ملحوظة: دول بس بيعكسوا الصفحة الحالية (9 منتجات)، مش الكتالوج كله */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
          <div className="bg-[#FAFBFC] p-5 rounded-2xl border border-[#E1E5EA] shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#EEF1F7] flex items-center justify-center text-[#3157D5]">▣</div>
              <div>
                <p className="text-[#697386] text-sm">Total Products</p>
                <h2 className="text-2xl font-bold text-[#172033]">{totalProducts}</h2>
              </div>
            </div>
          </div>

          <div className="bg-[#FAFBFC] p-5 rounded-2xl border border-[#E1E5EA] shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#FFF8E8] flex items-center justify-center text-[#D99A16]">
                <Star size={19} />
              </div>
              <div>
                <p className="text-[#697386] text-sm">Featured (this page)</p>
                <h2 className="text-2xl font-bold text-[#172033]">{featuredCount}</h2>
              </div>
            </div>
          </div>

          <div className="bg-[#FAFBFC] p-5 rounded-2xl border border-[#E1E5EA] shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#EAF8F0] flex items-center justify-center text-[#20A464]">✓</div>
              <div>
                <p className="text-[#697386] text-sm">In Stock (this page)</p>
                <h2 className="text-2xl font-bold text-[#172033]">{inStockCount}</h2>
              </div>
            </div>
          </div>

          <div className="bg-[#FAFBFC] p-5 rounded-2xl border border-[#E1E5EA] shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#FDEEEE] flex items-center justify-center text-[#D95353]">⊘</div>
              <div>
                <p className="text-[#697386] text-sm">Out of Stock (this page)</p>
                <h2 className="text-2xl font-bold text-[#172033]">{outStockCount}</h2>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-[#FAFBFC] p-4 rounded-2xl border border-[#E1E5EA] shadow-sm mb-7">
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3157D5]" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
                className="w-full h-12 bg-[#F1F3F5] border border-[#E5E7EB] rounded-xl pl-11 pr-4 outline-none text-[#172033] placeholder-[#8A94A6] focus:border-[#BFDBFE] focus:ring-2 focus:ring-[#BFDBFE] focus:bg-[#FAFBFC] transition"
              />
            </div>

            <button
              type="button"
              onClick={handleSearch}
              className="w-full sm:w-32 h-12 bg-[#1D3CA5] hover:bg-[#172F8F] text-white rounded-xl flex items-center justify-center gap-2 transition font-medium"
            >
              <Search size={17} />
              <span>Search</span>
            </button>

            <button
              type="button"
              onClick={() => setShowFilters((prev) => !prev)}
              className={`w-full sm:w-36 h-12 border rounded-xl flex items-center justify-center gap-2 transition font-medium ${
                showFilters ? "bg-[#263653] text-white border-[#263653]" : "bg-[#FAFBFC] border-[#D9DEE6] text-[#3157D5] hover:bg-[#F5F7FC]"
              }`}
            >
              <SlidersHorizontal size={22} />
              <span>Filter</span>
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-[#E5E7EB] grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-semibold text-[#405066] mb-2">Categories</p>
                <select
                  value={category}
                  onChange={(e) => { setCategory(e.target.value); setCurrentPage(1); }}
                  className="w-full h-12 border border-[#DDE3EA] rounded-xl px-4 outline-none bg-[#F8FAFC] text-[#405066] focus:border-[#AFC4E8] focus:ring-2 focus:ring-[#DCE8F8]"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                  ))}
                </select>
              </div>

              <div>
                <p className="text-sm font-semibold text-[#405066] mb-2">Sort By</p>
                <select
                  value={sortBy}
                  onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                  className="w-full h-12 border border-[#DDE3EA] rounded-xl px-4 outline-none bg-[#F8FAFC] text-[#405066] focus:border-[#AFC4E8] focus:ring-2 focus:ring-[#DCE8F8]"
                >
                  <option value="">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>

              <button
                type="button"
                onClick={clearFilters}
                className="sm:col-span-2 text-sm text-[#3157D5] font-medium text-left hover:underline"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="bg-[#FAFBFC] p-12 rounded-2xl text-center text-[#697386] border border-[#E1E5EA]">
            Loading products...
          </div>
        ) : error ? (
          <div className="bg-[#FAFBFC] p-12 rounded-2xl text-center text-danger border border-[#E1E5EA]">
            {error}
          </div>
        ) : items.length === 0 ? (
          <div className="bg-[#FAFBFC] p-12 rounded-2xl text-center text-[#697386] border border-[#E1E5EA]">
            No products found
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {items.map((item) => {
                const hasDiscount = item.discountPrice && item.discountPrice < item.price;
                const displayPrice = hasDiscount ? item.discountPrice : item.price;

                return (
                  <div key={item._id} className="bg-[#FAFBFC] rounded-2xl overflow-hidden border border-[#E1E5EA] shadow-sm hover:shadow-md transition">
                    <div className="relative bg-[#EEF0F3]">
                      <div className="w-full h-52 sm:h-56 flex items-center justify-center bg-[#EEF0F3] overflow-hidden">
                        {item.images?.length > 0 ? (
                          <img src={item.images[0]?.url} alt={item.name || "Product"} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[#98A1B2]">No Image</span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => changeFeatured(item)}
                        className={`absolute top-3 left-3 z-10 w-9 h-9 rounded-lg flex items-center justify-center transition ${
                          item.featured ? "bg-[#FFF8E8] text-[#D99A16]" : "bg-[#FAFBFC] text-[#697386]"
                        }`}
                      >
                        <Star size={17} fill={item.featured ? "currentColor" : "none"} />
                      </button>

                      <span
                        className={`absolute top-3 right-3 z-10 px-3 py-1.5 rounded-lg text-xs font-semibold ${
                          item.stock > 0 ? "bg-[#EAF8F0] text-[#20965D]" : "bg-[#FDEEEE] text-[#C94A4A]"
                        }`}
                      >
                        {item.stock > 0 ? `${item.stock} in stock` : "Out of stock"}
                      </span>
                    </div>

                    <div className="p-5">
                      <h2 className="font-bold text-lg text-[#172033]">{item.name}</h2>
                      <p className="text-[#697386] text-sm mt-1 capitalize">
                        {item.category}
                        {item.subcategory && ` / ${item.subcategory}`}
                      </p>

                      <div className="flex items-center gap-3 mt-4">
                        <span className="font-bold text-xl text-[#18243A]">${displayPrice}</span>
                        {hasDiscount && (
                          <span className="text-[#B42318] line-through">${item.price}</span>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-2 mt-5">
                        <button
                          type="button"
                          onClick={() => navigate(`/dashboard/products/${item._id}/view`)}
                          className="bg-[#F8FAFC] border border-[#D9DEE6] py-2.5 rounded-lg text-[#364152] hover:bg-[#F1F3F5] transition"
                        >
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => navigate(`/dashboard/products/${item._id}/edit`)}
                          className="bg-[#F8FAFC] border border-[#D9DEE6] py-2.5 rounded-lg text-[#364152] hover:bg-[#F1F3F5] transition"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setProductToDelete(item)}
                          className="bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-lg transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={totalProducts}
              itemsPerPage={LIMIT}
            />
          </>
        )}
      </div>

    </DashboardLayout>
  );
}