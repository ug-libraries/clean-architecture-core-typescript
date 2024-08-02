/*
 * This file is part of the Urichy Core package.
 *
 * (c) Ulrich Geraud AHOGLA. <iamcleancoder@gmail.com>
 */

import UsecaseInterface from "./usecase.interface";
import PresenterInterface from "../presenter/presenter.interface";
import RequestInterface from "../request/request.interface";
import ResponseInterface from "../response/response.interface";

/**
 * @author Ulrich Geraud AHOGLA. <iamcleancoder@gmail.com
 */
abstract class Usecase implements UsecaseInterface {
  protected request: RequestInterface | undefined;
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
  withPresenter(presenter: PresenterInterface): this {
    this.presenter = presenter;
    return this;
  }

  /**
   * Set applicative request to be processed by usecase.
   *
   * @param request The applicative request
   * @return this
   */
  withRequest(request: RequestInterface): this {
    this.request = request;
    return this;
  }

  /**
   * Get request data.
   *
   * @return Record<string, any>
   */
  protected getRequestData(): Record<string, any> {
    if (this.request === undefined) {
      return {};
    }

    return this.request.toArray();
  }

  /**
   * Get application request uniq id.
   */
  protected getRequestId(): string {
    if (this.request === undefined) {
      return "";
    }

    return this.request.getRequestId();
  }

  /**
   * Get request data by field path.
   *
   * @param fieldName
   * @param defaultValue
   */
  protected getField(fieldName: string, defaultValue: any = null): any {
    if (this.request === undefined) {
      return defaultValue;
    }

    return this.request.get(fieldName, defaultValue);
  }

  /**
   * Transport given response to infrastructure layer.
   *
   * @param response The response to be presented
   */
  protected presentResponse(response: ResponseInterface): void {
    if (this.presenter === undefined) {
      return;
    }

    this.presenter.present(response);
  }
}

export default Usecase;
