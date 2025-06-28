package pt.isel.project.nearby.controllers.models.exceptions
import pt.isel.project.nearby.controllers.models.ProblemJson
import java.net.URI


/**
 * Factory function to create ProblemJson instance for user already exists errors.
 * This function generates a ProblemJson object with a specific URI, title, detail, and instance.
 *
 * @param username The username that already exists.
 * @return A ProblemJson object representing the user already exists error.
 */
fun <T> userAlreadyExist(username: T) = ProblemJson(
    URI("http://localhost:8080/errors/userAlreadyExists"),
    "User already exists",
    "The user with username: $username already exists.",
    "/users",
)

/**
 * Factory function to create ProblemJson instance for user not found errors.
 * This function generates a ProblemJson object with a specific URI, title, detail, and instance.
 *
 * @param userID The ID of the user that was not found.
 * @return A ProblemJson object representing the user not found error.
 */
fun <T> userNotFound(userID: T?) = ProblemJson(
    URI("http://localhost:8080/errors/userNotFound"),
    "User not found",
    "User with token: $userID not found.",
    ""
)

/**
 * Factory function to create ProblemJson instance for email already taken errors.
 * This function generates a ProblemJson object with a specific URI, title, detail, and instance.
 *
 * @param email The email that is already taken.
 * @return A ProblemJson object representing the email already taken error.
 */
fun emailAlreadyTaken(email: String) = ProblemJson(
    URI("http://localhost:8080/errors/emailAlreadyTaken"),
    "Email already taken",
    "User with email: $email already exists.",
    "/users/"
)