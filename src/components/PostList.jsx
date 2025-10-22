import React from "react";
import useFetch from "../hooks/useFetch";

export default function PostList(){
  // using jsonplaceholder to get actual posts; demonstrates useFetch hook
  const { data, loading, error, retry } = useFetch("https://jsonplaceholder.typicode.com/posts");

  if(loading) return <div className="loading">Loading posts…</div>;
  if(error) return <div className="error">Failed to load posts: {String(error.message)} <button className="btn" onClick={retry}>Retry</button></div>;
  if(!data) return null;

  return (
    <div className="post-list">
      <div className="small">Showing {data.length} posts (fetched with useFetch & cached)</div>
      <div style={{marginTop:8}}>
        {data.slice(0,10).map(p=>(
          <div key={p.id} className="card" style={{marginBottom:8}}>
            <div style={{fontWeight:600}}>{p.title}</div>
            <div className="small">{p.body}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
