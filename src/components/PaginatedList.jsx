import React, { useEffect, useState } from "react";
import products from "../data/products";

/**
 * Client-side pagination using the same mock products.
 * 'Load more' appends the next page of products.
 */
export default function PaginatedList(){
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const limit = 6; // items per page

  const total = products.length;
  const totalPages = Math.ceil(total / limit);

  useEffect(()=>{
    // load initial page
    loadPage(1, true);
    // eslint-disable-next-line
  },[])

  function loadPage(p, replace=false){
    setLoading(true);
    setError(null);
    try{
      // simulate a small delay to show spinner (but synchronous data)
      setTimeout(()=>{
        const start = (p - 1) * limit;
        const slice = products.slice(start, start + limit);
        setItems(prev=>{
          if(replace) return slice;
          // append but avoid duplicates
          const ids = new Set(prev.map(it=>it.id));
          const appended = slice.filter(it=>!ids.has(it.id));
          return [...prev, ...appended];
        });
        setPage(p);
        setLoading(false);
      }, 250);
    }catch(err){
      setError(err);
      setLoading(false);
    }
  }

  function loadMore(){
    if(page >= totalPages) return;
    loadPage(page + 1);
  }

  return (
    <div>
      <div className="small">Paginated products (client-side). Showing {items.length} of {total} products.</div>
      <div style={{marginTop:8}} className="grid">
        {items.map(it=>(
          <div key={it.id} className="card" style={{marginBottom:8}}>
            <div style={{display:'flex', gap:12, alignItems:'center'}}>
              <div style={{width:64,height:64,flex:'0 0 64px',borderRadius:10,background:'linear-gradient(135deg,#06b6d4,#7c3aed)'}} />
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:15}}>{it.name}</div>
                <div className="small" style={{marginTop:6}}>{it.category}</div>
                <div className="price">${it.price}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {loading && <div className="loading"><span className="spinner" /> Loading…</div>}
      {error && <div className="error">Failed to load: {String(error.message)}</div>}
      <div style={{marginTop:8, display:'flex', gap:8}}>
        <button className="btn" onClick={loadMore} disabled={loading || page >= totalPages}>
          {page >= totalPages ? 'No more products' : 'Load more'}
        </button>
      </div>
    </div>
  )
}
