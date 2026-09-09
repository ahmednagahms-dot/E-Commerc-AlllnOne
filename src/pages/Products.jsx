<<<<<<< Updated upstream
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Search, SlidersHorizontal, Star, Plus, Eye, Pencil, Trash2 } from "lucide-react"
import DashboardLayout from "../components/layout/DashboardLayout"
import Pagination from "../components/ui/Pagination"
import api from "../api/axios"

const LIMIT = 9
const CATEGORIES = ["electronics", "phones", "fashion", "home", "beauty", "sports"]

export default function Products() {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [totalProducts, setTotalProducts] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState("")
  const [searchText, setSearchText] = useState("")
  const [category, setCategory] = useState("")
  const [sortBy, setSortBy] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [deleting, setDeleting] = useState(false)
=======
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getAllCategories } from "../data/customCategories";
import {
  Search,
  SlidersHorizontal,
  Star,
  Plus,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

import DashboardLayout from "../components/layout/DashboardLayout";
import Pagination from "../components/ui/Pagination";
import DeleteConfirmModal from "../components/products/DeleteConfirmModal";
import QuickEditModel from "../components/products/QuickEditModel";
import api from "../api/axios";

const LIMIT = 9;



export default function Products() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const CATEGORIES = getAllCategories();

  const [items, setItems] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [showFilters, setShowFilters] = useState(!!searchParams.get("category"));
  const [sortBy, setSortBy] = useState("");

  // Delete Modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Quick Edit Modal state
  const [quickEditOpen, setQuickEditOpen] = useState(false);
  const [quickEditProduct, setQuickEditProduct] = useState(null);
>>>>>>> Stashed changes

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const res = await api.get("/products/search", {
        params: { search: search || undefined, category: category || undefined, sort: sortBy || undefined, page: currentPage, limit: LIMIT }
      })
      setItems(res.data.products || [])
      setTotalProducts(res.data.totalProducts || 0)
      setTotalPages(res.data.totalPages || 1)
      setError(null)
    } catch (err) {
      setError("Failed to load products.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProducts() }, [currentPage, category, sortBy])

  const handleSearch = () => {
    setSearch(searchText.trim())
    setCurrentPage(1)
    if (currentPage === 1) fetchProducts()
  }

  const changeFeatured = async item => {
    const newValue = !item.featured
    setItems(prev => prev.map(x => x._id === item._id ? { ...x, featured: newValue } : x))
    try {
      const formData = new FormData()
      formData.append("featured", newValue)
      await api.patch(`/products/update/${item._id}`, formData, { headers: { "Content-Type": "multipart/form-data" } })
    } catch (err) {
      setItems(prev => prev.map(x => x._id === item._id ? { ...x, featured: !newValue } : x))
      alert("Failed to update featured status.")
    }
  }

  const handleDelete = async item => {
    if (!window.confirm(`Are you sure you want to delete ${item.name}?`)) return
    try {
      setDeleting(true)
      await api.delete(`/products/${item._id}`)
      setItems(prev => prev.filter(x => x._id !== item._id))
    } catch (err) {
      alert("Failed to delete product.")
    } finally {
      setDeleting(false)
    }
  }

  const clearFilters = () => {
    setSearch(""); setSearchText(""); setCategory(""); setSortBy(""); setCurrentPage(1)
  }

  const featuredCount = items.filter(i => i.featured).length
  const inStockCount = items.filter(i => i.stock > 0).length
  const outStockCount = items.filter(i => i.stock <= 0).length

  const stats = [
    { icon: "▣", title: "Total Products", count: totalProducts, style: "text-[#3157D5] bg-[#EEF1F7]" },
    { icon: <Star size={19} />, title: "Featured (this page)", count: featuredCount, style: "text-[#D99A16] bg-[#FFF8E8]" },
    { icon: "✓", title: "In Stock (this page)", count: inStockCount, style: "text-[#20A464] bg-[#EAF8F0]" },
    { icon: "⊘", title: "Out of Stock (this page)", count: outStockCount, style: "text-[#D95353] bg-[#FDEEEE]" }
  ]

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#ffffff] -m-6 p-4
        sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between
          items-start sm:items-center gap-4 mb-7">
          <div>
            <h1 className="text-3xl font-bold text-[#172033]">Products</h1>
            <p className="text-[#697386] mt-1">{totalProducts} products total</p>
          </div>
          <button onClick={() => navigate("/dashboard/products/new")} className="flex items-center gap-2
            bg-[#263653] hover:bg-[#1D2A43] text-white px-5 py-3 rounded-xl transition">
            <Plus size={18} /> Add Product
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2
          lg:grid-cols-4 gap-4 mb-7">
          {stats.map((stat, index) => (
            <div key={index} className="bg-[#fffdfd] p-5 rounded-2xl
              border border-[#E3E0DB] shadow-sm">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center
                  justify-center ${stat.style}`}>{stat.icon}</div>
                <div>
                  <p className="text-[#697386] text-sm">{stat.title}</p>
                  <h2 className="text-2xl font-bold text-[#172033]">{stat.count}</h2>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[#fffefc] p-4 rounded-2xl border
          border-[#E3E0DB] shadow-sm mb-7">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2
                -translate-y-1/2 text-[#263653]" />
              <input type="text" placeholder="Search products..." value={searchText}
                onChange={e => setSearchText(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSearch()}
                className="w-full h-12 bg-[#F3F1ED] border border-[#DEDAD3]
                rounded-xl pl-11 pr-4 outline-none text-[#172033] placeholder-[#8A94A6]" />
            </div>
            <button onClick={handleSearch} className="w-full sm:w-32 h-12
              bg-[#1D3CA5] hover:bg-[#172F8F] text-white rounded-xl
              flex items-center justify-center gap-2">
              <Search size={17} /> Search
            </button>
            <button onClick={() => setShowFilters(prev => !prev)} className={`w-full sm:w-36 h-12
              rounded-xl border flex items-center justify-center gap-2 font-medium
              ${showFilters ? "bg-[#263653] text-white border-[#263653]" : "bg-[#F3F1ED] text-[#263653] border-[#D9D5CF]"}`}>
              <SlidersHorizontal size={20} /> Filter
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-[#E3E0DB]
              grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-semibold text-[#405066] mb-2">Categories</p>
                <select value={category} onChange={e => { setCategory(e.target.value); setCurrentPage(1) }}
                  className="w-full h-11 border border-[#D9D5CF] rounded-xl
                  px-4 bg-[#F3F1ED] text-[#405066] outline-none">
                  <option value="">All Categories</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#405066] mb-2">Sort By</p>
                <select value={sortBy} onChange={e => { setSortBy(e.target.value); setCurrentPage(1) }}
                  className="w-full h-11 border border-[#D9D5CF] rounded-xl
                  px-4 bg-[#F3F1ED] text-[#405066] outline-none">
                  <option value="">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
              <button onClick={clearFilters} className="sm:col-span-2 text-sm
                text-[#263653] font-medium text-left hover:underline">Clear Filters</button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="bg-[#FCFAF7] p-12 rounded-2xl text-center
            text-[#697386] border border-[#E3E0DB]">Loading products...</div>
        ) : error ? (
          <div className="bg-[#FCFAF7] p-12 rounded-2xl text-center
            text-[#D95353] border border-[#E3E0DB]">{error}</div>
        ) : items.length === 0 ? (
          <div className="bg-[#FCFAF7] p-12 rounded-2xl text-center
            text-[#697386] border border-[#E3E0DB]">No products found</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2
              lg:grid-cols-3 gap-5">
              {items.map(item => {
                const hasDiscount = item.discountPrice && item.discountPrice < item.price
                const displayPrice = hasDiscount ? item.discountPrice : item.price
                const discountAmount = hasDiscount ? item.price - item.discountPrice : 0

                return (
                  <div key={item._id} className="bg-[#FCFAF7] rounded-2xl
                    overflow-hidden border border-[#E3E0DB] shadow-sm
                    hover:shadow-md transition flex flex-col">
                    <div className="relative bg-[#F3F1ED]">
                      <div className="h-52 sm:h-56 overflow-hidden">
                        {item.images?.length > 0 ? (
                          <img src={item.images[0]?.url} alt={item.name || "Product"}
                            className="w-full h-full object-cover" />
                        ) : (
                          <div className="h-full flex items-center
                            justify-center text-[#8A8A8A]">No Image</div>
                        )}
                      </div>
                      <button onClick={() => changeFeatured(item)} className={`absolute top-3 left-3 w-9 h-9
                        rounded-lg flex items-center justify-center
                        ${item.featured ? "bg-[#FFF8E8] text-[#D99A16]" : "bg-[#F3F1ED] text-[#263653]"}`}>
                        <Star size={17} fill={item.featured ? "currentColor" : "none"} />
                      </button>
                      <span className={`absolute bottom-3 right-3 px-3 py-1.5
                        rounded-full text-xs font-semibold
                        ${item.stock > 0 ? "bg-[#EAF8F0] text-[#20965D]" : "bg-[#FDEEEE] text-[#C94A4A]"}`}>
                        {item.stock > 0 ? `${item.stock} in stock` : "Out of stock"}
                      </span>
                    </div>

                    <div className="p-5 sm:p-6 flex flex-col flex-1">
                      <h2 className="font-bold text-lg text-[#172033]">{item.name}</h2>

                      <div className="flex flex-wrap items-center gap-x-2
                        gap-y-1 mt-1 text-sm font-medium text-[#8A94A6]">
                        {item.category && <span className="capitalize">{item.category}</span>}
                        {item.subcategory && (
                          <>
                            <span className="text-[#C2C0BB]">•</span>
                            <span className="capitalize">{item.subcategory}</span>
                          </>
                        )}
                        {item.brand && (
                          <>
                            <span className="text-[#C2C0BB]">•</span>
                            <span>{item.brand}</span>
                          </>
                        )}
                      </div>

                      {item.shortDescription && (
                        <p className="text-[#344054] text-sm mt-3
                          leading-6 font-medium line-clamp-2">
                          {item.shortDescription}
                        </p>
                      )}

                      <div className="flex items-end gap-3 mt-7">
                        <span className="font-extrabold text-[30px]
                          leading-none tracking-tight text-[#263653]">
                          ${displayPrice}
                        </span>
                        {hasDiscount && (
                          <span className="mb-0.5 text-sm font-semibold
                            text-[#20A464]">-${discountAmount} off</span>
                        )}
                      </div>

                      <div className="mt-6 pt-4 border-t border-[#E5E1DB]">
                        <div className="flex items-center gap-2">
                          <button onClick={() => navigate(`/dashboard/products/${item._id}/view`)} className="group h-10 px-3 rounded-xl
                            border border-[#D9D5CF] bg-[#F8F6F2] text-[#405066]
                            flex items-center gap-1.5 text-xs font-semibold shadow-sm
                            transition-all duration-200 hover:-translate-y-0.5
                            hover:bg-[#263653] hover:border-[#263653] hover:text-white
                            hover:shadow-md active:translate-y-0 active:scale-[0.97]">
                            <Eye size={15} /> View
                          </button>
<<<<<<< Updated upstream
                          <button onClick={() => navigate(`/dashboard/products/${item._id}/edit`)} className="group h-10 px-3 rounded-xl
                            border border-[#D9D5CF] bg-[#F8F6F2] text-[#405066]
                            flex items-center gap-1.5 text-xs font-semibold shadow-sm
                            transition-all duration-200 hover:-translate-y-0.5
                            hover:bg-[#EEF1F7] hover:border-[#3157D5] hover:text-[#3157D5]
                            hover:shadow-md active:translate-y-0 active:scale-[0.97]">
=======

                          <button
                            onClick={() =>
                              navigate(
                               `/dashboard/products/edit/${item._id}`
                              )
                            }
                            className="group h-10 px-3 rounded-xl border border-[#D9D5CF] bg-[#F8F6F2] text-[#405066] flex items-center gap-1.5 text-xs font-semibold shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#EEF1F7] hover:border-[#3157D5] hover:text-[#3157D5] hover:shadow-md active:translate-y-0 active:scale-[0.97]"
                          >
>>>>>>> Stashed changes
                            <Pencil size={15} /> Edit
                          </button>
                          <button onClick={() => navigate(`/dashboard/products/${item._id}/edit`)} className="group h-10 px-3 rounded-xl
                            border border-[#D9D5CF] bg-[#F8F6F2] text-[#405066]
                            flex items-center gap-1.5 text-xs font-semibold shadow-sm
                            transition-all duration-200 hover:-translate-y-0.5
                            hover:bg-[#FFF8E8] hover:border-[#D99A16] hover:text-[#D99A16]
                            hover:shadow-md active:translate-y-0 active:scale-[0.97]">
                            <SlidersHorizontal size={15} /> Quick Edit
                          </button>
                        </div>

                        <div className="flex justify-end mt-3">
                          <button disabled={deleting} onClick={() => handleDelete(item)} className="h-10 px-3 rounded-xl border border-[#E9C9C6]
                            bg-[#FDF4F3] text-[#C94A4A] flex items-center justify-center
                            gap-1.5 text-xs font-semibold shadow-sm transition-all duration-200
                            hover:-translate-y-0.5 hover:bg-[#C94A4A] hover:border-[#C94A4A]
                            hover:text-white hover:shadow-md active:translate-y-0
                            active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed">
                            <Trash2 size={15} /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages}
              onPageChange={setCurrentPage} totalItems={totalProducts} itemsPerPage={LIMIT} />
          </>
        )}
      </div>
    </DashboardLayout>
  )
}