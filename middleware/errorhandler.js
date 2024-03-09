// I M P O R T:  E R R O R  H A N D L I N G  O P T I O N S
import { ERROR_HANDLING_OPTIONS } from "../config/config.js";

// E R R O R   H A N D L E R
const errorHandler = (err, req, res, next) => {
  let isValidationError = Array.isArray(err);
  // CONSOLE OUTPUT
  console.log("\n========= E R R O R =========");
  if (isValidationError) {
    console.error(
      `Name: Validation Error\nMessage: Validation failed\nErrors: ${JSON.stringify(
        err,
        null,
        2
      )}`
    );
  } else {
    console.error(
      `Name: ${err.name}\nMessage: ${err.message}\nStatusCode: ${
        err.statusCode || "500"
      }`
    );
  }
  console.log("========= E R R O R =========\n");

  // RESPONSE OUTPUT
  const statusCode = err.statusCode || 500;
  let errorResponse = {
    error: {
      status: statusCode,
      message: err.message || "Internal Server Error",
    },
  };

  // CUSTOMIZE ERROR (IN CASE OF VALIDATION ERROR)
  if (isValidationError) {
    statusCode = 422;
    errorResponse.error.status = statusCode;
    errorResponse.error.message = "Validation failed";
    errorResponse.errors = err;
  }

  // Check whether stack traces should be displayed
  if (
    ERROR_HANDLING_OPTIONS.showStack &&
    process.env.NODE_ENV === "development"
  ) {
    errorResponse.error.stack = err.stack;
  }
  res.status(statusCode).send(errorResponse);
};

export default errorHandler;
