import { ApiHandlerResponse } from "./model";
import { ApiResponse } from "./ApiResponse";

export class ApiError extends Error {
  private readonly msg: string;
  private readonly statusCode: number;

  constructor({ statusCode, body }: ApiHandlerResponse) {
    const msg = JSON.parse(body).msg;
    super(msg);
    this.statusCode = statusCode;
    this.msg = msg;
  }

  getResponse(): ApiHandlerResponse {
    return {
      statusCode: this.statusCode,
      body: JSON.stringify({ msg: this.msg }),
    };
  }

  getMessage() {
    return this.msg;
  }

  getStatusCode() {
    return this.statusCode;
  }

  static invalidData(msg: string) {
    return new ApiError(ApiResponse.invalidData(msg));
  }

  static unauthorized(msg: string) {
    return new ApiError(ApiResponse.unauthorized(msg));
  }

  static unfound(msg: string) {
    return new ApiError(ApiResponse.unfound(msg));
  }
}
