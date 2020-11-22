import { useEffect, useState } from 'react';
import axios from 'axios';
const URL = 'https://openlibrary.org/search.json';

export default function useBookSearch(q, page) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [books, setBooks] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setBooks([]);
  }, [q]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    // The cancel variable allows us to cancel unnecessary requests:
    let cancel;
    axios.get(URL, { params: { q, page }, cancelToken: new axios.CancelToken(c => cancel = c) }).then(res => {
      setBooks(prev => {
        // The Set object allows us to remove duplicates:
        return [...new Set([...prev, ...res.data.docs.map(b => b.title)])]
      });
      setHasMore(res.data.docs.length > 0);
      setLoading(false);
    }).catch(e => {
      if(axios.isCancel(e)) return;
      setError(true);
    });
    return () => cancel();
  }, [q, page]);
  return { loading, error, books, hasMore };
}
