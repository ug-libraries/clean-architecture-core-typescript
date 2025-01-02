/*
 * This file is part of the Urichy Core package.
 *
 * (c) Ulrich Geraud AHOGLA. <iamcleancoder@gmail.com>
 */

import { IPresenter } from "presenter/presenter";
import { IRequest } from "request/request";
import { IResponse } from "response/response";

/**
 * @author Ulrich Geraud AHOGLA. <iamcleancoder@gmail.com
 */
export interface IUsecase {
  /**
   * Execute the application request.
   */
  execute(): void;

  /**
   * Set applicative request to be processed by usecase.
   *
   * @param request
   */
  withRequest(request: IRequest): this;

  /**
   * Set presenter to get usecase response.
   *
   * @param presenter
   */
  withPresenter(presenter: IPresenter): this;
}

export abstract class Usecase implements IUsecase {
  protected request: IRequest | undefined;
  protected presenter: IPresenter | undefined;

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
  withPresenter(presenter: IPresenter): this {
    this.presenter = presenter;
    return this;
  }

  /**
   * Set applicative request to be processed by usecase.
   *
   * @param request The applicative request
   * @return this
   */
  withRequest(request: IRequest): this {
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
  protected getField<T>(fieldName: string, defaultValue?: T): T {
    if (!this.request || typeof this.request.get !== "function") {
      return defaultValue as T;
    }

    return this.request.get<T>(fieldName, defaultValue);
  }

  /**
   * Transport given response to infrastructure layer.
   *
   * @param response The response to be presented
   */
  protected presentResponse(response: IResponse): void {
    if (this.presenter === undefined) {
      return;
    }

    this.presenter.present(response);
  }
}
