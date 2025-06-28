package pt.isel.project.nearby.exceptions

/**
 * Custom exceptions for the Nearby application.
 * These exceptions are used to handle specific error cases in the application.
 *
 * @property message The error message describing the exception.
 * @property cause The underlying cause of the exception, if any.
 */
class FetchZoneException(message: String, cause: Throwable? = null) : RuntimeException(message, cause)
class FetchWindException(message: String, cause: Throwable? = null) : RuntimeException(message, cause)
class FetchTrafficException(message: String, cause: Throwable? = null) : RuntimeException(message, cause)
class SavePlacesException(message: String, cause: Throwable? = null) : RuntimeException(message, cause)
class NoPlacesFoundException(message: String, cause: Throwable? = null) : RuntimeException(message, cause)
class NoParkingSpacesFoundException(message: String, cause: Throwable? = null) : RuntimeException(message, cause)