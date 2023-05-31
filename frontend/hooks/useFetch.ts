import { useState } from "react";

const BASE_URL = "http://localhost:3001/";

export const useFetch = (method, uri) => {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const doFetch = async (body?) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}${uri}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      setResponse(data);
      setIsLoading(false);
      return data;
    } catch (error) {
      setIsLoading(false);
      console.error("Failed to fetch:", error);
    }
  };

  return { doFetch, response, isLoading };
};
