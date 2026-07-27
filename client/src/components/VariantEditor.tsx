import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, Edit2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import ImageUploader from "./ImageUploader";

interface Variant {
  id: string;
  colorNameKa: string;
  colorNameEn: string;
  colorHex: string;
  imageUrl?: string;
  priceMin?: number;
  priceMax?: number;
  available: boolean;
  isDefault: boolean;
}

interface VariantEditorProps {
  variants: Variant[];
  onAddVariant: (variant: Omit<Variant, "id">) => void;
  onUpdateVariant: (id: string, variant: Partial<Variant>) => void;
  onDeleteVariant: (id: string) => void;
}

export function VariantEditor({
  variants,
  onAddVariant,
  onUpdateVariant,
  onDeleteVariant,
}: VariantEditorProps) {
  const { language } = useLanguage();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Variant, "id">>({
    colorNameKa: "",
    colorNameEn: "",
    colorHex: "#f6a5b8",
    imageUrl: "",
    priceMin: undefined,
    priceMax: undefined,
    available: true,
    isDefault: false,
  });

  const handleAddVariant = () => {
    if (!formData.colorNameKa || !formData.colorNameEn) {
      alert(language === "ka" ? "გთხოვთ შეავსოთ ფერის სახელი" : "Please fill in color names");
      return;
    }
    onAddVariant(formData);
    setFormData({
      colorNameKa: "",
      colorNameEn: "",
      colorHex: "#f6a5b8",
      imageUrl: "",
      priceMin: undefined,
      priceMax: undefined,
      available: true,
      isDefault: false,
    });
  };

  const handleUpdateVariant = (id: string) => {
    onUpdateVariant(id, formData);
    setEditingId(null);
  };

  const handleEditVariant = (variant: Variant) => {
    if (editingId === variant.id) {
      // If clicking the same edit button, close the form
      setEditingId(null);
      setFormData({
        colorNameKa: "",
        colorNameEn: "",
        colorHex: "#f6a5b8",
        imageUrl: "",
        priceMin: undefined,
        priceMax: undefined,
        available: true,
        isDefault: false,
      });
    } else {
      // Open form for editing this variant
      setEditingId(variant.id);
      setFormData(variant);
    }
  };

  return (
    <div className="space-y-4 border-t pt-4" onClick={(e) => e.stopPropagation()}>
      <h3 className="text-lg font-semibold">
        {language === "ka" ? "ფერის ვარიანტები" : "Color Variants"}
      </h3>

      {/* Variants List */}
      <div className="space-y-2">
        {variants.map((variant) => (
          <div
            key={variant.id}
            className="flex items-center gap-3 p-3 border rounded bg-gray-50"
          >
            <div
              className="w-8 h-8 rounded border-2 border-gray-300"
              style={{ backgroundColor: variant.colorHex }}
            />
            <div className="flex-1">
              <div className="font-medium">
                {variant.colorNameKa} / {variant.colorNameEn}
              </div>
              <div className="text-sm text-gray-600">
                {variant.colorHex}
                {variant.priceMin && ` • ₾${variant.priceMin}`}
                {!variant.available && " • " + (language === "ka" ? "მიუწვდომელი" : "Unavailable")}
                {variant.isDefault && " • " + (language === "ka" ? "ნაგულისხმევი" : "Default")}
              </div>
            </div>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleEditVariant(variant);
              }}
              className="p-2 hover:bg-gray-200 rounded"
              title={language === "ka" ? "რედაქტირება" : "Edit"}
            >
              <Edit2 size={16} />
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDeleteVariant(variant.id);
              }}
              className="p-2 hover:bg-red-100 rounded text-red-600"
              title={language === "ka" ? "წაშლა" : "Delete"}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Add/Edit Form */}
      <div className="border rounded p-4 bg-blue-50">
        <h4 className="font-medium mb-3">
          {editingId
            ? language === "ka"
              ? "ვარიანტის რედაქტირება"
              : "Edit Variant"
            : language === "ka"
              ? "ახალი ვარიანტის დამატება"
              : "Add New Variant"}
        </h4>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>{language === "ka" ? "ფერის სახელი (ქართული)" : "Color Name (Georgian)"}</Label>
            <Input
              value={formData.colorNameKa}
              onChange={(e) => setFormData({ ...formData, colorNameKa: e.target.value })}
              placeholder="ვარდისფერი"
            />
          </div>

          <div>
            <Label>{language === "ka" ? "ფერის სახელი (ინგლისური)" : "Color Name (English)"}</Label>
            <Input
              value={formData.colorNameEn}
              onChange={(e) => setFormData({ ...formData, colorNameEn: e.target.value })}
              placeholder="Pink"
            />
          </div>

          <div>
            <Label>{language === "ka" ? "ფერის კოდი" : "Color Code"}</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={formData.colorHex}
                onChange={(e) => setFormData({ ...formData, colorHex: e.target.value })}
                className="w-12 h-10"
              />
              <Input
                value={formData.colorHex}
                onChange={(e) => setFormData({ ...formData, colorHex: e.target.value })}
                placeholder="#f6a5b8"
              />
            </div>
          </div>

          <div className="col-span-2">
            <Label>{language === "ka" ? "ფერის სურათი" : "Color Image"}</Label>
            <ImageUploader
              onChange={(url: string | null) => setFormData({ ...formData, imageUrl: url || "" })}
              value={formData.imageUrl || null}
            />
          </div>

          <div className="col-span-2">
            <Label>{language === "ka" ? "მინიმალური ფასი" : "Min Price"}</Label>
            <Input
              type="number"
              value={formData.priceMin || ""}
              onChange={(e) =>
                setFormData({ ...formData, priceMin: e.target.value ? Number(e.target.value) : undefined })
              }
              placeholder="0"
            />
          </div>

          <div className="col-span-2">
            <Label>{language === "ka" ? "მაქსიმალური ფასი" : "Max Price"}</Label>
            <Input
              type="number"
              value={formData.priceMax || ""}
              onChange={(e) =>
                setFormData({ ...formData, priceMax: e.target.value ? Number(e.target.value) : undefined })
              }
              placeholder="0"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.available}
              onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
            />
            <span>{language === "ka" ? "ხელმისაწვდომი" : "Available"}</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isDefault}
              onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
            />
            <span>{language === "ka" ? "ნაგულისხმევი" : "Default"}</span>
          </label>
        </div>

        <div className="flex gap-2 mt-4">
          {editingId ? (
            <>
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleUpdateVariant(editingId);
                }}
                className="flex-1"
              >
                {language === "ka" ? "შენახვა" : "Save"}
              </Button>
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setEditingId(null);
                  setFormData({
                    colorNameKa: "",
                    colorNameEn: "",
                    colorHex: "#f6a5b8",
                    imageUrl: "",
                    priceMin: undefined,
                    priceMax: undefined,
                    available: true,
                    isDefault: false,
                  });
                }}
                variant="outline"
                className="flex-1"
              >
                {language === "ka" ? "გაუქმება" : "Cancel"}
              </Button>
            </>
          ) : (
            <Button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleAddVariant();
              }}
              className="w-full"
            >
              <Plus size={16} className="mr-2" />
              {language === "ka" ? "+ ფერის დამატება" : "+ Add Color"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
