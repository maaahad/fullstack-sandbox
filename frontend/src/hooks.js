import React, { useState, useEffect, useMemo } from "react";

const useFetch = (method = "get", url, body) => {
  const [data, setData] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);

  const _body = useMemo(
    () => (typeof body === "string" ? body : JSON.stringify(body)),
    [body]
  );

  useEffect(() => {
    if (!url) return;
    const headers = {
      "Content-Type": "application/json",
    };
    fetch(url, { method, headers, body: _body })
      .then((res) => {
        if (res.status < 200 || res.status > 299) {
          throw new Error(`API returned with status code ${res.status}`);
        }
        return res.json();
      })
      .then(setData)
      .then(() => setLoading(false))
      .catch(setError);
  }, [method, url, _body]);

  return { loading, data, error };
};

export { useFetch };
