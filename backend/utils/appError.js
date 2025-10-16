class AppError extends Error {
    constructor(message, statusCode) {
        super(message); // Call the parent constructor (Error)

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true; // Identify this as a predictable error

        // Capture the stack trace to know where the error happened
        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppError;
