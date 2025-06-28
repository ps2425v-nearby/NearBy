package pt.isel.project.nearby.exceptions

import java.time.LocalDateTime

/**
 * Represents an error response structure for API errors.
 *
 * @property timestamp The time when the error occurred.
 * @property status The HTTP status code of the error.
 * @property error A brief description of the error type.
 * @property message A detailed message describing the error.
 * @property path The path of the request that caused the error.
 */
data class ErrorResponse(
    val timestamp: LocalDateTime,
    val status: Int,
    val error: String,
    val message: String,
    val path: String
)