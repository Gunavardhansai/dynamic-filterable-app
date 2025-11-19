import { useEffect, useRef, useState } from "react";

/**
 * useFetch hook
 * - caches successful responses in `cache` (url -> data)
 * - deduplicates in-flight requests via `inFlight` map (url -> promise)
 * - supports retry(url) which forces a network fetch (clears cache & inFlight)
 * - uses AbortController to cancel fetches on unmount or url change
 */
const cache = new Map(); // url -> data
const inFlight = new Map(); // url -> promise

export default function useFetch(url){
  const [data, setData] = useState(()=> cache.has(url) ? cache.get(url) : null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(()=> !cache.has(url) && !!url);
  const controllerRef = useRef(null);
  const urlRef = useRef(url);

  useEffect(()=>{
    let cancelled = false;
    // if no url provided, reset states
    if(!url){
      setData(null);
      setError(null);
      setLoading(false);
      return;
    }

    // if url unchanged and we have cached data, nothing to do
    if(url === urlRef.current && cache.has(url)){
      setData(cache.get(url));
      setError(null);
      setLoading(false);
      return;
    }

    // update urlRef
    urlRef.current = url;

    // if cache has data return it
    if(cache.has(url)){
      setData(cache.get(url));
      setError(null);
      setLoading(false);
      return;
    }

    // if there's an in-flight request for the same URL, reuse it
    if(inFlight.has(url)){
      setLoading(true);
      setError(null);
      const p = inFlight.get(url);
      p.then(resData=>{
        if(cancelled) return;
        setData(resData);
        setLoading(false);
      }).catch(err=>{
        if(cancelled) return;
        setError(err);
        setLoading(false);
      });
      return;
    }

    // otherwise start a fresh fetch
    controllerRef.current = new AbortController();
    const signal = controllerRef.current.signal;
    setLoading(true);
    setError(null);

    const fetchPromise = fetch(url, { signal }).then(async res=>{
      if(!res.ok) throw new Error('Network response was not ok: '+res.status);
      const json = await res.json();
      cache.set(url, json);
      return json;
    });

    // store in-flight
    inFlight.set(url, fetchPromise);

    fetchPromise.then(resData=>{
      inFlight.delete(url);
      if(cancelled) return;
      setData(resData);
      setLoading(false);
    }).catch(err=>{
      inFlight.delete(url);
      if(cancelled) return;
      // if aborted, keep error null and loading false
      if (err.name === 'AbortError') {
        // do nothing
        setLoading(false);
      } else {
        setError(err);
        setLoading(false);
      }
    });

    return ()=>{
      cancelled = true;
      // abort ongoing fetch
      if(controllerRef.current){
        controllerRef.current.abort();
      }
    }
  }, [url]);

  // retry: clear cache/inFlight for url and re-trigger by returning a new URL reference
  function retry(){
    if(!url) return;
    cache.delete(url);
    inFlight.delete(url);
    // trick: update urlRef to force effect to run even if same url (by setting to different value briefly)
    urlRef.current = null;
    // small microtask to restore urlRef so effect sees a change
    setTimeout(()=> {
      urlRef.current = url;
      // set loading true and clear error so UI updates immediately
      setLoading(true);
      setError(null);
      // We rely on useEffect to pick up url change via url dependency (the prop 'url' didn't change),
      // so we manually start a fetch here to ensure retry works deterministically.
      // Start a fetch similar to the effect logic:
      const controller = new AbortController();
      controllerRef.current = controller;
      const signal = controller.signal;
      const fetchPromise = fetch(url, { signal }).then(async res=>{
        if(!res.ok) throw new Error('Network response was not ok: '+res.status);
        const json = await res.json();
        cache.set(url, json);
        return json;
      });
      inFlight.set(url, fetchPromise);
      fetchPromise.then(resData=>{
        inFlight.delete(url);
        setData(resData);
        setLoading(false);
      }).catch(err=>{
        inFlight.delete(url);
        if (err.name === 'AbortError') {
          setLoading(false);
        } else {
          setError(err);
          setLoading(false);
        }
      });
    }, 0);
  }

  return { data, error, loading, retry };
}
