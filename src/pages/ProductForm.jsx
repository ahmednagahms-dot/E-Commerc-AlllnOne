import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import Button from "../components/ui/Button";
import ProductFormFields from "../components/products/ProductFormFields";
import { ArrowLeft, PackagePlus } from "lucide-react";
import api from "../api/axios";

export default function ProductForm() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [imageFiles, setImageFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(isEditMode);
  const [formError, setFormError] = useState("");

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    if (!isEditMode) return;
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        const product = response.data.product;
        reset({
          ...product,
          tags: (product.tags || []).join(", "),
        });
        setExistingImages(product.images || []);
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

    // في وضع الإضافة، لازم صورة واحدة على الأقل
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

    // التاجز لازم تتبعت كـ JSON string (زي ما موضح في التوثيق)
    if (formData.tags) {
      const tagsArray = formData.tags.split(",").map((t) => t.trim()).filter(Boolean);
      data.append("tags", JSON.stringify(tagsArray));
    }

    // الصور الجديدة
    imageFiles.forEach((file) => data.append("images", file));

    // في وضع التعديل، نبعت الصور المحذوفة (لو فيه)
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
      <button onClick={() => navigate("/dashboard/products")} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-4">
        <ArrowLeft size={16} /> Back to products
      </button>

      <div className="flex items-start gap-3 mb-6">
        <div className="w-11 h-11 rounded-lg bg-primary-50 text-primary-500 flex items-center justify-center shrink-0">
          <PackagePlus size={20} />
        </div>
        <div>
          <p className="text-xs font-semibold text-primary-500 tracking-widest uppercase">
            {isEditMode ? "Edit Product" : "Create Product"}
          </p>
          <h1 className="text-2xl font-bold">{isEditMode ? "Update product details" : "Add a new product"}</h1>
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