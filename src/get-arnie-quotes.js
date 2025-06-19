const { httpGet } = require("./mock-http-interface");

/**
 * Executes a HTTP GET request on each of the URLs, transforms each of the HTTP
 * responses according to the challenge instructions and returns the results.
 *
 * @param {string[]} urls The urls to be requested
 * @returns {Promise<Array<{ "Arnie Quote"?: string, "FAILURE"?: string }>>} A promise which resolves to a results array.
 */
const getArnieQuotes = async (urls) => {
	return Promise.all(
		urls.map(async (url) => {
			try {
				const response = await httpGet(url);
				return parseHttpResponse(response);
			} catch (error) {
				console.warn("Error parsing response:", error);
				return { "FAILURE": "Unexpected error occurred" };
			}
		})
	);
};

/**
 * Parses the HTTP response and returns a formatted result object.
 *
 * @param {{ status: number, body: string }} response - The HTTP response to parse.
 * @returns {object} A key-value object with either "Arnie Quote" if status is 200 or "FAILURE" as the key.
 */
function parseHttpResponse(response) {
	const { status, body } = response;
	const message = getHttpResponseBodyMessage(body);
	return status === 200 ? { "Arnie Quote": message } : { "FAILURE": message };
}

/**
 * Extracts the message field from a JSON response body.
 *
 * @param {string} body - A JSON string in format "{ 'message': string }".
 * @returns {string} The message contained within the body.
 * @throws {Error} If the body is not valid JSON or format does not match expected.
 */
function getHttpResponseBodyMessage(body) {
	const parsed = JSON.parse(body);
	if (!parsed.message || typeof parsed.message !== "string") {
		throw new Error("Response body must contain a valid 'message' string");
	}
	return parsed.message;
}

module.exports = {
	getArnieQuotes,
};
