import React from "react";
import useFetch from "../hooks/useFetch";

export default function PostList(){
  // using the assignment URL (delayed) to demonstrate useFetch and delay handling
  const url = "https://httpbin.org/delay/2?query=abcd";
  const { data, loading, error, retry } = useFetch(url);

  if(loading) return <div className="loading">Loading posts…</div>;
  if(error) return <div className="error">Failed to load posts: {String(error.message)} <button className="btn" onClick={retry}>Retry</button></div>;
  if(!data) return null;

  // httpbin returns an object, not a list. Create a small synthetic posts list
  const posts = [];
  const q = data.args && data.args.query ? String(data.args.query) : "post";
  for(let i=1;i<=10;i++){
    posts.push({
      id: i,
      title: `${q} - Post ${i}`,
      body: `This post was generated from httpbin response; origin ${data.origin || 'unknown'}`
    });
  }

  return (
    <div className="post-list">
      <div className="small">Showing {posts.length} posts (fetched with useFetch & cached)</div>
      <div style={{marginTop:8}}>
        {posts.map(p=>(
          <div key={p.id} className="card" style={{marginBottom:8}}>
            <div style={{fontWeight:600}}>{p.title}</div>
            <div className="small">{p.body}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
