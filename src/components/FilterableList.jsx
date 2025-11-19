import React, { useEffect, useMemo, useState } from "react";
import products from "../data/products";


function uniqueCategories(items){
  const s = new Set(items.map(i=>i.category));
  return Array.from(s).sort();
}

function parseNumberParam(val, fallback){
  // treat null/undefined/empty-string as 'no value' -> use fallback
  if(val === null || val === undefined) return fallback;
  if(typeof val === 'string' && val.trim() === '') return fallback;
  const n = Number(val);
  return Number.isFinite(n) ? n : fallback;
}

export default function FilterableList(){
  const items = products;

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
  useEffect(() => {
    // debounce URL updates to avoid spamming history while user types
    const handler = setTimeout(() => {
      const q = [];
      if(nameFilter) q.push('name=' + encodeURIComponent(nameFilter));
      if(category && category !== 'All') q.push('category=' + encodeURIComponent(category));
      if(minPrice != null) q.push('minPrice=' + String(minPrice));
      if(maxPrice != null) q.push('maxPrice=' + String(maxPrice));
      const query = q.join('&');
      const newUrl = window.location.pathname + (query ? ('?' + query) : '');
      window.history.replaceState({}, '', newUrl);
    }, 300); // 300ms debounce

    return () => clearTimeout(handler);
  }, [nameFilter, category, minPrice, maxPrice, globalMin, globalMax]);

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
