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
