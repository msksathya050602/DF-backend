import { CustomOpenAPIPath } from "@customTypes/customOpenapi";
import { authenticationPaths } from "./authentication";
import { branchPaths } from "./branches";
import { catalogPaths } from "./catalog";
import { orderPaths } from "./orders";

export const paths: CustomOpenAPIPath = {
  ...authenticationPaths,
  ...branchPaths,
  ...catalogPaths,
  ...orderPaths,
};
