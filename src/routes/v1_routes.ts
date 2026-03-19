import { Router } from "express";

import auth from "./auth";
import branches from "./branches";
import catalog from "./catalog";
import orders from "./orders";

const route = Router();

export default function Routes() {
  [auth, branches, catalog, orders].forEach((callback) => {
    callback(route);
  });
  return route;
}
