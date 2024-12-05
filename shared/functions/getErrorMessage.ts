import { isError } from "./isError";

export function getErrorMessage(error: unknown) {
  return isError(error) ? error.message : "An unknown error occurred.";
}
