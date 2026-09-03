import { ImagePlus, Loader2, X } from "lucide-react";
import Input from "../ui/Input";
import Textarea from "../ui/Textarea";

const MAX_IMAGES = 5;

export default function ProductFormFields({
  register,
  errors,
  existingImages,
  imageFiles,
  onAddImages,
  onRemoveExistingImage,
  onRemoveNewImage,
  imagesError,
}) {
  const totalImages = existingImages.length + imageFiles.length;
  const canAddMore = totalImages < MAX_IMAGES;

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length) onAddImages(files);
    e.target.value = "";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
      {/* Gallery */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <ImagePlus size={16} className="text-gray-500" />
          <h3 className="text-sm font-semibold text-gray-800">Gallery</h3>
        </div>
        <p className="text-xs text-gray-400 mb-3">
          Up to {MAX_IMAGES} images. At least 1 required.
        </p>

        <div className="grid grid-cols-2 gap-3">
          {existingImages.map((url) => (
            <div
              key={url}
              className="relative aspect-square rounded-lg border border-gray-200 overflow-hidden group"
            >
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => onRemoveExistingImage(url)}
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
              >
                <X size={13} />
              </button>
            </div>
          ))}

          {imageFiles.map((img, index) => (
            <div
              key={img.previewUrl}
              className="relative aspect-square rounded-lg border border-gray-200 overflow-hidden group"
            >
              <img src={img.previewUrl} alt="" className="w-full h-full object-cover" />
              {img.uploading && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Loader2 size={18} className="text-white animate-spin" />
                </div>
              )}
              {img.error && (
                <div className="absolute inset-0 bg-red-500/70 flex items-center justify-center text-white text-[10px] text-center px-1">
                  Upload failed
                </div>
              )}
              <button
                type="button"
                onClick={() => onRemoveNewImage(index)}
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
              >
                <X size={13} />
              </button>
            </div>
          ))}

          {canAddMore && (
            <label className="aspect-square rounded-lg border border-dashed border-gray-300 flex flex-col items-center justify-center gap-1.5 text-gray-400 text-xs cursor-pointer hover:border-primary-400 hover:text-primary-500 transition">
              <ImagePlus size={20} />
              Add Image
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        {imagesError && <p className="text-xs text-danger mt-2">{imagesError}</p>}
      </div>

      {/* Product data */}
      <div className="flex flex-col gap-4">
        <Input
          label="Product Name"
          error={errors.name?.message}
          {...register("name", { required: "Product name is required" })}
        />

        <Input
          label="Short Description"
          error={errors.shortDescription?.message}
          {...register("shortDescription")}
        />

        <Textarea
          label="Description"
          error={errors.description?.message}
          {...register("description")}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Price"
            type="number"
            step="0.01"
            min="0"
            error={errors.price?.message}
            {...register("price", {
              required: "Price is required",
              min: { value: 0, message: "Price can't be negative" },
              valueAsNumber: true,
            })}
          />
          <Input
            label="Discount Price"
            type="number"
            step="0.01"
            min="0"
            error={errors.discountPrice?.message}
            {...register("discountPrice", {
              min: { value: 0, message: "Discount price can't be negative" },
              setValueAs: (v) => (v === "" ? undefined : Number(v)),
            })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Stock"
            type="number"
            min="0"
            error={errors.stock?.message}
            {...register("stock", {
              required: "Stock is required",
              min: { value: 0, message: "Stock can't be negative" },
              valueAsNumber: true,
            })}
          />
          <Input label="SKU" error={errors.sku?.message} {...register("sku")} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Category"
            error={errors.category?.message}
            {...register("category", { required: "Category is required" })}
          />
          <Input label="Subcategory" error={errors.subcategory?.message} {...register("subcategory")} />
        </div>

        <Input label="Brand" error={errors.brand?.message} {...register("brand")} />

        <Input
          label="Tags (comma separated)"
          placeholder="wireless, audio"
          error={errors.tags?.message}
          {...register("tags")}
        />

        <div className="flex items-center gap-6 pt-1">
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 accent-indigo-600"
              {...register("featured")}
            />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 accent-indigo-600"
              {...register("active")}
            />
            Active
          </label>
        </div>
      </div>
    </div>
  );
}
