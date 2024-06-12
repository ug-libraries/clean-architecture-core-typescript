/*
 * This file is part of the Urichy Core package.
 *
 * (c) Ulrich Geraud AHOGLA. <iamcleancoder@gmail.com>
 */

import ResponseData from "./enum/response-data";

/**
 * @author Ulrich Geraud AHOGLA. <iamcleancoder@gmail.com
 */
interface ResponseInterface {
  /**
   * Check if response is success
   */
  isSuccess(): boolean;

  /**
   * Get response status code
   */
  getStatusCode(): number;

  /**
   * Get custom response message
   */
  getMessage(): string | null;

  /**
   * Get the response data
   */
  getData(): ResponseData;

  /**
   * Get specific field from response
   */
  get(fieldName: string): any;

  /**
   * Return response as array with more context
   *
   * @see ResponseTest
   * ex: [
   *     'status'   => 'success',
   *      'code'    => 200,
   *      'message' => null,
   *      'data'    => [
   *          'key' => 'value',
   *      ]
   * ]
   */
  output(): any;
}

export default ResponseInterface;
