import logger, { Logger } from "@helpers/logger";
import { Response } from "express";
import moment from "moment";

import { STATUSCODES } from "@/types/statusCodes";

export interface BaseControllerAttributes {
  logger: Logger;
  badRequest: (res: Response, message: string) => void;
  internalServerError: (res: Response, message: string) => void;
  notFound: (res: Response, message: string) => void;
  conflict: (res: Response, message: string) => void;
  forbidden: (res: Response, message: string) => void;
  created: (res: Response, json: Record<string, any>) => void;
  ok: (res: Response, json: Record<string, any>) => void;
  accepted: (res: Response, json: Record<string, any>) => void;
  noContent: (res: Response) => void;
  tryCall: (action: () => Promise<void>, onError?: (e?: any) => void) => Promise<void>;
  unauthorized: (res: Response, message: string) => void;
  after: (res: Response, cb: () => void | Promise<void>) => void;
  measureTimeSync<T>(action: () => T): [T, number];
  measureTimeAsync<T>(action: () => Promise<T>): Promise<[T, number]>;
}

export class BaseController implements BaseControllerAttributes {
  public logger: Logger;

  constructor() {
    this.logger = logger;
  }

  async tryCall(action: () => Promise<void>, onError?: (e?: any) => void): Promise<void> {
    try {
      await action();
    } catch (err: any) {
      this.logger.error(JSON.stringify(err?.message || err));
      if (onError) {
        onError(err);
      }
    }
  }

  public badRequest(res: Response, message: string, options: Record<string, any> = {}) {
    this.logger.error(
      JSON.stringify({
        error_code: STATUSCODES.BAD_REQUEST,
        error_message: message,
      }),
    );
    return res.status(STATUSCODES.BAD_REQUEST).json({
      error_code: STATUSCODES.BAD_REQUEST,
      error_message: message,
      ...options,
    });
  }

  public internalServerError(res: Response, message: string) {
    this.logger.error(
      JSON.stringify({
        error_code: STATUSCODES.INTERNAL_SERVER_ERROR,
        error_message: message,
      }),
    );
    return res.status(STATUSCODES.INTERNAL_SERVER_ERROR).json({
      error_code: STATUSCODES.INTERNAL_SERVER_ERROR,
      error_message: message,
    });
  }

  public notFound(res: Response, message: string, options: Record<string, any> = {}) {
    this.logger.error(
      JSON.stringify({
        error_code: STATUSCODES.NOT_FOUND,
        error_message: message,
      }),
    );
    return res.status(STATUSCODES.NOT_FOUND).json({
      error_code: STATUSCODES.NOT_FOUND,
      error_message: message,
      ...options,
    });
  }

  public conflict(res: Response, message: string) {
    this.logger.error(
      JSON.stringify({
        error_code: STATUSCODES.CONFLICT,
        error_message: message,
      }),
    );
    return res
      .status(STATUSCODES.CONFLICT)
      .json({ error_code: STATUSCODES.CONFLICT, error_message: message });
  }

  public forbidden(res: Response, message: string) {
    this.logger.error(
      JSON.stringify({
        error_code: STATUSCODES.FORBIDDEN,
        error_message: message,
      }),
    );
    return res
      .status(STATUSCODES.FORBIDDEN)
      .json({ error_code: STATUSCODES.FORBIDDEN, error_message: message });
  }

  public created<T extends Record<string, any>>(res: Response, json: T) {
    this.logger.debug(JSON.stringify(json));
    return res.status(STATUSCODES.CREATED).json({ ...json });
  }

  public ok<T extends Record<string, any>>(res: Response, json: T) {
    this.logger.debug(JSON.stringify(json));
    return res.status(STATUSCODES.OK).json({ ...json });
  }

  public accepted<T extends Record<string, any>>(res: Response, json: T) {
    this.logger.debug(JSON.stringify(json));
    return res.status(STATUSCODES.ACCEPTED).json({ ...json });
  }

  public noContent(res: Response) {
    return res.status(STATUSCODES.NO_CONTENT).json();
  }

  public unauthorized(res: Response, message: string) {
    this.logger.error(
      JSON.stringify({
        error_code: STATUSCODES.UNAUTHORIZED,
        error_message: message,
      }),
    );
    return res
      .status(STATUSCODES.UNAUTHORIZED)
      .json({ error_code: STATUSCODES.UNAUTHORIZED, error_message: message });
  }

  public after(res: Response, cb: () => void | Promise<void>) {
    this.logger.debug("executing after callback...");
    this.logger.debug("after callback executed");
  }

  public measureTimeSync<T>(action: () => T): [T, number] {
    const start = moment().format("YYYY-MM-DD HH:mm:ss");
    const result = action();
    const end = moment().format("YYYY-MM-DD HH:mm:ss");
    const duration = moment.duration(moment(end).diff(moment(start))).asSeconds();
    this.logger.debug(`Execution time: ${duration} seconds`);
    return [result, duration] as const;
  }

  public async measureTimeAsync<T>(action: () => Promise<T>): Promise<[T, number]> {
    const start = moment().format("YYYY-MM-DD HH:mm:ss");
    try {
      const result = await action();
      const end = moment().format("YYYY-MM-DD HH:mm:ss");
      const duration = moment.duration(moment(end).diff(moment(start))).asSeconds();
      this.logger.debug(`Execution time: ${duration} seconds`);
      return [result, duration] as const;
    } catch (error) {
      const end = moment().format("YYYY-MM-DD HH:mm:ss");
      const duration = moment.duration(moment(end).diff(moment(start))).asSeconds();
      this.logger.debug(`Execution time: ${duration} seconds`);
      throw error;
    }
  }
}
