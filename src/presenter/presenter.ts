/*
 * This file is part of the Urichy Core package.
 *
 * (c) Ulrich Geraud AHOGLA. <iamcleancoder@gmail.com>
 */

import { IResponse } from "../response/response";

export interface IPresenter {
  /**
   * Use by use case to send application response.
   *
   * @param response The response to be presented.
   */
  present(response: IResponse): void;

  /**
   * Get the use case response that was sent.
   *
   * @return ResponseInterface|undefined The response that was sent.
   */
  getResponse(): IResponse | undefined;

  /**
   * Return the formatted usecase response that was sent.
   *
   * @return any
   */
  getFormattedResponse(): any;
}

export abstract class Presenter implements IPresenter {
  /**
   * The application response
   */
  protected response: IResponse | undefined;

  /**
   * Get the use case formatted response
   */
  getFormattedResponse(): any {
    if (this.response === undefined) {
      return null;
    }

    return this.response.output();
  }

  /**
   * Get the use case response
   */
  getResponse(): IResponse | undefined {
    return this.response;
  }

  /**
   * Present use case response to the client
   */
  present(response: IResponse): void {
    this.response = response;
  }
}
