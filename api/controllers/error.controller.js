const sendErrorDev = (err, req, res) => {
  //! Handle errors for api
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
};

const sendErrorProd = (err, req, res) => {
  //! Handle errors for api
  if (req.originalUrl.startsWith('/api')) {
    //? Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    //? Programming or other unknown error: don't leak error details
    console.error('Error', { ...err });
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
    });
  }
};

export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  }

  if (process.env.NODE_ENV === 'production') {
    sendErrorProd(err, req, res);
  }
};
