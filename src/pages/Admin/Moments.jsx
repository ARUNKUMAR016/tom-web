// src/pages/Admin/Moments.jsx
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  listMoments,
  createMoment,
  updateMoment,
  deleteMoment,
} from "../../api/momentApi";
import {
  Plus,
  ImageIcon,
  Pencil,
  Trash2,
  X,
  Upload,
  Check,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { resolveImage } from "@/lib/imageUtils";

export default function Moments() {
  const [moments, setMoments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingMoment, setEditingMoment] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    loadMoments();
  }, []);

  async function loadMoments() {
    try {
      setLoading(true);
      const data = await listMoments(false); // Get all moments (active + inactive)
      setMoments(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  function handleAdd() {
    setEditingMoment(null);
    setShowDialog(true);
  }

  function handleEdit(moment) {
    setEditingMoment(moment);
    setShowDialog(true);
  }

  function handleDelete(moment) {
    setDeleteTarget(moment);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      await deleteMoment(deleteTarget._id);
      toast.success("Moment deleted successfully");
      setMoments(moments.filter((m) => m._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] pb-20">
      {/* Header */}
      <header className="flex items-center justify-between gap-4 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary border border-brand-primary/20 shadow-sm">
            <ImageIcon className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-brand-dark font-display uppercase tracking-tight">
              Captured Moments
            </h1>
            <p className="text-sm text-brand-dark/40 font-medium">
              Manage gallery images for the website
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            to="/admin/home"
            className="hidden sm:inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/5"
          >
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>

          <button
            onClick={handleAdd}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all bg-brand-primary text-white hover:bg-brand-primary/90 hover:scale-105 shadow-lg shadow-brand-primary/20"
          >
            <Plus className="h-4 w-4" />
            Add Moment
          </button>
        </div>
      </header>

      {/* Grid */}
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="rounded-3xl p-4 bg-white border border-brand-dark/5 animate-pulse shadow-sm aspect-square"
            />
          ))}
        </div>
      ) : moments.length === 0 ? (
        <EmptyState onAdd={handleAdd} />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {moments.map((moment) => (
            <MomentCard
              key={moment._id}
              moment={moment}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Dialogs */}
      {showDialog && (
        <MomentDialog
          moment={editingMoment}
          onClose={() => setShowDialog(false)}
          onSuccess={() => {
            setShowDialog(false);
            loadMoments();
          }}
        />
      )}

      {deleteTarget && (
        <DeleteDialog
          name={deleteTarget.caption || "this moment"}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}

function MomentCard({ moment, onEdit, onDelete }) {
  return (
    <div className="group relative overflow-hidden rounded-3xl bg-white border border-brand-dark/5 premium-shadow-hover">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={resolveImage(moment.imageUrl, 400)}
          alt={moment.caption}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        {!moment.isActive && (
          <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-red-500 text-white text-xs font-bold uppercase">
            Inactive
          </div>
        )}
        {moment.displayOrder > 0 && (
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-brand-dark/80 text-white text-xs font-bold">
            #{moment.displayOrder}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        <p className="text-sm text-brand-dark/60 font-medium line-clamp-2 mb-4 min-h-[2rem]">
          {moment.caption || "No caption"}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(moment)}
            className="flex-1 h-10 flex items-center justify-center gap-2 rounded-xl bg-brand-cream hover:bg-brand-primary hover:text-white text-brand-dark font-bold text-xs uppercase tracking-widest transition-all duration-300"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </button>
          <button
            onClick={() => onDelete(moment)}
            className="h-10 w-10 flex items-center justify-center rounded-xl bg-red-50 hover:bg-red-500 hover:text-white text-red-500 transition-all duration-300 border border-red-100"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function MomentDialog({ moment, onClose, onSuccess }) {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    moment ? resolveImage(moment.imageUrl, 400) : null
  );
  const [caption, setCaption] = useState(moment?.caption || "");
  const [displayOrder, setDisplayOrder] = useState(moment?.displayOrder || 0);
  const [isActive, setIsActive] = useState(moment?.isActive ?? true);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!moment && !imageFile) {
      return toast.error("Please select an image");
    }

    setSaving(true);
    try {
      const formData = new FormData();
      if (imageFile) formData.append("image", imageFile);
      formData.append("caption", caption);
      formData.append("displayOrder", displayOrder);
      formData.append("isActive", isActive);

      if (moment) {
        await updateMoment(moment._id, formData);
        toast.success("Moment updated successfully");
      } else {
        await createMoment(formData);
        toast.success("Moment created successfully");
      }
      onSuccess();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  }

  function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-2xl max-h-[90vh] flex flex-col bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary">
              <ImageIcon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-brand-dark font-display uppercase tracking-wide">
                {moment ? "Edit Moment" : "Add New Moment"}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Image Upload */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Image {!moment && <span className="text-red-500">*</span>}
              </label>
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 group">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-300">
                    <Upload className="w-12 h-12 mb-2" />
                    <span className="text-sm font-medium">
                      Click to upload image
                    </span>
                  </div>
                )}

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleImageChange}
                  />
                  <Upload className="w-8 h-8 text-white mb-2" />
                  <span className="text-white text-xs font-bold uppercase tracking-wider">
                    {imagePreview ? "Change" : "Upload"}
                  </span>
                </div>
              </div>
            </div>

            {/* Caption */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Caption
              </label>
              <textarea
                rows={2}
                className="w-full rounded-xl px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-brand-primary/50 focus:ring-4 focus:ring-brand-primary/10 transition-all font-medium text-brand-dark resize-none"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Optional caption for this moment..."
              />
            </div>

            {/* Display Order & Active */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Display Order
                </label>
                <input
                  type="number"
                  className="w-full rounded-xl px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-brand-primary/50 focus:ring-4 focus:ring-brand-primary/10 transition-all font-bold text-brand-dark"
                  value={displayOrder}
                  onChange={(e) =>
                    setDisplayOrder(parseInt(e.target.value) || 0)
                  }
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Status
                </label>
                <label className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      isActive
                        ? "bg-brand-primary border-brand-primary"
                        : "border-gray-300"
                    }`}
                  >
                    {isActive && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="hidden"
                  />
                  <span className="text-sm font-bold text-brand-dark">
                    Active
                  </span>
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 h-11 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-sm uppercase tracking-wider transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 h-11 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white font-bold text-sm uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Saving..." : moment ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
}

function EmptyState({ onAdd }) {
  return (
    <div className="rounded-3xl border border-dashed border-gray-200 p-12 text-center bg-gray-50">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary">
        <ImageIcon className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-bold text-brand-dark font-display">
        No Moments Yet
      </h3>
      <p className="mt-2 text-sm text-brand-dark/40 max-w-xs mx-auto">
        Start adding beautiful moments to showcase in your gallery.
      </p>
      <button
        onClick={onAdd}
        className="mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold bg-brand-primary text-white hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/20"
      >
        <Plus className="h-4 w-4" />
        Add First Moment
      </button>
    </div>
  );
}

function DeleteDialog({ name, onCancel, onConfirm }) {
  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <Trash2 className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-bold text-brand-dark mb-2">
            Delete Moment?
          </h3>
          <p className="text-sm text-brand-dark/60">
            Are you sure you want to delete <strong>{name}</strong>? This action
            cannot be undone.
          </p>
        </div>

        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 h-11 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-sm uppercase tracking-wider transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 h-11 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm uppercase tracking-wider transition-all"
          >
            Delete
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
