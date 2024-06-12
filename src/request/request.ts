/*
 * This file is part of the Urichy Core package.
 *
 * (c) Ulrich Geraud AHOGLA. <iamcleancoder@gmail.com>
 */

import RequestInterface from "./request.interface";
import RequestBuilderInterface from "./request-builder.interface";
import RequestBuilder from "./request-builder";
import RequestFilter from "./request-filter";
import BadRequestContentError from "../error/bad-request-content.error";

/**
 * @author Ulrich Geraud AHOGLA. <iamcleancoder@gmail.com
 */
abstract class Request extends RequestFilter implements RequestInterface {
  createFromPayload(payload: Record<string, any>): RequestBuilderInterface {
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

    return new RequestBuilder(payload);
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
