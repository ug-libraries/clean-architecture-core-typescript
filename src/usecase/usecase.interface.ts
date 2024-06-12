/*
 * This file is part of the Urichy Core package.
 *
 * (c) Ulrich Geraud AHOGLA. <iamcleancoder@gmail.com>
 */

import RequestBuilderInterface from "../request/request-builder.interface";
import PresenterInterface from "../presenter/presenter.interface";

/**
 * @author Ulrich Geraud AHOGLA. <iamcleancoder@gmail.com
 */
interface UsecaseInterface {
  /**
   * Execute the application request.
   */
  execute(): void;

  /**
   * Set applicative request to be processed by usecase.
   *
   * @param request
   */
  setRequest(request: RequestBuilderInterface): this;

  /**
   * Set presenter to get usecase response.
   *
   * @param presenter
   */
  setPresenter(presenter: PresenterInterface): this;
}

export default UsecaseInterface;
