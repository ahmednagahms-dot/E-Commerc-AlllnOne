import {useState} from 'react';
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import api from "../../api/axios";

export default function DeleteConfirmMode({
    isOpen,productId, onClose,onDeleted,productName
}) {
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState("");
    const handleDelete = async () => {
    try {
        setDeleting(true);
        setError("");

        await api.delete(`/products/${productId}`);
        if (onDeleted) {
            onDeleted();
        }
        onClose();
    
    }

    catch (error) {
        setError(
            error.response?.data?.message || "Failed to delete product. Please try again.");
    }
    finally {
        setDeleting(false);
    }   
};
const handleClose = () => {
    if (deleting) {
        return;
    }
    setError("");
    onClose();
};

return (
    <Modal isOpen={isOpen} onClose={handleClose}
        title="Delete Product"
    >
        <div className="space-y-4"> 
            <p className="text-sm text-gray-700"> Are you sure you want to delete{" "} 
                <span className="font-semibold">{productName}</span>? 
            </p>
            <p className="text-sm text-danger bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                This action cannot be undone. 
            </p>
            {error && (
                <p className="text-sm text-danger bg-red-50 border border-red-100 rounded-lg px-3 py-2"> {error}
                </p> 
            )}
            <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={handleClose}
                    disabled={deleting} > Cancel 
                </Button>
                <Button type="button" variant="danger" 
                    onClick={handleDelete} disabled={deleting} > 
                    {deleting ? "Deleting..." : "Delete"} 
                </Button> 
            </div> 
        </div> 
    </Modal>
);}
