/*
 * This file is part of the Urichy Core package.
 *
 * (c) Ulrich Geraud AHOGLA. <iamcleancoder@gmail.com>
 */

import PresenterInterface from "../presenter/presenter.interface";
import RequestInterface from "../request/request.interface";

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
  withRequest(request: RequestInterface): this;

  /**
   * Set presenter to get usecase response.
   *
   * @param presenter
   */
  withPresenter(presenter: PresenterInterface): this;
}

export default UsecaseInterface;
