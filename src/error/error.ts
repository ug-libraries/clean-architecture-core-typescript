/*
 * This file is part of the Urichy Core package.
 *
 * (c) Ulrich Geraud AHOGLA. <iamcleancoder@gmail.com>
 */

import { StatusCode } from "../response/response";
import { Status } from "../enum/status";

/**
 * @author Ulrich Geraud AHOGLA. <iamcleancoder@gmail.com
 */
export interface IError {
  /**
   * Format exception as array.
   */
  format(): Record<string, any>;

  /**
   * Get custom exception errors.
   */
  getErrors(): Record<string, any>;

  /**
   * Get custom exception errors details.
   */
  getDetails(): Record<string, any>;

  /**
   * Get custom exception errors details message.
   */
  getDetailsMessage(): string;

  /**
   * Get error message.
   */
  getMessage(): string;
}

export class BaseError extends Error implements IError {
  /**
   * Exception status code.
   */
  protected statusCode: number = StatusCode.BAD_REQUEST;

  /**
   * Custom data into the exception.
   */
  protected errors: Record<string, any> = [];

  constructor(errors: Record<string, any>) {
    super(errors["message"] ?? "");
    delete errors["message"];
    this.errors = errors;
  }

  /**
   * Format exception as array.
   */
  format(): Record<string, any> {
    return {
      status: Status.ERROR,
      error_code: this.statusCode,
      message: this.message,
      ...this.getErrors(),
    };
  }

  /**
   * Get custom exception errors details.
   */
  getDetails(): Record<string, any> {
    return this.errors["details"] ?? {};
  }

  /**
   * Get custom exception errors details message.
   */
  getDetailsMessage(): string {
    return this.getDetails()["error"] ?? "";
  }

  /**
   * Get custom exception errors.
   */
  getErrors(): Record<string, any> {
    return this.errors;
  }

  getMessage(): string {
    return this.message;
  }
}

export class BadRequestContentError extends BaseError {}
