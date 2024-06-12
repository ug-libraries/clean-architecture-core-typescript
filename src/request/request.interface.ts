/*
 * This file is part of the Urichy Core package.
 *
 * (c) Ulrich Geraud AHOGLA. <iamcleancoder@gmail.com>
 */

import RequestBuilderInterface from "./request-builder.interface";

/**
 * @author Ulrich Geraud AHOGLA. <iamcleancoder@gmail.com
 */
interface RequestInterface {
  createFromPayload(payload: Record<string, any>): RequestBuilderInterface;
}

export default RequestInterface;
