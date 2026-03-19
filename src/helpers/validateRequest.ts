import { CustomRequest } from "@customTypes/customRequest";
import { STATUSCODES } from "@customTypes/statusCodes";
import { ValidationChain, validationResult } from "express-validator";

import { CustomError } from "./customErrors";

export async function validateRequest(
  req: CustomRequest,
  validations: ValidationChain[],
): Promise<void | boolean> {
  await Promise.all(validations.map((validation) => validation.run(req)));
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new CustomError(String(errors.array()[0].msg), STATUSCODES.BAD_REQUEST);
  }
  return true;
}
