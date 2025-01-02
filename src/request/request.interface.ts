/*
 * This file is part of the Urichy Core package.
 *
 * (c) Ulrich Geraud AHOGLA. <iamcleancoder@gmail.com>
 */

/**
 * @author Ulrich Geraud AHOGLA. <iamcleancoder@gmail.com
 */
interface RequestInterface {
  /**
   * Create a new application request from payload.
   *
   * @param payload
   */
  createFromPayload(payload: Record<string, any>): RequestInterface;

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

export default RequestInterface;
