import { useFetch } from "../../hooks";

export default function Fetch({
  url,
  method = "get",
  body,
  renderSuccess = (f) => f,
  loadingFallback = <p>loading ... </p>,
  renderError = (f) => f,
}) {
  const { loading, data, error } = useFetch(method, url, body);
  if (loading) return loadingFallback;
  if (error) return renderError(error);
  if (data) return renderSuccess(data);
}
