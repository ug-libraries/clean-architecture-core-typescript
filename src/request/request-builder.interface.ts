/*
 * This file is part of the Urichy Core package.
 *
 * (c) Ulrich Geraud AHOGLA. <iamcleancoder@gmail.com>
 */

/**
 * @author Ulrich Geraud AHOGLA. <iamcleancoder@gmail.com
 */
interface RequestBuilderInterface {
  /**
   * Get application request uniq id.
   */
  getRequestId(): string;

  /**
   * Get application request data as object.
   */
  getRequestData(): Record<string, any>;
}

export default RequestBuilderInterface;
