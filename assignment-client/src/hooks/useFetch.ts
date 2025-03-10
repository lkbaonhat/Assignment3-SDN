import { useState, useEffect } from "react";

type FetchState<T> = {
  data: T | null;
  loading: boolean;
  error: Error | null;
};

/**
 * Custom hook for fetching data
 */
function useFetch<T>(
  fetchFunction: () => Promise<T>,
  dependencies: any[] = []
): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setState((prev) => ({ ...prev, loading: true }));
      try {
        const result = await fetchFunction();
        if (isMounted) {
          setState({
            data: result,
            loading: false,
            error: null,
          });
        }
      } catch (error: any) {
        if (isMounted) {
          setState({
            data: null,
            loading: false,
            error,
          });
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, dependencies);

  return state;
}

export default useFetch;
