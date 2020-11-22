import { useState, useRef, useCallback } from 'react';
import useBookSearch from './hooks/useBookSearch';

export default function App() {
  const [query, setQuery] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const { loading, error, books, hasMore } = useBookSearch(query, pageNumber);

  const observer = useRef(null);
  // The useCallback hook allows us to change the ref's value:
  const lastBookElement = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    // The IntersectionObserver allows us to track the page scrolling:
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore)
        setPageNumber(prev => prev + 1);
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const handleSearch = e => {
    setQuery(e.target.value);
    setPageNumber(1);
  }

  return <>
    <>
      <input type = 'text' value = { query } onChange = { handleSearch }/>
      {
        books.map((book, index) => {
          return books.length === index + 1
          ? <p ref = { lastBookElement } key = { book }>{ book }</p>
          : <p key = { book }>{ book }</p>
        })
      }
      { loading && <p>Loading...</p> }
      { error && <p>Error!</p> }
    </>
  </>;
}
