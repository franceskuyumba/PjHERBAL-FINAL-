'use client';
import { useState, useEffect } from 'react';
import { Search, Camera, ShoppingBag, Star, Home, Heart, MessageSquare, User, Scan } from 'lucide-react';

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setProducts(data);
        else if (data.products && Array.isArray(data.products)) setProducts(data.products);
      })
      .catch(() => {});
  }, []);

  const defaultProducts = [
    { id: '1', name: 'Liver Cleanse Detox and Repair', category: 'Supplements', price: 'TSh 35,000', rating: '4.8 (2.2k)', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop' },
    { id: '2', name: 'Natural Immunity Booster', category: 'Herbal Remedies', price: 'TSh 28,000', rating: '4.9 (1.5k)', image: 'https://images.unsplash.com/photo-1577401239170-897942555fb3?w=300&auto=format&fit=crop' }
  ];

  const displayProducts = products.length > 0 ? products : defaultProducts;

  const handleWhatsAppOrder = (productName: string) => {
    const text = encodeURIComponent(`Hello PJHERBAL Clinic, I would like to order: ${productName}`);
    window.open(`https://wa.me/255000000000?text=${text}`, '_blank');
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen pb-24 font-sans text-slate-800 shadow-sm">
      
      {/* Search Header */}
      <header className="p-4 flex items-center gap-2">
        <button className="p-2.5 rounded-full bg-slate-100 text-slate-600">
          <Scan className="w-5 h-5" />
        </button>
        <div className="flex-1 relative flex items-center">
          <Search className="w-5 h-5 absolute left-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search herbal remedies..."
            className="w-full bg-slate-100 rounded-full py-2.5 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
          <Camera className="w-5 h-5 absolute right-3 text-slate-400 cursor-pointer" />
        </div>
        <button className="p-2.5 rounded-full bg-slate-100 text-slate-600 relative">
          <ShoppingBag className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
            0
          </span>
        </button>
      </header>

      {/* Hero Banner */}
      <section className="px-4 my-2">
        <div className="bg-emerald-700 text-white rounded-3xl p-5 relative overflow-hidden flex items-center justify-between shadow-md">
          <div className="z-10 max-w-[60%]">
            <h2 className="text-2xl font-bold leading-tight">15% OFF</h2>
            <p className="text-xs text-white/90 mt-1">Herbal Wellness at Your Doorstep</p>
            <button className="mt-4 bg-white text-emerald-700 text-xs font-bold px-4 py-2 rounded-full shadow hover:bg-slate-100 transition">
              Shop Now
            </button>
          </div>
          <div className="w-24 h-24 relative z-10 flex items-center justify-center overflow-hidden rounded-2xl bg-white/20">
            <img 
              src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&auto=format&fit=crop" 
              alt="PJHERBAL Banner" 
              className="object-cover w-full h-full" 
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mt-6">
        <div className="flex justify-between items-center px-4 mb-3">
          <h3 className="font-bold text-slate-900 text-base">Categories</h3>
          <button className="text-xs font-semibold text-emerald-600">See All</button>
        </div>
        <div className="flex gap-4 overflow-x-auto px-4 no-scrollbar scroll-smooth">
          {[
            { name: 'Herbal Remedies', img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150&auto=format&fit=crop' },
            { name: 'Supplements', img: 'https://images.unsplash.com/photo-1577401239170-897942555fb3?w=150&auto=format&fit=crop' },
            { name: 'Detox Tea', img: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=150&auto=format&fit=crop' },
            { name: 'Personal Care', img: 'https://images.unsplash.com/photo-1608248597263-0057e43a4522?w=150&auto=format&fit=crop' },
          ].map((cat, idx) => (
            <div key={idx} className="flex flex-col items-center min-w-[72px]">
              <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center border border-slate-200 overflow-hidden">
                <img src={cat.img} alt={cat.name} className="object-cover w-full h-full" />
              </div>
              <span className="text-[11px] text-center mt-2 font-medium text-slate-700 leading-tight">
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Bestseller Products */}
      <section className="mt-6 px-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-slate-900 text-base">Bestseller Products</h3>
          <button className="text-xs font-semibold text-emerald-600">See All</button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {displayProducts.map((prod: any) => (
            <div
              key={prod.id || prod.name}
              onClick={() => handleWhatsAppOrder(prod.name)}
              className="bg-slate-50/80 rounded-2xl p-3 border border-slate-100 flex flex-col justify-between cursor-pointer hover:shadow-sm transition"
            >
              <div className="w-full h-32 relative bg-white rounded-xl p-2 mb-2 flex items-center justify-center overflow-hidden">
                <img 
                  src={prod.imageUrl || prod.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop'} 
                  alt={prod.name} 
                  className="max-h-full object-contain" 
                />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-slate-800 line-clamp-2 leading-tight">
                  {prod.name}
                </h4>
                <p className="text-[10px] text-slate-400 mt-1">{prod.category?.name || prod.category || 'Herbal Product'}</p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1 text-[10px] text-slate-500">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{prod.rating || '4.8'}</span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600">
                    {prod.price ? (typeof prod.price === 'number' ? `TSh ${prod.price.toLocaleString()}` : prod.price) : 'Contact'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-slate-100 px-6 py-2 flex justify-between items-center text-slate-400 z-50">
        <button className="flex flex-col items-center text-emerald-600 gap-0.5">
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium">Home</span>
        </button>
        <button className="flex flex-col items-center gap-0.5 hover:text-slate-600">
          <ShoppingBag className="w-5 h-5" />
          <span className="text-[10px] font-medium">Cart</span>
        </button>
        <button className="flex flex-col items-center gap-0.5 hover:text-slate-600">
          <Heart className="w-5 h-5" />
          <span className="text-[10px] font-medium">Wishlist</span>
        </button>
        <button className="flex flex-col items-center gap-0.5 hover:text-slate-600">
          <MessageSquare className="w-5 h-5" />
          <span className="text-[10px] font-medium">Chat</span>
        </button>
        <button className="flex flex-col items-center gap-0.5 hover:text-slate-600">
          <User className="w-5 h-5" />
          <span className="text-[10px] font-medium">Profile</span>
        </button>
      </nav>

    </div>
  );
}
