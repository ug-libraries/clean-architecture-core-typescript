/*
 * This file is part of the Urichy Core package.
 *
 * (c) Ulrich Geraud AHOGLA. <iamcleancoder@gmail.com>
 */

import RequestFilter from "./request-filter";
import { BadRequestContentError } from "../error/error";
import { v4 as uuidv4 } from "uuid";

export interface IRequest {
  /**
   * Create a new application request from payload.
   *
   * @param payload
   */
  createFromPayload(payload: Record<string, any>): IRequest;

  /**
   * Get application request uniq id.
   */
  getRequestId(): string;

  /**
   * Get application request data by field path.
   *
   * @param fieldName
   * @param defaultValue
   */
  get<T>(fieldName: string, defaultValue?: T): T;

  /**
   * Get application request data as object.
   */
  toArray(): Record<string, any>;
}

/**
 * @author Ulrich Geraud AHOGLA. <iamcleancoder@gmail.com
 */
export abstract class Request extends RequestFilter implements IRequest {
  protected requestId: string = "";
  protected requestParams: Record<string, any> = [];

  createFromPayload(payload: Record<string, any>): IRequest {
    const requestValidationResult = this.requestPayloadFilter(payload);
    this.throwMissingFieldsExceptionIfNeeded(
      requestValidationResult["missing_fields"],
    );
    this.throwUnRequiredFieldsExceptionIfNeeded(
      requestValidationResult["unauthorized_fields"],
    );

    this.applyConstraintsOnRequestFields(payload);

    this.requestId = uuidv4();
    this.requestParams = payload;

    return this;
  }

  /**
   * Get application request uniq id.
   */
  getRequestId(): string {
    return this.requestId;
  }

  /**
   * Get application request data by field path.
   *
   * @param fieldName
   * @param defaultValue
   */
  get<T>(fieldName: string, defaultValue?: T): T {
    let data: unknown = this.requestParams;

    const isObject = (value: unknown): value is Record<string, unknown> =>
      typeof value === "object" && value !== null;

    for (const key of fieldName.split(".")) {
      if (!isObject(data) || !(key in data)) {
        return defaultValue as T;
      }
      data = data[key];
    }

    return data as T;
  }

  /**
   * Get application request data as object.
   */
  toArray(): Record<string, any> {
    return this.requestParams;
  }

  /**
   * Throws an error if the request has missing fields.
   */
  protected throwMissingFieldsExceptionIfNeeded(
    missingFields: Record<string, any>,
  ): void {
    if (Object.keys(missingFields).length > 0) {
      throw new BadRequestContentError({
        message: "missing.required.fields",
        details: {
          missing_fields: missingFields,
        },
      });
    }
  }

  /**
   * Throws an error if the request has unauthorized fields.
   */
  protected throwUnRequiredFieldsExceptionIfNeeded(
    unauthorizedFields: Record<string, any>,
  ): void {
    if (Object.keys(unauthorizedFields).length > 0) {
      throw new BadRequestContentError({
        message: "illegal.fields",
        details: {
          unrequired_fields: unauthorizedFields,
        },
      });
    }
  }

  /**
   * Apply constraints on request fields if needed.
   */
  protected applyConstraintsOnRequestFields(
    requestData: Record<string, any>,
  ): void {}
}
