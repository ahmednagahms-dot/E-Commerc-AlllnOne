    import { useEffect, useState } from "react";
    import { toast } from "react-toastify";
    import { useNavigate, useParams } from "react-router-dom";
    import {
    ArrowLeft,
    Package,
    Tag,
    Layers,
    Building2,
    Hash,
    ShoppingBag,
    } from "lucide-react";

    import DashboardLayout from "../components/layout/DashboardLayout";
    import Button from "../components/ui/Button";
    import api from "../api/axios";
    import PageLoader from "../components/ui/sessionLoader/PageLoader";

    export default function ProductView() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProduct = async () => {
        try {
            setLoading(true);
            setError("");

            const { data } = await api.get(`/products/${id}`);

            const productData = data.product || data;

            if (!productData) {
            setProduct(null);
            return;
            }

            setProduct(productData);

            const firstImage = productData.images?.[0];

            if (typeof firstImage === "string") {
            setSelectedImage(firstImage);
            } else {
            setSelectedImage(
                firstImage?.url ||
                firstImage?.secure_url ||
                firstImage?.src ||
                ""
            );
            }
        } catch (err) {
            setError(
            err.response?.data?.message ||
                "Failed to load product details."
            );
            toast.error(err.response?.data?.message ||
                "Failed to load product details."
            );
        } finally {
            setLoading(false);
        }
        };

        fetchProduct();
    }, [id]);

    const getImageUrl = (image) => {
        if (typeof image === "string") {
        return image;
        }

        return (
        image?.url ||
        image?.secure_url ||
        image?.src ||
        ""
        );
    };

    if (loading) {
        return (
        <DashboardLayout>
            <PageLoader text="Loading product..." />
        </DashboardLayout>
        );
    }

    if (error) {
        return (
        <DashboardLayout>
            <div className="min-h-screen bg-[#F5F3EF] -m-6 p-6">
            <div className="max-w-3xl mx-auto pt-10">
                <div className="bg-white rounded-2xl border border-red-100 p-8 text-center shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                    Unable to load product
                </h2>

                <p className="text-sm text-danger mb-6">
                    {error}
                </p>

                <Button
                    type="button"
                    onClick={() =>
                    navigate("/dashboard/products")
                    }
                >
                    Back to Products
                </Button>
                </div>
            </div>
            </div>
        </DashboardLayout>
        );
    }

    if (!product) {
        return (
        <DashboardLayout>
            <div className="min-h-screen bg-[#F5F3EF] -m-6 p-6">
            <div className="max-w-3xl mx-auto pt-10">
                <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                    Product Not Found
                </h2>

                <p className="text-sm text-gray-500 mb-6">
                    The product you are looking for does not exist.
                </p>

                <Button
                    type="button"
                    onClick={() =>
                    navigate("/dashboard/products")
                    }
                >
                    Back to Products
                </Button>
                </div>
            </div>
            </div>
        </DashboardLayout>
        );
    }

    const images = Array.isArray(product.images)
        ? product.images
            .map(getImageUrl)
            .filter(Boolean)
        : [];

    const discountPrice =
        product.discountPrice !== undefined &&
        product.discountPrice !== null &&
        product.discountPrice !== ""
        ? Number(product.discountPrice)
        : null;

    const price = Number(product.price || 0);
    const stock = Number(product.stock || 0);

    return (
        <DashboardLayout>
        <div className="min-h-screen bg-[#F5F3EF] -m-6 p-4 sm:p-6">
            <div className="max-w-7xl mx-auto">

            {/* Back */}
            <button
                type="button"
                onClick={() =>
                navigate("/dashboard/products")
                }
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-500 transition mb-5"
            >
                <ArrowLeft size={18} />
                Back to Products
            </button>

            {/* Product */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-5 sm:p-7 lg:p-8">

                {/* ================= Gallery ================= */}
                <div>
                    <div className="bg-[#F7F6F3] rounded-2xl overflow-hidden aspect-square flex items-center justify-center">
                    {selectedImage ? (
                        <img
                        src={selectedImage}
                        alt={product.name}
                        className="w-full h-full object-contain"
                        />
                    ) : (
                        <div className="text-gray-400 text-sm">
                        No image available
                        </div>
                    )}
                    </div>

                    {images.length > 0 && (
                    <div className="flex gap-3 mt-4 overflow-x-auto pb-1">
                        {images.map((image, index) => (
                        <button
                            key={`${image}-${index}`}
                            type="button"
                            onClick={() =>
                            setSelectedImage(image)
                            }
                            className={`w-20 h-20 shrink-0 rounded-xl overflow-hidden border-2 transition ${
                            selectedImage === image
                                ? "border-primary-500"
                                : "border-gray-200 hover:border-gray-400"
                            }`}
                        >
                            <img
                            src={image}
                            alt={`${product.name} ${index + 1}`}
                            className="w-full h-full object-cover"
                            />
                        </button>
                        ))}
                    </div>
                    )}
                </div>

                {/* ================= Details ================= */}
                <div className="flex flex-col">

                    {/* Category */}
                    <div className="flex items-center gap-2 mb-3">
                    {product.category && (
                        <span className="px-3 py-1 rounded-full bg-primary-50 text-primary-600 text-xs font-medium">
                        {product.category}
                        </span>
                    )}

                    {product.featured && (
                        <span className="px-3 py-1 rounded-full bg-yellow-50 text-yellow-700 text-xs font-medium">
                        Featured
                        </span>
                    )}
                    </div>

                    {/* Name */}
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#1D2A43]">
                    {product.name}
                    </h1>

                    {/* Short Description */}
                    {product.shortDescription && (
                    <p className="text-gray-500 text-sm mt-3 leading-6">
                        {product.shortDescription}
                    </p>
                    )}

                    {/* Price */}
                    <div className="flex items-center gap-3 mt-6">
                    <span className="text-2xl font-bold text-[#1D2A43]">
                        ${price.toFixed(2)}
                    </span>

                    {discountPrice !== null &&
                        discountPrice < price && (
                        <span className="text-lg text-gray-400 line-through">
                            ${discountPrice.toFixed(2)}
                        </span>
                        )}
                    </div>

                    {/* Stock */}
                    <div className="flex items-center gap-2 mt-4">
                    <Package
                        size={18}
                        className="text-gray-500"
                    />

                    <span className="text-sm text-gray-600">
                        Stock:
                    </span>

                    <span
                        className={`text-sm font-semibold ${
                        stock === 0
                            ? "text-danger"
                            : stock < 10
                            ? "text-yellow-600"
                            : "text-green-600"
                        }`}
                    >
                        {stock === 0
                        ? "Out of Stock"
                        : `${stock} available`}
                    </span>
                    </div>

                    {/* Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-7">

                    {product.sku && (
                        <div className="p-4 bg-[#F8F7F4] rounded-xl">
                        <div className="flex items-center gap-2 text-gray-400 mb-1">
                            <Hash size={15} />
                            <span className="text-xs">
                            SKU
                            </span>
                        </div>

                        <p className="text-sm font-semibold text-gray-700">
                            {product.sku}
                        </p>
                        </div>
                    )}

                    {product.brand && (
                        <div className="p-4 bg-[#F8F7F4] rounded-xl">
                        <div className="flex items-center gap-2 text-gray-400 mb-1">
                            <Building2 size={15} />
                            <span className="text-xs">
                            Brand
                            </span>
                        </div>

                        <p className="text-sm font-semibold text-gray-700">
                            {product.brand}
                        </p>
                        </div>
                    )}

                    {product.category && (
                        <div className="p-4 bg-[#F8F7F4] rounded-xl">
                        <div className="flex items-center gap-2 text-gray-400 mb-1">
                            <Layers size={15} />
                            <span className="text-xs">
                            Category
                            </span>
                        </div>

                        <p className="text-sm font-semibold text-gray-700 capitalize">
                            {product.category}
                        </p>
                        </div>
                    )}

                    {product.subcategory && (
                        <div className="p-4 bg-[#F8F7F4] rounded-xl">
                        <div className="flex items-center gap-2 text-gray-400 mb-1">
                            <Tag size={15} />
                            <span className="text-xs">
                            Subcategory
                            </span>
                        </div>

                        <p className="text-sm font-semibold text-gray-700">
                            {product.subcategory}
                        </p>
                        </div>
                    )}
                    </div>
                </div>
                </div>

                {/* ================= Description ================= */}
                <div className="border-t border-gray-100 p-5 sm:p-7 lg:p-8">
                <div className="flex items-center gap-2 mb-4">
                    <ShoppingBag
                    size={18}
                    className="text-primary-500"
                    />

                    <h2 className="text-lg font-semibold text-[#1D2A43]">
                    Product Description
                    </h2>
                </div>

                <p className="text-sm text-gray-600 leading-7 whitespace-pre-line">
                    {product.description ||
                    "No description available."}
                </p>
                </div>

                {/* ================= Tags ================= */}
                {Array.isArray(product.tags) &&
                product.tags.length > 0 && (
                    <div className="border-t border-gray-100 p-5 sm:p-7 lg:p-8">
                    <h2 className="text-lg font-semibold text-[#1D2A43] mb-4">
                        Tags
                    </h2>

                    <div className="flex flex-wrap gap-2">
                        {product.tags.map((tag, index) => (
                        <span
                            key={`${tag}-${index}`}
                            className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs"
                        >
                            #{tag}
                        </span>
                        ))}
                    </div>
                    </div>
                )}
            </div>
            </div>
        </div>
        </DashboardLayout>
    );
    }