package pt.isel.project.nearby.controllers.models

import org.springframework.http.ResponseEntity
import java.net.URI

/**
 * Represents a problem in the API, following the Problem Details for HTTP APIs specification.
 * This class is used to provide detailed error information in JSON format.
 *
 * @property type A URI reference that identifies the problem type.
 * @property title A short, human-readable summary of the problem type.
 * @property detail A human-readable explanation specific to this occurrence of the problem.
 * @property instance A URI reference that identifies the specific occurrence of the problem.
 */
data class ProblemJson(
    val type: URI,
    val title: String,
    val detail: String,
    val instance: String,
) {

    companion object {
        private const val MEDIA_TYPE = "application/problem+json"

        /**
         * Creates a ResponseEntity with the specified status and ProblemJson.
         *
         * @param status The HTTP status code for the response.
         * @param problem The ProblemJson object containing error details.
         *
         * @return A ResponseEntity with the specified status and ProblemJson in the body.
         */
        fun response(status: Int, problem: ProblemJson) = ResponseEntity
            .status(status)
            .header("Content-Type", MEDIA_TYPE)
            .body<Any>(problem)


        /**
         * Creates a ProblemJson for a "Internal Server Error" error.
         * This is typically used when a requested resource cannot be found.
         *
         * @return A ProblemJson instance representing an "Internal Server Error" error.
         */
        fun internalServerError() = ProblemJson(
            URI("http://localhost:8080/errors/internalServerError"),
            "Internal Server Error",
            "An internal server error occurred. Please try again later.",
            " "
        )
    }
}