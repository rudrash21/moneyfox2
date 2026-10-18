import React, { useState, useMemo, useEffect } from 'react';
import { 
  Filter, 
  ChevronRight, 
  Heart, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  SlidersHorizontal, 
  Search, 
  X, 
  Eye, 
  ArrowUpDown, 
  Check,
  ShoppingBag
} from 'lucide-react';
import { dbService, dbProductToProduct } from '../../lib/dbService';
import { ScreenView, Product } from '../../types';

interface ProductsCatalogViewProps {
  onNavigate: (screen: ScreenView) => void;
  onSelectProductAndBuy: (productId: string, size: 'S' | 'M' | 'L' | 'XL') => void;
  onViewProductDetail: (productId: string) => void;
}

type SortOption = 'relevance' | 'popularity' | 'price-asc' | 'price-desc' | 'newest';

export const ProductsCatalogView: React.FC<ProductsCatalogViewProps> = ({
  onNavigate,
  onSelectProductAndBuy,
  onViewProductDetail,
}) => {
  // Live dynamic products
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      const dbProds = await dbService.fetchProducts();
      if (isMounted) {
        setProductsList(dbProds.map(dbProductToProduct));
        setLoading(false);
      }
    };
    load();

    const unsub = dbService.subscribeProducts((fresh) => {
      if (isMounted) {
        setProductsList(fresh.map(dbProductToProduct));
      }
    });

    return () => {
      isMounted = false;
      unsub();
    };
  }, []);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(5000);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState<SortOption>('relevance');
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // Toggle wishlist item
  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Color options
  const colorOptions = useMemo(() => [
    { id: 'black', label: 'Obsidian Noir', hex: '#0D0D0D' },
    { id: 'plum', label: 'Royal Plum', hex: '#4A2346' },
    { id: 'navy', label: 'Deep Sea Navy', hex: '#16233B' },
    { id: 'white', label: 'Chalk White', hex: '#E6E6E6' },
  ], []);

  // Dynamic Category options extracted from products
  const categoryOptions = useMemo(() => {
    const list = [
      { id: 'all', label: 'All Streetwear Drops', count: productsList.length },
    ];
    const catMap = new Map<string, number>();
    productsList.forEach((p) => {
      const cat = p.series || 'Streetwear';
      catMap.set(cat, (catMap.get(cat) || 0) + 1);
    });
    catMap.forEach((count, cat) => {
      list.push({ id: cat, label: cat, count });
    });
    return list;
  }, [productsList]);

  // Reset all filters
  const handleClearFilters = () => {
    setSelectedCategory('all');
    setSelectedColors([]);
    setSelectedSizes([]);
    setMaxPrice(5000);
    setSearchQuery('');
  };

  const hasActiveFilters = 
    selectedCategory !== 'all' || 
    selectedColors.length > 0 || 
    selectedSizes.length > 0 || 
    maxPrice < 5000 || 
    searchQuery.trim() !== '';

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    return productsList.filter((prod) => {
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = prod.name.toLowerCase().includes(query);
        const matchesSeries = (prod.series || '').toLowerCase().includes(query);
        const matchesTag = (prod.editionTag || '').toLowerCase().includes(query);
        const matchesColor = (prod.color || '').toLowerCase().includes(query);
        if (!matchesName && !matchesSeries && !matchesTag && !matchesColor) return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && prod.series !== selectedCategory) {
        return false;
      }

      // Color filter
      if (selectedColors.length > 0) {
        const prodColor = (prod.color || '').toLowerCase();
        const matchesColor = selectedColors.some((c) => {
          if (c === 'black') return prodColor.includes('black') || prodColor.includes('noir');
          if (c === 'plum') return prodColor.includes('plum');
          if (c === 'navy') return prodColor.includes('navy');
          if (c === 'white') return prodColor.includes('white') || prodColor.includes('chalk');
          return prodColor.includes(c);
        });
        if (!matchesColor) return false;
      }

      // Price filter
      if (prod.price > maxPrice) return false;

      return true;
    }).sort((a, b) => {
      if (sortOption === 'price-asc') return a.price - b.price;
      if (sortOption === 'price-desc') return b.price - a.price;
      if (sortOption === 'newest') return b.id.localeCompare(a.id);
      if (sortOption === 'popularity') return b.name.length - a.name.length;
      return 0; // relevance
    });
  }, [productsList, selectedCategory, selectedColors, maxPrice, searchQuery, sortOption]);

  return (
    <div className="bg-noir-950 text-parchment-100 min-h-screen pb-24">
      {/* Top Header / Breadcrumbs Bar - Non-sticky to eliminate gap and avoid covering content */}
      <div className="border-b border-amberfox/15 bg-noir-900/90 py-3 sm:py-3.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Breadcrumbs */}
            <div className="flex items-center space-x-2 text-[11px] font-mono tracking-luxury text-amberfox uppercase">
              <button
                onClick={() => onNavigate('storefront')}
                className="hover:underline text-parchment-400 cursor-pointer"
              >
                HOME
              </button>
              <span className="text-parchment-600">/</span>
              <span className="text-parchment-400">LUXURY STREETWEAR</span>
              <span className="text-parchment-600">/</span>
              <span className="text-amberfox font-semibold">ALL PRODUCTS</span>
            </div>

            {/* Mobile Filters Trigger */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 bg-amberfox text-noir-950 px-3 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider cursor-pointer shadow-amber-glow"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters</span>
                {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-noir-950"></span>}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container with Sidebar + Product Grid (Tight top spacing) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ================= LEFT SIDEBAR (FILTERS - PROPERLY ADJUSTED AT STICKY TOP-24) ================= */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6 sticky top-24">
            <div className="bg-noir-900/95 border border-amberfox/25 rounded-2xl p-5 shadow-2xl backdrop-blur-xl">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-amberfox/15">
                <div className="flex items-center gap-2 text-sm font-serif uppercase tracking-wider text-parchment-100 font-bold">
                  <Filter className="w-4 h-4 text-amberfox" />
                  <span>FILTERS</span>
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={handleClearFilters}
                    className="text-[11px] font-mono uppercase text-amberfox hover:underline cursor-pointer font-bold tracking-wider"
                  >
                    CLEAR ALL
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div className="py-4 border-b border-amberfox/15 space-y-2.5">
                <span className="text-[11px] font-mono uppercase tracking-wider text-parchment-400 font-bold block">
                  CATEGORIES
                </span>
                <div className="space-y-1.5">
                  {categoryOptions.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors flex items-center justify-between cursor-pointer ${
                        selectedCategory === cat.id
                          ? 'bg-amberfox/15 text-amberfox font-bold border border-amberfox/30'
                          : 'text-parchment-300 hover:text-amberfox hover:bg-noir-850'
                      }`}
                    >
                      <span className="truncate">{cat.label}</span>
                      <span className="text-[10px] text-parchment-500 font-mono">({cat.count})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter Slider */}
              <div className="py-4 border-b border-amberfox/15 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-parchment-400 font-bold">
                    PRICE RANGE
                  </span>
                  <span className="text-xs font-mono font-bold text-amberfox">Up to ₹{maxPrice.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="1500"
                  max="3000"
                  step="100"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#F58A2E] bg-noir-800 rounded-lg h-2 cursor-pointer"
                />
                <div className="flex items-center justify-between text-[10px] font-mono text-parchment-500">
                  <span>Min ₹1,500</span>
                  <span>Max ₹3,000</span>
                </div>
              </div>

              {/* Color Filter */}
              <div className="py-4 border-b border-amberfox/15 space-y-2.5">
                <span className="text-[11px] font-mono uppercase tracking-wider text-parchment-400 font-bold block">
                  COLORWAY
                </span>
                <div className="space-y-2">
                  {colorOptions.map((col) => {
                    const isChecked = selectedColors.includes(col.id);
                    return (
                      <label
                        key={col.id}
                        className="flex items-center space-x-2.5 cursor-pointer text-xs text-parchment-300 hover:text-parchment-100"
                        onClick={() => {
                          setSelectedColors((prev) =>
                            isChecked ? prev.filter((c) => c !== col.id) : [...prev, col.id]
                          );
                        }}
                      >
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                            isChecked
                              ? 'bg-amberfox border-amberfox text-noir-950'
                              : 'border-amberfox/40 bg-noir-850'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span
                          className="w-3 h-3 rounded-full border border-parchment-600/50"
                          style={{ backgroundColor: col.hex }}
                        />
                        <span className="font-mono text-[11px]">{col.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Size Filter */}
              <div className="py-4 border-b border-amberfox/15 space-y-2.5">
                <span className="text-[11px] font-mono uppercase tracking-wider text-parchment-400 font-bold block">
                  SIZE FIT
                </span>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['S', 'M', 'L', 'XL'] as const).map((sz) => {
                    const isSelected = selectedSizes.includes(sz);
                    return (
                      <button
                        key={sz}
                        onClick={() => {
                          setSelectedSizes((prev) =>
                            isSelected ? prev.filter((s) => s !== sz) : [...prev, sz]
                          );
                        }}
                        className={`py-1.5 text-center font-mono text-xs rounded-lg transition-all cursor-pointer border ${
                          isSelected
                            ? 'border-amberfox bg-amberfox text-noir-950 font-bold'
                            : 'bg-noir-850 border-amberfox/20 hover:border-amberfox/50 text-parchment-300'
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Delivery & Tax Guarantees */}
              <div className="pt-4 border-t border-amberfox/15 text-[10px] font-mono text-parchment-400 space-y-2">
                <div className="flex items-center gap-2 text-parchment-300">
                  <Truck className="w-3.5 h-3.5 text-amberfox" />
                  <span>Free Nationwide Express Delivery</span>
                </div>
                <div className="flex items-center gap-2 text-parchment-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-amberfox" />
                  <span>Official GST Tax Invoiced</span>
                </div>
              </div>
            </div>
          </aside>

          {/* ================= RIGHT MAIN AREA (SORT BAR + FLIPKART STYLE PRODUCT GRID IN NOIR THEME) ================= */}
          <main className="lg:col-span-9 space-y-6">
            
            {/* Top Toolbar / Flipkart-style Sort Tabs with MoneyFox luxury styling */}
            <div className="bg-noir-900/95 border border-amberfox/25 rounded-2xl p-4 sm:p-5 shadow-xl backdrop-blur-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                
                {/* Result Count and Query indicator */}
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-mono text-parchment-300">
                    Showing <strong className="text-amberfox font-bold">{filteredProducts.length}</strong> of{' '}
                    <strong className="text-parchment-100">{productsList.length}</strong> drops
                  </span>
                  {hasActiveFilters && (
                    <span className="px-2 py-0.5 bg-amberfox/10 text-amberfox border border-amberfox/30 rounded text-[10px] font-mono">
                      Filtered
                    </span>
                  )}
                </div>

                {/* Instant Search Bar */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-parchment-500" />
                  <input
                    type="text"
                    placeholder="Search drops, editions, colors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-noir-850 border border-amberfox/20 rounded-xl pl-9 pr-3 py-1.5 text-xs text-parchment-100 placeholder:text-parchment-600 focus:outline-none focus:border-amberfox font-mono"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-parchment-500 hover:text-amberfox cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Flipkart-style Sort Tabs */}
              <div className="flex items-center gap-2 sm:gap-6 pt-3 border-t border-amberfox/15 text-xs font-mono overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                <span className="text-parchment-500 uppercase tracking-wider shrink-0 font-bold flex items-center gap-1">
                  <ArrowUpDown className="w-3 h-3 text-amberfox" />
                  <span>Sort By:</span>
                </span>
                {[
                  { id: 'relevance', label: 'Relevance' },
                  { id: 'popularity', label: 'Popularity' },
                  { id: 'price-asc', label: 'Price -- Low to High' },
                  { id: 'price-desc', label: 'Price -- High to Low' },
                  { id: 'newest', label: 'Newest First' },
                ].map((tab) => {
                  const isActive = sortOption === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setSortOption(tab.id as SortOption)}
                      className={`pb-1.5 tracking-wider transition-all cursor-pointer whitespace-nowrap uppercase font-semibold ${
                        isActive
                          ? 'text-amberfox border-b-2 border-amberfox font-bold shadow-[0_4px_12px_rgba(245,138,46,0.3)]'
                          : 'text-parchment-400 hover:text-parchment-100'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ================= PRODUCT GRID ================= */}
            {filteredProducts.length === 0 ? (
              <div className="bg-noir-900/60 border border-amberfox/20 rounded-2xl p-12 text-center space-y-4">
                <Sparkles className="w-10 h-10 text-amberfox/40 mx-auto" />
                <h3 className="font-serif text-lg text-parchment-200 uppercase">
                  {productsList.length === 0 ? 'Streetwear Vault Is Currently Empty' : 'No Matching Streetwear Drops Found'}
                </h3>
                <p className="text-xs font-mono text-parchment-500 max-w-md mx-auto">
                  {productsList.length === 0
                    ? 'Exclusive garment drops will appear here once published in the Admin Products dashboard.'
                    : 'Try clearing your filters or search criteria to see all drops.'}
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={handleClearFilters}
                    className="btn-gold-sheen text-noir-950 px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {filteredProducts.map((prod) => {
                  const isWishlisted = !!wishlist[prod.id];
                  const mrpPrice = Math.round(prod.price * 2.5); // ₹5,000 crossed out
                  const discountPercent = Math.round(((mrpPrice - prod.price) / mrpPrice) * 100);
                  const frontImg = prod.angles?.front || prod.image;

                  return (
                    <div
                      key={prod.id}
                      onClick={() => onViewProductDetail(prod.id)}
                      className="bg-noir-900/95 border border-amberfox/25 hover:border-amberfox rounded-2xl p-4 sm:p-5 transition-all duration-300 hover:shadow-[0_0_35px_rgba(245,138,46,0.25)] group flex flex-col justify-between cursor-pointer relative overflow-hidden"
                    >
                      {/* Top Pill / Edition Badge */}
                      <div className="flex items-center justify-between pb-3 text-xs font-mono">
                        <span className="text-amberfox font-bold uppercase tracking-wider text-[11px] truncate">
                          {prod.editionTag}
                        </span>
                        <span className="px-2 py-0.5 bg-amberfox/15 text-amberfox border border-amberfox/30 text-[10px] font-bold rounded uppercase shrink-0">
                          240 GSM
                        </span>
                      </div>

                      {/* Product Image Stage (Flipkart tall aspect ratio with clean contrast & inspect overlay) */}
                      <div className="relative bg-white rounded-xl aspect-[4/4.5] p-3 flex items-center justify-center overflow-hidden shadow-inner group-hover:scale-[1.02] transition-transform duration-300">
                        <img
                          src={frontImg}
                          alt={prod.name}
                          className="max-h-full max-w-full object-contain transition-all duration-300"
                        />

                        {/* Top Right: Wishlist Button */}
                        <button
                          type="button"
                          onClick={(e) => toggleWishlist(prod.id, e)}
                          aria-label="Add to wishlist"
                          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-noir-950/80 border border-amberfox/30 flex items-center justify-center hover:bg-noir-900 transition-colors shadow-lg cursor-pointer"
                        >
                          <Heart
                            className={`w-4 h-4 transition-colors ${
                              isWishlisted ? 'fill-red-500 text-red-500' : 'text-parchment-300 hover:text-amberfox'
                            }`}
                          />
                        </button>

                        {/* Bottom Tag: 4 Angles Peek on hover */}
                        <div className="absolute bottom-2.5 inset-x-2.5 bg-noir-950/90 text-parchment-100 py-1 px-2.5 font-mono text-[9px] uppercase rounded-lg border border-amberfox/30 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                          <span className="flex items-center gap-1 text-amberfox font-bold">
                            <Eye className="w-3 h-3 text-amberfox" />
                            <span>Inspect 4 Angles</span>
                          </span>
                          <span className="text-parchment-400">Front • Back • Sides</span>
                        </div>
                      </div>

                      {/* Product Details Section */}
                      <div className="pt-4 space-y-3 flex-1 flex flex-col justify-between">
                        <div>
                          {/* Brand label */}
                          <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-parchment-400">
                            <span>MONEYFOX PRODUCTS</span>
                            <span className="text-amberfox font-semibold">{prod.editionTag || 'VERIFIED'}</span>
                          </div>

                          {/* Product Title */}
                          <h3 className="font-serif text-base sm:text-lg text-parchment-100 font-bold uppercase hover:text-amberfox transition-colors mt-1 line-clamp-2 leading-tight">
                            {prod.name.replace('MoneyFox ', '')}
                          </h3>

                          {/* Color subtitle */}
                          <p className="text-xs text-amberfox-gold font-mono mt-1 truncate">
                            {prod.color}
                          </p>

                          {/* Price Row (Flipkart-style: Current Price + Strikethrough MRP + % Discount) */}
                          <div className="flex items-baseline gap-2 mt-2.5 flex-wrap">
                            <span className="font-serif text-2xl font-bold text-amberfox">
                              ₹{prod.price.toLocaleString('en-IN')}
                            </span>
                            <span className="text-xs font-mono text-parchment-500 line-through">
                              ₹{mrpPrice.toLocaleString('en-IN')}
                            </span>
                            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-1.5 py-0.5 rounded">
                              {discountPercent}% OFF
                            </span>
                          </div>

                          {/* Delivery and GST Badges */}
                          <div className="flex items-center gap-2 pt-2 text-[10px] font-mono text-parchment-400">
                            <span className="text-parchment-300 flex items-center gap-1">
                              <Truck className="w-3 h-3 text-amberfox" />
                              <span>Free Delivery</span>
                            </span>
                            <span>•</span>
                            <span className="text-parchment-400">GST Tax Invoiced</span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-3 border-t border-amberfox/15 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onViewProductDetail(prod.id);
                            }}
                            className="flex-1 py-2 text-center text-xs font-mono uppercase font-bold text-parchment-200 hover:text-amberfox border border-amberfox/40 hover:border-amberfox rounded-xl transition-colors cursor-pointer"
                          >
                            Details
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectProductAndBuy(prod.id, 'L');
                            }}
                            className="flex-1 btn-gold-sheen text-noir-950 py-2 text-xs font-bold font-mono uppercase tracking-wider rounded-xl shadow-amber-glow cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                            <span>Add to Cart</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ================= MOBILE FILTER MODAL DRAWER ================= */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs bg-noir-950 border-l border-amberfox/30 p-5 h-full overflow-y-auto space-y-6 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-amberfox/20">
                <div className="flex items-center gap-2 text-sm font-serif uppercase tracking-wider text-parchment-100 font-bold">
                  <Filter className="w-4 h-4 text-amberfox" />
                  <span>FILTERS</span>
                </div>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="text-parchment-400 hover:text-amberfox cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Category */}
              <div className="py-4 border-b border-amberfox/15 space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-parchment-400 font-bold block">
                  CATEGORIES
                </span>
                <div className="space-y-1">
                  {categoryOptions.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono flex items-center justify-between ${
                        selectedCategory === cat.id
                          ? 'bg-amberfox/15 text-amberfox font-bold border border-amberfox/30'
                          : 'text-parchment-300'
                      }`}
                    >
                      <span>{cat.label}</span>
                      <span>({cat.count})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Price */}
              <div className="py-4 border-b border-amberfox/15 space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-parchment-400">MAX PRICE</span>
                  <span className="text-amberfox font-bold">₹{maxPrice.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="1500"
                  max="3000"
                  step="100"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#F58A2E] bg-noir-800 rounded-lg h-2"
                />
              </div>

              {/* Mobile Colors */}
              <div className="py-4 border-b border-amberfox/15 space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-parchment-400 font-bold block">
                  COLORWAY
                </span>
                <div className="space-y-2">
                  {colorOptions.map((col) => {
                    const isChecked = selectedColors.includes(col.id);
                    return (
                      <label
                        key={col.id}
                        className="flex items-center space-x-2 text-xs font-mono text-parchment-300"
                        onClick={() => {
                          setSelectedColors((prev) =>
                            isChecked ? prev.filter((c) => c !== col.id) : [...prev, col.id]
                          );
                        }}
                      >
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center ${
                            isChecked ? 'bg-amberfox border-amberfox text-noir-950' : 'border-amberfox/40'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span>{col.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-4 space-y-2">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full btn-gold-sheen text-noir-950 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider shadow-amber-glow"
              >
                Apply Filters ({filteredProducts.length} Results)
              </button>
              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="w-full text-center text-xs font-mono text-amberfox hover:underline py-1.5"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
