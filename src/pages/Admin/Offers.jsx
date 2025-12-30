import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Tag,
  Plus,
  Trash2,
  Edit,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import {
  getAllOffers,
  createOffer,
  updateOffer,
  deleteOffer,
} from "@/api/offerApi";

export default function Offers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentOffer, setCurrentOffer] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    originalPrice: "",
    tag: "Special Offer",
    color: "from-brand-primary to-brand-secondary",
    isActive: true,
  });

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const data = await getAllOffers();
      setOffers(data);
    } catch (err) {
      toast.error("Failed to load offers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing && currentOffer) {
        await updateOffer(currentOffer._id, formData);
        toast.success("Offer updated successfully");
      } else {
        await createOffer(formData);
        toast.success("Offer created successfully");
      }
      setModalOpen(false);
      resetForm();
      fetchOffers();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await deleteOffer(id);
      toast.success("Offer deleted");
      fetchOffers();
    } catch (err) {
      toast.error("Failed to delete offer");
    }
  };

  const openEdit = (offer) => {
    setCurrentOffer(offer);
    setFormData({
      title: offer.title,
      description: offer.description,
      price: offer.price,
      originalPrice: offer.originalPrice || "",
      tag: offer.tag,
      color: offer.color,
      isActive: offer.isActive,
    });
    setIsEditing(true);
    setModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      price: "",
      originalPrice: "",
      tag: "Special Offer",
      color: "from-brand-primary to-brand-secondary",
      isActive: true,
    });
    setIsEditing(false);
    setCurrentOffer(null);
  };

  const toggleActive = async (offer) => {
    try {
      await updateOffer(offer._id, { isActive: !offer.isActive });
      toast.success(`Offer ${!offer.isActive ? "activated" : "deactivated"}`);
      fetchOffers();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-brand-dark uppercase tracking-tight">
            Special Offers
          </h2>
          <p className="text-brand-dark/60 font-medium">
            Manage your website's special offers and deals
          </p>
        </div>
        <Dialog
          open={modalOpen}
          onOpenChange={(val) => {
            setModalOpen(val);
            if (!val) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-brand-primary hover:bg-brand-secondary text-white rounded-xl shadow-lg shadow-brand-primary/20 transition-all active:scale-95">
              <Plus className="w-5 h-5 mr-2" />
              Add New Offer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl bg-white rounded-3xl p-8 border-none overflow-y-auto max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-display font-bold text-brand-dark uppercase tracking-tight">
                {isEditing ? "Edit Offer" : "Create New Offer"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="e.g. Family Feast"
                    required
                    className="rounded-xl border-brand-dark/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tag / Badge</Label>
                  <Input
                    value={formData.tag}
                    onChange={(e) =>
                      setFormData({ ...formData, tag: e.target.value })
                    }
                    placeholder="e.g. Best Value"
                    className="rounded-xl border-brand-dark/10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Details about the offer..."
                  required
                  className="rounded-xl border-brand-dark/10 min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Offer Price</Label>
                  <Input
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="e.g. 349 kr"
                    required
                    className="rounded-xl border-brand-dark/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Original Price (Optional)</Label>
                  <Input
                    value={formData.originalPrice}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        originalPrice: e.target.value,
                      })
                    }
                    placeholder="e.g. 420 kr"
                    className="rounded-xl border-brand-dark/10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Gradient Color Theme</Label>
                <select
                  value={formData.color}
                  onChange={(e) =>
                    setFormData({ ...formData, color: e.target.value })
                  }
                  className="w-full flex h-10 w-full items-center justify-between rounded-xl border border-brand-dark/10 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="from-brand-primary to-brand-secondary">
                    Red to Orange (Brand)
                  </option>
                  <option value="from-brand-secondary to-yellow-500">
                    Orange to Yellow
                  </option>
                  <option value="from-brand-dark to-gray-800">
                    Dark to Gray
                  </option>
                  <option value="from-emerald-600 to-emerald-400">
                    Green (Fresh)
                  </option>
                  <option value="from-purple-600 to-pink-500">
                    Purple to Pink
                  </option>
                </select>
                <div
                  className={`h-4 w-full rounded-full bg-gradient-to-r ${formData.color} mt-2`}
                />
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-brand-dark/5">
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(val) =>
                    setFormData({ ...formData, isActive: val })
                  }
                />
                <div className="flex flex-col">
                  <span className="font-bold text-sm text-brand-dark">
                    Active Status
                  </span>
                  <span className="text-xs text-brand-dark/60">
                    Show this offer on the website immediately
                  </span>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 rounded-xl bg-brand-primary hover:bg-brand-secondary text-white font-bold uppercase tracking-wide"
              >
                {isEditing ? "Update Offer" : "Create Offer"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-[2rem] shadow-xl border border-brand-dark/5 overflow-hidden">
        <Table>
          <TableHeader className="bg-brand-cream/50">
            <TableRow>
              <TableHead className="font-bold text-brand-dark uppercase tracking-wide">
                Offer Details
              </TableHead>
              <TableHead className="font-bold text-brand-dark uppercase tracking-wide">
                Price
              </TableHead>
              <TableHead className="font-bold text-brand-dark uppercase tracking-wide">
                Tag
              </TableHead>
              <TableHead className="font-bold text-brand-dark uppercase tracking-wide">
                Status
              </TableHead>
              <TableHead className="text-right font-bold text-brand-dark uppercase tracking-wide">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center">
                  <div className="flex items-center justify-center gap-2 text-brand-dark/40">
                    <Loader2 className="animate-spin w-5 h-5" />
                    <span>Loading offers...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : offers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-brand-dark/40">
                    <Tag className="w-8 h-8 opacity-20" />
                    <p>No offers found. Create one to get started!</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              offers.map((offer) => (
                <TableRow key={offer._id} className="hover:bg-brand-cream/30">
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-brand-dark text-lg">
                        {offer.title}
                      </span>
                      <span className="text-sm text-brand-dark/60 line-clamp-1">
                        {offer.description}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-brand-primary">
                        {offer.price}
                      </span>
                      {offer.originalPrice && (
                        <span className="text-xs line-through text-brand-dark/40">
                          {offer.originalPrice}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-brand-dark/5 text-xs font-bold uppercase tracking-wider text-brand-dark/70">
                      {offer.tag}
                    </span>
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => toggleActive(offer)}
                      className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                        offer.isActive
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {offer.isActive ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" /> Active
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-3 h-3" /> Inactive
                        </>
                      )}
                    </button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(offer)}
                        className="h-8 w-8 rounded-full hover:bg-brand-dark/5 text-brand-dark/60 hover:text-brand-dark"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(offer._id)}
                        className="h-8 w-8 rounded-full hover:bg-red-50 text-brand-dark/60 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
