import { useEffect, useRef, useState } from "react";

const cache = new Map(); // url -> data

export default function useFetch(url){
  const [data, setData] = useState(()=> cache.has(url) ? cache.get(url) : null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(()=> !cache.has(url) && !!url);
  const controllerRef = useRef(null);
  const urlRef = useRef(url);

  useEffect(()=>{
    if(!url) return;
    if(url === urlRef.current && cache.has(url)){
      // url same and cache hit -> already initialised
      setData(cache.get(url));
      setLoading(false);
      setError(null);
      return;
    }
    urlRef.current = url;

    let mounted = true;
    controllerRef.current = new AbortController();
    setLoading(true);
    setError(null);

    fetch(url, {signal: controllerRef.current.signal})
      .then(async res => {
        if(!res.ok) throw new Error('Network response was not ok: '+res.status);
        const json = await res.json();
        cache.set(url, json);
        if(mounted){
          setData(json);
          setLoading(false);
        }
      })
      .catch(err=>{
        if(err.name === 'AbortError') return;
        if(mounted){
          setError(err);
          setLoading(false);
        }
      });

    return ()=>{
      mounted = false;
      if(controllerRef.current) controllerRef.current.abort();
    }
  },[url]);

  const retry = ()=>{
    // remove from cache and re-trigger by setting data to null then re-fetching by calling fetch again
    if(!url) return;
    cache.delete(url);
    setData(null);
    setLoading(true);
    setError(null);
    // simple re-fetch
    fetch(url).then(async res=>{
      if(!res.ok) throw new Error('Network response was not ok: '+res.status);
      const json = await res.json();
      cache.set(url, json);
      setData(json);
      setLoading(false);
    }).catch(err=>{
      setError(err);
      setLoading(false);
    })
  }

  return { data, error, loading, retry };
}
