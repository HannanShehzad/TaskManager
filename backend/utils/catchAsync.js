// utils/catchAsync.js: Wraps async route handlers to catch errors automatically.

const catchAsync = (fn) => {
    // The inner function is what Express calls (req, res, next)
    const errorHandler = (req, res, next) => {
        // fn(req, res, next) is the async function (route handler).
        // .catch(next) forwards any error thrown inside 'fn' directly to Express's global error handler.
        fn(req, res, next).catch(next);
    };

    return errorHandler;
};

export default catchAsync;
