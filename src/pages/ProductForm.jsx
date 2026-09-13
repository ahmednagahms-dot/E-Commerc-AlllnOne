import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, PackagePlus } from "lucide-react";

import DashboardLayout from "../components/layout/DashboardLayout";
import Button from "../components/ui/Button";
import ProductFormFields from "../components/products/ProductFormFields";
import PageLoader from "../components/ui/sessionLoader/PageLoader";
import api from "../api/axios";

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

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      shortDescription: "",
      description: "",
      price: "",
      discountPrice: "",
      stock: "",
      sku: "",
      category: "",
      subcategory: "",
      brand: "",
      featured: false,
      isActive: true,
    },
  });

  // =========================
  // Fetch product (Edit mode)
  // =========================
  useEffect(() => {
    if (!isEditMode) return;

    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        const product = response.data.product || response.data;

        reset({
          name: product.name || "",
          shortDescription: product.shortDescription || "",
          description: product.description || "",
          price: product.price ?? "",
          discountPrice: product.discountPrice ?? "",
          stock: product.stock ?? "",
          sku: product.sku || "",
          category: product.category || "",
          subcategory: product.subcategory || "",
          brand: product.brand || "",
          featured: Boolean(product.featured),
          isActive: product.active !== false,
        });

        setExistingImages(product.images || []);
        setTags(Array.isArray(product.tags) ? product.tags : []);
        setDeletedImages([]);
        setImageFiles([]);
      } catch (err) {
        toast.error("Failed to load product data.");
        navigate("/dashboard/products");
      } finally {
        setLoadingProduct(false);
      }
    };

    fetchProduct();
  }, [id, isEditMode, reset, navigate]);

  // =========================
  // Delete existing image
  // =========================
  const onDeleteExistingImage = (publicId) => {
    setExistingImages((prev) =>
      prev.filter((img) => img.public_id !== publicId)
    );
    setDeletedImages((prev) => [...prev, publicId]);
  };

  // =========================
  // Submit
  // =========================
  const onSubmit = async (formData) => {
    setFormError("");

    // Validation: at least one image
    if (
      (!isEditMode && imageFiles.length === 0) ||
      (isEditMode && existingImages.length === 0 && imageFiles.length === 0)
    ) {
      setFormError("At least one image is required.");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("shortDescription", formData.shortDescription || "");
    data.append("description", formData.description || "");
    data.append("price", formData.price);
    if (formData.discountPrice) {
      data.append("discountPrice", formData.discountPrice);
    }
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

    // New images
    imageFiles.forEach((file) => data.append("images", file));

    // Deleted images (edit only)
    if (isEditMode && deletedImages.length > 0) {
      data.append("deletedImages", JSON.stringify(deletedImages));
    }

    try {
      setSubmitting(true);

      if (isEditMode) {
        await api.patch(`/products/update/${id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/products", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      toast.success(
        isEditMode
          ? "Product updated successfully!"
          : "Product added successfully!"
      );
      navigate("/dashboard/products");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Something went wrong while saving the product.";
      setFormError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingProduct) {
    return (
      <DashboardLayout>
        <PageLoader text="Loading product..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 w-full animate-fade-in">
        {/* Header */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <button
              type="button"
              onClick={() => navigate("/dashboard/products")}
              className="inline-flex items-center gap-2 text-sm bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg mb-4 transition"
            >
              <ArrowLeft size={14} />
              Back to products
            </button>

            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0">
                <PackagePlus size={20} />
              </div>
              <div>
                <p className="text-xs font-semibold text-indigo-300 tracking-widest uppercase">
                  {isEditMode ? "Edit Product" : "Create Product"}
                </p>
                <h1 className="text-2xl font-bold mt-0.5">
                  {isEditMode
                    ? "Update product details"
                    : "Add a new product"}
                </h1>
                <p className="text-sm text-white/50 mt-1">
                  Fill in the details, upload images, and save.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Error */}
        {formError && (
          <p className="text-red-600 text-sm bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-5">
            {formError}
          </p>
        )}

        {/* Form */}
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

          <div className="flex items-center gap-3 pt-6 mt-6 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/dashboard/products")}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting
                ? "Saving..."
                : isEditMode
                ? "Update Product"
                : "Create Product"}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}