import { ImagePlus, X, Sparkles } from "lucide-react";
import Input from "../ui/Input";
import TagsInput from "./TagsInput";

const categories = ["electronics", "phones", "fashion", "home", "beauty", "sports"];

export default function ProductFormFields({
  register,
  errors,
  imageFiles,
  setImageFiles,
  existingImages,
  onDeleteExistingImage,
  tags,
  setTags,
}) {
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const combined = [...imageFiles, ...files].slice(0, 5);
    setImageFiles(combined);
    e.target.value = "";
  };

  const removeNewImage = (index) => {
    setImageFiles(imageFiles.filter((_, i) => i !== index));
  };

  const totalImages = (existingImages?.length || 0) + imageFiles.length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left: Gallery */}
      <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm h-fit">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-9 h-9 rounded-lg bg-primary-50 text-primary-500 flex items-center justify-center">
            <ImagePlus size={18} />
          </div>
          <div>
            <h3 className="font-semibold">Gallery</h3>
            <p className="text-xs text-gray-400">Upload multiple images and preview instantly.</p>
          </div>
        </div>

        {totalImages > 0 && (
          <div className="grid grid-cols-2 gap-3 mb-4">
            {existingImages?.map((img) => (
              <div key={img.public_id} className="relative rounded-lg overflow-hidden border border-gray-100">
                <img src={img.url} alt="Existing" className="w-full h-32 object-cover" />
                <button
                  type="button"
                  onClick={() => onDeleteExistingImage(img.public_id)}
                  className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"
                >
                  <X size={14} />
                </button>
                <span className="absolute bottom-1 left-1 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded">
                  IMAGE {existingImages.indexOf(img) + 1}
                </span>
              </div>
            ))}

            {imageFiles.map((file, index) => (
              <div key={index} className="relative rounded-lg overflow-hidden border border-gray-100">
                <img src={URL.createObjectURL(file)} alt={`New ${index + 1}`} className="w-full h-32 object-cover" />
                <button
                  type="button"
                  onClick={() => removeNewImage(index)}
                  className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"
                >
                  <X size={14} />
                </button>
                <span className="absolute bottom-0 left-0 right-0 bg-primary-500/80 text-white text-[10px] text-center py-0.5">
                  NEW
                </span>
              </div>
            ))}
          </div>
        )}

        {totalImages < 5 && (
          <label className="block border-2 border-dashed border-primary-200 bg-primary-50/40 rounded-xl py-8 flex flex-col items-center justify-center text-gray-500 text-sm cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition">
            <ImagePlus size={22} className="text-primary-400 mb-2" />
            <span className="font-medium">Upload images</span>
            <span className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP • multiple files supported</span>
            <input type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
          </label>
        )}

        <div className="bg-green-50 border border-green-100 rounded-xl p-4 mt-4 flex items-start gap-2">
          <Sparkles size={16} className="text-success shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-green-800">Senior UX</p>
            <p className="text-xs text-green-700 mt-0.5">
              Optimized product creation experience with responsive design and smooth interactions.
            </p>
          </div>
        </div>
      </div>

      {/* Right: Fields */}
      <div className="flex flex-col gap-4">
        <Input
          label="Product Name"
          placeholder="iPhone 16 Pro"
          error={errors.name?.message}
          {...register("name", { required: "Required", minLength: { value: 3, message: "Minimum 3 characters" } })}
        />

        <Input
          label="Short Description"
          placeholder="Minimum 10 characters"
          error={errors.shortDescription?.message}
          {...register("shortDescription", { required: "Required", minLength: { value: 10, message: "Minimum 10 characters" } })}
        />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Description</label>
          <textarea
            rows={3}
            placeholder="Minimum 20 characters"
            className={`px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500 ${errors.description ? "border-danger" : "border-gray-300"}`}
            {...register("description", { required: "Required", minLength: { value: 20, message: "Minimum 20 characters" } })}
          />
          {errors.description && <span className="text-xs text-danger">{errors.description.message}</span>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input label="Price" type="number" step="0.01" error={errors.price?.message} {...register("price", { required: "Required", min: 0 })} />
          <Input label="Discount Price" type="number" step="0.01" {...register("discountPrice")} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input label="Stock" type="number" error={errors.stock?.message} {...register("stock", { required: "Required", min: 0 })} />
          <Input label="SKU" {...register("sku")} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Category</label>
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500"
              {...register("category")}
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
          </div>
          <Input label="Subcategory" {...register("subcategory")} />
        </div>

        <Input label="Brand" {...register("brand")} />

        <TagsInput tags={tags} onChange={setTags} />

        <div className="flex items-center gap-3">
          <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 has-[:checked]:bg-primary-50 has-[:checked]:border-primary-300 has-[:checked]:text-primary-700 text-gray-500 text-sm font-medium cursor-pointer transition">
            <input type="checkbox" className="w-4 h-4" {...register("featured")} />
            Featured
          </label>
          <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 has-[:checked]:bg-primary-50 has-[:checked]:border-primary-300 has-[:checked]:text-primary-700 text-gray-500 text-sm font-medium cursor-pointer transition">
            <input type="checkbox" defaultChecked className="w-4 h-4" {...register("isActive")} />
            Active
          </label>
        </div>
      </div>
    </div>
  );
}