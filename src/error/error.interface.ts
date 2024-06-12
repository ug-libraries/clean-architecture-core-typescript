/*
 * This file is part of the Urichy Core package.
 *
 * (c) Ulrich Geraud AHOGLA. <iamcleancoder@gmail.com>
 */

/**
 * @author Ulrich Geraud AHOGLA. <iamcleancoder@gmail.com
 */
interface ErrorInterface {
  /**
   * Format exception as array.
   */
  format(): Record<string, any>;

  /**
   * Get custom exception errors.
   */
  getErrors(): Record<string, any>;

  /**
   * Get custom exception errors details.
   */
  getDetails(): Record<string, any>;

  /**
   * Get custom exception errors details message.
   */
  getDetailsMessage(): string;

  /**
   * Get error message.
   */
  getMessage(): string;
}

export default ErrorInterface;
