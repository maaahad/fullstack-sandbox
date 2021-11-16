// This method is for performing http request

const getJSON = (method = "get", url, body) => {
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

export { getJSON };
