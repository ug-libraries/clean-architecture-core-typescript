/*
 * This file is part of the Urichy Core package.
 *
 * (c) Ulrich Geraud AHOGLA. <iamcleancoder@gmail.com>
 */

import PresenterInterface from "./presenter.interface";
import ResponseInterface from "../response/response.interface";

/**
 * @author Ulrich Geraud AHOGLA. <iamcleancoder@gmail.com
 */
abstract class Presenter implements PresenterInterface {
  /**
   * The application response
   */
  protected response: ResponseInterface | undefined;

  /**
   * Get the use case formatted response
   */
  getFormattedResponse(): any {
    return this.response?.output();
  }

  /**
   * Get the use case response
   */
  getResponse(): ResponseInterface | undefined {
    return this.response;
  }

  /**
   * Present use case response to the client
   */
  present(response: ResponseInterface): void {
    this.response = response;
  }
}

export default Presenter;
