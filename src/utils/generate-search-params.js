export const genereateSearchParams = (obj) => {
  return (
    `?${
      Object.entries(obj)
        .filter(([_, v]) => { return v != undefined || v != null; })
        .map(([k]) => { return `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`; })
        .join('&')}`
  );
};
