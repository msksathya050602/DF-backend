import { Router } from "express";

import auth from "./auth";
import branches from "./branches";

const route = Router();

export default function Routes() {
  [auth, branches].forEach((callback) => {
    callback(route);
  });
  return route;
}
