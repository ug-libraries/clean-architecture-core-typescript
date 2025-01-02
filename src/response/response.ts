/*
 * This file is part of the Urichy Core package.
 *
 * (c) Ulrich Geraud AHOGLA. <iamcleancoder@gmail.com>
 */

import ResponseInterface from "./response.interface";
import ResponseData from "./enum/response-data";
import type { ResponseData as ResponseDataType } from "./type/response-data";
import Status from "../enum/status";

/**
 * @author Ulrich Geraud AHOGLA. <iamcleancoder@gmail.com
 */
class Response implements ResponseInterface {
  constructor(
    private readonly success: boolean,
    private readonly statusCode: number,
    private readonly message: string,
    private readonly data: ResponseData,
  ) {}

  /**
   * Create a new application response
   *
   * @param success True if the response was successfully, false otherwise
   * @param statusCode The response status code
   * @param message The custom response message
   * @param data The response data
   *
   * @return Response
   */
  static create(
    success: boolean,
    statusCode: number,
    message: string,
    data: ResponseData,
  ) {
    return new Response(success, statusCode, message, data);
  }

  /**
   * Get specific field from response
   *
   * ex: value = response.get('user.firstname') // return user firstname value or null if not found
   * ex: value = response.get('user.account.balance') // return user account balance value or null if not found
   */
  get<T>(fieldName: string): T | undefined {
    let data: unknown = this.data;

    const isObject = (value: unknown): value is Record<string, unknown> =>
      typeof value === "object" && value !== null;

    for (const key of fieldName.split(".")) {
      if (!isObject(data) || !(key in data)) {
        return undefined;
      }
      data = data[key];
    }

    return data as T;
  }

  /**
   * Get the response data
   *
   * @return ResponseData
   */
  getData(): ResponseData {
    return this.data;
  }

  /**
   * Get custom response message
   */
  getMessage(): string | null {
    return this.message;
  }

  /**
   * Get response status code
   */
  getStatusCode(): number {
    return this.statusCode;
  }

  /**
   * Check if response is success
   */
  isSuccess(): boolean {
    return this.success;
  }

  output(): any {
    return {
      status: this.status(),
      code: this.statusCode,
      message: this.message,
      ...this.mapDataKeyAccordingToResponseStatus(),
    };
  }

  private status(): Status {
    return this.isSuccess() ? Status.SUCCESS : Status.ERROR;
  }

  private mapDataKeyAccordingToResponseStatus(): ResponseDataType {
    return this.isSuccess()
      ? { data: this.getData() }
      : { details: this.getData() };
  }
}

export default Response;
