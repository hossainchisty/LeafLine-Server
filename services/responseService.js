/**
 * Send a standardized JSON response to the client.
 *
 * @param {Object} res - Express response object.
 * @param {number} statusCode - HTTP status code for the response.
 * @param {boolean} success - Indicates whether the operation was successful.
 * @param {string} message - A message to include in the response.
 * @param {Object} [data] - Optional data to include in the response.
 * @returns {Object} - The response object sent to the client.
 */
function sendResponse(res, statusCode, success, message, data) {
  const response = {
    statusCode,
    success,
    message,
  };

  if (data) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
}

module.exports = {
  sendResponse,
};

  