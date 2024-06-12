# Core library for clean architecture in TypeScript

## Introduction

This documentation guides you through the utilization of the core library for implementing clean architecture in project
using TypeScript.

We'll explore the creation of custom application request and use cases, paying special attention to handling missing and
unauthorized fields.

Practical examples are provided using code snippets from a test suite to showcase the library's usage in building a
modular and clean TypeScript application.

## Prerequisites

Ensure that you have the following:

- `TypeScript` installed on your machine (version `5.4.5`).
- `Yarn or npm or pnpm` installed for dependency management.

## Installation

```
> With yarn
yarn add @ug-ts/clean-architecture-core

> With npm
npm install @ug-ts/clean-architecture-core

> With pnpm
pnpm add @ug-ts/clean-architecture-core
```

## Core Overview

### Application Request

Requests serve as input object, encapsulating data from your http controller. In the core library, use the `@ug-ts/clean-architecture-core/lib/esm/src/request/request` class
as the foundation for creating custom application request object and implements `@ug-ts/clean-architecture-core/lib/esm/src/request/request.interface` interface.
Define the expected fields using the `requestPossibleFields` property.

### Presenter

Presenters handle the output logic of your usecase. You have to extends `@ug-ts/clean-architecture-core/lib/esm/src/presenter/presenter` and
implements `@ug-ts/clean-architecture-core/lib/esm/src/presenter/presenter.interface` interface.

### Usecase

Use cases encapsulate business logic and orchestrate the flow of data between requests, entities, and presenters.
Extends the `@ug-ts/clean-architecture-core/lib/esm/src/usecase/usecase` class and implements `@ug-ts/clean-architecture-core/lib/esm/src/usecase/usecase.interface` with the execute method.

### Response

- Use `@ug-ts/clean-architecture-core/lib/esm/src/response/response` to create usecase `response`.
- Supports success/failure status, custom message, HTTP status codes, and response data.
- I recommend you to extends `@ug-ts/clean-architecture-core/lib/esm/src/response/response` class to create your own response


## Example of how to use the core library

> NB: I recommend you to @see all tests in `tests` folder to get more about examples.

1. Creating a custom request and handling missing/unauthorized fields

- Extends `@ug-ts/clean-architecture-core/lib/esm/src/request/request` and implements `@ug-ts/clean-architecture-core/lib/esm/src/request/request.interface` to create
  custom application request objects.
- Define the possible fields in the `requestPossibleFields` property.

```ts
import RequestInterface from '@ug-ts/clean-architecture-core/lib/esm/src/request/request.interface';
import RequestInterface from '@ug-ts/clean-architecture-core/lib/esm/src/request/request';
import BadRequestContentError from '@ug-ts/clean-architecture-core/lib/esm/src/error/bad-request-content.error';

interface CustomRequestInterface extends RequestInterface {
}

class CustomRequest extends Request implements CustomRequestInterface {
  protected requestPossibleFields: Record<string, any> = {
    firstname: true, // required
    lastname: true, // required
    roles: true,
  };
}


// You can also apply constraints to the request fields. For that you have to modify the `applyConstraintsOnRequestFields` methods as below:
class CustomRequest extends Request implements CustomRequestInterface {
  protected requestPossibleFields: Record<string, any> = {
    field_1: true, // required
    field_2: false // optional
  };

  protected applyConstraintsOnRequestFields(requestData: Record<string, any>): void
  {
    const mySchema = z.string({
      invalid_type_error: '[field_2] must be a string.',
    });
    const result = mySchema.safeParse(requestData.field_2);

    if (!result.success) {
      throw new BadRequestContentError(result.error.format())
    }
  }
}

// when unauthorized fields
const UnrequiredFieldRequest = class extends Request {
  protected requestPossibleFields: Record<string, any> = {
    field_1: true,
  };
};

try {
  const instanceRequest = (new UnrequiredFieldRequest()).createFromPayload({
    field_1: true,
    field_2: ['nice'],
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

// when missing fields
const MissingFieldRequest = class extends Request {
  protected requestPossibleFields: Record<string, any> = {
    field_1: true,
    field_2: {
      field_3: true
    }
  };
};

try {
  const instanceRequest = (new MissingFieldRequest()).createFromPayload({
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

// when everything is good
const EverythingOKRequest = class extends Request {
  protected requestPossibleFields: Record<string, any> = {
    field_1: true,
    field_2: true
  };
};
const instanceRequest = (new EverythingOKRequest()).createFromPayload({
  field_1: true,
  field_2: true
});

console.log(instanceRequest.getRequestId()); // 6d326314-f527-483c-80df-7c157acdb95b
expect(instanceRequest).toBeInstanceOf(RequestBuilder);


// or with nested request parameters
const NestedParameterRequest = class extends Request {
  protected requestPossibleFields: Record<string, any> = {
    field_1: true,
    field_2: {
        field_3: true
    }
  };
};
const instanceNestedParamaterRequest = (new NestedParameterRequest()).createFromPayload({
  field_1: true,
  field_2: {
    field_3: 3
  }
});
expect(instanceNestedParamaterRequest).toBeInstanceOf(RequestBuilder);

```

2. Create the custom presenter

- Extends `@ug-ts/clean-architecture-core/lib/esm/src/presenter/presenter` to create `presenters`.

```ts
import Presenter from '@ug-ts/clean-architecture-core/lib/esm/src/presenter/presenter';
import PresenterInterface from '@ug-ts/clean-architecture-core/lib/esm/src/presenter/presenter.interface';

interface ICustomPresenter extends PresenterInterface {
}

class CustomPresenter extends Presenter implements ICustomPresenter {
  // you can override parent methods here to customize them
}
```

3. Creating a custom usecase and execute it

- Extends `@ug-ts/clean-architecture-core/lib/esm/src/usecase/usecase` and implements `@ug-ts/clean-architecture-core/lib/esm/src/usecase/usecase.interface` to create your use cases.
- Implement the `execute` method for the use case logic.

```ts
import Presenter from '@ug-ts/clean-architecture-core/lib/esm/src/presenter/presenter';
import PresenterInterface from '@ug-ts/clean-architecture-core/lib/esm/src/presenter/presenter.interface';
import Usecase from '@ug-ts/clean-architecture-core/lib/esm/src/usecase/usecase';
import UsecaseInterface from '@ug-ts/clean-architecture-core/lib/esm/src/usecase/usecase.interface';
import RequestInterface from "./request.interface";

const CustomPresenter = class extends Presenter implements PresenterInterface {
};
instancePresenter = new CustomPresenter();

// with presenter and without request
const CustomUsecase = class extends Usecase implements UsecaseInterface {
  execute(): void {
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

// without request and presenter
const WithRquestWithoutPresenterUsecase = class extends Usecase implements UsecaseInterface {
  execute(): void {
    throw new BadRequestContentError({
      message: 'BadRequestContentError',
      details: {
        field_1: 'yes',
      }
    });
  }
};

const instanceWithRquestWithoutPresenterUsecase = new WithRquestWithoutPresenterUsecase();

try {
  instanceWithRquestWithoutPresenterUsecase.execute();
} catch (error: any) {
  const errorDetails = error.format();
  expect(errorDetails.status).toEqual(Status.ERROR);
  expect(errorDetails.error_code).toEqual(StatusCode.BAD_REQUEST);
  expect(errorDetails.message).toEqual('BadRequestContentError');
  expect(errorDetails.details).toEqual({
    field_1: 'yes'
  })
}

// with request and presenter
const WithRquestAndPresenterUsecase = class extends Usecase implements UsecaseInterface {
  execute(): void {
    this.presenter?.present(
            Response.create(true, StatusCode.OK, 'success.response', this.getRequestData())
    );
  }
};

const CustomRequest = class extends Request implements RequestInterface {
  protected requestPossibleFields: Record<string, any> = {
    field_1: true,
    field_2: true
  };
};

const payload = {
  field_1: true,
  field_2: 3
};

const instanceWithRquestAndPresenterUsecase = new WithRquestAndPresenter();
instanceWithRquestAndPresenterUsecase
        .setRequest((new CustomRequest()).createFromPayload(payload))
        .setPresenter(instancePresenter)
        .execute();

const usecaseResponse = instancePresenter.getResponse();
expect(usecaseResponse).toBeInstanceOf(Response);
expect(usecaseResponse?.isSuccess()).toBe(true);
expect(usecaseResponse?.getMessage()).toEqual('success.response');
expect(usecaseResponse?.getStatusCode()).toEqual(StatusCode.OK);
expect(usecaseResponse?.getData()).toEqual(payload);
expect(usecaseResponse?.get('field_1')).toBeTruthy();
expect(usecaseResponse?.get('field_2')).toEqual(3);
expect(instanceWithRquestAndPresenterUsecase.getFormattedResponse()).toEqual({
  status: Status.SUCCESS,
  code: StatusCode.OK,
  message: 'success.response',
  data: payload
});
```

4. When error throwing

When errors throwing, you can use some methods.

```ts

// for exception, some method are available
console.log(error.getErrors()); // print details
{
  details: {
      field_1: 'required'
  }
}

// or
{
  details: {
      error: 'field [username] is missing.'
  }
}

console.log(error.getDetails()); // print error details
{
  field_1: 'required'
}


// or 

{
  error: 'field [username] is missing.'
}

console.log(error.getMessage()) // 'error.message'
console.log(error.getDetailsMessage()) // 'field [username] is missing.' only if error key is defined in details.


console.log(error.format());
{
    status: 'success or error',
    error_code: 400,
    message: 'throw.error',
    details: {
        field_1: 'required'
    }
}
```

5. How to use it in Nestjs project

```ts

// (you can import form cjs or esm)

// create presenter interface
import PresenterInterface from '@ug-ts/clean-architecture-core/lib/cjs/src/presenter/presenter.interface';

interface AppPresenterInterface extends PresenterInterface {}
export default AppPresenterInterface;

// create presenter concret class that implement that interface
import Presenter from '@ug-ts/clean-architecture-core/lib/cjs/src/presenter/presenter';
import AppPresenterInterface from './app-presenter.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
class AppPresenter extends Presenter implements AppPresenterInterface {}
export default AppPresenter;

// create applicative request interface
import RequestInterface from '@ug-ts/clean-architecture-core/lib/cjs/src/request/request.interface';

interface AppRequestInterface extends RequestInterface {}
export default AppRequestInterface;

// create applicative request concret class that implement that interface
import Request from '@ug-ts/clean-architecture-core/lib/cjs/src/request/request';
import AppRequestInterface from './app-request.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
class AppRequest extends Request implements AppRequestInterface {
  protected requestPossibleFields: Record<string, any> = {
    field_1: true,
    field_2: true,
  };
}

export default AppRequest;

// create usecase interface
import UsecaseInterface from '@ug-ts/clean-architecture-core/lib/cjs/src/usecase/usecase.interface';

interface AppUsecaseInterface extends UsecaseInterface {}
export default AppUsecaseInterface;

// create usecase concret class that implement that interface
import Usecase from '@ug-ts/clean-architecture-core/lib/cjs/src/usecase/usecase';
import Response from '@ug-ts/clean-architecture-core/lib/cjs/src/response/response';
import AppUsecaseInterface from './app-usecase.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
class AppUsecase extends Usecase implements AppUsecaseInterface {
  execute() {
    this.presenter?.present(
      Response.create(true, 200, 'success.message', this.getRequestData()),
    );
  }
}

export default AppUsecase;

// register interface into your nestjs module
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import AppUsecase from './custom/usecase/app-usecase';
import AppRequest from './custom/request/app-request';
import AppPresenter from './custom/presenter/app-presenter';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'AppUsecaseInterface', // This token can also be a Symbol if preferred.
      useClass: AppUsecase,
    },
    {
      provide: 'AppRequestInterface', // This token can also be a Symbol if preferred.
      useClass: AppRequest,
    },
    {
      provide: 'AppPresenterInterface', // This token can also be a Symbol if preferred.
      useClass: AppPresenter,
    },
  ],
  exports: [],
})
export class AppModule {}


// use it in controller
import { Controller, Get, Inject } from '@nestjs/common';
import AppRequestInterface from './custom/request/app-request.interface';
import AppUsecaseInterface from './custom/usecase/app-usecase.interface';
import AppPresenterInterface from './custom/presenter/app-presenter.interface';

@Controller()
export class AppController {
  constructor(
      @Inject('AppRequestInterface') private readonly request: AppRequestInterface,
      @Inject('AppUsecaseInterface') private readonly usecase: AppUsecaseInterface,
      @Inject('AppPresenterInterface') private readonly presenter: AppPresenterInterface,
  ) {}

  @Get()
  example(): Record<string, any> {
    this.usecase
        .setRequest(
          this.request.createFromPayload({
            field_1: ['yes', 'no'],
            field_2: 3,
          }),
        )
        .setPresenter(this.presenter)
        .execute();

    return this.presenter.getFormattedResponse();
  }
}

// response look like
{
  status: 'success',
  code: 200,
  message: 'success.message',
  data: {
    field_1: [
      'yes',
      'no'
    ],
    field_2: 3
  }
}
```


## Units Tests

You also can execute unit tests.

```
$ yarn test
```

## License

- Written and copyrighted ©2023-present by Ulrich Geraud AHOGLA. <iamcleancoder@gmail.com>
- Clean architecture core is open-sourced software licensed under the [MIT license](http://www.opensource.org/licenses/mit-license.php)