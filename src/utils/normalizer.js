import CamelcaseKeys from "camelcase-keys";
import SnakecaseKeys from "snakecase-keys";

export const toCamel = (data) => {
  return CamelcaseKeys(data, { exclude: [/-/], deep: true });
};

export const toSnake = (data) => {
  if (typeof data === "string") {
    return Object.keys(SnakecaseKeys({ [data]: null }))[0];
  }
  return SnakecaseKeys(data, { deep: true });
};

export const toQueryString = (obj) => {
  const params = new URLSearchParams();
  Object.keys(obj).map((key) =>
    params.append(key.toString(), String(obj[key]))
  );
  return params.toString();
};
