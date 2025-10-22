import React, { useEffect, useMemo, useState } from "react";

// Mock data generator
const mockItems = [
  { id: 1, name: "Apple iPhone 14", category: "Electronics", price: 1200 },
  { id: 2, name: "Samsung Galaxy S23", category: "Electronics", price: 999 },
  { id: 3, name: "Nike Air Max", category: "Footwear", price: 150 },
  { id: 4, name: "Leather Wallet", category: "Accessories", price: 45 },
  { id: 5, name: "Dell XPS 13", category: "Electronics", price: 1400 },
  { id: 6, name: "Office Chair", category: "Furniture", price: 220 },
  { id: 7, name: "Running Shorts", category: "Clothing", price: 35 },
  { id: 8, name: "Coffee Maker", category: "Home", price: 80 },
  { id: 9, name: "Sunglasses", category: "Accessories", price: 120 },
  { id: 10, name: "Adidas Trainers", category: "Footwear", price: 130 },
  { id: 11, name: "Bookshelf", category: "Furniture", price: 180 },
  { id: 12, name: "T-Shirt", category: "Clothing", price: 20 },
];

function uniqueCategories(items){
  const s = new Set(items.map(i=>i.category));
  return Array.from(s).sort();
}

function parseNumberParam(val, fallback){
  const n = Number(val);
  return Number.isFinite(n) ? n : fallback;
}

export default function FilterableList(){
  const items = mockItems;

  // read initial filter state from URL params
  const params = new URLSearchParams(window.location.search);
  const initialName = params.get('name') || '';
  const initialCategory = params.get('category') || 'All';
  const globalMin = Math.min(...items.map(i=>i.price));
  const globalMax = Math.max(...items.map(i=>i.price));
  const initialMinPrice = parseNumberParam(params.get('minPrice'), globalMin);
  const initialMaxPrice = parseNumberParam(params.get('maxPrice'), globalMax);

  const [nameFilter, setNameFilter] = useState(initialName);
  const [category, setCategory] = useState(initialCategory);
  const [minPrice, setMinPrice] = useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);

  // update URL when filters change
  useEffect(()=>{
    const p = new URLSearchParams();
    if(nameFilter) p.set('name', nameFilter);
    if(category && category !== 'All') p.set('category', category);
    if(minPrice !== globalMin) p.set('minPrice', String(minPrice));
    if(maxPrice !== globalMax) p.set('maxPrice', String(maxPrice));
    const query = p.toString();
    const newUrl = window.location.pathname + (query ? ('?' + query) : '');
    window.history.replaceState({}, '', newUrl);
  },[nameFilter, category, minPrice, maxPrice, globalMin, globalMax]);

  const categories = useMemo(()=>['All', ...uniqueCategories(items)], [items]);

  const filtered = useMemo(()=>{
    const name = nameFilter.trim().toLowerCase();
    return items.filter(it=>{
      if(name && !it.name.toLowerCase().includes(name)) return false;
      if(category !== 'All' && it.category !== category) return false;
      if(it.price < minPrice || it.price > maxPrice) return false;
      return true;
    });
  },[items, nameFilter, category, minPrice, maxPrice]);

  // helpers for range slider - we use two range inputs
  const handleMinChange = (v) => {
    const nv = Number(v);
    if(nv <= maxPrice) setMinPrice(nv);
    else setMinPrice(maxPrice);
  }
  const handleMaxChange = (v) => {
    const nv = Number(v);
    if(nv >= minPrice) setMaxPrice(nv);
    else setMaxPrice(minPrice);
  }

  return (
    <div>
      <h2>Products</h2>
      <div className="controls">
        <input className="input" placeholder="Filter by name" value={nameFilter} onChange={(e)=>setNameFilter(e.target.value)} />
        <select className="input" value={category} onChange={(e)=>setCategory(e.target.value)}>
          {categories.map(c=> <option key={c} value={c}>{c}</option>)}
        </select>

        <div className="controls-column" style={{minWidth:220}}>
          <div className="small">Price range</div>
          <div className="slider-row">
            <input type="range" min={globalMin} max={globalMax} value={minPrice} onChange={(e)=>handleMinChange(e.target.value)} />
            <input type="range" min={globalMin} max={globalMax} value={maxPrice} onChange={(e)=>handleMaxChange(e.target.value)} />
          </div>
          <div className="small">Min: ${minPrice} — Max: ${maxPrice}</div>
        </div>

        <div style={{marginLeft:'auto'}}>
          <button className="btn" onClick={()=>{
            setNameFilter('');
            setCategory('All');
            setMinPrice(globalMin);
            setMaxPrice(globalMax);
          }}>Reset</button>
        </div>
      </div>

      <div style={{marginTop:12}}>
        <div className="small">{filtered.length} item(s) — showing prices between ${minPrice} and ${maxPrice}</div>
        <div className="grid">
          {filtered.map(it=>(
            <div key={it.id} className="card">
              <div style={{fontWeight:600}}>{it.name}</div>
              <div className="small">{it.category}</div>
              <div style={{marginTop:8, fontWeight:700}}>${it.price}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
