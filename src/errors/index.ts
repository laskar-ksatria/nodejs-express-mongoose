import { IErrorMessage } from "../types";

interface IErrors {
  rateLimit: IErrorMessage;
  highTraffic: IErrorMessage;
  internalservererror: IErrorMessage;
  failedAuthentication: IErrorMessage;
  invalidEmailOrPassword: IErrorMessage;
  tokenExpired: IErrorMessage;
}

export const errorStates: IErrors = {
  internalservererror: {
    message: "Oops! Something’s off-track. Give it another go!",
    error_id: 0,
    http_code: 500,
  },
  highTraffic: {
    message: "Too many steps at once! Let’s pace ourselves and try again soon.",
    error_id: 1,
    http_code: 503,
  },
  rateLimit: {
    message: "Whoa, slow down! You've hit the limit. Try again later.",
    error_id: 2,
    http_code: 429,
  },
  failedAuthentication: {
    message: "Not Authenticated",
    error_id: 3,
    http_code: 401,
  },
  invalidEmailOrPassword: {
    message: "Invalid email or password",
    error_id: 4,
    http_code: 401,
  },
  tokenExpired: {
    message: "Session expired—time to lace up and log in again!",
    http_code: 401,
    error_id: 5,
  },
};

// Custom class for throwing error
class HttpError extends Error {
  statusCode: number;
  error_id: number; // This for flaging and identify kind of error on client
  constructor(args: IErrorMessage) {
    super(args.message);
    this.statusCode = args.http_code;
    this.error_id = args.error_id;
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

export default HttpError;
