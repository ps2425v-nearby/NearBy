package pt.isel.project.nearby.controllers.models.exceptions
import pt.isel.project.nearby.controllers.models.ProblemJson
import java.net.URI


fun <T> userAlreadyExist(username: T) = ProblemJson(
    URI("http://localhost:8080/errors/userAlreadyExists"),
    "Player already exists",
    "The player with username: $username already exists.",
    "/users",
)

fun <T> userNotFound(userID: T?) = ProblemJson(
    URI("http://localhost:8080/errors/userNotFound"),
    "User not found",
    "User with token: $userID not found.",
    ""
)

fun emailAlreadyTaken(email: String) = ProblemJson(
    URI("http://localhost:8080/errors/emailAlreadyTaken"),
    "Email already taken",
    "User with email: $email already exists.",
    "/users/"
)