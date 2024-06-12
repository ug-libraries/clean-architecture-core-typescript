/*
 * This file is part of the Urichy Core package.
 *
 * (c) Ulrich Geraud AHOGLA. <iamcleancoder@gmail.com>
 */

import ResponseInterface from "../response/response.interface";

/**
 * @author Ulrich Geraud AHOGLA. <iamcleancoder@gmail.com
 */
interface PresenterInterface {
  /**
   * Use by use case to send application response.
   *
   * @param response The response to be presented.
   */
  present(response: ResponseInterface): void;

  /**
   * Get the use case response that was sent.
   *
   * @return ResponseInterface|undefined The response that was sent.
   */
  getResponse(): ResponseInterface | undefined;

  /**
   * Return the formatted usecase response that was sent.
   *
   * @return any
   */
  getFormattedResponse(): any;
}

export default PresenterInterface;
