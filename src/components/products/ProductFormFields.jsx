import { useState } from "react";
import { ImagePlus, X } from "lucide-react";
import Input from "../ui/Input";

export default function ProductFormFields({ register, errors, imageFiles, setImageFiles, existingImages, onDeleteExistingImage }) {
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    // الـ API بيقبل 5 صور بحد أقصى
    const combined = [...imageFiles, ...files].slice(0, 5);
    setImageFiles(combined);
    e.target.value = "";
  };

  const removeNewImage = (index) => {
    setImageFiles(imageFiles.filter((_, i) => i !== index));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left: Images */}
      <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-9 h-9 rounded-lg bg-primary-50 text-primary-500 flex items-center justify-center">
            <ImagePlus size={18} />
          </div>
          <div>
            <h3 className="font-semibold">Gallery</h3>
            <p className="text-xs text-gray-400">Up to 5 images. At least 1 required.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          {/* الصور الموجودة فعليًا (في وضع التعديل) */}
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
            </div>
          ))}

          {/* الصور الجديدة (لسه معملهاش Upload، هنبعتها مع الفورم) */}
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
              <span className="absolute bottom-0 left-0 right-0 bg-primary-500/80 text-white text-[10px] text-center py-0.5">NEW</span>
            </div>
          ))}

          {(existingImages?.length || 0) + imageFiles.length < 5 && (
            <label className="border-2 border-dashed border-gray-200 rounded-lg h-32 flex flex-col items-center justify-center text-gray-400 text-xs cursor-pointer hover:border-primary-400 hover:text-primary-500">
              <ImagePlus size={20} />
              Add Image
              <input type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
            </label>
          )}
        </div>
      </div>

      {/* Right: Fields */}
      <div className="flex flex-col gap-4">
        <Input label="Product Name" error={errors.name?.message} {...register("name", { required: "Required", minLength: { value: 3, message: "Minimum 3 characters" } })} />

        <Input label="Short Description" error={errors.shortDescription?.message} {...register("shortDescription", { required: "Required", minLength: { value: 10, message: "Minimum 10 characters" } })} />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Description</label>
          <textarea
            rows={3}
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
          <Input label="Category" error={errors.category?.message} {...register("category")} />
          <Input label="Subcategory" {...register("subcategory")} />
        </div>

        <Input label="Brand" {...register("brand")} />
        <Input label="Tags (comma separated)" placeholder="wireless, audio" {...register("tags")} />

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register("featured")} className="w-4 h-4" /> Featured
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" defaultChecked {...register("isActive")} className="w-4 h-4" /> Active
          </label>
        </div>
      </div>
    </div>
  );
}