import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import Button from "../components/ui/Button";
import ProductFormFields from "../components/products/ProductFormFields";
import { ArrowLeft, PackagePlus } from "lucide-react";
import api from "../api/axios";
import PageLoader from "../components/ui/sessionLoader/PageLoader";

export default function ProductForm() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [imageFiles, setImageFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [tags, setTags] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(isEditMode);
  const [formError, setFormError] = useState("");

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();

  useEffect(() => {
    if (!isEditMode) return;
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        const product = response.data.product;
        reset(product);
        setExistingImages(product.images || []);
        setTags(product.tags || []);
      } catch (err) {
        alert("Failed to load product data.");
      } finally {
        setLoadingProduct(false);
      }
    };
    fetchProduct();
  }, [id, isEditMode, reset]);

  const onDeleteExistingImage = (publicId) => {
    setExistingImages(existingImages.filter((img) => img.public_id !== publicId));
    setDeletedImages([...deletedImages, publicId]);
  };

  const onSubmit = async (formData) => {
    setFormError("");

    if (!isEditMode && imageFiles.length === 0) {
      setFormError("At least one image is required.");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("shortDescription", formData.shortDescription);
    data.append("description", formData.description);
    data.append("price", formData.price);
    if (formData.discountPrice) data.append("discountPrice", formData.discountPrice);
    data.append("stock", formData.stock);
    if (formData.sku) data.append("sku", formData.sku);
    if (formData.category) data.append("category", formData.category);
    if (formData.subcategory) data.append("subcategory", formData.subcategory);
    if (formData.brand) data.append("brand", formData.brand);
    data.append("featured", formData.featured || false);
    data.append("isActive", formData.isActive ?? true);

    if (tags.length > 0) {
      data.append("tags", JSON.stringify(tags));
    }

    imageFiles.forEach((file) => data.append("images", file));

    if (isEditMode && deletedImages.length > 0) {
      data.append("deletedImages", JSON.stringify(deletedImages));
    }

    try {
      setSubmitting(true);
      if (isEditMode) {
        await api.patch(`/products/update/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } });
      } else {
        await api.post("/products", data, { headers: { "Content-Type": "multipart/form-data" } });
      }
      navigate("/dashboard/products");
    } catch (err) {
      setFormError(err.response?.data?.message || "Something went wrong while saving the product.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingProduct) {
    return <DashboardLayout><p className="text-gray-400 text-center py-16">Loading product...</p></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      {/* Dark Header Banner */}
      <div className="bg-sidebar text-white rounded-2xl p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate("/dashboard/products")}
            className="flex items-center gap-2 text-sm bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg mb-4"
          >
            <ArrowLeft size={14} /> Back to products
          </button>

          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-lg bg-primary-500/20 text-primary-300 flex items-center justify-center shrink-0">
              <PackagePlus size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold text-primary-300 tracking-widest uppercase">
                {isEditMode ? "Edit Product" : "Create Product"}
              </p>
              <h1 className="text-2xl font-bold">
                {isEditMode ? "Update product details" : "Launch a polished product entry"}
              </h1>
              <p className="text-sm text-white/50 mt-1">
                Add products with validation, image previews, multi-upload support, and smooth UX.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/10 rounded-xl px-4 py-3 shrink-0">
          <p className="text-xs font-semibold text-primary-300 uppercase">Ready</p>
          <p className="text-xs text-white/60 mt-0.5">Create, validate, and save with one click.</p>
        </div>
      </div>

      {formError && (
        <p className="text-danger text-sm bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-4">{formError}</p>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <ProductFormFields
          register={register}
          errors={errors}
          imageFiles={imageFiles}
          setImageFiles={setImageFiles}
          existingImages={existingImages}
          onDeleteExistingImage={onDeleteExistingImage}
          tags={tags}
          setTags={setTags}
          watch={watch}
        />

        <div className="flex items-center gap-3 pt-6 mt-6 border-t">
          <Button type="button" variant="outline" onClick={() => navigate("/dashboard/products")}>Cancel</Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Saving..." : isEditMode ? "Update Product" : "Create Product"}
          </Button>
        </div>
      </form>
    </DashboardLayout>
  );
}