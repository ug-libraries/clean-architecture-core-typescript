/*
 * This file is part of the Urichy Core package.
 *
 * (c) Ulrich Geraud AHOGLA. <iamcleancoder@gmail.com>
 */

/**
 * @author Ulrich Geraud AHOGLA. <iamcleancoder@gmail.com
 */
class RequestParam {
  constructor(
    private readonly field: string,
    private readonly value: any,
  ) {}

  getField(): string {
    return this.field;
  }

  getValue(): any {
    return this.value;
  }
}

export default RequestParam;
