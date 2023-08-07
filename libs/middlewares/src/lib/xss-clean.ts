import { NextFunction, Request, Response } from 'express';
import xss from 'xss-filters';

const _typeof =
  typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol'
    ? function (obj) {
        return typeof obj;
      }
    : function (obj) {
        return obj &&
          typeof Symbol === 'function' &&
          obj.constructor === Symbol &&
          obj !== Symbol.prototype
          ? 'symbol'
          : typeof obj;
      };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function clean(...args: any[]) {
  let data = args.length > 0 && args[0] !== undefined ? args[0] : '';

  let isObject = false;
  if ((typeof data === 'undefined' ? undefined : _typeof(data)) === 'object') {
    data = JSON.stringify(data);
    isObject = true;
  }

  data = (0, xss.inHTMLData)(data).trim();
  if (isObject) data = JSON.parse(data);

  return data;
}

function xssClean(req: Request, res: Response, next: NextFunction) {
  if (req.body) {
    req.body = clean(req.body);
  }
  if (req.params) {
    req.params = clean(req.params);
  }
  if (req.query) {
    req.query = clean(req.query);
  }
  next();
}

export { xssClean };
