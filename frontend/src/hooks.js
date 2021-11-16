import { useState, useEffect, useMemo, useCallback } from "react";

// This object specify different state of auto save
const SAVING_STATE = Object.freeze({
  notSaved: "not saved",
  saving: "saving...",
  saved: "saved",
});
// This hook is used for auto save functionality
// This method is not optimized yet ...
const useAutoSave = (
  initialSavingState = SAVING_STATE.notSaved,
  initialData = null
) => {
  const [savingState, setSavingState] = useState(initialSavingState);
  const [data, setData] = useState(initialData);
  const [error, setError] = useState();
  const [timerId, setTimerId] = useState();

  const save = useCallback(
    (method = "get", url, body, propagateChangeToParent = null) => {
      if (!url) return;
      if (timerId) clearTimeout(timerId);
      setTimerId(
        setTimeout(() => {
          setSavingState(SAVING_STATE.saving);
          body = typeof body === "string" ? body : JSON.stringify(body);
          const headers = {
            "Content-Type": "application/json",
          };
          fetch(url, { method, headers, body })
            .then((res) => res.json())
            .then((jsonData) => {
              setData(jsonData);
              setSavingState(SAVING_STATE.saved);
              propagateChangeToParent && propagateChangeToParent();
            })
            .catch((error) => {
              setSavingState(SAVING_STATE.notSaved);
              setError(error);
            });
        }, 1000)
      );
    },
    [timerId]
  );

  return [savingState, data, error, save];
};

export { useAutoSave, SAVING_STATE };
