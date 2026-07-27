import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Trash2, Plus, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { toast } from "sonner";
import ImageUploader from "@/components/ImageUploader";
import FlowerImage from "@/components/FlowerImage";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";

interface ProductFormModernProps {
  editingId: number | null;
  onClose: () => void;
  language: string;
}

export function ProductFormModern({ editingId, onClose, language }: ProductFormModernProps) {
  // Form state
  const [nameEn, setNameEn] = useState('');
  const [nameKa, setNameKa] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [descriptionKa, setDescriptionKa] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [priceOnRequest, setPriceOnRequest] = useState(false);
  const [unitType, setUnitType] = useState('single stem');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [variants, setVariants] = useState<any[]>([]);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [imageAlt, setImageAlt] = useState('');

  // UI state
  const [loaded, setLoaded] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    pricing: true,
    photo: true,
    variants: true,
    seo: false,
    advanced: false,
  });
  const [showAddVariant, setShowAddVariant] = useState(false);
  const [newVariant, setNewVariant] = useState({
    colorNameKa: '',
    colorNameEn: '',
    colorHex: '#f6a5b8',
    imageUrl: '',
    priceMin: '',
    priceMax: '',
    available: true,
  });

  // Queries and mutations
  const { data: categories } = trpc.categories.list.useQuery();
  const { data: existingProduct } = trpc.products.byId.useQuery(
    { id: editingId! },
    { enabled: editingId !== null }
  );
  const utils = trpc.useUtils();
  const createMutation = trpc.products.create.useMutation({
    onSuccess: () => { utils.products.list.invalidate(); onClose(); toast.success(language === 'ka' ? 'პროდუქტი შეიქმნა' : 'Product created'); },
    onError: (err) => toast.error(err.message || 'Error'),
  });
  const updateMutation = trpc.products.update.useMutation({
    onSuccess: () => { utils.products.list.invalidate(); onClose(); toast.success(language === 'ka' ? 'პროდუქტი განახლდა' : 'Product updated'); },
    onError: (err) => toast.error(err.message || 'Error'),
  });

  // Load existing product
  useEffect(() => {
    if (editingId !== null && existingProduct && !loaded) {
      setNameEn(existingProduct.nameEn || '');
      setNameKa(existingProduct.nameKa || '');
      setDescriptionEn(existingProduct.descriptionEn || '');
      setDescriptionKa(existingProduct.descriptionKa || '');
      setCategoryId(String(existingProduct.categoryId || ''));
      setPriceMin(String(existingProduct.priceMin || ''));
      setPriceMax(String(existingProduct.priceMax || ''));
      setPriceOnRequest(existingProduct.priceOnRequest || false);
      setUnitType(existingProduct.unitType || 'single stem');
      setImageUrl(existingProduct.imageUrl || null);
      setIsAvailable(existingProduct.isAvailable !== false);
      setFeatured(existingProduct.featured || false);
      setVariants(existingProduct.variants || []);
      setLoaded(true);
    }
    if (editingId === null && !loaded) {
      setLoaded(true);
    }
  }, [editingId, existingProduct, loaded]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      nameEn,
      nameKa,
      descriptionEn,
      descriptionKa,
      categoryId: parseInt(categoryId),
      priceMin: priceOnRequest ? null : parseInt(priceMin) || null,
      priceMax: priceOnRequest ? null : parseInt(priceMax) || null,
      priceOnRequest,
      unitType,
      isAvailable,
      featured,
      imageUrl: imageUrl || null,
      variants,
    };
    if (editingId !== null) {
      await updateMutation.mutateAsync({ id: editingId, ...payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
  };

  const handleAddVariant = () => {
    if (!newVariant.colorNameKa || !newVariant.colorNameEn) {
      toast.error(language === 'ka' ? 'გთხოვთ შეავსოთ ფერის სახელი' : 'Please fill in color names');
      return;
    }
    const variant = {
      ...newVariant,
      id: Math.random().toString(36).substr(2, 9),
      priceMin: newVariant.priceMin ? parseInt(newVariant.priceMin) : undefined,
      priceMax: newVariant.priceMax ? parseInt(newVariant.priceMax) : undefined,
    };
    setVariants([...variants, variant]);
    setNewVariant({
      colorNameKa: '',
      colorNameEn: '',
      colorHex: '#f6a5b8',
      imageUrl: '',
      priceMin: '',
      priceMax: '',
      available: true,
    });
    setShowAddVariant(false);
    toast.success(language === 'ka' ? 'ვარიანტი დამატებულია' : 'Variant added');
  };

  const handleDeleteVariant = (id: string) => {
    setVariants(variants.filter(v => v.id !== id));
    toast.success(language === 'ka' ? 'ვარიანტი წაშლილია' : 'Variant deleted');
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;
  const isEdit = editingId !== null;

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#1C1917]">
          {isEdit ? (language === 'ka' ? 'პროდუქტის რედაქტირება' : 'Edit Product') : (language === 'ka' ? 'ახალი პროდუქტი' : 'New Product')}
        </h2>
        <p className="text-sm text-[#666] mt-1">
          {isEdit ? (language === 'ka' ? 'განაახლეთ პროდუქტის დეტალები' : 'Update product details') : (language === 'ka' ? 'შექმენით ახალი პროდუქტი' : 'Create a new product')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Information Card */}
        <div className="bg-white rounded-xl border border-[#E8E4DF] shadow-sm overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('basic')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#FAFAF8] transition-colors border-b border-[#E8E4DF]"
          >
            <h3 className="font-semibold text-[#1C1917]">
              {language === 'ka' ? 'ძირითადი ინფორმაცია' : 'Basic Information'}
            </h3>
            {expandedSections.basic ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          {expandedSections.basic && (
            <div className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1C1917] mb-2">
                    {language === 'ka' ? 'სახელი (ქართული)' : 'Name (Georgian)'}
                  </label>
                  <input
                    type="text"
                    value={nameKa}
                    onChange={(e) => setNameKa(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E8E4DF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4603A] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1C1917] mb-2">
                    {language === 'ka' ? 'სახელი (ინგლისური)' : 'Name (English)'}
                  </label>
                  <input
                    type="text"
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E8E4DF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4603A] focus:border-transparent"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1C1917] mb-2">
                  {language === 'ka' ? 'აღწერა (ქართული)' : 'Description (Georgian)'}
                </label>
                <textarea
                  value={descriptionKa}
                  onChange={(e) => setDescriptionKa(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E8E4DF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4603A] focus:border-transparent resize-none"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1C1917] mb-2">
                  {language === 'ka' ? 'აღწერა (ინგლისური)' : 'Description (English)'}
                </label>
                <textarea
                  value={descriptionEn}
                  onChange={(e) => setDescriptionEn(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E8E4DF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4603A] focus:border-transparent resize-none"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1C1917] mb-2">
                    {language === 'ka' ? 'კატეგორია' : 'Category'}
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E8E4DF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4603A] focus:border-transparent"
                    required
                  >
                    <option value="">{language === 'ka' ? 'აირჩიეთ კატეგორია' : 'Select Category'}</option>
                    {categories?.map((cat: any) => (
                      <option key={cat.id} value={cat.id}>{cat.nameEn}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1C1917] mb-2">
                    {language === 'ka' ? 'ერთეული' : 'Unit Type'}
                  </label>
                  <input
                    type="text"
                    value={unitType}
                    onChange={(e) => setUnitType(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E8E4DF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4603A] focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Price & Stock Card */}
        <div className="bg-white rounded-xl border border-[#E8E4DF] shadow-sm overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('pricing')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#FAFAF8] transition-colors border-b border-[#E8E4DF]"
          >
            <h3 className="font-semibold text-[#1C1917]">
              {language === 'ka' ? 'ფასი და მარაგი' : 'Price & Stock'}
            </h3>
            {expandedSections.pricing ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          {expandedSections.pricing && (
            <div className="px-6 py-4 space-y-4">
              <div className="flex items-center gap-4 p-4 bg-[#FAFAF8] rounded-lg border border-[#E8E4DF]">
                <div className="flex-1">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={priceOnRequest}
                        onChange={(e) => setPriceOnRequest(e.target.checked)}
                        className="w-5 h-5 rounded border-[#E8E4DF] cursor-pointer"
                      />
                    </div>
                    <span className="font-medium text-[#1C1917]">
                      {language === 'ka' ? 'ფასი მოთხოვნით' : 'Price on Request'}
                    </span>
                  </label>
                </div>
              </div>
              {!priceOnRequest && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1C1917] mb-2">
                      {language === 'ka' ? 'მინიმალური ფასი' : 'Min Price'}
                    </label>
                    <input
                      type="number"
                      value={priceMin}
                      onChange={(e) => setPriceMin(e.target.value)}
                      className="w-full px-3 py-2 border border-[#E8E4DF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4603A] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1C1917] mb-2">
                      {language === 'ka' ? 'მაქსიმალური ფასი' : 'Max Price'}
                    </label>
                    <input
                      type="number"
                      value={priceMax}
                      onChange={(e) => setPriceMax(e.target.value)}
                      className="w-full px-3 py-2 border border-[#E8E4DF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4603A] focus:border-transparent"
                    />
                  </div>
                </div>
              )}
              <div className="space-y-3 pt-4 border-t border-[#E8E4DF]">
                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-[#FAFAF8] transition-colors">
                  <input
                    type="checkbox"
                    checked={isAvailable}
                    onChange={(e) => setIsAvailable(e.target.checked)}
                    className="w-5 h-5 rounded border-[#E8E4DF] cursor-pointer"
                  />
                  <span className="font-medium text-[#1C1917]">
                    {language === 'ka' ? 'ხელმისაწვდომია' : 'Available'}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    isAvailable
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-rose-100 text-rose-700'
                  }`}>
                    {isAvailable ? (language === 'ka' ? 'ხელმისაწვდომია' : 'Available') : (language === 'ka' ? 'მიუწვდომელია' : 'Unavailable')}
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-[#FAFAF8] transition-colors">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-5 h-5 rounded border-[#E8E4DF] cursor-pointer"
                  />
                  <span className="font-medium text-[#1C1917]">
                    {language === 'ka' ? 'მთავარ გვერდზე გამოჩენა' : 'Show on Homepage'}
                  </span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Product Photo Card */}
        <div className="bg-white rounded-xl border border-[#E8E4DF] shadow-sm overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('photo')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#FAFAF8] transition-colors border-b border-[#E8E4DF]"
          >
            <h3 className="font-semibold text-[#1C1917]">
              {language === 'ka' ? 'პროდუქტის ფოტო' : 'Product Photo'}
            </h3>
            {expandedSections.photo ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          {expandedSections.photo && (
            <div className="px-6 py-4 space-y-4">
              {imageUrl && (
                <div className="w-full max-w-xs rounded-lg overflow-hidden border border-[#E8E4DF]">
                  <FlowerImage
                    src={imageUrl}
                    alt={language === 'ka' ? nameKa : nameEn}
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}
              <ImageUploader
                onChange={(url: string | null) => setImageUrl(url)}
                value={imageUrl}
              />
              <p className="text-xs text-[#666]">
                {language === 'ka' ? 'რეკომენდებული ზომა: 800x800px' : 'Recommended size: 800x800px'}
              </p>
            </div>
          )}
        </div>

        {/* Color Variants Card */}
        <div className="bg-white rounded-xl border border-[#E8E4DF] shadow-sm overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('variants')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#FAFAF8] transition-colors border-b border-[#E8E4DF]"
          >
            <div className="flex items-center gap-3">
              <h3 className="font-semibold text-[#1C1917]">
                {language === 'ka' ? 'ფერის ვარიანტები' : 'Color Variants'}
              </h3>
              {variants.length > 0 && (
                <span className="text-xs bg-[#C4603A] text-white px-2 py-1 rounded-full">
                  {variants.length}
                </span>
              )}
            </div>
            {expandedSections.variants ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          {expandedSections.variants && (
            <div className="px-6 py-4 space-y-4">
              {/* Existing Variants */}
              {variants.length > 0 && (
                <div className="space-y-2">
                  {variants.map((variant) => (
                    <div key={variant.id} className="flex items-center gap-3 p-3 bg-[#FAFAF8] rounded-lg border border-[#E8E4DF]">
                      <div
                        className="w-8 h-8 rounded-lg border-2 border-[#E8E4DF] flex-shrink-0"
                        style={{ backgroundColor: variant.colorHex }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-[#1C1917]">
                          {variant.colorNameKa} / {variant.colorNameEn}
                        </div>
                        <div className="text-xs text-[#666] flex items-center gap-2 flex-wrap">
                          <span>{variant.colorHex}</span>
                          {variant.priceMin && <span>₾{variant.priceMin}</span>}
                          {!variant.available && <span className="text-rose-600">{language === 'ka' ? 'მიუწვდომელი' : 'Unavailable'}</span>}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteVariant(variant.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Variant Button */}
              {!showAddVariant && (
                <button
                  type="button"
                  onClick={() => setShowAddVariant(true)}
                  className="w-full px-4 py-2 border-2 border-dashed border-[#C4603A] text-[#C4603A] rounded-lg hover:bg-[#C4603A]/5 transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <Plus className="w-4 h-4" />
                  {language === 'ka' ? '+ ფერის დამატება' : '+ Add Color'}
                </button>
              )}

              {/* Add Variant Form */}
              {showAddVariant && (
                <div className="p-4 bg-[#FAFAF8] rounded-lg border border-[#E8E4DF] space-y-4">
                  <h4 className="font-medium text-[#1C1917]">
                    {language === 'ka' ? 'ახალი ვარიანტი' : 'New Variant'}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1C1917] mb-2">
                        {language === 'ka' ? 'ფერის სახელი (ქართული)' : 'Color Name (Georgian)'}
                      </label>
                      <input
                        type="text"
                        value={newVariant.colorNameKa}
                        onChange={(e) => setNewVariant({ ...newVariant, colorNameKa: e.target.value })}
                        className="w-full px-3 py-2 border border-[#E8E4DF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4603A] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1C1917] mb-2">
                        {language === 'ka' ? 'ფერის სახელი (ინგლისური)' : 'Color Name (English)'}
                      </label>
                      <input
                        type="text"
                        value={newVariant.colorNameEn}
                        onChange={(e) => setNewVariant({ ...newVariant, colorNameEn: e.target.value })}
                        className="w-full px-3 py-2 border border-[#E8E4DF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4603A] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1C1917] mb-2">
                        {language === 'ka' ? 'ფერის კოდი' : 'Color Code'}
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={newVariant.colorHex}
                          onChange={(e) => setNewVariant({ ...newVariant, colorHex: e.target.value })}
                          className="w-12 h-10 rounded-lg border border-[#E8E4DF] cursor-pointer"
                        />
                        <input
                          type="text"
                          value={newVariant.colorHex}
                          onChange={(e) => setNewVariant({ ...newVariant, colorHex: e.target.value })}
                          className="flex-1 px-3 py-2 border border-[#E8E4DF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4603A] focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1C1917] mb-2">
                        {language === 'ka' ? 'მინიმალური ფასი' : 'Min Price'}
                      </label>
                      <input
                        type="number"
                        value={newVariant.priceMin}
                        onChange={(e) => setNewVariant({ ...newVariant, priceMin: e.target.value })}
                        className="w-full px-3 py-2 border border-[#E8E4DF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4603A] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1C1917] mb-2">
                        {language === 'ka' ? 'მაქსიმალური ფასი' : 'Max Price'}
                      </label>
                      <input
                        type="number"
                        value={newVariant.priceMax}
                        onChange={(e) => setNewVariant({ ...newVariant, priceMax: e.target.value })}
                        className="w-full px-3 py-2 border border-[#E8E4DF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4603A] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 cursor-pointer pt-6">
                        <input
                          type="checkbox"
                          checked={newVariant.available}
                          onChange={(e) => setNewVariant({ ...newVariant, available: e.target.checked })}
                          className="w-4 h-4 rounded border-[#E8E4DF] cursor-pointer"
                        />
                        <span className="text-sm font-medium text-[#1C1917]">
                          {language === 'ka' ? 'ხელმისაწვდომი' : 'Available'}
                        </span>
                      </label>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={handleAddVariant}
                      className="flex-1 px-4 py-2 bg-[#A16207] hover:bg-[#8B4D05] text-white rounded-lg transition-colors font-medium"
                    >
                      {language === 'ka' ? 'დამატება' : 'Add'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddVariant(false)}
                      className="flex-1 px-4 py-2 border border-[#E8E4DF] text-[#1C1917] rounded-lg hover:bg-[#FAFAF8] transition-colors font-medium"
                    >
                      {language === 'ka' ? 'გაუქმება' : 'Cancel'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* SEO Information Card */}
        <div className="bg-white rounded-xl border border-[#E8E4DF] shadow-sm overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('seo')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#FAFAF8] transition-colors border-b border-[#E8E4DF]"
          >
            <h3 className="font-semibold text-[#1C1917]">
              {language === 'ka' ? 'SEO ინფორმაცია' : 'SEO Information'}
            </h3>
            {expandedSections.seo ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          {expandedSections.seo && (
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1C1917] mb-2">
                  {language === 'ka' ? 'SEO სათაური' : 'SEO Title'}
                </label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E8E4DF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4603A] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1C1917] mb-2">
                  {language === 'ka' ? 'SEO აღწერა' : 'SEO Description'}
                </label>
                <textarea
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E8E4DF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4603A] focus:border-transparent resize-none"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1C1917] mb-2">
                  {language === 'ka' ? 'სურათის alt ტექსტი' : 'Image Alt Text'}
                </label>
                <input
                  type="text"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E8E4DF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4603A] focus:border-transparent"
                />
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-6 sticky bottom-0 bg-white rounded-xl border border-[#E8E4DF] shadow-sm p-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 px-6 py-3 bg-[#A16207] hover:bg-[#8B4D05] text-white rounded-lg transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isLoading ? (language === 'ka' ? 'შენახვა...' : 'Saving...') : (language === 'ka' ? 'შენახვა' : 'Save')}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-[#E8E4DF] text-[#1C1917] rounded-lg hover:bg-[#FAFAF8] transition-colors font-medium"
          >
            {language === 'ka' ? 'გაუქმება' : 'Cancel'}
          </button>
        </div>
      </form>
    </div>
  );
}
