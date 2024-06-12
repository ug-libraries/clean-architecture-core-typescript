/*
 * This file is part of the Urichy Core package.
 *
 * (c) Ulrich Geraud AHOGLA. <iamcleancoder@gmail.com>
 */

import UsecaseInterface from "./usecase.interface";
import PresenterInterface from "../presenter/presenter.interface";
import RequestBuilderInterface from "../request/request-builder.interface";

/**
 * @author Ulrich Geraud AHOGLA. <iamcleancoder@gmail.com
 */
abstract class Usecase implements UsecaseInterface {
  protected request: RequestBuilderInterface | undefined;
  protected presenter: PresenterInterface | undefined;

  /**
   * Execute the application request.
   */
  execute(): void {}

  /**
   * Set presenter to get usecase response.
   *
   * @param presenter The presenter to get usecase response
   * @return this
   */
  setPresenter(presenter: PresenterInterface): this {
    this.presenter = presenter;
    return this;
  }

  /**
   * Set applicative request to be processed by usecase.
   *
   * @param request The applicative request
   * @return this
   */
  setRequest(request: RequestBuilderInterface): this {
    this.request = request;
    return this;
  }

  /**
   * Get request data.
   *
   * @return Record<string, any>
   */
  getRequestData(): Record<string, any> {
    if (this.request === undefined) {
      return {};
    }

    return this.request.getRequestData();
  }
}

export default Usecase;
