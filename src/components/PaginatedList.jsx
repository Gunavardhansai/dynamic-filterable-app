import React, { useEffect, useState } from "react";

export default function PaginatedList(){
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const limit = 10;

  useEffect(()=>{
    // load initial page
    loadPage(1, true);
    // eslint-disable-next-line
  },[])

  function loadPage(p, replace=false){
    setLoading(true);
    setError(null);
    fetch(`https://jsonplaceholder.typicode.com/posts?_page=${p}&_limit=${limit}`)
      .then(async res=>{
        if(!res.ok) throw new Error('Network response was not ok');
        const json = await res.json();
        setItems(curr => replace ? json : [...curr, ...json]);
        setPage(p);
        setLoading(false);
      })
      .catch(err=>{
        setError(err);
        setLoading(false);
      })
  }

  return (
    <div>
      <div className="small">Paginated posts with "Load more". Page: {page}</div>
      <div style={{marginTop:8}}>
        {items.map(it=>(
          <div key={it.id} className="card" style={{marginBottom:8}}>
            <div style={{fontWeight:600}}>{it.title}</div>
            <div className="small">{it.body}</div>
          </div>
        ))}
      </div>
      {loading && <div className="loading">Loading…</div>}
      {error && <div className="error">Failed to load: {String(error.message)}</div>}
      <div style={{marginTop:8}}>
        <button className="btn" onClick={()=>loadPage(page+1)} disabled={loading}>Load more</button>
      </div>
    </div>
  )
}
