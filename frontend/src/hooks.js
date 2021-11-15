import { useState, useEffect, useMemo, useCallback } from "react";

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

const jsonFetch = (method = "get", url, body) => {
  body = typeof body === "string" ? body : JSON.stringify(body);
  const headers = {
    "Content-Type": "application/json",
  };
  return fetch(url, { method, headers, body }).then((res) => {
    if (res.status < 200 || res.status > 299) {
      throw new Error(`API returned with status code ${res.status}`);
    }
    return res.json();
  });
};

const useAutoSave = (initialSavingState = "not saved", initialData = null) => {
  const [savingState, setSavingState] = useState(initialSavingState);
  const [data, setData] = useState(initialData);
  const [error, setError] = useState();
  const [timerId, setTimerId] = useState();

  const save = useCallback(
    (method = "get", url, body, propagateToParent = null) => {
      if (!url) return;
      if (timerId) clearTimeout(timerId);
      setTimerId(
        setTimeout(() => {
          setSavingState("saving...");
          body = typeof body === "string" ? body : JSON.stringify(body);
          const headers = {
            "Content-Type": "application/json",
          };
          fetch(url, { method, headers, body })
            .then((res) => res.json())
            .then((jsonData) => {
              setData(jsonData);
              setSavingState("saved");
              propagateToParent && propagateToParent();
            })
            .catch((error) => {
              setSavingState("not saved");
              setError(error);
            });
        }, 1000)
      );
    },
    [timerId]
  );

  return [savingState, data, error, setData, save];
};

export { useFetch, jsonFetch, useAutoSave };
