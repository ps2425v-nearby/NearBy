package pt.isel.project.nearby.utils

/**
 * Error is a sealed class representing various error states that can occur in the application.
 * Each object within this class represents a specific type of error, allowing for type-safe error handling.
 */
sealed class Error {

    object UserAlreadyExists : Error()
    object UserNotFound : Error()
    object EmailAlreadyTaken : Error()

    object CommentNotFound : Error()
    object CommentRepositoryError : Error()
    object ExceededCommentLimit : Error()

    object UserOrPasswordInvalid : Error()
    object TokenNotFound : Error()

    object LocationNotFound : Error()
    object LocationRepositoryError : Error()
    object LocationAlreadyExists : Error()
    object LocationHasComments: Error()

    object ApiRequestError : Error()
    object ApiResponseError : Error()
    object ApiTimeoutResponse : Error()

    object InternalServerError : Error()

    object EmailSendingError : Error()
}