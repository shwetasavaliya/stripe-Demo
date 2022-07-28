import { Request, Response, NextFunction } from 'express';
import { LANGUAGES } from '../utils/mapper/language.constant';
import { mapStatusLang } from '../utils/mapper/mapper';

type ResponseFunction = {
  [key in any]: (data: any, status: boolean, code: string, err?: any) => void;
};

declare global {
  namespace Express {
    interface Response {
      formatter: ResponseFunction;
    }
  }
}

/**
 * Date: June 30, 2021
 * Author: Kishan Talaviya
 * Function defination:
 *   provides a common response that will be sent to each request based
 *   on the status received from the controller function inside response
 *
 * req @params
 *
 * res @params
 */

export const responseEnhancer = () => (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.formatter = _generateFormatters(req, res);
  next();
};

const _generateFormatters = (req: Request, res: Response) => {
  const formatter = {} as ResponseFunction;
  let responseBody = {};
  const language:any = req.headers?.language || 'en',
    lang = getLanguage(language);
    // console.log("lang....",lang);
    // console.log("language....",language);
    
  formatter['ok'] = (data: any, status: boolean, code: string) => {
    responseBody = _generateSuccessResponse({ data, status, code, lang });
    return responseBody;
  };

  formatter['error'] = (
    data: any,
    status: boolean,
    code: string,
    err?: any
  ) => {
    responseBody = _generateErrorResponse({ data, status, code, err, lang });
    return responseBody;
  };

  return formatter;
};

interface SuccessInput {
  data: any;
  status: boolean;
  code: string;
  lang?: string;
}

const _generateSuccessResponse = async ({
  data,
  status,
  code,
  lang = 'en'
}: SuccessInput) => {
  const message = await mapStatusLang(lang, 'success', code);
  return {
    status,
    success: {
      code,
      message,
      data: JSON.parse(JSON.stringify(data)) // to check and find a better solution
    },
    error: null
  };
};

interface ErrorsInput {
  data: any;
  status: boolean;
  code: string;
  err: any;
  lang: string;
}

const _generateErrorResponse = async ({
  data,
  status,
  code,
  err,
  lang = 'en'
}: ErrorsInput) => {
  const message = await mapStatusLang(lang, 'error', code);
  return {
    status,
    error: {
      code,
      message,
      data: data,
      errorStack: err?.message || err
    },
    success: null
  };
};

const getLanguage = (lang: string) => {
  return parseInt(lang) ? LANGUAGES[lang] : lang;
};
