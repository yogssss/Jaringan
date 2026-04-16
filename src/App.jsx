import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, ShoppingCart, Menu, X, 
  MapPin, Phone, Mail, Truck, 
  ChevronRight, Loader2 
} from 'lucide-react';

// --- CUSTOM ICONS UNTUK SOSIAL MEDIA ---
const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

// Utilitas Format Rupiah
const formatRp = (angka) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
};

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // State untuk Data dari Google Sheets
  const [productsData, setProductsData] = useState([]);
  const [categories, setCategories] = useState(["Semua"]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Link API SheetDB Anda
  const API_URL = 'https://sheetdb.io/api/v1/qtawe3p6j07dk';

  // Mengambil data dari API saat website pertama kali dimuat
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error('Gagal mengambil data dari server');
        }
        const data = await response.json();
        
        // Membersihkan dan memformat data dari Google Sheets
        const formattedData = data.map(item => ({
          id: item.id,
          name: item.name,
          category: item.category,
          price: parseInt(item.price, 10) || 0, 
          desc: item.desc,
          image: item.image
        }));

        setProductsData(formattedData);

        // Membuat daftar kategori otomatis
        const uniqueCategories = ["Semua", ...new Set(formattedData.map(item => item.category).filter(Boolean))];
        setCategories(uniqueCategories);
        
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setError("Gagal memuat produk. Pastikan link API benar dan tidak ada gangguan internet.");
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Komponen Navigasi
  const navigateTo = (page) => {
    setActivePage(page);
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 flex flex-col">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 30s linear infinite;
        }
        .marquee-container:hover .animate-marquee {
          animation-play-state: paused;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* NAVBAR */}
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => navigateTo('home')}>
              <ShoppingCart className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900 tracking-tight">KawanBelanja</span>
            </div>

            <div className="hidden md:flex space-x-8">
              <button onClick={() => navigateTo('home')} className={`text-sm font-medium transition-colors ${activePage === 'home' ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}>Beranda</button>
              <button onClick={() => navigateTo('products')} className={`text-sm font-medium transition-colors ${activePage === 'products' ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}>Produk</button>
              <button onClick={() => navigateTo('contact')} className={`text-sm font-medium transition-colors ${activePage === 'contact' ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}>Kontak</button>
            </div>

            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-600 hover:text-gray-900 focus:outline-none">
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <button onClick={() => navigateTo('home')} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50">Beranda</button>
              <button onClick={() => navigateTo('products')} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50">Produk</button>
              <button onClick={() => navigateTo('contact')} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50">Kontak</button>
            </div>
          </div>
        )}
      </nav>

      {/* KONTEN UTAMA */}
      <main className="flex-grow">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mb-4" />
            <p className="text-gray-500 font-medium animate-pulse">Menyiapkan katalog produk terbaik untukmu...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
            <div className="bg-red-50 text-red-600 p-4 rounded-xl max-w-lg border border-red-100">
              <h3 className="font-bold text-lg mb-2">Mohon Maaf</h3>
              <p>{error}</p>
              <button onClick={() => window.location.reload()} className="mt-4 bg-red-100 text-red-700 px-4 py-2 rounded-lg font-medium hover:bg-red-200 transition-colors">
                Coba Muat Ulang
              </button>
            </div>
          </div>
        ) : (
          <>
            {activePage === 'home' && <LandingPage navigateTo={navigateTo} productsData={productsData} />}
            {activePage === 'products' && <ProductsPage productsData={productsData} categories={categories} />}
            {activePage === 'contact' && <ContactPage />}
          </>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white mt-auto">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-bold flex items-center justify-center md:justify-start">
              <ShoppingCart className="h-5 w-5 mr-2" /> KawanBelanja
            </h3>
            <p className="text-gray-400 text-sm mt-1">Gaya masa kini, belanja tanpa henti.</p>
          </div>
          <div className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} KawanBelanja. Seluruh hak cipta dilindungi.
          </div>
        </div>
      </footer>
    </div>
  );
}

function LandingPage({ navigateTo, productsData }) {
  const marqueeProducts = productsData.slice(0, 7);
  const displayMarquee = marqueeProducts.length > 0 ? [...marqueeProducts, ...marqueeProducts, ...marqueeProducts] : [];

  return (
    <div className="flex flex-col w-full">
      <section className="relative w-full h-[60vh] min-h-[400px] bg-gray-900">
        <img 
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1600" 
          alt="Banner Toko" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-4 drop-shadow-md">
            Gaya Hidup <span className="text-indigo-400">Modern</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl drop-shadow">
            Temukan koleksi pakaian, sepatu, dan aksesoris terbaik untuk melengkapi aktivitas harianmu dengan percaya diri.
          </p>
          <button 
            onClick={() => navigateTo('products')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full font-medium transition-transform transform hover:scale-105 flex items-center shadow-lg"
          >
            Mulai Belanja <ChevronRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Siapa Kami?</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            KawanBelanja hadir untuk kamu yang dinamis dan aktif. Berdiri sejak tahun 2021, kami mengurasi berbagai produk dari kategori <i>fashion</i> hingga elektronik ringan dengan mengutamakan kualitas, desain kekinian, serta harga yang bersahabat. Kami percaya bahwa gaya yang bagus tidak harus mahal, dan belanja online haruslah menyenangkan serta bebas hambatan.
          </p>
        </div>
      </section>

      <section className="py-12 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center md:text-left flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Pilihan Teratas Minggu Ini</h2>
            <p className="text-gray-500 mt-1">Produk favorit yang sering dicari pelanggan kami.</p>
          </div>
          <button onClick={() => navigateTo('products')} className="hidden md:inline-flex text-indigo-600 hover:text-indigo-800 font-medium items-center">
            Lihat Semua <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
        
        {marqueeProducts.length > 0 ? (
          <div className="marquee-container w-full overflow-hidden relative">
            <div className="animate-marquee flex gap-6 px-4">
              {displayMarquee.map((product, index) => (
                <div key={`${product.id}-${index}`} className="w-64 flex-none bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group cursor-pointer" onClick={() => navigateTo('products')}>
                  <div className="h-48 overflow-hidden relative bg-gray-100 flex items-center justify-center">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/400x400?text=Gambar+Rusak"; }} />
                    ) : (
                       <span className="text-gray-400 text-sm">Tidak ada gambar</span>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-indigo-600 font-semibold mb-1">{product.category}</p>
                    <h3 className="text-gray-800 font-medium truncate">{product.name}</h3>
                    <p className="text-gray-900 font-bold mt-2">{formatRp(product.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">Belum ada produk yang ditambahkan.</div>
        )}
        
        <div className="text-center mt-6 md:hidden">
            <button onClick={() => navigateTo('products')} className="text-indigo-600 font-medium inline-flex items-center">
              Lihat Semua Produk <ChevronRight className="h-4 w-4 ml-1" />
            </button>
        </div>
      </section>

      <section className="py-16 bg-white px-4 sm:px-6 lg:px-8 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center p-6 rounded-2xl bg-gray-50 hover:bg-indigo-50 transition-colors cursor-pointer" onClick={() => navigateTo('contact')}>
              <div className="bg-indigo-100 p-4 rounded-full mb-4 text-indigo-600">
                <Phone className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">WhatsApp</h3>
              <p className="text-gray-600">+62 812 3456 7890</p>
            </div>
            <div className="flex flex-col items-center p-6 rounded-2xl bg-gray-50 hover:bg-indigo-50 transition-colors cursor-pointer" onClick={() => navigateTo('contact')}>
              <div className="bg-indigo-100 p-4 rounded-full mb-4 text-indigo-600">
                <Mail className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600">halo@kawanbelanja.com</p>
            </div>
            <div className="flex flex-col items-center p-6 rounded-2xl bg-gray-50 hover:bg-indigo-50 transition-colors cursor-pointer" onClick={() => navigateTo('contact')}>
              <div className="bg-indigo-100 p-4 rounded-full mb-4 text-indigo-600">
                <MapPin className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Alamat</h3>
              <p className="text-gray-600">Tangerang, Banten, Indonesia</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ProductsPage({ productsData, categories }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const filteredProducts = useMemo(() => {
    return productsData.filter(product => {
      const cat = product.category || "";
      const name = product.name || "";
      const desc = product.desc || "";

      const matchCategory = selectedCategory === "Semua" || cat === selectedCategory;
      const matchSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          desc.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [searchQuery, selectedCategory, productsData]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Katalog Produk</h1>
          <p className="text-gray-500 mt-1">Temukan barang impianmu di sini.</p>
        </div>
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Cari kata kunci produk..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Kategori</h2>
            <ul className="hidden md:flex flex-col space-y-2">
              {categories.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === cat 
                        ? 'bg-indigo-50 text-indigo-700 font-medium' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
            
            <div className="md:hidden flex overflow-x-auto hide-scrollbar gap-2 pb-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex-none px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                    selectedCategory === cat 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div className="flex-grow">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">Produk tidak ditemukan</h3>
              <p className="text-gray-500">Coba gunakan kata kunci atau kategori lain.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div 
                  key={product.id} 
                  onClick={() => setSelectedProduct(product)}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 overflow-hidden cursor-pointer transition-all hover:-translate-y-1 group flex flex-col"
                >
                  <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-100 flex items-center justify-center">
                    {product.image ? (
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-64 object-cover object-center group-hover:opacity-90 transition-opacity" 
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/400x400?text=Gambar+Rusak"; }}
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">Tidak ada gambar</span>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <span className="text-xs font-semibold text-indigo-600 tracking-wide uppercase mb-1">{product.category}</span>
                    <h3 className="text-base font-bold text-gray-900 mb-2 leading-tight line-clamp-2">{product.name}</h3>
                    <div className="mt-auto">
                      <p className="text-lg font-extrabold text-gray-900">{formatRp(product.price)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity backdrop-blur-sm" 
              aria-hidden="true"
              onClick={() => setSelectedProduct(null)}
            ></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full relative">
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 bg-white/50 backdrop-blur-md p-2 rounded-full text-gray-600 hover:bg-gray-100 z-10"
              >
                <X className="h-5 w-5" />
              </button>
              
              <div className="flex flex-col sm:flex-row">
                <div className="w-full sm:w-1/2 h-64 sm:h-auto bg-gray-100 flex items-center justify-center">
                   {selectedProduct.image ? (
                      <img 
                        src={selectedProduct.image} 
                        alt={selectedProduct.name} 
                        className="w-full h-full object-cover" 
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/400x400?text=Gambar+Rusak"; }}
                      />
                    ) : (
                      <span className="text-gray-400">Tidak ada gambar</span>
                    )}
                </div>
                <div className="w-full sm:w-1/2 p-6 sm:p-8 flex flex-col">
                  <span className="text-xs font-bold text-indigo-600 tracking-wider uppercase mb-2">{selectedProduct.category}</span>
                  <h3 className="text-2xl font-bold text-gray-900 leading-tight mb-2" id="modal-title">
                    {selectedProduct.name}
                  </h3>
                  <p className="text-2xl font-extrabold text-gray-900 mb-6">
                    {formatRp(selectedProduct.price)}
                  </p>
                  
                  <div className="mb-8 flex-grow">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Deskripsi Produk</h4>
                    <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                      {selectedProduct.desc}
                    </p>
                  </div>
                  
                  <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-colors flex justify-center items-center gap-2">
                    <ShoppingCart className="h-5 w-5" /> Beli Sekarang
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ContactPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Hubungi Kami</h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Punya pertanyaan seputar produk atau pesanan Anda? Tim kami siap membantu Anda kapan saja.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Informasi Perusahaan</h2>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-indigo-50 p-3 rounded-full text-indigo-600">
                <MapPin className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Alamat Kantor Pusat</h3>
                <p className="mt-1 text-gray-600">
                  Gedung KawanBelanja Lt. 3<br />
                  Jl. Pahlawan Seribu No. 45<br />
                  BSD City, Tangerang, Banten 15322<br />
                  Indonesia
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 bg-indigo-50 p-3 rounded-full text-indigo-600">
                <Phone className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">WhatsApp Pelanggan</h3>
                <p className="mt-1 text-gray-600 font-medium">+62 812 3456 7890</p>
                <p className="text-sm text-gray-500">(Senin - Jumat, 09.00 - 18.00 WIB)</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 bg-indigo-50 p-3 rounded-full text-indigo-600">
                <Mail className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Email</h3>
                <p className="mt-1 text-gray-600">halo@kawanbelanja.com</p>
                <p className="mt-1 text-gray-600">support@kawanbelanja.com</p>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-gray-100">
            <h3 className="text-base font-medium text-gray-900 mb-4">Ikuti Sosial Media Kami</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">
                <InstagramIcon />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">
                <FacebookIcon />
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-8">
          <div className="bg-gradient-to-br from-[#EE4D2D] to-[#FF7337] p-8 rounded-3xl shadow-lg text-white relative overflow-hidden">
            <div className="absolute -right-6 -top-6 opacity-20">
              <Truck className="h-48 w-48" />
            </div>
            
            <div className="relative z-10">
              <div className="bg-white inline-block px-4 py-1 rounded-full mb-6 shadow-sm">
                <span className="text-[#EE4D2D] font-extrabold text-xl tracking-tighter italic">SPX</span>
                <span className="text-gray-800 font-bold ml-1 text-sm">Express</span>
              </div>
              
              <h2 className="text-2xl font-bold mb-3">Mitra Pengiriman Resmi</h2>
              <p className="text-white/90 text-lg leading-relaxed mb-6">
                Kami bangga bekerjasama secara eksklusif dengan <strong>SPX Express</strong> untuk memastikan semua barang belanjaan Anda sampai ke tangan dengan aman, cepat, dan terpercaya di seluruh penjuru Indonesia.
              </p>
              
              <ul className="space-y-3">
                <li className="flex items-center">
                  <div className="bg-white/20 p-1 rounded-full mr-3"><CheckIcon /></div>
                  Lacak paket secara real-time
                </li>
                <li className="flex items-center">
                  <div className="bg-white/20 p-1 rounded-full mr-3"><CheckIcon /></div>
                  Jaminan asuransi pengiriman
                </li>
                <li className="flex items-center">
                  <div className="bg-white/20 p-1 rounded-full mr-3"><CheckIcon /></div>
                  Dukungan pengiriman ke pelosok negeri
                </li>
              </ul>
            </div>
          </div>

          <div className="flex-grow rounded-3xl overflow-hidden shadow-sm relative">
             <img 
              src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=800" 
              alt="Tim Layanan Pelanggan" 
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>

      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
  );
}