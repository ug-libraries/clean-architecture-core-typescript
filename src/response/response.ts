/*
 * This file is part of the Urichy Core package.
 *
 * (c) Ulrich Geraud AHOGLA. <iamcleancoder@gmail.com>
 */

import { Status } from "../enum/status";

/**
 * @author Ulrich Geraud AHOGLA. <iamcleancoder@gmail.com
 */
export interface ResponseData {
  [key: string]: any;
}

export type ResponseDataType = { data: any } | { details: any };

export enum StatusCode {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  RESOURCE_ALREADY_EXISTS = 409,
  EXPECTATION_FAILED = 417,
  LOCKED = 423,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
}

export interface IResponse {
  /**
   * Check if response is success
   */
  isSuccess(): boolean;

  /**
   * Get response status code
   */
  getStatusCode(): number;

  /**
   * Get custom response message
   */
  getMessage(): string | null;

  /**
   * Get the response data
   */
  getData(): ResponseData;

  /**
   * Get specific field from response
   */
  get<T>(fieldName: string): T | undefined;

  /**
   * Return response as array with more context
   *
   * @see ResponseTest
   * ex: [
   *     'status'   => 'success',
   *      'code'    => 200,
   *      'message' => null,
   *      'data'    => [
   *          'key' => 'value',
   *      ]
   * ]
   */
  output(): any;
}

export class Response implements IResponse {
  private constructor(
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
