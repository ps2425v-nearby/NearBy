package pt.isel.project.nearby.controllers.models.exceptions

import pt.isel.project.nearby.controllers.models.ProblemJson
import java.net.URI

class ApiRequestException(message: String? = "", cause: Throwable? = null) : RuntimeException(message, cause)
class ApiResponseException(message: String? = "", cause: Throwable? = null) : RuntimeException(message, cause)

fun apiRequestError() = ProblemJson(
    URI("http://localhost:8080/errors/apiRequestError"),
    "API Request Error",
    "Invalid request to the API.",
    ""
)

fun apiResponseError() = ProblemJson(
    URI("http://localhost:8080/errors/apiResponseError"),
    "API Response Error",
    "Invalid response from the API.",
    ""
)

fun timeoutError() = ProblemJson(
    URI("http://localhost:8080/errors/timeoutError"),
    "Timeout Error",
    "The request to the API timed out.",
    ""
)