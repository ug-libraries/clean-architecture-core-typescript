/*
 * This file is part of the Urichy Core package.
 *
 * (c) Ulrich Geraud AHOGLA. <iamcleancoder@gmail.com>
 */

import Request from "../../src/request/request";
import BadRequestContentError from "../../src/error/bad-request-content.error";
import Status from "../../src/enum/status";
import StatusCode from "../../src/response/status-code";
import { z } from "zod";

/**
 * @author Ulrich Geraud AHOGLA. <iamcleancoder@gmail.com
 */
describe('request class', () => {
    it('Should be able to build a custom new request and get request ID', () => {
        const CustomRequest = class extends Request {};
        const instanceRequest = (new CustomRequest()).createFromPayload({});
        expect(instanceRequest.getRequestId()).not.toBeNull();
    });

    it('Should be able to build a custom new request with parameters', () => {
        const CustomRequest = class extends Request {
            protected requestPossibleFields: Record<string, any> = {
                field_1: true,
                field_2: true
            };
        };
        const instanceRequest = (new CustomRequest()).createFromPayload({
            field_1: true,
            field_2: true
        });
        expect(instanceRequest.getRequestId()).not.toBeNull();
    });

    it('Should be able to build a custom new request with optional parameters', () => {
        const CustomRequest = class extends Request {
            protected requestPossibleFields: Record<string, any> = {
                field_1: true,
                field_2: false
            };
        };
        const instanceRequest = (new CustomRequest()).createFromPayload({
            field_1: true
        });
        expect(instanceRequest.getRequestId()).not.toBeNull();
    });

    it('Should be able to build a custom new request and get as object', () => {
        const CustomRequest = class extends Request {
            protected requestPossibleFields: Record<string, any> = {
                field_1: true,
                field_2: true,
                field_4: {
                    field_5: true
                }
            };
        };
        const instanceRequest = (new CustomRequest()).createFromPayload({
            field_1: ['yes', 'no'],
            field_2: 3,
            field_4: {
                field_5: ['nice']
            }
        });

        expect(instanceRequest.toArray()).toStrictEqual({field_1: ['yes', 'no'], field_2: 3, field_4: {field_5: ['nice']}});
        expect(instanceRequest.get<string[]>('field_1')).toEqual(['yes', 'no']);
        expect(instanceRequest.get<number>('field_2')).toEqual(3);
        expect(instanceRequest.get<string[]>('field_4.field_5')).toEqual(['nice']);
        expect(instanceRequest.get<undefined>('field_3')).toBeUndefined();
        expect(instanceRequest.get<undefined>('field_2.field_3')).toBeUndefined();

        expect(instanceRequest.get<string>('field_3', 'default_value')).toEqual('default_value');
        expect(instanceRequest.get<number>('field_2.field_3', 666)).toEqual(666);
    });

    it('Should not be able to build a custom new request with missing parameters', () => {
        const CustomRequest = class extends Request {
            protected requestPossibleFields: Record<string, any> = {
                field_1: true,
                field_2: true
            };
        };

        try {
            const instanceRequest = (new CustomRequest()).createFromPayload({
                field_1: true
            });
        } catch (error: any) {
            const errorDetails = error.format();
            expect(error instanceof BadRequestContentError).toBeTruthy();
            expect(errorDetails.status).toEqual(Status.ERROR);
            expect(errorDetails.error_code).toEqual(StatusCode.BAD_REQUEST);
            expect(errorDetails.message).toEqual('missing.required.fields');
            expect(errorDetails.details).toEqual({
                missing_fields: {'field_2': 'required'}
            });
        }
    });

    it('Should not be able to build a custom new request with missing nested parameters', () => {
        const CustomRequest = class extends Request {
            protected requestPossibleFields: Record<string, any> = {
                field_1: true,
                field_2: {
                    field_3: true
                }
            };
        };

        try {
            const instanceRequest = (new CustomRequest()).createFromPayload({
                field_1: true,
                field_2: {}
            });
        } catch (error: any) {
            const errorDetails = error.format();
            expect(error instanceof BadRequestContentError).toBeTruthy();
            expect(errorDetails.status).toEqual(Status.ERROR);
            expect(errorDetails.error_code).toEqual(StatusCode.BAD_REQUEST);
            expect(errorDetails.message).toEqual('missing.required.fields');
            expect(errorDetails.details).toEqual({
                missing_fields: {'field_2.field_3': 'required'}
            });
        }
    });

    it('Should not be able to build a custom new request with missing array parameters', () => {
        const CustomRequest = class extends Request {
            protected requestPossibleFields: Record<string, any> = {
                field_1: true,
                field_2: {
                    field_3: true
                }
            };
        };

        try {
            const instanceRequest = (new CustomRequest()).createFromPayload({
                field_1: true,
                field_2: 1
            });
        } catch (error: any) {
            const errorDetails = error.format();
            expect(error instanceof BadRequestContentError).toBeTruthy();
            expect(errorDetails.status).toEqual(Status.ERROR);
            expect(errorDetails.error_code).toEqual(StatusCode.BAD_REQUEST);
            expect(errorDetails.message).toEqual('missing.required.fields');
            expect(errorDetails.details).toEqual({
                missing_fields: {'field_2': 'required field type not matching array'}
            });
        }
    });

    it('Should not be able to build a custom new request with unrequired parameters ', () => {
        const CustomRequest = class extends Request {
            protected requestPossibleFields: Record<string, any> = {
                field_1: true,
                field_2: true
            };
        };

        try {
            const instanceRequest = (new CustomRequest()).createFromPayload({
                field_1: true,
                field_2: true,
                field_3: 1
            });
        } catch (error: any) {
            const errorDetails = error.format();
            expect(error instanceof BadRequestContentError).toBeTruthy();
            expect(errorDetails.status).toEqual(Status.ERROR);
            expect(errorDetails.error_code).toEqual(StatusCode.BAD_REQUEST);
            expect(errorDetails.message).toEqual('illegal.fields');
            expect(errorDetails.details).toEqual({
                unrequired_fields: ['field_3']
            });
        }
    });

    it('Should not be able to build a custom new request with unrequired nested parameters ', () => {
        const CustomRequest = class extends Request {
            protected requestPossibleFields: Record<string, any> = {
                field_1: true,
                field_2: {
                    field_3: true
                }
            };
        };

        try {
            const instanceRequest = (new CustomRequest()).createFromPayload({
                field_1: true,
                field_2: {
                    field_3: 2,
                    field_4: true
                },
            });
        } catch (error: any) {
            const errorDetails = error.format();
            expect(error instanceof BadRequestContentError).toBeTruthy();
            expect(errorDetails.status).toEqual(Status.ERROR);
            expect(errorDetails.error_code).toEqual(StatusCode.BAD_REQUEST);
            expect(errorDetails.message).toEqual('illegal.fields');
            expect(errorDetails.details).toEqual({
                unrequired_fields: ['field_2.field_4']
            });
        }
    });

    it('Should not be able to build a custom new request with unrequired deep nested parameters', () => {
        const CustomRequest = class extends Request {
            protected requestPossibleFields: Record<string, any> = {
                field_1: true,
                field_2: {
                    field_3: {
                        field_4: true
                    }
                }
            };
        };

        try {
            const instanceRequest = (new CustomRequest()).createFromPayload({
                field_1: true,
                field_2: {
                    field_3: {
                        field_4: true,
                        field_5: true,
                    }
                },
            });
        } catch (error: any) {
            const errorDetails = error.format();
            expect(error instanceof BadRequestContentError).toBeTruthy();
            expect(errorDetails.status).toEqual(Status.ERROR);
            expect(errorDetails.error_code).toEqual(StatusCode.BAD_REQUEST);
            expect(errorDetails.message).toEqual('illegal.fields');
            expect(error.getDetails()).toEqual({
                unrequired_fields: ['field_2.field_3.field_5']
            });
            expect(errorDetails.details).toEqual({
                unrequired_fields: ['field_2.field_3.field_5']
            });
        }
    });

    it('Should not be able to build a custom new request with failed validation constraints', () => {
        const CustomRequest = class extends Request {
            protected requestPossibleFields: Record<string, any> = {
                field_1: true,
                field_2: true
            };

            protected applyConstraintsOnRequestFields(requestData: Record<string, any>): void
            {
                const mySchema = z.string({
                    invalid_type_error: '[field_2] must be a string.',
                });
                const result = mySchema.safeParse(requestData.field_2);

                if (!result.success) {
                    throw new BadRequestContentError({
                        message: 'invalid.request.fields',
                        errors: result.error.format()
                    })
                }
            }
        };

        try {
            const instanceRequest = (new CustomRequest()).createFromPayload({
                field_1: ['yes', 'no'],
                field_2: 3
            });
        } catch (error: any) {
            const errorDetails = error.format();
            expect(error instanceof BadRequestContentError).toBeTruthy();
            expect(errorDetails.status).toEqual(Status.ERROR);
            expect(errorDetails.error_code).toEqual(StatusCode.BAD_REQUEST);
            expect(error.getMessage()).toEqual('invalid.request.fields');
            expect(errorDetails.errors).toEqual({
                _errors: ['[field_2] must be a string.'],
            });
        }
    });

    it('Should not be able to build a custom new request with failed validation constraints with message', () => {
        const CustomRequest = class extends Request {
            protected requestPossibleFields: Record<string, any> = {
                field_1: true,
                field_2: true
            };

            protected applyConstraintsOnRequestFields(requestData: Record<string, any>): void
            {
                throw new BadRequestContentError({
                    message: 'validation.constraints'
                });
            }
        };

        try {
            const instanceRequest = (new CustomRequest()).createFromPayload({
                field_1: ['yes', 'no'],
                field_2: 3
            });
        } catch (error: any) {
            const errorDetails = error.format();
            expect(error instanceof BadRequestContentError).toBeTruthy();
            expect(errorDetails.status).toEqual(Status.ERROR);
            expect(errorDetails.error_code).toEqual(StatusCode.BAD_REQUEST);
            expect(errorDetails.message).toEqual('validation.constraints');
        }
    });

    it('Should not be able to build a custom new request with failed validation constraints without message', () => {
        const CustomRequest = class extends Request {
            protected requestPossibleFields: Record<string, any> = {
                field_1: true,
                field_4: true
            };

            protected applyConstraintsOnRequestFields(requestData: Record<string, any>): void
            {
                throw new Error('error_message');
            }
        };

        try {
            const instanceRequest = (new CustomRequest()).createFromPayload({
                field_1: ['yes', 'no'],
                field_4: 3
            });
        } catch (error: any) {
            expect(error instanceof Error).toBeTruthy();
            expect(error.message).toEqual('error_message');
        }
    });
});