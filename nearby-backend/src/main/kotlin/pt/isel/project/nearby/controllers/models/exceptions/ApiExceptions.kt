package pt.isel.project.nearby.controllers.models.exceptions

import pt.isel.project.nearby.controllers.models.ProblemJson
import java.net.URI

/**
 * Custom exceptions for API-related errors.
 * These exceptions can be used to handle specific API request, response and timeout errors.
 */
class ApiRequestException(message: String? = "", cause: Throwable? = null) : RuntimeException()
class ApiResponseException(message: String? = "", cause: Throwable? = null) : RuntimeException()

/**
 * Factory function to create ProblemJson instance for Request API errors.
 * This function generates a ProblemJson object with a specific URI, title, detail, and instance.
 *
 * @return A ProblemJson object representing the API request error.
 */
fun apiRequestError() = ProblemJson(
    URI("http://localhost:8080/errors/apiRequestError"),
    "API Request Error",
    "Invalid request to the API.",
    ""
)

/**
 * Factory function to create ProblemJson instance for Response API errors.
 * This function generates a ProblemJson object with a specific URI, title, detail, and instance.
 *
 * @return A ProblemJson object representing the API response error.
 */
fun apiResponseError() = ProblemJson(
    URI("http://localhost:8080/errors/apiResponseError"),
    "API Response Error",
    "Invalid response from the API.",
    ""
)

/**
 * Factory function to create ProblemJson instance for Timeout errors.
 * This function generates a ProblemJson object with a specific URI, title, detail, and instance.
 *
 * @return A ProblemJson object representing the timeout error.
 */
fun timeoutError() = ProblemJson(
    URI("http://localhost:8080/errors/timeoutError"),
    "Timeout Error",
    "The request to the API timed out.",
    ""
)