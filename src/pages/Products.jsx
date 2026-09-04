
import { useEffect, useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import { Search, SlidersHorizontal, Star, Plus, Eye, Pencil, Zap } from "lucide-react"
import api from "../api/axios"

export default function Products() {
  const [items, setItems] = useState([])
  const [search, setSearch] = useState("")
  const [searchText, setSearchText] = useState("")
  const [category, setCategory] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [showFilters, setShowFilters] = useState(false)

  const categories = ["electronics", "phones", "fashion", "home", "beauty", "sports"]

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await api.get("/products")
        setItems(response.data.products)
      } catch (error) {
        console.log(error)
      }
    }
    loadProducts()
  }, [])

  const changeFeatured = async item => {
    const value = !item.featured

    setItems(prev => prev.map(x => x._id === item._id ? { ...x, featured: value } : x))

    try {
      const response = await api.patch(`/products/${item._id}`, { featured: value })
      const product = response.data.product || response.data
      setItems(prev => prev.map(x => x._id === item._id ? { ...x, ...product, featured: value } : x))
    } catch (error) {
      console.log(error)
    }
  }

  const handleSearch = () => {
    setSearch(searchText.trim())
  }

  const filtered = items.filter(item => {
    const name = item.name?.toLowerCase() || ""
    const itemCategory = item.category?.toLowerCase() || ""
    const value = search.toLowerCase()
    const matchName = name.includes(value)
    const matchCategory = category === "" || itemCategory === category.toLowerCase()
    return matchName && matchCategory
  })

  const sorted = [...filtered].sort((a, b) => {
    const dateA = new Date(a.createdAt)
    const dateB = new Date(b.createdAt)
    return sortBy === "newest" ? dateB - dateA : dateA - dateB
  })

  const featuredCount = items.filter(item => item.featured).length
  const inStockCount = items.filter(item => item.stock > 0).length
  const outStockCount = items.filter(item => item.stock <= 0).length

  const clearFilters = () => {
    setSearch("")
    setSearchText("")
    setCategory("")
    setSortBy("newest")
  }

  return (
    <div className="min-h-screen bg-[#F5F6F8] p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center mb-7">
        <div>
          <h1 className="text-3xl font-bold text-[#172033]">Products</h1>
          <p className="text-[#697386] mt-1">Manage and organize your store products</p>
        </div>
        <button type="button" className="flex items-center gap-2 bg-[#263653] hover:bg-[#1D2A43] text-white px-5 py-3 rounded-xl transition">
          <Plus size={18} />
          <span>Add Product</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        <div className="bg-[#FAFBFC] p-5 rounded-2xl border border-[#E1E5EA] shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#EEF1F7] flex items-center justify-center text-[#3157D5]">
              <span className="text-lg">▣</span>
            </div>
            <div>
              <p className="text-[#697386] text-sm">Total Products</p>
              <h2 className="text-2xl font-bold text-[#172033]">{items.length}</h2>
            </div>
          </div>
          <p className="text-sm text-[#98A1B2] mt-4">All products</p>
        </div>

        <div className="bg-[#FAFBFC] p-5 rounded-2xl border border-[#E1E5EA] shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#FFF8E8] flex items-center justify-center text-[#D99A16]">
              <Star size={19} />
            </div>
            <div>
              <p className="text-[#697386] text-sm">Featured</p>
              <h2 className="text-2xl font-bold text-[#172033]">{featuredCount}</h2>
            </div>
          </div>
          <p className="text-sm text-[#98A1B2] mt-4">Featured products</p>
        </div>

        <div className="bg-[#FAFBFC] p-5 rounded-2xl border border-[#E1E5EA] shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#EAF8F0] flex items-center justify-center text-[#20A464]">
              <span className="text-lg">✓</span>
            </div>
            <div>
              <p className="text-[#697386] text-sm">In Stock</p>
              <h2 className="text-2xl font-bold text-[#172033]">{inStockCount}</h2>
            </div>
          </div>
          <p className="text-sm text-[#98A1B2] mt-4">Products in stock</p>
        </div>

        <div className="bg-[#FAFBFC] p-5 rounded-2xl border border-[#E1E5EA] shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#FDEEEE] flex items-center justify-center text-[#D95353]">
              <span className="text-lg">⊘</span>
            </div>
            <div>
              <p className="text-[#697386] text-sm">Out of Stock</p>
              <h2 className="text-2xl font-bold text-[#172033]">{outStockCount}</h2>
            </div>
          </div>
          <p className="text-sm text-[#98A1B2] mt-4">Products out of stock</p>
        </div>
      </div>

      <div className="bg-[#FAFBFC] p-4 rounded-2xl border border-[#E1E5EA] shadow-sm mb-7">
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3157D5]" />
            <input type="text" placeholder="Search products..." value={searchText} onChange={e => setSearchText(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSearch()} className="w-full h-12 bg-[#F1F3F5] border border-[#E5E7EB] rounded-xl pl-11 pr-4 outline-none text-[#172033] placeholder-[#8A94A6] focus:border-[#BFDBFE] focus:ring-2 focus:ring-[#BFDBFE] focus:bg-[#FAFBFC] transition" />
          </div>

          <button type="button" onClick={handleSearch} className="w-full sm:w-32 h-12 bg-[#1D3CA5] hover:bg-[#172F8F] text-white rounded-xl flex items-center justify-center gap-2 transition font-medium">
            <Search size={17} />
            <span>Search</span>
          </button>

          <button type="button" onClick={() => setShowFilters(prev => !prev)} className={`w-full  sm:w-36 h-12 border rounded-xl flex items-center justify-center gap-2 transition font-medium ${showFilters ? "bg-[#263653] text-white border-[#263653]" : "bg-[#FAFBFC] border-[#D9DEE6] text-[#3157D5] hover:bg-[#F5F7FC]"}`}>
            <SlidersHorizontal size={22} />
            <span>Filter</span>
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-[#E5E7EB] grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-semibold text-[#405066] mb-2">Categories</p>
              <select value={category} onChange={e => setCategory(e.target.value)} className="w-full h-12 border border-[#DDE3EA] rounded-xl px-4 outline-none bg-[#F8FAFC] text-[#405066] focus:border-[#AFC4E8] focus:ring-2 focus:ring-[#DCE8F8] transition">
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                ))}
              </select>
            </div>

            <div>
              <p className="text-sm font-semibold text-[#405066] mb-2">Sort By</p>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="w-full h-12 border border-[#DDE3EA] rounded-xl px-4 outline-none bg-[#F8FAFC] text-[#405066] focus:border-[#AFC4E8] focus:ring-2 focus:ring-[#DCE8F8] transition">
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>

            <button type="button" onClick={clearFilters} className="sm:col-span-2 text-sm text-[#3157D5] font-medium text-left hover:underline">
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {sorted.length === 0 ? (
        <div className="bg-[#FAFBFC] p-12 rounded-2xl text-center text-[#697386] border border-[#E1E5EA]">No products found</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sorted.map(item => (
            <div key={item._id} className="bg-[#FAFBFC] rounded-2xl overflow-hidden border border-[#E1E5EA] shadow-sm hover:shadow-md transition">
              <div className="relative bg-[#EEF0F3]">
                {item.images?.length > 0 ? (
                  <Swiper modules={[Navigation, Pagination]} navigation pagination={{ clickable: true }} spaceBetween={0} slidesPerView={1} className="w-full h-52 sm:h-56">
                    {item.images.map((image, index) => (
                      <SwiperSlide key={`${item._id}-${index}`} className="w-full h-full">
                        <img src={image.url} alt={item.name || "Product"} className="w-full h-52 sm:h-56 object-cover block" />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                ) : (
                  <div className="w-full h-52 sm:h-56 flex items-center justify-center text-[#98A1B2] bg-[#EEF0F3]">No Image</div>
                )}

                <button type="button" onClick={() => changeFeatured(item)} className={`absolute top-3 left-3 z-10 w-9 h-9 rounded-lg flex items-center justify-center transition ${item.featured ? "bg-[#FFF8E8] text-[#D99A16]" : "bg-[#FAFBFC] text-[#697386] hover:text-[#18243A]"}`}>
                  <Star size={17} fill={item.featured ? "currentColor" : "none"} />
                </button>

                <span className={`absolute top-3 right-3 z-10 px-3 py-1.5 rounded-lg text-xs font-semibold ${item.stock > 0 ? "bg-[#EAF8F0] text-[#20965D]" : "bg-[#FDEEEE] text-[#C94A4A]"}`}>
                  {item.stock > 0 ? `${item.stock} in stock` : "Out of stock"}
                </span>
              </div>

              <div className="p-5">
                <h2 className="font-bold text-lg text-[#172033]">{item.name}</h2>
                <p className="text-[#697386] text-sm mt-1 capitalize">{item.category}{item.subcategory && ` / ${item.subcategory}`}</p>

                <div className="flex items-center gap-3 mt-4">
                  <span className="font-bold text-xl text-[#18243A]">${item.price}</span>
                  {item.discountPrice && <span className="text-[#B42318] line-through">${item.discountPrice}</span>}
                </div>

                <div className="grid grid-cols-3 gap-2 mt-5">
                  <button type="button"  className="bg-[#F8FAFC] size={16} border border-[#D9DEE6] py-2.5 rounded-lg flex items-center justify-center gap-1.5 text-[#364152] hover:bg-[#F1F3F5] transition">
                    <span>View</span>
                  </button>

                  <button type="button" className="bg-[#F8FAFC] size={16} border border-[#D9DEE6] py-2.5 rounded-lg flex items-center justify-center gap-1.5 text-[#364152] hover:bg-[#F1F3F5] transition">

                    <span>Edit</span>
                  </button>

                  <button type="button" className="bg-[#263653] size={16} hover:bg-[#1D2A43] text-white py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition">
                    
                    <span>Quick Edit</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

