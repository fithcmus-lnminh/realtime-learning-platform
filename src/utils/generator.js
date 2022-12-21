export const isObjectData = (data) => {
  return (
    data &&
    typeof data === "object" &&
    !Array.isArray(data) &&
    Object.keys(data).length > 0
  );
};

export const isArrayData = (data) => {
  return (
    data && typeof data === "object" && Array.isArray(data) && data.length > 0
  );
};
