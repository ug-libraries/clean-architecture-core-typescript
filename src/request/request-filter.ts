/*
 * This file is part of the Urichy Core package.
 *
 * (c) Ulrich Geraud AHOGLA. <iamcleancoder@gmail.com>
 */

/**
 * @author Ulrich Geraud AHOGLA. <iamcleancoder@gmail.com
 */
abstract class RequestFilter {
  /**
   * All possible request fields. Set field value to null by default.
   * Even if field is not required, you have to register into fields list.
   * This will allow you to control all fields in the request and avoid having unexpected fields.
   */
  protected requestPossibleFields: Record<string, any> = [];

  /**
   * Filter request data to identified missing/unauthorized fields.
   *
   * @param requestPayload
   * @protected
   */
  protected requestPayloadFilter(requestPayload: Record<string, any>): any {
    return {
      unauthorized_fields: RequestFilter.findUnAuthorizedFields(
        requestPayload,
        this.requestPossibleFields,
      ),
      missing_fields: RequestFilter.findMissingFields(
        this.requestPossibleFields,
        requestPayload,
      ),
    };
  }

  /**
   * Find unauthorized fields from request.
   *
   * @param requestPayload
   * @param authorizedFields
   * @param prefix
   * @protected
   */
  protected static findUnAuthorizedFields(
    requestPayload: Record<string, any>,
    authorizedFields: Record<string, any>,
    prefix: string = "",
  ): string[] {
    const unAuthorizedFields: string[] = [];
    for (const field in requestPayload) {
      if (Object.prototype.hasOwnProperty.call(requestPayload, field)) {
        const value = requestPayload[field];
        const fullKey = prefix + field;
        if (!(field in authorizedFields)) {
          unAuthorizedFields.push(fullKey);
        } else if (
          this.isObject(value) &&
          this.isObject(authorizedFields[field])
        ) {
          unAuthorizedFields.push(
            ...this.findUnAuthorizedFields(
              value,
              authorizedFields[field],
              fullKey + ".",
            ),
          );
        }
      }
    }

    return unAuthorizedFields;
  }

  /**
   * Find missing fields from request.
   *
   * @param authorizedFields
   * @param requestPayload
   * @param prefix
   * @protected
   */
  protected static findMissingFields(
    authorizedFields: Record<string, any>,
    requestPayload: Record<string, any>,
    prefix: string = "",
  ): Record<string, string> {
    const missingFields: Record<string, string> = {};
    for (const field in authorizedFields) {
      if (Object.prototype.hasOwnProperty.call(authorizedFields, field)) {
        const value = authorizedFields[field];
        const fullKey = prefix + field;
        if (value && !(field in requestPayload)) {
          missingFields[fullKey] = this.isObject(value)
            ? "required field type not matching object"
            : "required";
        } else if (field in requestPayload) {
          if (
            this.isObject(value) &&
            typeof requestPayload[field] !== typeof value
          ) {
            missingFields[fullKey] = "required field type not matching array";
          } else if (
            this.isObject(requestPayload[field]) &&
            this.isObject(value)
          ) {
            Object.assign(
              missingFields,
              this.findMissingFields(
                value,
                requestPayload[field],
                fullKey + ".",
              ),
            );
          }
        }
      }
    }

    return missingFields;
  }

  /**
   * Check if the value is an object
   *
   * @param value
   */
  static isObject(value: any): boolean {
    return typeof value === "object" && value !== null;
  }
}

export default RequestFilter;
