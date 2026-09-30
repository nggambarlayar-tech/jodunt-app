import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, Plus, Minus, Trash2, ArrowLeft, Printer, 
  MessageCircle, Store, CheckCircle2, ChevronRight, Settings, 
  Edit3, X, Image as ImageIcon, Check
} from 'lucide-react';

const DEFAULT_PRODUCTS = [
  // Kategori: Bomboloni
  { id: 1, name: 'Redvelvet Cream Cheese', category: 'Bomboloni', price: 18000, description: 'Bomboloni lembut dengan isian cream cheese yang melimpah dan balutan gula halus red velvet.', image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=600&auto=format&fit=crop' },
  { id: 2, name: 'Double Choco', category: 'Bomboloni', price: 16000, description: 'Adonan bomboloni empuk dengan isian lelehan coklat pekat yang lumer di mulut.', image: 'https://images.unsplash.com/photo-1626359556209-663806967da7?q=80&w=600&auto=format&fit=crop' },
  { id: 3, name: 'Cookies & Cream', category: 'Bomboloni', price: 17000, description: 'Isian krim vanilla manis dengan remahan biskuit hitam renyah.', image: 'https://images.unsplash.com/photo-1527515637-ed512d1b7027?q=80&w=600&auto=format&fit=crop' },
  { id: 4, name: 'Matcha', category: 'Bomboloni', price: 16000, description: 'Bomboloni dengan isian krim matcha Jepang premium yang wangi.', image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=600&auto=format&fit=crop' },
  { id: 5, name: 'Strawberry', category: 'Bomboloni', price: 15000, description: 'Selai strawberry segar buatan rumahan dengan taburan gula halus.', image: 'https://images.unsplash.com/photo-1570956556116-ea782635dd2e?q=80&w=600&auto=format&fit=crop' },
  { id: 6, name: 'Tiramisu', category: 'Bomboloni', price: 17000, description: 'Sensasi kopi espresso dan krim mascarpone di dalam donat Italia.', image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=600&auto=format&fit=crop' },
  
  // Kategori: Donat
  { id: 7, name: 'Donat Vanilla', category: 'Donat', price: 10000, description: 'Donat klasik dengan lapisan gula glaze vanilla yang manis dan mengkilap.', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=600&auto=format&fit=crop' },
  { id: 8, name: 'Donat Coklat', category: 'Donat', price: 12000, description: 'Donat bolong tengah dengan lelehan coklat dan taburan meses.', image: 'https://images.unsplash.com/photo-1612240498936-65f5101365d2?q=80&w=600&auto=format&fit=crop' },
  { id: 9, name: 'Donat Tiramisu', category: 'Donat', price: 13000, description: 'Donat empuk berlapis coklat putih rasa kopi dengan taburan bubuk kakao.', image: 'https://images.unsplash.com/photo-1582590214309-8837e42d3c94?q=80&w=600&auto=format&fit=crop' },
  { id: 10, name: 'Donat Matcha', category: 'Donat', price: 13000, description: 'Lapisan teh hijau matcha tebal dengan irisan kacang almond.', image: 'https://images.unsplash.com/photo-1621644788390-449e7b2ffbb4?q=80&w=600&auto=format&fit=crop' }
];

const ONGKIR = 12000;

const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
};

export default function App() {
  // Sync products with localStorage
  const [products, setProducts] = useState(() => {
    try {
      const savedProducts = localStorage.getItem('manisdonat_products');
      if (savedProducts) return JSON.parse(savedProducts);
    } catch (e) {
      console.error("Failed to parse local storage", e);
    }
    return DEFAULT_PRODUCTS;
  });

  useEffect(() => {
    localStorage.setItem('manisdonat_products', JSON.stringify(products));
  }, [products]);

  const [cart, setCart] = useState([]);
  const [currentView, setCurrentView] = useState('catalog'); // 'catalog', 'checkout', 'admin'
  const [receiptData, setReceiptData] = useState(null);

  const cartTotalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const grandTotal = cartSubtotal + (cartSubtotal > 0 ? ONGKIR : 0);

  // --- CART HANDLERS ---
  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  // --- CHECKOUT HANDLER ---
  const handleCheckoutSubmit = (formData) => {
    const orderData = {
      ...formData,
      cart: [...cart],
      subtotal: cartSubtotal,
      ongkir: ONGKIR,
      total: grandTotal,
      date: new Date().toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' }),
      orderId: 'MD-' + Math.floor(100000 + Math.random() * 900000)
    };
    setReceiptData(orderData);
    setCart([]); 
  };

  const closeReceipt = () => {
    setReceiptData(null);
    setCurrentView('catalog');
  };

  return (
    <div className="min-h-screen bg-[#faf5f0] text-slate-800 font-sans print:bg-white print:m-0">
      
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-amber-100 shadow-sm print:hidden">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setCurrentView('catalog')}
          >
            <div className="bg-[#fdf2f8] p-2 rounded-xl group-hover:bg-[#fce7f3] transition-colors">
              <Store className="w-6 h-6 text-pink-500" />
            </div>
            <h1 className="text-2xl font-extrabold text-[#78350f] tracking-tight">
              Manis<span className="text-pink-500">Donat</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('admin')}
              className={`p-2 flex items-center gap-2 rounded-xl transition-colors font-medium text-sm
                ${currentView === 'admin' ? 'bg-[#78350f] text-white' : 'text-[#78350f] hover:bg-amber-50 border border-amber-100'}`}
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Admin Menu</span>
            </button>

            {currentView !== 'admin' && (
              <button 
                onClick={() => setCurrentView('checkout')}
                className={`relative p-2 rounded-xl transition-colors flex items-center gap-2 px-4 font-semibold shadow-sm border
                  ${currentView === 'checkout' ? 'bg-pink-500 text-white border-pink-500' : 'bg-white text-pink-600 border-pink-200 hover:bg-pink-50'}`}
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="hidden sm:inline">Keranjang</span>
                {cartTotalQty > 0 && (
                  <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs w-6 h-6 flex items-center justify-center rounded-full border-2 border-white shadow-sm animate-in zoom-in">
                    {cartTotalQty}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-6xl mx-auto px-4 py-8 pb-32 print:hidden min-h-[calc(100vh-4rem)]">
        {currentView === 'catalog' && (
          <CatalogView products={products} onAdd={addToCart} />
        )}
        
        {currentView === 'checkout' && (
          <CheckoutView 
            cart={cart} 
            onBack={() => setCurrentView('catalog')}
            onUpdateQty={updateQuantity}
            onRemove={removeFromCart}
            subtotal={cartSubtotal}
            ongkir={ONGKIR}
            total={grandTotal}
            onSubmit={handleCheckoutSubmit}
          />
        )}

        {currentView === 'admin' && (
          <AdminView 
            products={products} 
            setProducts={setProducts}
            onBack={() => setCurrentView('catalog')} 
          />
        )}
      </main>

      {/* RECEIPT MODAL */}
      {receiptData && (
        <ReceiptModal data={receiptData} onClose={closeReceipt} />
      )}
    </div>
  );
}

function CatalogView({ products, onAdd }) {
  const [activeTab, setActiveTab] = useState('Bomboloni'); // 'Bomboloni' or 'Donat'

  const filteredProducts = products.filter(p => p.category === activeTab);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-3 mb-8 mt-4">
        <h2 className="text-4xl md:text-5xl font-extrabold text-[#78350f]">Ceria Setiap Gigitan! 🍩</h2>
        <p className="text-amber-800/80 max-w-lg mx-auto text-lg">
          Pilih varian manis favoritmu hari ini. Freshly baked every day!
        </p>
      </div>

      {/* TABS */}
      <div className="flex justify-center mb-8">
        <div className="bg-white p-1.5 rounded-full shadow-sm border border-amber-100 flex gap-2">
          {['Bomboloni', 'Donat'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-3 rounded-full font-bold text-sm transition-all duration-300
                ${activeTab === tab 
                  ? 'bg-pink-500 text-white shadow-md' 
                  : 'text-amber-800 hover:bg-pink-50'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* PRODUCT GRID */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 text-slate-500 bg-white rounded-3xl border border-dashed border-amber-200">
          Tidak ada menu di kategori {activeTab}. Silakan tambahkan menu di halaman Admin.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-amber-50 group flex flex-col hover:-translate-y-1">
              <div className="relative h-56 overflow-hidden bg-amber-50">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600' }}
                />
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-extrabold text-[#78350f] shadow-sm">
                  {formatRupiah(product.price)}
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-slate-800 mb-2">{product.name}</h3>
                <p className="text-sm text-slate-500 line-clamp-2 mb-6 flex-grow leading-relaxed">
                  {product.description}
                </p>
                
                <button 
                  onClick={() => onAdd(product)}
                  className="w-full py-3.5 bg-[#fdf2f8] hover:bg-pink-500 hover:text-white text-pink-600 font-bold rounded-2xl flex items-center justify-center gap-2 transition-all focus:ring-4 focus:ring-pink-100 outline-none"
                >
                  <Plus className="w-5 h-5" />
                  Tambah
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AdminView({ products, setProducts, onBack }) {
  const [formData, setFormData] = useState({
    id: null, name: '', category: 'Bomboloni', price: '', description: '', image: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  const resetForm = () => {
    setFormData({ id: null, name: '', category: 'Bomboloni', price: '', description: '', image: '' });
    setIsEditing(false);
  };

  const handleEdit = (product) => {
    setFormData(product);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if (window.confirm('Hapus menu ini?')) {
      setProducts(products.filter(p => p.id !== id));
      if (formData.id === id) resetForm();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      setProducts(products.map(p => p.id === formData.id ? { ...formData, price: Number(formData.price) } : p));
    } else {
      const newProduct = {
        ...formData,
        id: Date.now(), // Generate unique ID
        price: Number(formData.price)
      };
      setProducts([...products, newProduct]);
    }
    resetForm();
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-[#78350f] hover:text-amber-900 mb-6 font-medium bg-white px-4 py-2 rounded-xl shadow-sm w-max"
      >
        <ArrowLeft className="w-5 h-5" /> Kembali ke Katalog
      </button>

      <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-amber-100 mb-8">
        <h2 className="text-2xl font-bold text-[#78350f] mb-6 flex items-center gap-2">
          {isEditing ? <Edit3 className="text-pink-500" /> : <Plus className="text-pink-500" />}
          {isEditing ? 'Edit Menu' : 'Tambah Menu Baru'}
        </h2>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">Nama Menu</label>
            <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none" />
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">Kategori</label>
            <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none bg-white">
              <option value="Bomboloni">Bomboloni</option>
              <option value="Donat">Donat</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">Harga (Rp)</label>
            <input required type="number" min="0" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none" />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">URL Gambar</label>
            <div className="relative">
              <input required type="url" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} placeholder="https://..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none" />
              <ImageIcon className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
            </div>
          </div>

          <div className="md:col-span-2 space-y-1">
            <label className="text-sm font-semibold text-slate-700">Deskripsi Singkat</label>
            <textarea required rows="2" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none resize-none" />
          </div>

          <div className="md:col-span-2 flex gap-3 mt-2">
            <button type="submit" className="flex-1 bg-[#78350f] hover:bg-[#5c280b] text-white font-bold py-3.5 rounded-xl transition-colors shadow-sm flex justify-center items-center gap-2">
              <Check className="w-5 h-5" /> {isEditing ? 'Simpan Perubahan' : 'Tambah ke Menu'}
            </button>
            {isEditing && (
              <button type="button" onClick={resetForm} className="px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center">
                Batal
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-amber-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-amber-50/50">
          <h2 className="text-xl font-bold text-[#78350f]">Daftar Menu Saat Ini</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-100">
                <th className="p-4 font-semibold">Produk</th>
                <th className="p-4 font-semibold">Kategori</th>
                <th className="p-4 font-semibold">Harga</th>
                <th className="p-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <img src={p.image} alt="" className="w-12 h-12 rounded-lg object-cover bg-slate-100" />
                    <div>
                      <div className="font-bold text-slate-800">{p.name}</div>
                      <div className="text-xs text-slate-500 truncate max-w-[200px]">{p.description}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${p.category === 'Bomboloni' ? 'bg-amber-100 text-amber-800' : 'bg-pink-100 text-pink-700'}`}>
                      {p.category}
                    </span>
                  </td>
                  <td className="p-4 font-medium text-slate-700">{formatRupiah(p.price)}</td>
                  <td className="p-4 text-right space-x-2 whitespace-nowrap">
                    <button onClick={() => handleEdit(p)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit3 className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <div className="p-8 text-center text-slate-500">Menu kosong. Silakan tambahkan menu.</div>
          )}
        </div>
      </div>
    </div>
  );
}

function CheckoutView({ cart, onBack, onUpdateQty, onRemove, subtotal, ongkir, total, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '', phone: '', address: '', payment: 'Transfer Bank (BCA)'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cart.length === 0) return alert('Keranjang belanja kosong!');
    onSubmit(formData);
  };

  if (cart.length === 0) {
    return (
      <div className="text-center py-32 animate-in zoom-in-95">
        <div className="bg-white w-32 h-32 rounded-full shadow-sm border border-amber-100 flex items-center justify-center mx-auto mb-6">
          <ShoppingCart className="w-12 h-12 text-amber-300" />
        </div>
        <h2 className="text-3xl font-bold text-[#78350f] mb-3">Keranjang Masih Kosong</h2>
        <p className="text-slate-500 mb-8 text-lg">Yuk, pilih varian bomboloni atau donat manis favoritmu!</p>
        <button onClick={onBack} className="inline-flex items-center gap-2 bg-[#78350f] text-white px-8 py-4 rounded-full font-bold hover:bg-[#5c280b] transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
          <ArrowLeft className="w-5 h-5" /> Kembali Belanja
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button onClick={onBack} className="flex items-center gap-2 text-[#78350f] hover:text-amber-900 mb-6 font-medium bg-white px-4 py-2 rounded-xl shadow-sm w-max">
        <ArrowLeft className="w-5 h-5" /> Lanjut Belanja
      </button>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* FORM PENGIRIMAN */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-amber-100">
            <h2 className="text-2xl font-bold text-[#78350f] mb-8 flex items-center gap-3">
              <span className="bg-pink-100 text-pink-600 w-10 h-10 rounded-full flex items-center justify-center text-lg">1</span>
              Detail Pengiriman
            </h2>
            
            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama Pemesan</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Cth: Budi Santoso"
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition-all" />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nomor WhatsApp Aktif</label>
                <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="Cth: 08123456789"
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition-all" />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Alamat Pengiriman Lengkap</label>
                <textarea required rows="3" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="Nama jalan, Nomor rumah, RT/RW, Patokan..."
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition-all resize-none" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Metode Pembayaran</label>
                <div className="relative">
                  <select value={formData.payment} onChange={e => setFormData({...formData, payment: e.target.value})}
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition-all appearance-none bg-white font-medium">
                    <option value="Transfer Bank (BCA)">Transfer Bank (BCA)</option>
                    <option value="Transfer Bank (Mandiri)">Transfer Bank (Mandiri)</option>
                    <option value="GoPay / OVO / Dana">E-Wallet (GoPay / OVO / Dana)</option>
                    <option value="Cash on Delivery">Bayar di Tempat (COD)</option>
                  </select>
                  <ChevronRight className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 rotate-90 pointer-events-none" />
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* RINGKASAN ORDER */}
        <div className="lg:col-span-5">
          <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-amber-100 sticky top-24">
            <h2 className="text-xl font-bold text-[#78350f] mb-6 flex items-center gap-3">
              <span className="bg-pink-100 text-pink-600 w-10 h-10 rounded-full flex items-center justify-center text-lg">2</span>
              Ringkasan Pesanan
            </h2>
            
            <div className="space-y-4 mb-6 max-h-[45vh] overflow-y-auto pr-2 custom-scrollbar">
              {cart.map(item => (
                <div key={item.id} className="flex gap-4 p-3 bg-[#faf5f0] rounded-xl border border-amber-50">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg shadow-sm bg-white" />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-slate-800 leading-tight text-sm">{item.name}</h4>
                      <span className="text-xs bg-pink-100 text-pink-600 px-2 py-0.5 rounded mt-1 inline-block">{item.category}</span>
                    </div>
                    <div className="text-amber-700 font-bold text-sm mt-2">{formatRupiah(item.price)}</div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button type="button" onClick={() => onRemove(item.id)} className="text-slate-400 hover:text-red-500 transition-colors p-1">
                      <X className="w-4 h-4" />
                    </button>
                    <div className="flex items-center bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
                      <button type="button" onClick={() => onUpdateQty(item.id, -1)} className="p-1 hover:bg-slate-100 transition-colors"><Minus className="w-3.5 h-3.5 text-slate-600" /></button>
                      <span className="w-8 text-center text-sm font-bold text-slate-700">{item.quantity}</span>
                      <button type="button" onClick={() => onUpdateQty(item.id, 1)} className="p-1 hover:bg-slate-100 transition-colors"><Plus className="w-3.5 h-3.5 text-slate-600" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-6 border-t border-slate-100 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal ({cart.reduce((a,b)=>a+b.quantity,0)} item)</span>
                <span className="font-semibold text-slate-800">{formatRupiah(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Ongkos Kirim (Flat)</span>
                <span className="font-semibold text-slate-800">{formatRupiah(ongkir)}</span>
              </div>
              <div className="flex justify-between items-center pt-4 mt-2 border-t border-slate-100">
                <span className="font-extrabold text-slate-800 text-lg">Total Akhir</span>
                <span className="text-2xl font-black text-pink-600">{formatRupiah(total)}</span>
              </div>
            </div>

            <button 
              type="submit" form="checkout-form"
              className="w-full mt-8 bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-pink-500/30 text-lg flex justify-center items-center gap-2 hover:-translate-y-1"
            >
              <CheckCircle2 className="w-6 h-6" /> Pesan Sekarang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReceiptModal({ data, onClose }) {
  
  const generateWaLink = () => {
    let message = `Halo *ManisDonat*! 🍩\nSaya ingin memesan menu manis ini (Order ID: ${data.orderId}):\n\n`;
    
    message += `*Rincian Pesanan:*\n`;
    data.cart.forEach((item, index) => {
      message += `${index + 1}. ${item.name} (${item.quantity}x) - ${formatRupiah(item.price * item.quantity)}\n`;
    });
    
    message += `\nSubtotal: ${formatRupiah(data.subtotal)}`;
    message += `\nOngkir: ${formatRupiah(data.ongkir)}`;
    message += `\n*TOTAL BAYAR: ${formatRupiah(data.total)}*\n\n`;
    
    message += `*Data Pengiriman:*\n`;
    message += `Nama: ${data.name}\n`;
    message += `No WA: ${data.phone}\n`;
    message += `Pembayaran: ${data.payment}\n`;
    message += `Alamat: ${data.address}\n\n`;
    
    message += `Mohon konfirmasi pesanannya ya. Terima kasih! 🙏`;

    return `https://wa.me/?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm print:p-0 print:bg-white print:block">
      
      <div className="absolute inset-0 print:hidden" onClick={onClose}></div>

      <div className="relative bg-white w-full max-w-md mx-auto rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 print:shadow-none print:w-full print:max-w-none print:rounded-none">
        
        {/* Receipt Header */}
        <div className="bg-[#faf5f0] p-6 text-center border-b border-amber-100">
          <div className="flex justify-center mb-3">
            <div className="bg-white p-3 rounded-full shadow-sm">
              <Store className="w-8 h-8 text-pink-500" />
            </div>
          </div>
          <h2 className="text-2xl font-black text-[#78350f]">ManisDonat</h2>
          <p className="text-amber-700 text-sm mt-1 font-medium">Struk Pesanan Digital</p>
        </div>

        {/* Receipt Body */}
        <div className="p-6 md:p-8 bg-white">
          <div className="flex justify-between items-center text-sm text-slate-500 mb-6 pb-4 border-b border-dashed border-slate-300">
            <div>
              <p>{data.date.split(' ')[0]}</p>
              <p>{data.date.split(' ')[1] || ''}</p>
            </div>
            <div className="text-right">
              <p>Order ID:</p>
              <p className="font-mono font-bold text-slate-800">{data.orderId}</p>
            </div>
          </div>

          <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Pemesan</h3>
            <p className="font-bold text-slate-800">{data.name}</p>
            <p className="text-sm text-slate-600 font-medium">{data.phone}</p>
            <p className="text-sm text-slate-600 mt-1">{data.address}</p>
            <div className="inline-block px-2 py-1 bg-amber-100 text-amber-800 rounded text-xs font-bold mt-2">
              Bayar: {data.payment}
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-4">Item Pesanan</h3>
            {data.cart.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm items-start gap-4">
                <div className="flex-1">
                  <span className="font-bold text-slate-800">{item.name}</span>
                  <div className="text-slate-500 text-xs font-medium mt-0.5">{item.quantity} x {formatRupiah(item.price)}</div>
                </div>
                <div className="font-bold text-slate-800">
                  {formatRupiah(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2 pt-4 border-t border-dashed border-slate-300 text-sm">
            <div className="flex justify-between text-slate-500 font-medium">
              <span>Subtotal</span>
              <span>{formatRupiah(data.subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-500 font-medium">
              <span>Ongkos Kirim</span>
              <span>{formatRupiah(data.ongkir)}</span>
            </div>
            <div className="flex justify-between items-center pt-4 mt-4 border-t border-slate-200">
              <span className="font-black text-slate-800 text-lg">Total Bayar</span>
              <span className="font-black text-pink-600 text-2xl">{formatRupiah(data.total)}</span>
            </div>
          </div>
          
          <div className="mt-8 text-center text-xs text-slate-400 font-medium">
            Terima kasih telah berbelanja di ManisDonat!<br/>Struk ini adalah bukti pesanan yang sah.
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-slate-50 grid grid-cols-2 gap-3 border-t border-slate-100 print:hidden">
          <button 
            onClick={() => window.print()}
            className="flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-xl bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 transition-colors font-bold text-sm shadow-sm"
          >
            <Printer className="w-5 h-5" /> Cetak / PDF
          </button>
          <a 
            href={generateWaLink()}
            target="_blank"
            rel="noreferrer"
            className="flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-xl bg-[#25D366] hover:bg-[#128C7E] text-white transition-colors font-bold text-sm shadow-sm"
          >
            <MessageCircle className="w-5 h-5" /> Kirim ke WA
          </a>
          <button 
            onClick={onClose}
            className="col-span-2 py-3 rounded-xl text-slate-500 hover:bg-slate-200 transition-colors font-bold text-sm mt-1"
          >
            Tutup & Kembali
          </button>
        </div>

      </div>
    </div>
  );
}