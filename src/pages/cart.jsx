export default function Cart() {
  return (
    <div className="p-6 bg-[#f5f7fa] min-h-screen">
      
      
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
        <p className="text-xs tracking-[0.3em] text-[#00c8c8] font-semibold mb-2">
          CARTS
        </p>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Cart overview
        </h1>
        <p className="text-gray-500 text-sm">
          All active carts returned from the API are rendered here with their latest item details.
        </p>
      </div>

      
      <div className=" rounded-2xl border-2 border-dashed border-gray-200 flex-col items-center justify-center p-12">
        
        <h2 className="text-lg font-semibold text-gray-400 mb-1 h-2">
          No carts returned from APi
        </h2>
      </div>

    </div>
  )
}