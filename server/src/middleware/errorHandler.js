const notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`)
  res.status(404)
  next(error)
}

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500)
  const payload = {
    message: err.message || 'Server error',
  }
  if (err.errors) {
    payload.errors = err.errors
  }
  if (process.env.NODE_ENV !== 'production') {
    payload.stack = err.stack
  }
  res.status(statusCode).json(payload)
}

module.exports = { notFound, errorHandler }

