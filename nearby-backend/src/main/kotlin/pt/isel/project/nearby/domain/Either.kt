package pt.isel.project.nearby.domain

/**
 * Represents a type that can hold either a success value or an error value.
 * This is a common pattern used to handle operations that can succeed or fail,
 * allowing for more expressive error handling in functional programming.
 *
 * @param L The type of the left value, typically representing an error.
 * @param R The type of the right value, typically representing a success.
 */
sealed class Either<out L, out R> {
    data class Left<out L>(val value: L) : Either<L, Nothing>()
    data class Right<out R>(val value: R) : Either<Nothing, R>()
}

/**
 * Utility function to create instances of Either Right.
 * This function is used to wrap a successful value in the Either type,
 *
 * @param value The value to be wrapped in the Either type.
 */
fun <R> success(value: R) = Either.Right(value)

/**
 * Utility function to create instances of Either Left.
 * This function is used to wrap an error value in the Either type.
 *
 * @param error The error value to be wrapped in the Either type.
 */
fun <L> failure(error: L) = Either.Left(error)