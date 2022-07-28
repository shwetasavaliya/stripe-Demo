type ResponseFunction = {
  [key in any]: (data: any, status: boolean, code: string, err?: any) => void;
};

declare global {
  namespace Express {
    export interface Request {
      context?: any;
    }
    export interface Response {
      formatter: ResponseFunction;
    }
  }
}
