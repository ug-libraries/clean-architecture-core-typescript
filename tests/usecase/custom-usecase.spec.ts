/*
 * This file is part of the Urichy Core package.
 *
 * (c) Ulrich Geraud AHOGLA. <iamcleancoder@gmail.com>
 */

import Request from "../../src/request/request";
import Response from "../../src/response/response";
import Usecase from "../../src/usecase/usecase";
import StatusCode from "../../src/response/status-code";
import Presenter from "../../src/presenter/presenter";
import PresenterInterface from "../../src/presenter/presenter.interface";
import Status from "../../src/enum/status";
import BadRequestContentError from "../../src/error/bad-request-content.error";

/**
 * @author Ulrich Geraud AHOGLA. <iamcleancoder@gmail.com
 */
describe('usecase class', () => {
    let instancePresenter: PresenterInterface;

    beforeEach(() => {
        const CustomPresenter = class extends Presenter {};
        instancePresenter = new CustomPresenter();
    });

    it('Should be able to execute a custom usecase without request and get response via presenter', () => {
        const CustomUsecase = class extends Usecase {
            execute(): void
            {
                this.presenter?.present(
                    Response.create(true, StatusCode.NO_CONTENT, 'success.response', {
                        field_1: 'yes',
                        field_2: this.getRequestData()
                    })
                );
            }
        };

        const instanceUsecase = new CustomUsecase();
        instanceUsecase
            .setPresenter(instancePresenter)
            .execute();

        const response = instancePresenter.getResponse();
        expect(response).toBeInstanceOf(Response);
        expect(response?.isSuccess()).toBe(true);
        expect(response?.getMessage()).toEqual('success.response');
        expect(response?.getStatusCode()).toEqual(StatusCode.NO_CONTENT);
        expect(response?.getData()).toEqual({
            field_1: 'yes',
            field_2: {}
        });
        expect(response?.get('field_1')).toEqual('yes');
        expect(response?.get('field_3')).toBeNull();
        expect(instancePresenter.getFormattedResponse()).toEqual({
            status: Status.SUCCESS,
            code: StatusCode.NO_CONTENT,
            message: 'success.response',
            data: {
                field_1: 'yes',
                field_2: {}
            }
        });
    });

    it('Should be able to execute a custom usecase with request and get empty response', () => {
        const CustomUsecase = class extends Usecase {
            execute(): void
            {
                this.presenter?.present(
                    Response.create(true, StatusCode.OK, 'success.response', this.getRequestData())
                );
            }
        };

        const CustomRequest = class extends Request {
            protected requestPossibleFields: Record<string, any> = {
                field_1: true,
                field_2: true
            };
        };

        const payload = {
            field_1: true,
            field_2: 3
        };

        const instanceUsecase = new CustomUsecase();
        instanceUsecase
            .setRequest((new CustomRequest()).createFromPayload(payload))
            .setPresenter(instancePresenter)
            .execute();

        const response = instancePresenter.getResponse();
        expect(response).toBeInstanceOf(Response);
        expect(response?.isSuccess()).toBe(true);
        expect(response?.getMessage()).toEqual('success.response');
        expect(response?.getStatusCode()).toEqual(StatusCode.OK);
        expect(response?.getData()).toEqual(payload);
        expect(response?.get('field_1')).toBeTruthy();
        expect(response?.get('field_2')).toEqual(3);
        expect(instancePresenter.getFormattedResponse()).toEqual({
            status: Status.SUCCESS,
            code: StatusCode.OK,
            message: 'success.response',
            data: payload
        });
    });

    it('Should be able to execute a custom usecase without request and presenter', () => {
        const CustomUsecase = class extends Usecase {
            execute(): void
            {
                throw new BadRequestContentError({
                    message: 'BadRequestContentError',
                    details: {
                        field_1: 'yes',
                    }
                });
            }
        };

        const instanceUsecase = new CustomUsecase();

        try {
            instanceUsecase.execute();
        } catch (error: any) {
            const errorDetails = error.format();
            expect(errorDetails.status).toEqual(Status.ERROR);
            expect(errorDetails.error_code).toEqual(StatusCode.BAD_REQUEST);
            expect(errorDetails.message).toEqual('BadRequestContentError');
            expect(errorDetails.details).toEqual({
                field_1: 'yes'
            })
        }
    });

    it('Should be able to execute a custom usecase with request without presenter', () => {
        const CustomUsecase = class extends Usecase {
            execute(): void
            {
                throw new BadRequestContentError({
                    message: 'BadRequestContentError',
                    details: this.getRequestData()
                });
            }
        };

        const CustomRequest = class extends Request {
            protected requestPossibleFields: Record<string, any> = {
                field_1: true,
                field_4: true
            };
        };

        const payload = {
            field_1: true,
            field_4: ['nice', 'good']
        };

        try {
            const instanceUsecase = new CustomUsecase();
            instanceUsecase
                .setRequest((new CustomRequest()).createFromPayload(payload))
                .execute();
        } catch (error: any) {
            const errorDetails = error.format();
            expect(errorDetails.status).toEqual(Status.ERROR);
            expect(errorDetails.error_code).toEqual(StatusCode.BAD_REQUEST);
            expect(errorDetails.message).toEqual('BadRequestContentError');
            expect(errorDetails.details).toEqual(payload)
        }
    });
});