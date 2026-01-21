import { Router } from "express";

import branches from "./branches";

const route = Router();

export default function Routes() {
  branches(route);
  return route;
}
