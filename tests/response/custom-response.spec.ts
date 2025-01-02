/*
 * This file is part of the Urichy Core package.
 *
 * (c) Ulrich Geraud AHOGLA. <iamcleancoder@gmail.com>
 */

import { Response, StatusCode } from "../../src/response/response";
import { Status } from "../../src/enum/status";

/**
 * @author Ulrich Geraud AHOGLA. <iamcleancoder@gmail.com
 */
describe("response class", () => {
  it("Should be able to get a custom response without content", () => {
    const instanceResponse = Response.create(
      false,
      StatusCode.NO_CONTENT,
      "success.message",
      {},
    );
    expect(instanceResponse).toBeInstanceOf(Response);
    expect(instanceResponse.isSuccess()).toBeFalsy();
    expect(instanceResponse.getStatusCode()).toEqual(StatusCode.NO_CONTENT);
    expect(instanceResponse.getMessage()).toEqual("success.message");
    expect(instanceResponse.getData()).toEqual({});
  });

  it("Should be able to get a custom response with content", () => {
    const data = {
      field_1: "yes",
      field_2: {
        field_3: 3,
        field_4: {
          field_5: ["nice"],
        },
      },
    };

    const instanceResponse = Response.create(
      true,
      StatusCode.OK,
      "success.response",
      data,
    );
    expect(instanceResponse).toBeInstanceOf(Response);
    expect(instanceResponse.isSuccess()).toBeTruthy();
    expect(instanceResponse.getStatusCode()).toEqual(StatusCode.OK);
    expect(instanceResponse.getMessage()).toEqual("success.response");
    expect(instanceResponse.get<string>("field_1")).toEqual("yes");
    expect(instanceResponse.get<undefined>("field_6")).toBeUndefined();
    expect(instanceResponse.get<number>("field_2.field_3")).toEqual(3);
    expect(instanceResponse.get<string[]>("field_2.field_4.field_5")).toEqual([
      "nice",
    ]);

    expect(instanceResponse.output()).toEqual({
      status: Status.SUCCESS,
      code: StatusCode.OK,
      message: "success.response",
      data: data,
    });
  });
});
