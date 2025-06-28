package pt.isel.project.nearby.utils

/**
 * Error is a sealed class representing various error states that can occur in the application.
 * Each object within this class represents a specific type of error, allowing for type-safe error handling.
 */
sealed class Error {
    // User
    object UserAlreadyExists : Error()
    object UserNotFound : Error()
    object EmailAlreadyTaken : Error()

    // Comment
    object CommentNotFound : Error()
    object CommentRepositoryError : Error()
    object ExceededCommentLimit : Error()

    // Token
    object UserOrPasswordInvalid : Error()
    object TokenNotFound : Error()

    // Location
    object LocationNotFound : Error()
    object LocationRepositoryError : Error()
    object LocationAlreadyExists : Error()
    object LocationHasComments: Error()


    // External API

    object ApiRequestError : Error()
    object ApiResponseError : Error()
    object ApiTimeoutResponse : Error()

    // Server
    object InternalServerError : Error()

    // Email
    object EmailSendingError : Error()
}