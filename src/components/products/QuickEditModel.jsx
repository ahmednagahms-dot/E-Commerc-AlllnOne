    import { useEffect, useState } from "react";
    import { useForm } from "react-hook-form";
    import Modal from "../ui/Modal";
    import Button from "../ui/Button";
    import ProductFormFields from "./ProductFormFields";
    import api from "../../api/axios";
    import { uploadToCloudinary } from "../../api/cloudinary";

    const MAX_IMAGES = 5;

    export default function QuickEditModel({
    isOpen,
    onClose,
    productId,
    onUpdated,
    }) {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const [submitError, setSubmitError] = useState("");
    const [imagesError, setImagesError] = useState("");

    const [existingImages, setExistingImages] = useState([]);
    const [imageFiles, setImageFiles] = useState([]);

    const [tags, setTags] = useState([]);

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
        featured: false,
        isActive: true,
        },
    });

    // =========================
    // Fetch Product
    // =========================
    useEffect(() => {
        if (!isOpen || !productId) return;

        const fetchProduct = async () => {
        try {
            setLoading(true);
            setSubmitError("");

            const { data } = await api.get(`/products/${productId}`);

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
            featured: Boolean(product.featured),
            isActive: product.active !== false,
            });

            // Tags
            setTags(Array.isArray(product.tags) ? product.tags : []);

            // Existing images
            const images = Array.isArray(product.images)
            ? product.images
                .map((image) => {
                    if (typeof image === "string") {
                    return {
                        url: image,
                        public_id: image,
                    };
                    }

                    return {
                    url:
                        image?.url ||
                        image?.secure_url ||
                        image?.src ||
                        "",
                    public_id:
                        image?.public_id || "",
                    };
                })
                .filter((image) => image.url)
            : [];

            setExistingImages(images);
            setImageFiles([]);
        } catch (err) {
            setSubmitError(
            err.response?.data?.message ||
                "Failed to fetch product details. Please try again."
            );
        } finally {
            setLoading(false);
        }
        };

        fetchProduct();
    }, [isOpen, productId, reset]);

    // =========================
    // Cleanup Preview URLs
    // =========================
    useEffect(() => {
        return () => {
        imageFiles.forEach((img) => {
            if (img.previewUrl) {
            URL.revokeObjectURL(img.previewUrl);
            }
        });
        };
    }, [imageFiles]);

    // =========================
    // Add New Images
    // =========================
    const handleAddImages = (files) => {
        const remainingSlots =
        MAX_IMAGES - existingImages.length - imageFiles.length;

        if (remainingSlots <= 0) {
        setImagesError(
            `You can upload up to ${MAX_IMAGES} images.`
        );
        return;
        }

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
                img.previewUrl === entry.previewUrl
                    ? {
                        ...img,
                        uploading: false,
                        uploadedUrl: url,
                    }
                    : img
                )
            );
            })
            .catch(() => {
            setImageFiles((prev) =>
                prev.map((img) =>
                img.previewUrl === entry.previewUrl
                    ? {
                        ...img,
                        uploading: false,
                        error: true,
                    }
                    : img
                )
            );
            });
        });
    };

    // =========================
    // Remove Existing Image
    // =========================
    const handleRemoveExistingImage = (publicId) => {
        setExistingImages((prev) =>
        prev.filter((image) => image.public_id !== publicId)
        );
    };

    // =========================
    // Remove New Image
    // =========================
    const handleRemoveNewImage = (index) => {
        setImageFiles((prev) => {
        const target = prev[index];

        if (target?.previewUrl) {
            URL.revokeObjectURL(target.previewUrl);
        }

        return prev.filter((_, i) => i !== index);
        });
    };

    // =========================
    // Submit
    // =========================
    const onSubmit = async (formData) => {
        setSubmitError("");
        setImagesError("");

        // Check image uploads
        if (imageFiles.some((img) => img.uploading)) {
        setImagesError(
            "Please wait for all images to finish uploading."
        );
        return;
        }

        // Check failed uploads
        if (imageFiles.some((img) => img.error)) {
        setImagesError(
            "Please remove the failed image and try again."
        );
        return;
        }

        // New uploaded images
        const uploadedImages = imageFiles
        .filter((img) => img.uploadedUrl)
        .map((img) => ({
            url: img.uploadedUrl,
        }));

        // Existing images
        const finalImages = [
        ...existingImages,
        ...uploadedImages,
        ];

        if (finalImages.length === 0) {
        setImagesError("At least 1 image is required.");
        return;
        }

        const payload = {
        name: formData.name,
        shortDescription: formData.shortDescription,
        description: formData.description,
        price: Number(formData.price),
        discountPrice:
            formData.discountPrice === ""
            ? undefined
            : Number(formData.discountPrice),
        stock: Number(formData.stock),
        sku: formData.sku,
        category: formData.category,

        ...(formData.subcategory?.trim() && {
            subcategory: formData.subcategory.trim(),
        }),

        ...(formData.brand?.trim() && {
            brand: formData.brand.trim(),
        }),

        tags: tags,

        featured: formData.featured,

        images: finalImages,
        };

        try {
        setSaving(true);

        await api.patch(
            `/products/update/${productId}`,
            payload
        );

        if (onUpdated) {
            onUpdated();
        }

        onClose();
        } catch (err) {
        console.error(
            "Quick Edit Error:",
            err.response?.data || err
        );

        setSubmitError(
            err.response?.data?.message ||
            "Failed to save product. Please try again."
        );
        } finally {
        setSaving(false);
        }
    };

    // =========================
    // Close Modal
    // =========================
    const handleClose = () => {
        if (saving) return;

        setSubmitError("");
        setImagesError("");

        setExistingImages([]);
        setImageFiles([]);
        setTags([]);

        reset();

        onClose();
    };

    // =========================
    // Render
    // =========================
    return (
        <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Quick Edit Product"
        >
        {loading ? (
            <p className="text-sm text-gray-500 py-8 text-center">
            Loading product...
            </p>
        ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
            <ProductFormFields
                register={register}
                errors={errors}
                imageFiles={imageFiles}
                setImageFiles={setImageFiles}
                existingImages={existingImages}
                onDeleteExistingImage={
                handleRemoveExistingImage
                }
                tags={tags}
                setTags={setTags}
            />

            {imagesError && (
                <p className="text-danger text-sm bg-red-50 border border-red-100 rounded-lg px-3 py-2 mt-6">
                {imagesError}
                </p>
            )}

            {submitError && (
                <p className="text-danger text-sm bg-red-50 border border-red-100 rounded-lg px-3 py-2 mt-6">
                {submitError}
                </p>
            )}

            <div className="flex items-center gap-3 pt-6 mt-6 border-t border-gray-100">
                <Button
                type="submit"
                disabled={saving}
                >
                {saving ? "Saving..." : "Save Changes"}
                </Button>

                <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={saving}
                >
                Cancel
                </Button>
            </div>
            </form>
        )}
        </Modal>
    );
    }