import logo from "./assets/logo.png";
import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Search, Menu, ArrowRight, Play, Star, X, Check, ChevronRight, Maximize2, Plus } from 'lucide-react';

// --- MOCK DATA & ASSETS ---
const HERO_SHOES = [
  {
    id: 'phantom',
    name: "Air Max Dn",
    colorName: "Phantom White",
    price: 160,
    theme: "bg-[#EAEAEA]",
    textTheme: "text-black",
    img: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&q=80&w=1200", 
    glow: "rgba(255,255,255,0.8)"
  },
  {
    id: 'volt',
    name: "Air Max Dn",
    colorName: "Volt Green",
    price: 160,
    theme: "bg-[#D4FF00]",
    textTheme: "text-black",
    img: "https://images.unsplash.com/photo-1579338908476-3a3a1d71a706?auto=format&fit=crop&q=80&w=1200", 
    glow: "rgba(212, 255, 0, 0.6)"
  },
  {
    id: 'obsidian',
    name: "Air Max Dn",
    colorName: "Obsidian Black",
    price: 160,
    theme: "bg-[#111111]",
    textTheme: "text-white",
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1200", 
    glow: "rgba(255, 50, 50, 0.4)"
  }
];

const SIZES = [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12];

const ALL_PRODUCTS = [
  { id: 101, name: "Nike Dunk Low", price: 115, category: "Men", type: "Lifestyle", img: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=800" },
  { id: 102, name: "Nike Invincible 3", price: 180, category: "Men", type: "Running", img: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&q=80&w=800" },
  { id: 103, name: "Air Force 1 '07", price: 115, category: "Women", type: "Lifestyle", img: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=800" },
  { id: 104, name: "ZoomX Vaporfly", price: 250, category: "Women", type: "Race Day", img: "https://images.unsplash.com/photo-1588099768523-f4e6a5679d88?auto=format&fit=crop&q=80&w=800" },
  { id: 105, name: "Air Max 270 Kids", price: 100, category: "Kids", type: "Lifestyle", img: "https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&q=80&w=800" },
  { id: 106, name: "Pegasus 40", price: 95, category: "Sale", type: "Running", img: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&q=80&w=800", oldPrice: 130 },
  { id: 107, name: "Blazer Mid '77", price: 105, category: "Men", type: "Classic", img: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&q=80&w=800" },
  { id: 108, name: "Nike Cortez", price: 90, category: "Women", type: "Classic", img: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=800" },
];

// --- CUSTOM STYLES ---
const styles = `
  @keyframes slideUpFade {
    0% { opacity: 0; transform: translateY(40px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  .animate-slide-up { animation: slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
  
  @keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  .animate-marquee { display: flex; width: 200%; animation: marquee 25s linear infinite; }
  
  .text-outline { -webkit-text-stroke: 1px rgba(0,0,0,0.1); color: transparent; }
  .text-outline-light { -webkit-text-stroke: 1px rgba(255,255,255,0.2); color: transparent; }
  
  .hide-scrollbar::-webkit-scrollbar { display: none; }
  .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  
  .glass-nav { backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); }
  .glass-modal { backdrop-filter: blur(30px); -webkit-backdrop-filter: blur(30px); background: rgba(255,255,255,0.85); }

  /* Premium Shoe Glare Effect */
  .shoe-glare {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    border-radius: inherit;
    pointer-events: none;
    z-index: 20;
    mix-blend-mode: overlay;
    opacity: 0.4;
    transition: background 0.1s ease;
  }
  
  /* Smooth floating animation for hero */
  @keyframes float {
    0% { transform: translateY(0px) rotate(-15deg); }
    50% { transform: translateY(-15px) rotate(-14deg); }
    100% { transform: translateY(0px) rotate(-15deg); }
  }
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
`;

// --- REUSABLE REVEAL COMPONENT ---
const Reveal = ({ children, className = "", delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsVisible(true);
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={ref} 
      className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// --- MAIN APPLICATION ---
export default function App() {
  const [loading, setLoading] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [cursorType, setCursorType] = useState('default'); 
  const [scrolled, setScrolled] = useState(false);
  const [scrollDir, setScrollDir] = useState('up');
  
  // E-commerce State
  const [activeShoeIdx, setActiveShoeIdx] = useState(0);
  const [selectedHeroSize, setSelectedHeroSize] = useState(9);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  
  // Filtering & Modal State
  const [activeCategory, setActiveCategory] = useState('All');
  const [quickViewItem, setQuickViewItem] = useState(null);
  const [quickViewSize, setQuickViewSize] = useState(9);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const activeShoe = HERO_SHOES[activeShoeIdx];

  // Derived filtered products
  const filteredProducts = activeCategory === 'All' 
    ? ALL_PRODUCTS.slice(0, 4) 
    : ALL_PRODUCTS.filter(p => p.category === activeCategory);

  // --- INITIALIZATION & EVENT LISTENERS ---
  useEffect(() => {
    setTimeout(() => setLoading(false), 2400);

    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      if (window.scrollY > lastScrollY) setScrollDir('down');
      else setScrollDir('up');
      lastScrollY = window.scrollY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // --- INTERACTIVE LOGIC ---
  const addToCart = (product, size) => {
    const newItem = {
      id: `${product.id}-${size}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      color: product.colorName || "Standard",
      price: product.price,
      size: size,
      img: product.img,
      quantity: 1
    };
    setCart(prev => [...prev, newItem]);
    if (quickViewItem) setQuickViewItem(null); // Close modal if open
    setIsCartOpen(true);
    showToast(`Added ${product.name} to your bag.`);
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const simulateCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setCart([]);
      setIsCheckingOut(false);
      setIsCartOpen(false);
      showToast("Payment successful! Order confirmed.");
    }, 2000);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const showToast = (msg) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const handleNavClick = (category) => {
    setActiveCategory(category);
    const shopSection = document.getElementById('shop-section');
    if (shopSection) {
      shopSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Calculate dynamic glare based on mouse position
  const getGlareStyle = () => {
    const x = (mousePos.x / window.innerWidth) * 100;
    const y = (mousePos.y / window.innerHeight) * 100;
    return {
      background: `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.8) 0%, transparent 40%)`
    };
  };

  // --- LOADING SCREEN ---
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
        <svg viewBox="0 0 73 26" className="w-32 md:w-48 text-white fill-current animate-pulse mb-8">
          <path d="M21.5 25.4c-6.2 0-11.6-1.9-15.7-5.5C2.1 16.6.1 12.4.1 7.4.1 4.5 1.2 1.8 3.3.1c-.2.7-.3 1.4-.3 2.2 0 4.1 2.8 8.1 7.8 11.2 3.6 2.2 8.3 3.8 13.5 4.5 4.8.6 9.8.5 14.8-.2 6-.8 11.8-2.3 17.1-4.4 5.3-2.1 10.1-4.7 14.3-7.7L73 0C56.6 9.3 39.8 17.5 22.8 25.1c-.4.1-.9.2-1.3.3z"/>
        </svg>
        <div className="w-48 h-[2px] bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-white origin-left animate-[scaleX_2.4s_cubic-bezier(0.87,0,0.13,1)]" style={{ animationName: 'scaleX', animationFillMode: 'forwards' }}></div>
        </div>
        <style>{`@keyframes scaleX { 0% { transform: scaleX(0); } 100% { transform: scaleX(1); } }`}</style>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen text-black font-sans selection:bg-black selection:text-white overflow-x-hidden relative">
      <style>{styles}</style>

      {/* --- CUSTOM CURSOR --- */}
      <div 
        className={`hidden lg:flex fixed top-0 left-0 pointer-events-none z-[100] transition-all duration-300 ease-out items-center justify-center mix-blend-difference`}
        style={{ 
          transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0) translate(-50%, -50%)`,
          width: cursorType === 'hover' ? '60px' : cursorType === 'view' ? '80px' : '20px',
          height: cursorType === 'hover' ? '60px' : cursorType === 'view' ? '80px' : '20px',
          backgroundColor: cursorType === 'default' ? 'white' : 'transparent',
          border: cursorType === 'default' ? 'none' : '2px solid white',
          borderRadius: '50%',
          opacity: (isCartOpen || quickViewItem) ? 0 : 1
        }}
      >
        {cursorType === 'view' && <span className="text-white text-[10px] font-bold tracking-widest uppercase mix-blend-normal">View</span>}
      </div>

      {/* --- TOAST NOTIFICATIONS --- */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] flex flex-col gap-2 pointer-events-none">
        {toasts.map(toast => (
          <div key={toast.id} className="bg-black text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 animate-[slideUpFade_0.3s_ease-out]">
            <div className="w-6 h-6 bg-[#D4FF00] rounded-full flex items-center justify-center">
              <Check size={14} className="text-black stroke-[3]" />
            </div>
            <p className="text-sm font-bold tracking-wide">{toast.msg}</p>
          </div>
        ))}
      </div>

      {/* --- QUICK VIEW MODAL --- */}
      <div className={`fixed inset-0 bg-black/50 z-[70] transition-opacity duration-500 flex items-center justify-center p-4 md:p-12 ${quickViewItem ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setQuickViewItem(null)}>
        {quickViewItem && (
          <div 
            className="glass-modal w-full max-w-4xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row transform transition-transform duration-500"
            onClick={e => e.stopPropagation()}
            style={{ transform: quickViewItem ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(20px)' }}
          >
            <div className="w-full md:w-1/2 bg-[#F5F5F7] relative flex items-center justify-center p-12">
              <button className="absolute top-6 left-6 md:hidden p-2 bg-white rounded-full shadow-sm" onClick={() => setQuickViewItem(null)}>
                <X size={20} />
              </button>
              <img src={quickViewItem.img} alt={quickViewItem.name} className="w-full object-contain mix-blend-multiply drop-shadow-2xl" />
            </div>
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white relative">
              <button className="hidden md:block absolute top-6 right-6 p-2 hover:bg-zinc-100 rounded-full transition-colors" onClick={() => setQuickViewItem(null)}>
                <X size={24} />
              </button>
              <span className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-2">{quickViewItem.type}</span>
              <h2 className="text-4xl font-black tracking-tight mb-4">{quickViewItem.name}</h2>
              <div className="flex items-center gap-4 mb-8">
                <span className="text-2xl font-bold">${quickViewItem.price}</span>
                {quickViewItem.oldPrice && <span className="text-lg text-zinc-400 line-through">${quickViewItem.oldPrice}</span>}
              </div>
              
              <div className="mb-8">
                <div className="flex justify-between items-end mb-4">
                  <span className="font-bold text-sm uppercase tracking-wider">Select Size</span>
                  <button className="text-xs font-medium opacity-60 underline hover:opacity-100" onClick={() => showToast("Size guide modal triggered")}>Size Guide</button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {SIZES.slice(0,8).map(size => (
                    <button 
                      key={size} onClick={() => setQuickViewSize(size)}
                      className={`py-3 text-sm font-bold rounded-xl transition-all border ${quickViewSize === size ? 'bg-black text-white border-black' : 'border-zinc-200 hover:border-black bg-white'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              
              <button 
                onClick={() => addToCart(quickViewItem, quickViewSize)}
                className="w-full bg-black text-white py-5 rounded-full font-black uppercase tracking-widest text-sm hover:bg-[#D4FF00] hover:text-black transition-colors duration-300"
              >
                Add to Bag
              </button>
            </div>
          </div>
        )}
      </div>

      {/* --- CART DRAWER --- */}
      <div className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity duration-500 ${isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsCartOpen(false)}>
        <div 
          className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
          onClick={e => e.stopPropagation()}
        >
          <div className="p-6 flex justify-between items-center border-b border-zinc-100">
            <h2 className="text-2xl font-black tracking-tight">Your Bag ({cart.length})</h2>
            <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-zinc-100 rounded-full transition-colors"><X size={24} /></button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-zinc-400 space-y-4">
                <ShoppingBag size={48} strokeWidth={1} />
                <p className="font-medium">Your bag is empty.</p>
                <button onClick={() => { setIsCartOpen(false); handleNavClick('All'); }} className="mt-4 px-6 py-2 bg-black text-white rounded-full text-sm font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors">Shop Now</button>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.id} className="flex gap-4 group">
                  <div className="w-24 h-24 bg-zinc-100 rounded-xl overflow-hidden flex items-center justify-center">
                    <img src={item.img} alt={item.name} className="w-[120%] mix-blend-multiply" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-lg leading-tight">{item.name}</h3>
                        <p className="font-bold">${item.price}</p>
                      </div>
                      <p className="text-sm text-zinc-500">{item.color} • Size {item.size}</p>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-sm font-medium text-zinc-400 hover:text-red-500 text-left transition-colors w-fit">Remove</button>
                  </div>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="p-6 border-t border-zinc-100 bg-zinc-50">
              <div className="flex justify-between items-center mb-6">
                <span className="font-medium text-zinc-500">Estimated Total</span>
                <span className="text-2xl font-black">${cartTotal}</span>
              </div>
              <button 
                onClick={simulateCheckout}
                disabled={isCheckingOut}
                className="w-full bg-black text-white py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-[#D4FF00] hover:text-black transition-colors flex items-center justify-center gap-2"
              >
                {isCheckingOut ? (
                  <span className="animate-pulse">Processing...</span>
                ) : (
                  <>Checkout <ArrowRight size={18} /></>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* --- HEADER --- */}
      <header 
        className={`fixed top-0 w-full z-40 transition-all duration-500 ${scrolled ? 'py-4 glass-nav bg-white/70 border-b border-white/20 shadow-sm' : 'py-8'} ${scrollDir === 'down' && scrolled ? '-translate-y-full' : 'translate-y-0'}`}
        onMouseEnter={() => setCursorType('hover')} onMouseLeave={() => setCursorType('default')}
      >
        <div className="max-w-[1800px] mx-auto px-6 md:px-12 flex justify-between items-center">
          {/* Authentic Nike Swoosh Logo */}
          <div 
  className="cursor-pointer hover:scale-105 transition-transform"
  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
>
  <img
    src={logo}
    alt="Nike Logo"
    className={`w-16 md:w-20 transition-all duration-500 ${!scrolled && activeShoe.id === "obsidian" ? "invert" : ""}`}
  />
</div>

          {/* Interactive Nav Links */}
          <nav className="hidden lg:flex gap-10 font-bold tracking-tight text-sm uppercase">
            {['All', 'Men', 'Women', 'Kids', 'Sale'].map((item) => (
              <button 
                key={item} 
                onClick={() => handleNavClick(item)}
                className={`relative group overflow-hidden outline-none ${!scrolled && activeShoe.id === 'obsidian' ? 'text-white' : 'text-black'}`}
              >
                <span className={`block transition-transform duration-300 ${activeCategory === item ? '-translate-y-full' : 'group-hover:-translate-y-full'}`}>{item}</span>
                <span className={`block absolute top-0 left-0 transition-transform duration-300 ${activeCategory === item ? 'translate-y-0 text-red-500' : 'translate-y-full group-hover:translate-y-0 text-zinc-400'}`}>
                  {item}
                </span>
                {/* Active Indicator line */}
                <div className={`absolute -bottom-1 left-0 h-[2px] bg-current transition-all duration-300 ${activeCategory === item ? 'w-full' : 'w-0'}`} />
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className={`flex gap-6 items-center ${!scrolled && activeShoe.id === 'obsidian' ? 'text-white' : 'text-black'}`}>
            <button className="hover:scale-110 transition-transform" onClick={() => showToast('Search activated.')}><Search size={24} strokeWidth={2.5} /></button>
            <button className="relative hover:scale-110 transition-transform" onClick={() => setIsCartOpen(true)}>
              <ShoppingBag size={24} strokeWidth={2.5} />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-transparent">
                  {cart.length}
                </span>
              )}
            </button>
            <button className="lg:hidden" onClick={() => showToast('Mobile menu opened')}><Menu size={24} strokeWidth={2.5} /></button>
          </div>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <section className={`relative min-h-screen pt-24 pb-12 flex flex-col justify-center overflow-hidden transition-colors duration-1000 ease-in-out ${activeShoe.theme}`}>
        
        {/* Dynamic Background Text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center z-0 pointer-events-none select-none">
          <h1 className={`text-[28vw] font-black tracking-tighter leading-none opacity-5 transition-colors duration-1000 ${activeShoe.textTheme}`}>
            AIR MAX
          </h1>
        </div>

        <div className="max-w-[1800px] mx-auto w-full px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          {/* Left Column: Typo & Sizes */}
          <div className={`lg:col-span-3 order-2 lg:order-1 flex flex-col justify-center animate-slide-up transition-colors duration-1000 ${activeShoe.textTheme}`}>
            <div className="mb-12">
              <p className="font-bold tracking-widest uppercase text-xs mb-4 opacity-70 flex items-center gap-2">
                <Star size={14} className={activeShoe.id === 'obsidian' ? 'fill-white' : 'fill-black'} /> Premium Collection
              </p>
              <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] uppercase mb-4 drop-shadow-lg">
                Dn<br/>Vibe.
              </h2>
              <p className="text-sm font-medium opacity-80 max-w-[250px] leading-relaxed">
                Dynamic Air unit system features dual-pressure tubes for a reactive, bouncing sensation. Mastered for the streets.
              </p>
            </div>

            {/* Size Selector */}
            <div className="w-full max-w-[300px]" onMouseEnter={() => setCursorType('hover')} onMouseLeave={() => setCursorType('default')}>
              <div className="flex justify-between items-end mb-4">
                <span className="font-bold text-sm uppercase tracking-wider">Select Size</span>
                <span className="text-xs font-medium opacity-60 underline cursor-pointer hover:opacity-100" onClick={() => showToast('Size guide opened')}>Size Guide</span>
              </div>
              <div className="grid grid-cols-5 gap-2 mb-8 relative z-20">
                {SIZES.map(size => (
                  <button 
                    key={size}
                    onClick={() => setSelectedHeroSize(size)}
                    className={`py-2 text-sm font-bold rounded-lg transition-all duration-300 border ${
                      selectedHeroSize === size 
                        ? (activeShoe.id === 'obsidian' ? 'bg-white text-black border-white scale-110 shadow-lg' : 'bg-black text-white border-black scale-110 shadow-lg')
                        : `border-transparent hover:border-current bg-black/5 hover:scale-105 ${activeShoe.id === 'obsidian' ? 'bg-white/10' : ''}`
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              
              <button 
                onClick={() => addToCart(activeShoe, selectedHeroSize)}
                className={`relative overflow-hidden w-full py-5 rounded-full font-black uppercase tracking-widest text-sm transition-all duration-300 flex justify-center items-center gap-2 group z-20 ${
                  activeShoe.id === 'obsidian' 
                    ? 'bg-white text-black hover:bg-zinc-200 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]' 
                    : 'bg-black text-white hover:bg-zinc-800 hover:shadow-[0_0_30px_rgba(0,0,0,0.3)]'
                }`}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Add to Bag — ${activeShoe.price}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </div>
          </div>

          {/* Center Column: Interactive Shoe with Glare */}
          <div className="lg:col-span-7 order-1 lg:order-2 relative h-[50vh] lg:h-[80vh] flex items-center justify-center perspective-1000">
            {/* Ambient Base Glow */}
            <div 
              className="absolute w-[60%] h-[60%] rounded-full blur-[100px] transition-all duration-1000 ease-in-out mix-blend-normal"
              style={{ backgroundColor: activeShoe.glow, transform: `translate(${mousePos.x * -0.02}px, ${mousePos.y * -0.02}px)` }}
            />
            
            {/* Shoe Container */}
            <div 
              className="relative z-10 w-full max-w-[800px] transition-transform duration-300 ease-out animate-float"
              style={{ transform: `rotate(-15deg) rotateY(${mousePos.x * 0.01}deg) rotateX(${mousePos.y * -0.01}deg)` }}
              onMouseEnter={() => setCursorType('hover')} 
              onMouseLeave={() => setCursorType('default')}
            >
              <img 
                key={activeShoe.id}
                src={activeShoe.img} 
                alt={activeShoe.name}
                className="w-full object-contain mix-blend-multiply drop-shadow-[0_45px_45px_rgba(0,0,0,0.4)]"
              />
              {/* Fake Gloss/Glare overlay moving with mouse */}
              <div className="shoe-glare" style={getGlareStyle()} />
            </div>
          </div>

          {/* Right Column: Color Swatches */}
          <div className="lg:col-span-2 order-3 flex flex-row lg:flex-col justify-center items-center lg:items-end gap-6 z-20">
             <div className="flex flex-row lg:flex-col gap-4">
              {HERO_SHOES.map((shoe, idx) => (
                <button
                  key={shoe.id}
                  onClick={() => setActiveShoeIdx(idx)}
                  onMouseEnter={() => setCursorType('hover')} onMouseLeave={() => setCursorType('default')}
                  className={`relative w-16 h-16 rounded-full overflow-hidden border-2 transition-all duration-300 flex items-center justify-center shadow-lg ${
                    activeShoeIdx === idx ? (activeShoe.id === 'obsidian' ? 'border-white scale-110' : 'border-black scale-110') : 'border-transparent opacity-60 hover:opacity-100 hover:scale-105'
                  }`}
                >
                  <img src={shoe.img} alt={shoe.colorName} className="w-[150%] absolute mix-blend-multiply" style={{ transform: 'rotate(-20deg)' }}/>
                  <div className={`absolute inset-0 ${shoe.theme} -z-10`} />
                </button>
              ))}
             </div>
             <p className={`hidden lg:block text-xs font-bold uppercase tracking-widest transform rotate-90 origin-right translate-x-4 mt-20 transition-colors duration-1000 ${activeShoe.textTheme}`}>
               {activeShoe.colorName}
             </p>
          </div>

        </div>
      </section>

      {/* --- SCROLLING MARQUEE --- */}
      <section className="bg-black text-white py-6 overflow-hidden border-y border-zinc-800 relative z-20 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
        <div className="animate-marquee flex items-center">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center whitespace-nowrap">
              <span className="text-4xl md:text-6xl font-black tracking-tighter uppercase px-8">Unreal Bounce</span>
              <Star className="text-[#D4FF00] fill-[#D4FF00] w-8 h-8" />
              <span className="text-4xl md:text-6xl font-black tracking-tighter uppercase px-8 text-outline-light">Dynamic Air</span>
              <Star className="text-[#D4FF00] fill-[#D4FF00] w-8 h-8" />
            </div>
          ))}
        </div>
      </section>

      {/* --- TRENDING / SHOP GRID --- */}
      <section id="shop-section" className="py-32 px-6 md:px-12 max-w-[1800px] mx-auto min-h-screen">
        <Reveal>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
            <div>
              <p className="font-bold tracking-widest uppercase text-sm mb-2 text-zinc-500">Explore Collection</p>
              <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none">
                {activeCategory === 'All' ? 'Trending\nNow.' : `${activeCategory}\nGear.`}
              </h2>
            </div>
            <div className="flex gap-4 border-b-2 border-black pb-2" onMouseEnter={() => setCursorType('hover')} onMouseLeave={() => setCursorType('default')}>
               {['All', 'Men', 'Women', 'Kids', 'Sale'].map(cat => (
                 <button 
                   key={cat} 
                   onClick={() => handleNavClick(cat)}
                   className={`font-bold uppercase tracking-widest text-sm transition-colors ${activeCategory === cat ? 'text-black' : 'text-zinc-400 hover:text-black'}`}
                 >
                   {cat}
                 </button>
               ))}
            </div>
          </div>
        </Reveal>

        {filteredProducts.length === 0 ? (
          <div className="py-32 text-center text-zinc-400 font-medium text-xl">
            No products found in this category currently. Check back later.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((item, i) => (
              <Reveal key={item.id} delay={i * 100}>
                <div 
                  className="group cursor-pointer flex flex-col h-full"
                  onMouseEnter={() => setCursorType('view')} onMouseLeave={() => setCursorType('default')}
                  onClick={() => setQuickViewItem(item)}
                >
                  <div className="relative aspect-[4/5] bg-[#F5F5F7] rounded-3xl overflow-hidden mb-6 flex items-center justify-center p-8 transition-colors group-hover:bg-zinc-200">
                    {/* Badges */}
                    <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                      {item.category === 'Sale' && <span className="bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Sale</span>}
                      {i === 0 && activeCategory === 'All' && <span className="bg-black text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Bestseller</span>}
                    </div>

                    <img 
                      src={item.img} 
                      alt={item.name} 
                      className="w-full h-full object-cover mix-blend-multiply transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 group-hover:-rotate-6" 
                    />
                    
                    {/* Overlay Quick Add button (ignores parent click) */}
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-8 backdrop-blur-[2px]">
                      <button 
                        onMouseEnter={() => setCursorType('hover')} onMouseLeave={() => setCursorType('view')}
                        onClick={(e) => { e.stopPropagation(); addToCart(item, 9); }}
                        className="bg-white text-black font-bold uppercase tracking-widest text-xs px-8 py-4 rounded-full translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-black hover:text-white flex items-center gap-2 shadow-xl"
                      >
                        <Plus size={14} strokeWidth={3} /> Quick Add
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-start mt-auto">
                    <div>
                      <h3 className="text-xl font-bold tracking-tight mb-1 group-hover:underline">{item.name}</h3>
                      <p className="text-sm text-zinc-500 font-medium">{item.category} • {item.type}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${item.oldPrice ? 'text-red-500' : 'text-black'}`}>${item.price}</p>
                      {item.oldPrice && <p className="text-sm text-zinc-400 line-through">${item.oldPrice}</p>}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {/* --- IMMERSIVE FEATURE (DARK MODE BREAK) --- */}
      <section className="bg-[#0A0A0A] text-white py-32 rounded-[3rem] mx-4 md:mx-6 mb-20 overflow-hidden relative shadow-2xl">
        <div className="max-w-[1800px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
          <Reveal>
            <div className="aspect-square rounded-full bg-zinc-800 absolute -top-[20%] -left-[10%] w-[60%] blur-[100px] opacity-50 pointer-events-none" />
            <div className="relative group cursor-pointer" onMouseEnter={() => setCursorType('hover')} onMouseLeave={() => setCursorType('default')}>
              <img 
                src="https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&q=80&w=1000" 
                alt="Athlete" 
                className="w-full rounded-3xl object-cover aspect-[4/5] grayscale hover:grayscale-0 transition-all duration-1000 z-10 relative"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20">
                 <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                    <Play size={40} className="text-white fill-white ml-2" />
                 </div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={200}>
            <div className="flex flex-col items-start">
              <span className="text-[#D4FF00] font-bold uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
                <Play size={16} fill="currentColor" /> Innovation
              </span>
              <h2 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase mb-8 leading-[0.9]">
                Engineered <br/>for the exact <br/>specifications <br/>of athletes.
              </h2>
              <p className="text-xl text-zinc-400 font-medium max-w-md mb-12 leading-relaxed">
                We study movement. We build platforms for human potential. Discover the lab behind the legacy and unlock your true performance.
              </p>
              <button 
                onClick={() => showToast('Redirecting to Nike Lab...')}
                className="bg-white text-black px-10 py-5 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-[#D4FF00] hover:scale-105 transition-all duration-300 shadow-xl"
                onMouseEnter={() => setCursorType('hover')} onMouseLeave={() => setCursorType('default')}
              >
                Explore The Lab
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-white pt-24 pb-12 overflow-hidden border-t border-zinc-200 relative">
        <div className="max-w-[1800px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-12 mb-20 relative z-10">
          
          {/* Brand/Logo Col */}
          <div className="md:col-span-4 flex flex-col justify-between">
            <svg viewBox="0 0 73 26" className="w-24 text-black fill-current mb-8 cursor-pointer hover:scale-110 transition-transform origin-left" onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>
              <path d="M21.5 25.4c-6.2 0-11.6-1.9-15.7-5.5C2.1 16.6.1 12.4.1 7.4.1 4.5 1.2 1.8 3.3.1c-.2.7-.3 1.4-.3 2.2 0 4.1 2.8 8.1 7.8 11.2 3.6 2.2 8.3 3.8 13.5 4.5 4.8.6 9.8.5 14.8-.2 6-.8 11.8-2.3 17.1-4.4 5.3-2.1 10.1-4.7 14.3-7.7L73 0C56.6 9.3 39.8 17.5 22.8 25.1c-.4.1-.9.2-1.3.3z"/>
            </svg>
            <div className="space-y-4">
              <h4 className="font-bold uppercase tracking-widest text-xs">Join Nike</h4>
              <p className="text-sm text-zinc-500 font-medium max-w-xs leading-relaxed">Sign up for free to join the community. Get exclusive access to drops and news.</p>
              <button onClick={() => showToast('Sign up modal opened')} className="text-sm font-bold border-b border-black pb-1 hover:pr-2 transition-all">Sign Up</button>
            </div>
          </div>

          {/* Links Cols */}
          <div className="md:col-span-2">
             <h4 className="font-bold uppercase tracking-widest text-xs mb-6 text-black">Shop</h4>
             <ul className="space-y-4 font-medium text-sm text-zinc-500">
               {['Men', 'Women', 'Kids', 'Sale'].map(link => (
                 <li key={link} className="hover:text-black hover:translate-x-1 cursor-pointer transition-all" onClick={() => handleNavClick(link)}>{link}</li>
               ))}
             </ul>
          </div>
          <div className="md:col-span-2">
             <h4 className="font-bold uppercase tracking-widest text-xs mb-6 text-black">Help</h4>
             <ul className="space-y-4 font-medium text-sm text-zinc-500">
               {['Order Status', 'Shipping', 'Returns', 'Contact'].map(link => (
                 <li key={link} className="hover:text-black hover:translate-x-1 cursor-pointer transition-all" onClick={() => showToast(`Navigating to ${link}...`)}>{link}</li>
               ))}
             </ul>
          </div>
          <div className="md:col-span-2">
             <h4 className="font-bold uppercase tracking-widest text-xs mb-6 text-black">Company</h4>
             <ul className="space-y-4 font-medium text-sm text-zinc-500">
               {['About Nike', 'News', 'Careers', 'Investors'].map(link => (
                 <li key={link} className="hover:text-black hover:translate-x-1 cursor-pointer transition-all" onClick={() => showToast(`Navigating to ${link}...`)}>{link}</li>
               ))}
             </ul>
          </div>

          {/* Location Col */}
          <div className="md:col-span-2 flex justify-end">
            <span className="font-bold text-xs uppercase flex items-center gap-2 cursor-pointer hover:opacity-50 transition-opacity h-fit" onClick={() => showToast('Location selector opened')}>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
              United States
            </span>
          </div>
        </div>

        {/* Massive Background Text */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden flex justify-center translate-y-1/3 select-none pointer-events-none opacity-[0.03] z-0">
          <h1 className="text-[25vw] font-black tracking-tighter leading-none text-black">NIKE</h1>
        </div>

        {/* Bottom Bar */}
        <div className="max-w-[1800px] mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center text-xs text-zinc-400 font-medium border-t border-zinc-200 pt-8 relative z-10">
          <p>&copy; {new Date().getFullYear()} Nike, Inc. Concept Redesign.</p>
          <div className="flex flex-wrap gap-6 mt-4 md:mt-0">
            {['Guides', 'Terms of Sale', 'Terms of Use', 'Privacy Policy'].map(doc => (
              <span key={doc} className="hover:text-black cursor-pointer transition-colors" onClick={() => showToast(`Opening ${doc}`)}>{doc}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}