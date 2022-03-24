const errorMessageHandler = (status, errorObject, message = null) => {
  switch(status) {
    case 400: 
      return {
        code: 400,
        type: 'ValidationError',
        message: {
          en: `Invalid Parameters: ${message}`,
        }
      };
    case 403:   
      return {
        code: 403,
        type: 'PermissionDenied',
        message: {
          en: `Message: ${message}`,
        },
      }
    case 404:
      return {
        code: 404,
        type: 'NotFound',
        error: message,
      };
    case 500:
      return {
        code: errorObject.code,
        type: errorObject.type,
        message: {
          en: errorObject.message,
        },
        error: message,
      };
    default:
      return {
        code: 500,
        type: 'ServerError',
        message: {
          en: 'Internal server error',
        },
        error: message,
      };
  }
}

const catchReject = (func) => async (req, res, next) => {
  try {
    await func(req, res, next);
    if (res.headersSent) {
      return null;
    }
    return next();
  } catch (error) {
    return next(error)
  }
}

export {
  errorMessageHandler, catchReject
}