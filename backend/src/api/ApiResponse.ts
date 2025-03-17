import { ApiHandlerResponse } from "./model";

export class ApiResponse {
  static ok(payload: any = {}): ApiHandlerResponse {
    return {
      statusCode: 200,
      body: JSON.stringify(payload),
    };
  }

  static invalidData(msg: string): ApiHandlerResponse {
    return {
      statusCode: 400,
      body: JSON.stringify({ msg }),
    };
  }

  static unauthorized(msg: string): ApiHandlerResponse {
    return {
      statusCode: 403,
      body: JSON.stringify({ msg }),
    };
  }

  static unfound(msg: string): ApiHandlerResponse {
    return {
      statusCode: 404,
      body: JSON.stringify({ msg }),
    };
  }

  static error(msg: string, cause?: any): ApiHandlerResponse {
    if (cause) console.error(msg, cause);
    return {
      statusCode: 500,
      body: JSON.stringify({ msg }),
    };
  }
}
