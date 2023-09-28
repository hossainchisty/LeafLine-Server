/**
 * Send a standardized JSON error response to the client.
 *
 * @param {Object} res - Express response object.
 * @param {number} statusCode - HTTP status code for the error response.
 * @param {string} message - A message describing the error.
 * @returns {Object} - The error response object sent to the client.
 */
function sendError(res, statusCode, message) {
    return res.status(statusCode).json({
      statusCode,
      success,
      message,
    });
  }
  
  module.exports = {
    sendError,
  };
  