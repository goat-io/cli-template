const VError = require('verror')
const createError = require('http-errors')
import { Log } from '../Log/Logger'
// import gLog from "./gLogs";

export const Errors = (cause: any, message: any, info?: any) => {
  const stackableError: any = new VError(
    {
      cause,
      info
    },
    message
  )

  const details = {
    ...info,
    ...{ errors: cause },
    ...{ stack: stackableError.stack }
  }

  Log.error(details)

  if (info && info.code) {
    return {
      httpError: createError(info.code, message, {
        details,
        info
      }),
      stack: stackableError
    }
  }
  return stackableError
}
