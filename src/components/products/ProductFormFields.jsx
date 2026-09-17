import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ImagePlus, X, Sparkles, Tag, DollarSign, Layers, Boxes } from "lucide-react";
import Input from "../ui/Input";
import TagsInput from "./TagsInput";
import { getAllCategories } from "../../data/customCategories";

function SectionHeader({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary-500 flex items-center justify-center shrink-0">
        <Icon size={16} />
      </div>
      <div>
        <h3 className="font-semibold text-sm text-gray-800">{title}</h3>
        {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
      </div>
    </div>
  );
}

export default function ProductFormFields({
  register,
  errors,
  imageFiles,
  setImageFiles,
  existingImages = [],
  onDeleteExistingImage,
  tags,
  setTags,
  watch,
}) {
  const { t } = useTranslation();
  const existingCount = existingImages?.length || 0;
  const maxNewAllowed = Math.max(0, 5 - existingCount);
  const totalImages = existingCount + imageFiles.length;

  // إدارة روابط المعاينة وتنظيف الذاكرة بشكل آمن
  const newImagePreviews = useMemo(() => {
    return imageFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
  }, [imageFiles]);

  useEffect(() => {
    return () => {
      newImagePreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [newImagePreviews]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const combined = [...imageFiles, ...files].slice(0, maxNewAllowed);
    setImageFiles(combined);
    e.target.value = "";
  };

  const removeNewImage = (index) => {
    setImageFiles(imageFiles.filter((_, i) => i !== index));
  };

  const categories = useMemo(() => getAllCategories(), []);
  const shortDescValue = watch ? watch("shortDescription") || "" : "";
  const descValue = watch ? watch("description") || "" : "";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Column */}
      <div className="flex flex-col gap-5">
        {/* Gallery */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <SectionHeader
              icon={ImagePlus}
              title={t("productForm.gallery.title")}
              subtitle={t("productForm.gallery.subtitle")}
            />
            <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
              {totalImages}/5
            </span>
          </div>

          {totalImages > 0 && (
            <div className="grid grid-cols-3 gap-3 mb-4">
              {existingImages.map((img, i) => (
                <div key={img.public_id || i} className="relative rounded-xl overflow-hidden border border-gray-100 aspect-square">
                  <img src={img.url} alt="Existing product" className="w-full h-full object-cover" />
                  {i === 0 && (
                    <span className="absolute top-1 start-1 bg-primary-500 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded">
                      {t("productForm.gallery.cover")}
                    </span>
                  )}
                  <button
                    type="button"
                    aria-label={t("productForm.gallery.removeImage")}
                    onClick={() => onDeleteExistingImage(img.public_id)}
                    className="absolute top-1 end-1 bg-black/60 text-white rounded-full p-1 hover:bg-black/80 transition"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}

              {newImagePreviews.map((preview, index) => (
                <div key={preview.url} className="relative rounded-xl overflow-hidden border border-primary-100 aspect-square">
                  <img src={preview.url} alt={`New upload ${index + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    aria-label={t("productForm.gallery.removeImage")}
                    onClick={() => removeNewImage(index)}
                    className="absolute top-1 end-1 bg-black/60 text-white rounded-full p-1 hover:bg-black/80 transition"
                  >
                    <X size={12} />
                  </button>
                  <span className="absolute bottom-1 start-1 bg-primary-500/90 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded">
                    {t("productForm.gallery.new")}
                  </span>
                </div>
              ))}
            </div>
          )}

          {totalImages < 5 && (
            <label className="border-2 border-dashed border-gray-200 rounded-xl py-7 flex flex-col items-center justify-center text-gray-400 text-sm cursor-pointer hover:border-primary-300 hover:bg-primary-50/30 transition">
              <ImagePlus size={20} className="text-gray-300 mb-1.5" />
              <span className="font-medium text-gray-500">
                {t("productForm.gallery.uploadPrompt")}
              </span>
              <span className="text-xs text-gray-400 mt-0.5">
                {t("productForm.gallery.uploadFormats")}
              </span>
              <input type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
            </label>
          )}
        </div>

        {/* Organization */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <SectionHeader
            icon={Layers}
            title={t("productForm.organization.title")}
            subtitle={t("productForm.organization.subtitle")}
          />

          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  {t("productForm.organization.category")}
                </label>
                <select
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                  {...register("category")}
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {t(`categoryNames.${c}`, c.charAt(0).toUpperCase() + c.slice(1))}
                    </option>
                  ))}
                </select>
              </div>
              <Input
                label={t("productForm.organization.subcategory")}
                placeholder={t("productForm.organization.subcategoryPlaceholder")}
                {...register("subcategory")}
              />
            </div>

            <Input
              label={t("productForm.organization.brand")}
              placeholder={t("productForm.organization.brandPlaceholder")}
              {...register("brand")}
            />

            <TagsInput tags={tags} onChange={setTags} />
          </div>
        </div>

        {/* Visibility */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <SectionHeader icon={Tag} title={t("productForm.visibility.title")} />
          <div className="flex flex-wrap items-center gap-8">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <div className="relative inline-flex items-center">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  {...register("featured")}
                />
                <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:!bg-emerald-500 dark:peer-checked:!bg-emerald-500 transition-colors duration-200" />
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-xs transition-transform duration-200 peer-checked:translate-x-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {t("productForm.visibility.featured")}
                </span>
                <span className="text-[11px] text-gray-400">
                  {t("productForm.visibility.featuredSubtitle")}
                </span>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer select-none">
              <div className="relative inline-flex items-center">
                <input
                  type="checkbox"
                  defaultChecked
                  className="sr-only peer"
                  {...register("isActive")}
                />
                <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:!bg-emerald-500 dark:peer-checked:!bg-emerald-500 transition-colors duration-200" />
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-xs transition-transform duration-200 peer-checked:translate-x-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {t("productForm.visibility.active")}
                </span>
                <span className="text-[11px] text-gray-400">
                  {t("productForm.visibility.activeSubtitle")}
                </span>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="flex flex-col gap-5">
        {/* Basic Info */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <SectionHeader icon={Sparkles} title={t("productForm.basicInfo.title")} />

          <div className="flex flex-col gap-4">
            <Input
              label={t("productForm.basicInfo.name")}
              placeholder={t("productForm.basicInfo.namePlaceholder")}
              error={errors.name?.message}
              {...register("name", {
                required: t("productForm.validation.required"),
                minLength: {
                  value: 3,
                  message: t("productForm.validation.minChars", { count: 3 }),
                },
              })}
            />

            <div>
              <Input
                label={t("productForm.basicInfo.shortDescription")}
                placeholder={t("productForm.basicInfo.shortDescriptionPlaceholder")}
                error={errors.shortDescription?.message}
                {...register("shortDescription", {
                  required: t("productForm.validation.required"),
                  minLength: {
                    value: 10,
                    message: t("productForm.validation.minChars", { count: 10 }),
                  },
                })}
              />
              <p className="text-xs text-gray-400 mt-1 text-end">
                {t("productForm.basicInfo.charCount", { count: shortDescValue.length })}
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                {t("productForm.basicInfo.description")}
              </label>
              <textarea
                rows={4}
                placeholder={t("productForm.basicInfo.descriptionPlaceholder")}
                className={`px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.description ? "border-danger" : "border-gray-300"
                }`}
                {...register("description", {
                  required: t("productForm.validation.required"),
                  minLength: {
                    value: 20,
                    message: t("productForm.validation.minChars", { count: 20 }),
                  },
                })}
              />
              <div className="flex items-center justify-between mt-1">
                {errors.description ? (
                  <span className="text-xs text-danger">{errors.description.message}</span>
                ) : (
                  <span />
                )}
                <p className="text-xs text-gray-400">
                  {t("productForm.basicInfo.charCount", { count: descValue.length })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <SectionHeader icon={DollarSign} title={t("productForm.pricing.title")} />

          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label={t("productForm.pricing.price")}
                type="number"
                step="0.01"
                placeholder="0.00"
                error={errors.price?.message}
                {...register("price", {
                  required: t("productForm.validation.required"),
                  min: 0,
                  valueAsNumber: true,
                })}
              />
              <Input
                label={t("productForm.pricing.discountPrice")}
                type="number"
                step="0.01"
                placeholder={t("productForm.pricing.optional")}
                {...register("discountPrice", { valueAsNumber: true })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label={t("productForm.pricing.stock")}
                type="number"
                placeholder="0"
                error={errors.stock?.message}
                {...register("stock", {
                  required: t("productForm.validation.required"),
                  min: 0,
                  valueAsNumber: true,
                })}
              />
              <Input
                label={t("productForm.pricing.sku")}
                placeholder={t("productForm.pricing.optional")}
                {...register("sku")}
              />
            </div>
          </div>
        </div>

        {/* Tips Card */}
        <div className="bg-gradient-to-br from-primary-50 to-primary-100/50 border border-primary-100 rounded-2xl p-4 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-white text-primary-500 flex items-center justify-center shrink-0 shadow-sm">
            <Boxes size={16} />
          </div>
          <div>
            <p className="text-sm font-semibold text-primary-800">
              {t("productForm.tip.title")}
            </p>
            <p className="text-xs text-primary-700 mt-0.5">
              {t("productForm.tip.content")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}