/*
 * This file is part of the Urichy Core package.
 *
 * (c) Ulrich Geraud AHOGLA. <iamcleancoder@gmail.com>
 */

import RequestBuilderInterface from "./request-builder.interface";
import RequestParam from "./request-param";
import { v4 as uuidv4 } from "uuid";

/**
 * @author Ulrich Geraud AHOGLA. <iamcleancoder@gmail.com
 */
class RequestBuilder implements RequestBuilderInterface {
  protected requestId: string;
  protected requestParams: RequestParam[] = [];

  constructor(payload: Record<string, any>) {
    this.requestId = uuidv4();

    // Iterate over the payload object and create RequestParam instances
    for (const [field, value] of Object.entries(payload)) {
      this.requestParams.push(new RequestParam(field, value));
    }
  }

  /**
   * Get application request data as object.
   */
  getRequestData(): Record<string, any> {
    const data: Record<string, any> = {};

    for (const param of this.requestParams) {
      data[param.getField()] = param.getValue();
    }

    return data;
  }

  /**
   * Get application request uniq id.
   */
  getRequestId(): string {
    return this.requestId;
  }
}

export default RequestBuilder;
