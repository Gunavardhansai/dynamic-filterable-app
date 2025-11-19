import React, { useMemo, useState, useEffect } from 'react'
import FilterableList from './components/FilterableList'
import PostList from './components/PostList'
import PaginatedList from './components/PaginatedList'

export default function App(){
  return (
    <div className="container">
      <div className="header">
        <h1>Dynamic Filterable List</h1>
        
      </div>

      <FilterableList />

      <hr style={{margin:'20px 0'}} />

      <h2>PostList (uses useFetch)</h2>
      <PostList />

      <hr style={{margin:'20px 0'}} />

      <h2>Paginated List (Load more)</h2>
      <PaginatedList />
    </div>
  )
}
