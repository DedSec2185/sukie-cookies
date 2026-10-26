import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Image as ImageIcon, Check, Sparkles } from 'lucide-react';

const STUDIO_GALLERY_PRESETS = [
  { label: 'Triple Chocolate', url: '/images/triple_chocolate.jpg' },
  { label: 'Gooey Two-Chip', url: '/images/two_chip.jpg' },
  { label: 'Pistachio Gianduja', url: '/images/pistachio.jpg' },
  { label: "Cupid's Ruby", url: '/images/ruby_chocolate.jpg' },
  { label: 'Popcorn Praliné', url: '/images/popcorn_praline.jpg' },
  { label: 'Royal Gift Box', url: '/images/assorted_box.jpg' },
];

const QUICK_TAG_SUGGESTIONS = [
  'Bestseller',
  'Limited Edition',
  'Rare',
  'New Drop',
  'Luxury Gifting',
  'Ultimate Box',
];

export default function ProductEditorModal({ isOpen, onClose, product, categories, onSave }) {
  const fileInputRef = useRef(null);

  const defaultState = {
    name: '',
    category: categories?.[0]?.id || 'signature',
    price: 299,
    weight: '170g (6oz)',
    serves: '1–2',
    image: '/images/triple_chocolate.jpg',
    shortDesc: '',
    description: '',
    ingredientsText: 'Belgian Callebaut Chocolate, European Butter, Organic Flour, Maldon Sea Salt',
    tagsText: 'Eggless, Bestseller',
    storageNote: 'Store in an airtight container for up to 5 days. Warm at 160°C for 2–3 mins before serving.',
    available: true,
  };

  const [formData, setFormData] = useState(defaultState);
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        category: product.category || categories?.[0]?.id || 'signature',
        price: product.price ?? 299,
        weight: product.weight || '170g (6oz)',
        serves: product.serves || '1–2',
        image: product.image || '/images/triple_chocolate.jpg',
        shortDesc: product.shortDesc || '',
        description: product.description || '',
        ingredientsText: Array.isArray(product.ingredients)
          ? product.ingredients.join(', ')
          : product.ingredients || '',
        tagsText: Array.isArray(product.tags) ? product.tags.join(', ') : product.tags || 'Eggless',
        storageNote:
          product.storageNote ||
          'Store in an airtight container for up to 5 days. Warm at 160°C for 2–3 mins before serving.',
        available: product.available !== false,
      });
    } else {
      setFormData(defaultState);
    }
    setUploadError('');
  }, [product, isOpen]);

  // Compress uploaded image via HTML5 canvas so localStorage stays fast and light
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError('');

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPG, PNG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 900;
        const scaleSize = img.width > MAX_WIDTH ? MAX_WIDTH / img.width : 1;
        canvas.width = img.width * scaleSize;
        canvas.height = img.height * scaleSize;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
        setFormData((prev) => ({ ...prev, image: compressedDataUrl }));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleToggleQuickTag = (tagToToggle) => {
    const currentTags = formData.tagsText
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    const exists = currentTags.some((t) => t.toLowerCase() === tagToToggle.toLowerCase());
    let nextTags;
    if (exists) {
      nextTags = currentTags.filter((t) => t.toLowerCase() !== tagToToggle.toLowerCase());
    } else {
      nextTags = [...currentTags, tagToToggle];
    }
    if (!nextTags.some((t) => t.toLowerCase() === 'eggless')) {
      nextTags.unshift('Eggless');
    }
    setFormData({ ...formData, tagsText: nextTags.join(', ') });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const ingredients = formData.ingredientsText
      .split(',')
      .map((i) => i.trim())
      .filter(Boolean);

    const tags = formData.tagsText
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (!tags.some((t) => t.toLowerCase() === 'eggless')) {
      tags.unshift('Eggless');
    }

    onSave({
      name: formData.name.trim(),
      category: formData.category,
      price: Number(formData.price) || 299,
      weight: formData.weight.trim() || '170g (6oz)',
      serves: formData.serves.trim() || '1–2',
      image: formData.image.trim() || '/images/triple_chocolate.jpg',
      shortDesc: formData.shortDesc.trim(),
      description: formData.description.trim() || formData.shortDesc.trim(),
      ingredients,
      tags,
      storageNote: formData.storageNote.trim(),
      available: formData.available,
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[230] flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          className="relative w-full max-w-3xl bg-[#07132B] text-white rounded-3xl border border-[#C5A059]/40 shadow-[0_25px_80px_rgba(0,0,0,0.9)] overflow-hidden z-10 my-auto"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-[#C5A059]/25 flex items-center justify-between bg-gradient-to-r from-[#07132B] via-[#0A2250] to-[#07132B]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#C5A059]/20 border border-[#C5A059]/50 flex items-center justify-center text-[#F3E5AB]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C5A059] block">
                  {product ? 'Edit Existing Drop' : 'Launch New Quarterly Drop'}
                </span>
                <h2 className="font-heading text-xl font-bold text-white">
                  {product ? product.name : 'Create New Cookie / Gift Box'}
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-5 sm:p-7 space-y-6 max-h-[80vh] overflow-y-auto">
            {/* Image Preview, Upload & 1-Click Studio Gallery */}
            <div className="p-4 sm:p-5 rounded-2xl bg-black/35 border border-white/10 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                <div className="sm:col-span-4 aspect-[4/3] rounded-2xl overflow-hidden bg-stone-900 border border-[#C5A059]/40 relative">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/images/triple_chocolate.jpg';
                    }}
                  />
                  <span className="absolute bottom-2 left-2 bg-black/75 text-[#F3E5AB] text-[10px] font-mono px-2.5 py-0.5 rounded-full border border-[#C5A059]/40">
                    ₹{formData.price} • {formData.weight}
                  </span>
                </div>

                <div className="sm:col-span-8 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="text-xs font-bold text-[#F3E5AB] uppercase tracking-wider font-mono">
                      Product Photography
                    </label>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3.5 py-1.5 rounded-xl bg-[#C5A059] hover:bg-[#D4B86A] text-stone-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Photo From Device</span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>

                  {/* 1-Click Studio Gallery Presets */}
                  <div>
                    <span className="text-[10px] text-white/55 font-mono block mb-1.5">
                      Or choose from Sukié Studio Gallery in 1 click:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {STUDIO_GALLERY_PRESETS.map((preset) => {
                        const isSelected = formData.image === preset.url;
                        return (
                          <button
                            key={preset.url}
                            type="button"
                            onClick={() => setFormData({ ...formData, image: preset.url })}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold flex items-center gap-1.5 cursor-pointer border transition-all ${
                              isSelected
                                ? 'bg-[#0C419C] border-[#C5A059] text-white'
                                : 'bg-white/5 border-white/10 text-white/70 hover:text-white'
                            }`}
                          >
                            <img
                              src={preset.url}
                              alt={preset.label}
                              className="w-4 h-4 rounded-full object-cover"
                            />
                            <span>{preset.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="relative">
                    <ImageIcon className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="Or paste image URL..."
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  {uploadError && <p className="text-xs text-red-400">{uploadError}</p>}
                </div>
              </div>
            </div>

            {/* Name, Category & Price */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs text-white/75 font-semibold block mb-1.5">
                  Cookie / Box Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Hazelnut Praline Noir"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm text-white focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="text-xs text-white/75 font-semibold block mb-1.5">
                  Price (₹ INR) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm text-[#F3E5AB] font-bold font-mono focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>

            {/* Category Pills (No raw native <select>!) */}
            <div>
              <label className="text-xs text-white/75 font-semibold block mb-1.5">
                Menu Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(categories || []).map((cat) => {
                  const isSel = formData.category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: cat.id })}
                      className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        isSel
                          ? 'bg-[#0C419C] border-[#C5A059] text-white font-bold shadow-md'
                          : 'bg-white/5 border-white/10 text-white/70 hover:text-white'
                      }`}
                    >
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Weight, Serves & Availability */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-white/75 font-semibold block mb-1.5">
                  Weight / Portion
                </label>
                <input
                  type="text"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  placeholder="170g (6oz)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="text-xs text-white/75 font-semibold block mb-1.5">
                  Serves
                </label>
                <input
                  type="text"
                  value={formData.serves}
                  onChange={(e) => setFormData({ ...formData, serves: e.target.value })}
                  placeholder="1–2"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, available: !formData.available })}
                  className={`w-full py-2.5 px-3.5 rounded-xl border text-xs font-bold flex items-center justify-between cursor-pointer transition-all ${
                    formData.available
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                      : 'bg-red-500/15 border-red-500/40 text-red-300'
                  }`}
                >
                  <span>{formData.available ? '● Live & In Stock' : '○ Marked Sold Out'}</span>
                  <Check className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Short Card Teaser & Full Tasting Story */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-white/75 font-semibold block mb-1.5">
                  Card Teaser Summary (2 lines on menu card) *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.shortDesc}
                  onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
                  placeholder="Rich dark cocoa dough loaded with molten Belgian chocolate..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:outline-none focus:border-[#C5A059] leading-relaxed"
                />
              </div>

              <div>
                <label className="text-xs text-white/75 font-semibold block mb-1.5">
                  Full Tasting Notes &amp; Story (Modal View)
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed flavor profile and molten center description..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:outline-none focus:border-[#C5A059] leading-relaxed"
                />
              </div>
            </div>

            {/* Ingredients & Quick Badge Tags */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-white/75 font-semibold block mb-1.5">
                  Key Ingredients (Comma separated)
                </label>
                <input
                  type="text"
                  value={formData.ingredientsText}
                  onChange={(e) => setFormData({ ...formData, ingredientsText: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="text-xs text-white/75 font-semibold block mb-1.5">
                  Badge Tags (Click to toggle or type)
                </label>
                <input
                  type="text"
                  value={formData.tagsText}
                  onChange={(e) => setFormData({ ...formData, tagsText: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:outline-none focus:border-[#C5A059] mb-2"
                />
                <div className="flex flex-wrap gap-1">
                  {QUICK_TAG_SUGGESTIONS.map((tg) => {
                    const active = formData.tagsText.toLowerCase().includes(tg.toLowerCase());
                    return (
                      <button
                        key={tg}
                        type="button"
                        onClick={() => handleToggleQuickTag(tg)}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-mono cursor-pointer border ${
                          active
                            ? 'bg-[#C5A059] text-stone-950 border-[#C5A059] font-bold'
                            : 'bg-white/5 text-white/60 border-white/10 hover:text-white'
                        }`}
                      >
                        {active ? `✓ ${tg}` : `+ ${tg}`}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#DFBD73] hover:brightness-105 text-stone-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>{product ? 'Save Changes to Website' : 'Publish to Live Menu'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
