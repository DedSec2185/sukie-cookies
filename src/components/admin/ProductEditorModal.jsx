import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

export default function ProductEditorModal({ product, onSave, onClose }) {
  const isEditing = !!product;

  const [formData, setFormData] = useState({
    name: product?.name || '',
    category: product?.category || 'signature',
    price: product?.price || 299,
    weight: product?.weight || '170g (6oz)',
    serves: product?.serves || '1-2',
    image: product?.image || '/images/real_hero_cookie.jpg',
    shortDesc: product?.shortDesc || '',
    description: product?.description || '',
    provenanceHighlights: (product?.provenanceHighlights || []).join(', '),
    ingredients: (product?.ingredients || []).join(', '),
    tag: (product?.tags && product.tags[0]) || 'Signature',
    available: product?.available ?? true,
  });

  const [imagePreview, setImagePreview] = useState(formData.image);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle Photo File Upload (Convert to optimized Data URL)
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (max 3MB for local storage safety)
    if (file.size > 3 * 1024 * 1024) {
      setUploadError('Please select a photo under 3MB.');
      return;
    }

    setUploadError('');
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (typeof dataUrl === 'string') {
        setImagePreview(dataUrl);
        handleInputChange('image', dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const provenanceArr = formData.provenanceHighlights
      ? formData.provenanceHighlights.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const ingredientsArr = formData.ingredients
      ? formData.ingredients.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const tagsArr = [formData.tag, 'Eggless'].filter(Boolean);

    const updated = {
      ...formData,
      price: Number(formData.price) || 0,
      provenanceHighlights: provenanceArr,
      ingredients: ingredientsArr,
      tags: tagsArr,
    };

    onSave(updated);
  };

  return (
    <div className="fixed inset-0 z-[220] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-[#091B3E] border-2 border-[#C5A059]/70 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden text-white my-auto max-h-[90vh] flex flex-col"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-[#071636] via-[#0C419C] to-[#071636] border-b border-[#C5A059]/30 flex items-center justify-between shrink-0">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#F3E5AB] font-bold">
              {isEditing ? 'QUARTERLY MENU ROTATION' : 'NEW SEASONAL DROP'}
            </span>
            <h3 className="font-heading text-lg sm:text-2xl font-bold text-white mt-0.5">
              {isEditing ? `Edit: ${product.name}` : 'Add New Cookie or Drop'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          
          {/* 1. Photo Management & Preview */}
          <div className="p-4 rounded-2xl bg-black/40 border border-[#C5A059]/30 space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#F3E5AB] font-bold block">
              Cookie Photography (1:1 Square Recommended)
            </span>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Thumbnail Preview */}
              <div className="relative w-28 h-28 rounded-2xl overflow-hidden border-2 border-[#C5A059]/60 shrink-0 bg-stone-900 shadow-md">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={() => setImagePreview('/images/real_hero_cookie.jpg')}
                />
                <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-mono text-[#F3E5AB]">
                  Preview
                </span>
              </div>

              {/* Upload & URL Controls */}
              <div className="flex-1 space-y-2.5 w-full">
                <div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-[#F3E5AB] via-[#C5A059] to-[#D4B86A] text-stone-950 font-bold uppercase tracking-wider font-mono text-[11px] hover:brightness-110 transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                  >
                    <span>📷 Upload Photo from Device</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  {uploadError && (
                    <p className="text-[10px] text-red-400 mt-1">{uploadError}</p>
                  )}
                </div>

                <div>
                  <label className="text-[10px] font-mono text-white/60 block mb-1">
                    Or Enter Image URL / Existing Asset Path:
                  </label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => {
                      handleInputChange('image', e.target.value);
                      setImagePreview(e.target.value);
                    }}
                    placeholder="/images/triple_chocolate.jpg"
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2. Basic Specs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-semibold text-white/90 block mb-1">
                Cookie Name <span className="text-[#F3E5AB]">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g. Matcha Raspberry Ganache"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white font-medium focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-white/90 block mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#071636] border border-white/15 text-white font-medium focus:outline-none focus:border-[#C5A059] cursor-pointer"
              >
                <option value="signature">Signature Cookies (Permanent Drops)</option>
                <option value="limited">Limited Drops (Seasonal 3-Month Edition)</option>
                <option value="cakes">Artisan Cakes</option>
                <option value="combos">Luxury Gift Sets & Keepsake Boxes</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-white/90 block mb-1">
                Price in INR (₹) <span className="text-[#F3E5AB]">*</span>
              </label>
              <input
                type="number"
                required
                min={0}
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                placeholder="299"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white font-mono font-bold focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-white/90 block mb-1">
                Weight & Scale
              </label>
              <input
                type="text"
                value={formData.weight}
                onChange={(e) => handleInputChange('weight', e.target.value)}
                placeholder="170g (6oz)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white font-mono focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-white/90 block mb-1">
                Drop Tag Badge
              </label>
              <select
                value={formData.tag}
                onChange={(e) => handleInputChange('tag', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#071636] border border-white/15 text-white font-medium focus:outline-none focus:border-[#C5A059] cursor-pointer"
              >
                <option value="Bestseller">Bestseller</option>
                <option value="Limited Edition">Limited Edition</option>
                <option value="New">New Drop</option>
                <option value="Rare">Rare</option>
                <option value="Chef Special">Chef Special</option>
                <option value="Classic">Classic</option>
                <option value="Luxury Gifting">Luxury Gifting</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-white/90 block mb-1">
                Servings Guidance
              </label>
              <input
                type="text"
                value={formData.serves}
                onChange={(e) => handleInputChange('serves', e.target.value)}
                placeholder="1-2"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white focus:outline-none focus:border-[#C5A059]"
              />
            </div>
          </div>

          {/* 3. Stock Availability Switch */}
          <div className="p-3.5 rounded-2xl bg-black/30 border border-white/10 flex items-center justify-between">
            <div>
              <span className="font-bold text-white block">Stock Availability</span>
              <span className="text-[10px] text-white/60">
                {formData.available ? 'Active & available for pre-orders' : 'Marked as Sold Out on the website'}
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.available}
                onChange={(e) => handleInputChange('available', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-stone-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {/* 4. Descriptions */}
          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-semibold text-white/90 block mb-1">
                Short Card Summary <span className="text-white/40 font-normal">(1 sentence shown on card)</span>
              </label>
              <input
                type="text"
                value={formData.shortDesc}
                onChange={(e) => handleInputChange('shortDesc', e.target.value)}
                placeholder="e.g. Deep cocoa crumb with a molten 54.5% couverture dark ganache core and sea salt."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-white/90 block mb-1">
                Full Sensory Tasting Description <span className="text-white/40 font-normal">(Shown in detail popover)</span>
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe the layers, molten center, aroma, and European butter..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white leading-relaxed focus:outline-none focus:border-[#C5A059]"
              />
            </div>
          </div>

          {/* 5. Ingredients & Provenance Highlights */}
          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-semibold text-white/90 block mb-1">
                Provenance Highlights <span className="text-white/40 font-normal">(Comma-separated key highlights)</span>
              </label>
              <input
                type="text"
                value={formData.provenanceHighlights}
                onChange={(e) => handleInputChange('provenanceHighlights', e.target.value)}
                placeholder="e.g. 54.5% Couverture Dark Ganache, Maldon Sea Salt Flakes"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-white/90 block mb-1">
                Ingredients List <span className="text-white/40 font-normal">(Comma-separated)</span>
              </label>
              <input
                type="text"
                value={formData.ingredients}
                onChange={(e) => handleInputChange('ingredients', e.target.value)}
                placeholder="e.g. Callebaut Dark Ganache, European Cultured Butter, Organic Flour, Demerara Sugar"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-[#C5A059]"
              />
            </div>
          </div>

          {/* Modal Actions Footer */}
          <div className="pt-4 border-t border-white/15 flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#F3E5AB] via-[#C5A059] to-[#D4B86A] text-stone-950 font-bold uppercase tracking-wider shadow-lg hover:brightness-110 transition-all cursor-pointer font-mono"
            >
              {isEditing ? 'Save Changes' : 'Create Drop'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
