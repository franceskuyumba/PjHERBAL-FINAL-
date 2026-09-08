'use client';
import { useState, useEffect } from 'react';
import { Upload, Image as ImageIcon, Save, CheckCircle2, RefreshCw } from 'lucide-react';

export default function AdminMediaManager() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const [homeAssets, setHomeAssets] = useState({
    heroBanner: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&auto=format&fit=crop',
    remediesCat: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150&auto=format&fit=crop',
  });

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : data.products || [];
        setProducts(list);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleProductImageChange = (index: number, newUrl: string) => {
    const updated = [...products];
    updated[index].imageUrl = newUrl;
    setProducts(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products, assets: homeAssets }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg('Database updated! All product photos and homepage images are live.');
      } else {
        setStatusMsg('Failed to save changes.');
      }
    } catch {
      setStatusMsg('Network error while saving.');
    } finally {
      setSaving(false);
      setTimeout(() => setStatusMsg(''), 4000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-slate-50 min-h-screen text-slate-800">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Media & Image Control</h1>
          <p className="text-sm text-slate-500">Manage homepage hero banners, category icons, and product images.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium px-5 py-2.5 rounded-xl shadow transition"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {statusMsg && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl flex items-center gap-2 text-sm font-medium">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" /> {statusMsg}
        </div>
      )}

      <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8">
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-blue-600" /> Homepage & Category Media
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Hero Banner Image URL</label>
            <input
              type="text"
              value={homeAssets.heroBanner}
              onChange={(e) => setHomeAssets({ ...homeAssets, heroBanner: e.target.value })}
              className="w-full text-xs p-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Herbal Remedies Category Icon</label>
            <input
              type="text"
              value={homeAssets.remediesCat}
              onChange={(e) => setHomeAssets({ ...homeAssets, remediesCat: e.target.value })}
              className="w-full text-xs p-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>
      </section>

      <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Upload className="w-5 h-5 text-blue-600" /> Product Photos Manager
        </h2>

        {loading ? (
          <div className="flex items-center gap-2 text-slate-500 text-sm py-4">
            <RefreshCw className="w-4 h-4 animate-spin text-blue-600" /> Loading products...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map((prod, idx) => (
              <div key={prod.id || idx} className="p-4 border border-slate-100 rounded-xl bg-slate-50/50 flex gap-4 items-center">
                <div className="w-16 h-16 bg-white border border-slate-200 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                  <img 
                    src={prod.imageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150&auto=format&fit=crop'} 
                    alt={prod.name} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">{prod.name}</p>
                  <input
                    type="text"
                    value={prod.imageUrl || ''}
                    onChange={(e) => handleProductImageChange(idx, e.target.value)}
                    placeholder="Paste Image URL here"
                    className="w-full mt-2 text-[11px] p-2 border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
