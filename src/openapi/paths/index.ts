import { CustomOpenAPIPath } from "@customTypes/customOpenapi";
import { authenticationPaths } from "./authentication";
import { branchPaths } from "./branches";

export const paths: CustomOpenAPIPath = {
  ...authenticationPaths,
  ...branchPaths,
};
