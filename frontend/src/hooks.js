import { useState, useCallback, useMemo } from "react";

// This object specify different state of auto save
const SAVING_STATE = Object.freeze({
  notSaved: "not saved",
  saving: "saving...",
  saved: "saved",
});
// This hook is used for auto save functionality
const useAutoSave = (
  initialSavingState = SAVING_STATE.notSaved,
  initialData = null
) => {
  const [savingState, setSavingState] = useState(initialSavingState);
  const [data, setData] = useState(initialData);
  const [error, setError] = useState();
  const [timerId, setTimerId] = useState();
  const _data = useMemo(() => data, [data]);

  const save = useCallback(
    (method = "get", url, body, propagateChangeToParent = null) => {
      if (!url) return;
      if (timerId) clearTimeout(timerId);
      // first we save the state and then we update the database
      setData({ ..._data, ...body });
      // we wait 1000ms before we push the change to DB
      setTimerId(
        setTimeout(() => {
          setSavingState(SAVING_STATE.saving);
          body = typeof body === "string" ? body : JSON.stringify(body);
          const headers = {
            "Content-Type": "application/json",
          };
          fetch(url, { method, headers, body })
            .then((res) => {
              if (res.status < 200 || res.status > 299) {
                throw new Error(`API returned with status code ${res.status}`);
              }
            })
            .then(() => {
              propagateChangeToParent && propagateChangeToParent();
              setSavingState(SAVING_STATE.saved);
            })
            .catch((error) => {
              setSavingState(SAVING_STATE.notSaved);
              setError(error);
            });
        }, 1000)
      );
    },
    [timerId, _data]
  );

  return [savingState, data, error, save];
};

export { useAutoSave, SAVING_STATE };
