'use client';

import React, { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ChevronUp, ChevronDown, Edit2, Trash2, Plus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import ImageUploader from './ImageUploader';

interface ProductEditDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  product: any | null;
  isCreateMode: boolean;
  onSave?: () => void;
  categories?: any[];
}

export default function ProductEditDrawer({
  isOpen,
  onClose,
  product,
  isCreateMode,
  onSave,
  categories,
}: ProductEditDrawerProps) {
  const { language } = useLanguage();
  const [formData, setFormData] = useState<any>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    basic: true,
    priceStock: true,
    photo: false,
    variants: true,
    seo: false,
    advanced: false,
  });
  const [editingVariantIdx, setEditingVariantIdx] = useState<number | null>(null);
  const [showAddVariantForm, setShowAddVariantForm] = useState(false);
  const [variantFormData, setVariantFormData] = useState<any>({});

  const updateProductMutation = trpc.products.update.useMutation({
    onSuccess: () => {
      toast.success(language === 'ka' ? 'პროდუქტი წარმატებით განახლდა' : 'Product updated successfully');
      setHasUnsavedChanges(false);
      onSave?.();
      onClose();
    },
    onError: (error) => {
      toast.error(language === 'ka' ? 'პროდუქტის განახლება ვერ მოხერხდა' : 'Failed to update product');
    },
  });

  const createProductMutation = trpc.products.create.useMutation({
    onSuccess: () => {
      toast.success(language === 'ka' ? 'პროდუქტი წარმატებით შეიქმნა' : 'Product created successfully');
      setHasUnsavedChanges(false);
      onSave?.();
      onClose();
    },
    onError: (error) => {
      toast.error(language === 'ka' ? 'პროდუქტის შექმნა ვერ მოხერხდა' : 'Failed to create product');
    },
  });

  // Initialize form data when drawer opens or product changes
  useEffect(() => {
    if (isOpen) {
      if (isCreateMode) {
        setFormData({
          nameKa: '',
          nameEn: '',
          descriptionKa: '',
          descriptionEn: '',
          categoryId: null,
          unitType: 'single stem',
          priceMin: 0,
          priceMax: 0,
          priceOnRequest: false,
          isAvailable: true,
          published: true,
          featured: false,
          imageUrl: '',
          imageKey: '',
          variants: [],
          seoTitle: '',
          seoDescription: '',
          seoKeywords: '',
        });
      } else if (product) {
        setFormData({
          id: product.id,
          nameKa: product.nameKa || '',
          nameEn: product.nameEn || '',
          descriptionKa: product.descriptionKa || '',
          descriptionEn: product.descriptionEn || '',
          categoryId: product.categoryId,
          unitType: product.unitType || 'single stem',
          priceMin: product.priceMin ? parseFloat(String(product.priceMin)) : 0,
          priceMax: product.priceMax ? parseFloat(String(product.priceMax)) : 0,
          priceOnRequest: product.priceOnRequest || false,
          isAvailable: product.isAvailable !== undefined ? product.isAvailable : true,
          published: product.published !== undefined ? product.published : true,
          featured: product.featured || false,
          imageUrl: product.imageUrl || '',
          imageKey: product.imageKey || '',
          variants: Array.isArray(product.variants) ? product.variants : [],
          seoTitle: product.seoTitle || '',
          seoDescription: product.seoDescription || '',
          seoKeywords: product.seoKeywords || '',
        });
      }
      setHasUnsavedChanges(false);
      setEditingVariantIdx(null);
      setShowAddVariantForm(false);
    }
  }, [isOpen, product, isCreateMode]);

  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSaveVariant = () => {
    if (!variantFormData.colorNameKa || !variantFormData.colorNameEn || !variantFormData.colorHex) {
      toast.error(language === 'ka' ? 'გთხოვთ შეავსოთ ყველა აუცილებელი ველი' : 'Please fill all required fields');
      return;
    }

    let newVariants = [...(formData.variants || [])];
    if (editingVariantIdx !== null) {
      newVariants[editingVariantIdx] = variantFormData;
    } else {
      newVariants.push({ ...variantFormData, id: Date.now() });
    }

    handleFieldChange('variants', newVariants);
    setShowAddVariantForm(false);
    setEditingVariantIdx(null);
    setVariantFormData({});
    toast.success(language === 'ka' ? 'ვარიანტი წარმატებით შენახულია' : 'Variant saved successfully');
  };

  const handleDeleteVariant = (idx: number) => {
    if (confirm(language === 'ka' ? 'ნამდვილად გსურთ ამ ფერის ვარიანტის წაშლა?' : 'Delete this variant?')) {
      const newVariants = formData.variants.filter((_: any, i: number) => i !== idx);
      handleFieldChange('variants', newVariants);
      toast.success(language === 'ka' ? 'ვარიანტი წაშლილია' : 'Variant deleted');
    }
  };

  const handleSave = async () => {
    if (!formData.nameKa || !formData.nameEn || !formData.categoryId) {
      toast.error(language === 'ka' ? 'გთხოვთ შეავსოთ ყველა აუცილებელი ველი' : 'Please fill all required fields');
      return;
    }

    if (isCreateMode) {
      createProductMutation.mutate(formData);
    } else {
      updateProductMutation.mutate(formData);
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-w-2xl mx-auto">
        <DrawerHeader className="sticky top-0 bg-white border-b">
          <DrawerTitle>
            {isCreateMode
              ? language === 'ka' ? 'ახალი პროდუქტი' : 'New Product'
              : language === 'ka' ? 'პროდუქტის რედაქტირება' : 'Edit Product'}
          </DrawerTitle>
        </DrawerHeader>

        <div className="overflow-y-auto max-h-[calc(100vh-200px)] px-6 py-4 space-y-4">
          {/* Basic Info Section */}
          <Card className="p-4 border border-gray-200">
            <button
              onClick={() => toggleSection('basic')}
              className="flex items-center justify-between w-full"
            >
              <h3 className="font-semibold text-lg">{language === 'ka' ? 'ძირითადი ინფორმაცია' : 'Basic Info'}</h3>
              {expandedSections['basic'] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            {expandedSections['basic'] && (
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{language === 'ka' ? 'სახელი (ქართულად)' : 'Name (Georgian)'}</Label>
                    <Input
                      value={formData.nameKa}
                      onChange={(e) => handleFieldChange('nameKa', e.target.value)}
                      placeholder="სახელი"
                    />
                  </div>
                  <div>
                    <Label>{language === 'ka' ? 'სახელი (ინგლისურად)' : 'Name (English)'}</Label>
                    <Input
                      value={formData.nameEn}
                      onChange={(e) => handleFieldChange('nameEn', e.target.value)}
                      placeholder="Name"
                    />
                  </div>
                </div>
                <div>
                  <Label>{language === 'ka' ? 'აღწერა (ქართულად)' : 'Description (Georgian)'}</Label>
                  <Textarea
                    value={formData.descriptionKa}
                    onChange={(e) => handleFieldChange('descriptionKa', e.target.value)}
                    placeholder="აღწერა"
                    rows={3}
                  />
                </div>
                <div>
                  <Label>{language === 'ka' ? 'აღწერა (ინგლისურად)' : 'Description (English)'}</Label>
                  <Textarea
                    value={formData.descriptionEn}
                    onChange={(e) => handleFieldChange('descriptionEn', e.target.value)}
                    placeholder="Description"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{language === 'ka' ? 'კატეგორია' : 'Category'}</Label>
                    <Select value={String(formData.categoryId || '')} onValueChange={(val) => handleFieldChange('categoryId', parseInt(val))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories?.map((cat: any) => (
                          <SelectItem key={cat.id} value={String(cat.id)}>
                            {cat.nameEn}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>{language === 'ka' ? 'ერთეული' : 'Unit'}</Label>
                    <Input
                      value={formData.unitType}
                      onChange={(e) => handleFieldChange('unitType', e.target.value)}
                      placeholder={language === 'ka' ? 'ცალი' : 'piece'}
                    />
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Price & Stock Section */}
          <Card className="p-4 border border-gray-200">
            <button
              onClick={() => toggleSection('priceStock')}
              className="flex items-center justify-between w-full"
            >
              <h3 className="font-semibold text-lg">{language === 'ka' ? 'ფასი და მარაგი' : 'Price & Stock'}</h3>
              {expandedSections.priceStock ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            {expandedSections.priceStock && (
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{language === 'ka' ? 'მინიმალური ფასი' : 'Minimum Price'}</Label>
                    <Input
                      type="number"
                      value={formData.priceMin}
                      onChange={(e) => handleFieldChange('priceMin', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label>{language === 'ka' ? 'მაქსიმალური ფასი' : 'Maximum Price'}</Label>
                    <Input
                      type="number"
                      value={formData.priceMax}
                      onChange={(e) => handleFieldChange('priceMax', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={formData.priceOnRequest}
                    onCheckedChange={(checked) => handleFieldChange('priceOnRequest', checked)}
                  />
                  <Label>{language === 'ka' ? 'ფასი მოთხოვნის მიხედვით' : 'Price on Request'}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={formData.isAvailable}
                    onCheckedChange={(checked) => handleFieldChange('isAvailable', checked)}
                  />
                  <Label>{language === 'ka' ? 'მარაგშია' : 'In Stock'}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={formData.published}
                    onCheckedChange={(checked) => handleFieldChange('published', checked)}
                  />
                  <Label>{language === 'ka' ? 'გამოქვეყნებული' : 'Published'}</Label>
                </div>
              </div>
            )}
          </Card>

          {/* Photo Section */}
          <Card className="p-4 border border-gray-200">
            <button
              onClick={() => toggleSection('photo')}
              className="flex items-center justify-between w-full"
            >
              <h3 className="font-semibold text-lg">{language === 'ka' ? 'მთავარი ფოტო' : 'Main Photo'}</h3>
              {expandedSections.photo ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            {expandedSections.photo && (
              <div className="mt-4">
                <ImageUploader
                  value={formData.imageUrl}
                  onChange={(url: any) => {
                    handleFieldChange('imageUrl', url);
                  }}
                />
              </div>
            )}
          </Card>

          {/* Variants Section */}
          <Card className="p-4 border border-gray-200">
            <button
              onClick={() => toggleSection('variants')}
              className="flex items-center justify-between w-full"
            >
              <h3 className="font-semibold text-lg">{language === 'ka' ? 'ფერის ვარიანტები' : 'Color Variants'}</h3>
              {expandedSections.variants ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            {expandedSections.variants && (
              <div className="mt-4 space-y-4">
                {/* Existing Variants */}
                <div className="space-y-2">
                  {formData.variants && formData.variants.length > 0 ? (
                    formData.variants.map((variant: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-3 flex-1">
                          <div
                            className="w-8 h-8 rounded-full border border-gray-300 flex-shrink-0"
                            style={{ backgroundColor: variant.colorHex || '#ccc' }}
                          />
                          <div className="flex-1">
                            <div className="text-sm font-medium">
                              {variant.colorNameKa} / {variant.colorNameEn}
                            </div>
                            <div className="text-xs text-gray-600">
                              {variant.colorHex} · ₾{variant.priceMin || 0} · {variant.available ? (language === 'ka' ? 'მარაგშია' : 'In Stock') : (language === 'ka' ? 'მარაგში არ არის' : 'Out of Stock')}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => {
                              setEditingVariantIdx(idx);
                              setVariantFormData(variant);
                              setShowAddVariantForm(true);
                            }}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteVariant(idx)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">{language === 'ka' ? 'ფერის ვარიანტი არ არის დამატებული' : 'No color variants'}</p>
                  )}
                </div>

                {/* Add/Edit Variant Form */}
                {showAddVariantForm && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-sm">{language === 'ka' ? 'ფერის სახელი (ქართულად)' : 'Color Name (Georgian)'}</Label>
                        <Input
                          value={variantFormData.colorNameKa || ''}
                          onChange={(e) => setVariantFormData({ ...variantFormData, colorNameKa: e.target.value })}
                          placeholder="ვარდისფერი"
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-sm">{language === 'ka' ? 'ფერის სახელი (ინგლისურად)' : 'Color Name (English)'}</Label>
                        <Input
                          value={variantFormData.colorNameEn || ''}
                          onChange={(e) => setVariantFormData({ ...variantFormData, colorNameEn: e.target.value })}
                          placeholder="Pink"
                          className="text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm">{language === 'ka' ? 'ფერის კოდი' : 'Color Code'}</Label>
                      <Input
                        value={variantFormData.colorHex || ''}
                        onChange={(e) => setVariantFormData({ ...variantFormData, colorHex: e.target.value })}
                        placeholder="#c13e5d"
                        className="text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-sm">{language === 'ka' ? 'მინ. ფასი' : 'Min Price'}</Label>
                        <Input
                          type="number"
                          value={variantFormData.priceMin || 0}
                          onChange={(e) => setVariantFormData({ ...variantFormData, priceMin: parseFloat(e.target.value) || 0 })}
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-sm">{language === 'ka' ? 'მაქს. ფასი' : 'Max Price'}</Label>
                        <Input
                          type="number"
                          value={variantFormData.priceMax || 0}
                          onChange={(e) => setVariantFormData({ ...variantFormData, priceMax: parseFloat(e.target.value) || 0 })}
                          className="text-sm"
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={variantFormData.available !== false}
                        onCheckedChange={(checked) => setVariantFormData({ ...variantFormData, available: checked })}
                      />
                      <Label className="text-sm">{language === 'ka' ? 'მარაგშია' : 'In Stock'}</Label>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSaveVariant} className="flex-1 text-sm">
                        {editingVariantIdx !== null ? (language === 'ka' ? 'განახლება' : 'Update') : (language === 'ka' ? 'დამატება' : 'Add')}
                      </Button>
                      <Button
                        onClick={() => {
                          setShowAddVariantForm(false);
                          setEditingVariantIdx(null);
                          setVariantFormData({});
                        }}
                        variant="outline"
                        className="flex-1 text-sm"
                      >
                        {language === 'ka' ? 'გაუქმება' : 'Cancel'}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Add Variant Button */}
                {!showAddVariantForm && (
                  <button
                    className="w-full px-4 py-2 border border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                    onClick={() => {
                      setShowAddVariantForm(true);
                      setEditingVariantIdx(null);
                      setVariantFormData({});
                    }}
                  >
                    <Plus size={16} className="inline mr-1" />
                    {language === 'ka' ? '+ ფერის დამატება' : '+ Add Color'}
                  </button>
                )}
              </div>
            )}
          </Card>

          {/* SEO Section */}
          <Card className="p-4 border border-gray-200">
            <button
              onClick={() => toggleSection('seo')}
              className="flex items-center justify-between w-full"
            >
              <h3 className="font-semibold text-lg">SEO</h3>
              {expandedSections.seo ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            {expandedSections.seo && (
              <div className="mt-4 space-y-4">
                <div>
                  <Label>{language === 'ka' ? 'SEO სათაური' : 'SEO Title'}</Label>
                  <Input
                    value={formData.seoTitle}
                    onChange={(e) => handleFieldChange('seoTitle', e.target.value)}
                    placeholder="SEO Title"
                  />
                </div>
                <div>
                  <Label>{language === 'ka' ? 'SEO აღწერა' : 'SEO Description'}</Label>
                  <Textarea
                    value={formData.seoDescription}
                    onChange={(e) => handleFieldChange('seoDescription', e.target.value)}
                    placeholder="SEO Description"
                    rows={2}
                  />
                </div>
                <div>
                  <Label>{language === 'ka' ? 'SEO საკვანძო სიტყვები' : 'SEO Keywords'}</Label>
                  <Input
                    value={formData.seoKeywords}
                    onChange={(e) => handleFieldChange('seoKeywords', e.target.value)}
                    placeholder="keyword1, keyword2"
                  />
                </div>
              </div>
            )}
          </Card>

          {/* Featured Section */}
          <Card className="p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <Label>{language === 'ka' ? 'პოპულარული' : 'Featured'}</Label>
              <Checkbox
                checked={formData.featured}
                onCheckedChange={(checked) => handleFieldChange('featured', checked)}
              />
            </div>
          </Card>
        </div>

        {/* Sticky Footer */}
        <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose}>
            {language === 'ka' ? 'გაუქმება' : 'Cancel'}
          </Button>
          <Button
            onClick={handleSave}
            disabled={updateProductMutation.isPending || createProductMutation.isPending}
          >
            {updateProductMutation.isPending || createProductMutation.isPending
              ? language === 'ka' ? 'შენახვა...' : 'Saving...'
              : language === 'ka' ? 'შენახვა' : 'Save'}
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
