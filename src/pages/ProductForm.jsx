import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import Button from "../components/ui/Button";
import ProductFormFields from "../components/products/ProductFormFields";
import { uploadToCloudinary } from "../api/cloudinary";
import api from "../api/axios";

const MAX_IMAGES = 5;

export default function ProductForm() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [imagesError, setImagesError] = useState("");

  // Images already saved on the product (edit mode only) — array of URLs
  const [existingImages, setExistingImages] = useState([]);
  // Newly picked images, not part of the saved product yet
  // shape: { file, previewUrl, uploading, uploadedUrl, error }
  const [imageFiles, setImageFiles] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
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
      tags: "",
      featured: false,
      active: true,
    },
  });

  // Load product data in edit mode
  useEffect(() => {
    if (!isEditMode) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/products/${id}`);
        const product = data.product || data;

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
          tags: Array.isArray(product.tags) ? product.tags.join(", ") : product.tags || "",
          featured: Boolean(product.featured),
          active: product.active !== false,
        });
        setExistingImages(product.images || []);
      } catch (err) {
        setSubmitError(err.response?.data?.message || "Failed to load product.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, isEditMode, reset]);

  // Revoke object URLs on unmount to avoid memory leaks
  useEffect(() => {
    return () => {
      imageFiles.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddImages = (files) => {
    const remainingSlots = MAX_IMAGES - existingImages.length - imageFiles.length;
    const filesToAdd = files.slice(0, remainingSlots);

    const newEntries = filesToAdd.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      uploading: true,
      uploadedUrl: null,
      error: false,
    }));

    setImageFiles((prev) => [...prev, ...newEntries]);
    setImagesError("");

    newEntries.forEach((entry) => {
      uploadToCloudinary(entry.file)
        .then((url) => {
          setImageFiles((prev) =>
            prev.map((img) =>
              img.previewUrl === entry.previewUrl ? { ...img, uploading: false, uploadedUrl: url } : img
            )
          );
        })
        .catch(() => {
          setImageFiles((prev) =>
            prev.map((img) =>
              img.previewUrl === entry.previewUrl ? { ...img, uploading: false, error: true } : img
            )
          );
        });
    });
  };

  const handleRemoveExistingImage = (url) => {
    setExistingImages((prev) => prev.filter((img) => img !== url));
  };

  const handleRemoveNewImage = (index) => {
    setImageFiles((prev) => {
      const target = prev[index];
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  };

  const onSubmit = async (formData) => {
    setSubmitError("");
    setImagesError("");

    if (imageFiles.some((img) => img.uploading)) {
      setImagesError("Please wait for all images to finish uploading.");
      return;
    }

    const uploadedUrls = imageFiles
      .filter((img) => img.uploadedUrl)
      .map((img) => img.uploadedUrl);
    const finalImages = [...existingImages, ...uploadedUrls];

    if (!isEditMode && finalImages.length === 0) {
      setImagesError("At least 1 image is required.");
      return;
    }

    const payload = {
      name: formData.name,
      shortDescription: formData.shortDescription,
      description: formData.description,
      price: formData.price,
      discountPrice: formData.discountPrice,
      stock: formData.stock,
      sku: formData.sku,
      category: formData.category,
      subcategory: formData.subcategory,
      brand: formData.brand,
      tags: formData.tags
        ? formData.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [],
      featured: formData.featured,
      active: formData.active,
      images: finalImages,
    };

    try {
      setSaving(true);
      if (isEditMode) {
        await api.patch(`/products/${id}`, payload);
      } else {
        await api.post("/products", payload);
      }
      navigate("/dashboard/products");
    } catch (err) {
      setSubmitError(err.response?.data?.message || "Failed to save product. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <p className="text-sm text-gray-500">Loading product...</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <button
        type="button"
        onClick={() => navigate("/dashboard/products")}
        className="text-xs text-gray-500 hover:text-gray-800 mb-3"
      >
        ← Back to products
      </button>

      <div className="mb-6">
        <p className="text-[11px] font-semibold text-primary-600 tracking-wide uppercase">
          {isEditMode ? "Edit Product" : "Create Product"}
        </p>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditMode ? "Edit product" : "Add a new product"}
        </h1>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-xl border border-gray-100 shadow-sm p-6"
      >
        <ProductFormFields
          register={register}
          errors={errors}
          existingImages={existingImages}
          imageFiles={imageFiles}
          onAddImages={handleAddImages}
          onRemoveExistingImage={handleRemoveExistingImage}
          onRemoveNewImage={handleRemoveNewImage}
          imagesError={imagesError}
        />

        {submitError && (
          <p className="text-danger text-sm bg-red-50 border border-red-100 rounded-lg px-3 py-2 mt-6">
            {submitError}
          </p>
        )}

        <div className="flex items-center gap-3 pt-6 mt-6 border-t border-gray-100">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : isEditMode ? "Save Changes" : "Create Product"}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate("/dashboard/products")}>
            Cancel
          </Button>
        </div>
      </form>
    </DashboardLayout>
  );
}
