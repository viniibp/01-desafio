export function extractQueryParams(query?: string) {    
  if (!query) return {};
  return query
    .substring(1)
    .split("&")
    .reduce((queryParams, param) => {
      const [key, value] = param.split("=");
      Object.assign(queryParams, { [key]: value });
      return queryParams;
    }, {});
}
