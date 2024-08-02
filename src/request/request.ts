/*
 * This file is part of the Urichy Core package.
 *
 * (c) Ulrich Geraud AHOGLA. <iamcleancoder@gmail.com>
 */

import RequestInterface from "./request.interface";
import RequestFilter from "./request-filter";
import BadRequestContentError from "../error/bad-request-content.error";
import { v4 as uuidv4 } from "uuid";

/**
 * @author Ulrich Geraud AHOGLA. <iamcleancoder@gmail.com
 */
abstract class Request extends RequestFilter implements RequestInterface {
  protected requestId: string = "";
  protected requestParams: Record<string, any> = [];

  createFromPayload(payload: Record<string, any>): RequestInterface {
    const requestValidationResult = this.requestPayloadFilter(payload);
    this.throwMissingFieldsExceptionIfNeeded(
      requestValidationResult["missing_fields"],
    );
    this.throwUnRequiredFieldsExceptionIfNeeded(
      requestValidationResult["unauthorized_fields"],
    );

    try {
      this.applyConstraintsOnRequestFields(payload);
    } catch (error: any) {
      let errorDetail: any;

      if (error.message) errorDetail = error.message;
      else if (error.errors) errorDetail = error.errors;
      else errorDetail = error;

      throw new BadRequestContentError({
        message: "invalid.request.fields",
        details: {
          error: errorDetail,
        },
      });
    }

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
  get(fieldName: string, defaultValue: any = null): any {
    let data: Record<string, any> = this.requestParams;
    for (const key of fieldName.split(".")) {
      if (!data || typeof data !== "object" || !(key in data)) {
        return defaultValue;
      }
      data = data[key];
    }
    return data;
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

export default Request;
