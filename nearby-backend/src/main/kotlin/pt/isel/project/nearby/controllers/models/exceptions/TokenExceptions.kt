package pt.isel.project.nearby.controllers.models.exceptions

import pt.isel.project.nearby.controllers.models.ProblemJson
import java.net.URI

/**
 * Factory function to create ProblemJson instance for user or password invalid errors.
 * This function generates a ProblemJson object with a specific URI, title, detail, and instance.
 *
 * @param username The username that was invalid.
 * @return A ProblemJson object representing the user or password invalid error.
 */
fun <T> userOrPasswordInvalid(username: T) = ProblemJson(
    URI("http://localhost:8080/errors/user_or_password_invalid"),
    "User or Password invalid",
    "Invalid password for user: $username",
    "/session"
)

/**
 * Factory function to create ProblemJson instance for user not found errors.
 * This function generates a ProblemJson object with a specific URI, title, detail, and instance.
 *
 * @param userID The ID of the user that was not found.
 * @return A ProblemJson object representing the user not found error.
 */
fun <T> tokenNotFound(playerID: T) = ProblemJson(
    URI("http://localhost:8080/errors/tokenNotFound"),
    "Token not found",
    "User token with id: $playerID not found.",
    "/session"
)