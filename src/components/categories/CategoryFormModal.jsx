import { useState } from "react";
import { useForm } from "react-hook-form";
import { Info } from "lucide-react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { addCustomCategory } from "../../data/customCategories";

export default function CategoryFormModal({ isOpen, onClose, onSaved }) {
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = (formData) => {
    setSubmitting(true);
    addCustomCategory(formData.name);
    reset();
    onSaved();
    onClose();
    setSubmitting(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Category">
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-start gap-2 mb-4">
        <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
        <p className="text-xs text-blue-700">
          There's no categories endpoint in the backend yet, so this is saved locally on your
          browser only. It will appear in the product form's category list, but won't sync with
          other team members until a real Categories API is added.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="Category Name"
          placeholder="e.g. accessories"
          error={errors.name?.message}
          {...register("name", { required: "Category name is required" })}
        />

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={submitting}>{submitting ? "Saving..." : "Add Category"}</Button>
        </div>
      </form>
    </Modal>
  );
}