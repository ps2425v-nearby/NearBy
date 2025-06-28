package pt.isel.project.nearby.controllers

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import pt.isel.project.nearby.PathTemplate
import pt.isel.project.nearby.controllers.models.*
import pt.isel.project.nearby.controllers.models.exceptions.tokenNotFound
import pt.isel.project.nearby.controllers.models.exceptions.userNotFound
import pt.isel.project.nearby.controllers.models.exceptions.userOrPasswordInvalid
import pt.isel.project.nearby.domain.Either
import pt.isel.project.nearby.services.UserService
import pt.isel.project.nearby.utils.Error

/**
 * Controller for handling user authentication-related requests.
 * This controller provides endpoints for user login, logout, and reading authentication cookies.
 * It uses the UserService to perform operations and returns appropriate HTTP responses.
 *
 * @property userService The service used to handle user authentication operations.
 * @constructor Creates a TokenController with the specified UserService.
 *
 * @RestController annotation indicates that this class is a Spring MVC controller.
 */
@RestController
class TokenController(val userService: UserService) {

    val mediaType = "application/json"

    /**
     * Endpoint for user login.
     * Accepts a UserInputModel containing the user's name and password,
     * and returns a UserTokenCreateOutputModel with the generated token and user ID.
     *
     * @param player The input model containing user credentials.
     * @return A ResponseEntity containing the token and user ID or an error response if the login fails.
     */
    @PostMapping(PathTemplate.LOGIN)
    fun login(@RequestBody player: UserInputModel): ResponseEntity<*> {
        return when (val res = userService.createToken(player.name, player.password)) {
            is Either.Right -> {
                ResponseEntity.status(200)
                    .header("Content-Type", mediaType)
                    .body(UserTokenCreateOutputModel(token = res.value.token.toString(), userID = res.value.userID))
            }

            is Either.Left -> when (res.value) {
                Error.UserOrPasswordInvalid -> ProblemJson.response(400, userOrPasswordInvalid(player.name))
                else -> ProblemJson.response(500, ProblemJson.internalServerError())
            }
        }
    }

    /**
     * Endpoint for user logout.
     * Accepts a UserLogoutModel containing the token to be removed,
     * and returns a UserTokenRemoveOutputModel indicating success or failure.
     *
     * @param token The input model containing the token to be removed.
     * @return A ResponseEntity indicating the result of the logout operation.
     */
    @PostMapping(PathTemplate.LOGOUT)
    fun logout(@RequestBody token: UserLogoutModel): ResponseEntity<*> {
        return when (val res = userService.removeToken(token.token)) {
            is Either.Right -> ResponseEntity.status(200).header("Content-Type", mediaType)
                .body(UserTokenRemoveOutputModel(success = res.value))

            is Either.Left -> when (res.value) {
                Error.TokenNotFound -> ProblemJson.response(404, tokenNotFound(token))
                else -> ProblemJson.response(500, ProblemJson.internalServerError())
            }
        }
    }

    /**
     * Endpoint to read the authentication cookie.
     * Accepts a cookie named "token" and returns the user ID associated with that token.
     *
     * @param token The authentication token from the cookie.
     * @return A ResponseEntity containing the user ID or an error response if the token is invalid or not found.
     */
    @GetMapping(PathTemplate.AUTH_COOKIE)
    fun readCookie(@CookieValue(name = "token") token: String?): ResponseEntity<*> {
        return if (token != null) {
            when (val res = userService.getUserIdByToken(token)) {
                is Either.Right -> ResponseEntity.ok(res.value)
                is Either.Left -> when (res.value) {
                    Error.UserNotFound -> ProblemJson.response(404, userNotFound(null))
                    else -> ProblemJson.response(500, ProblemJson.internalServerError())
                }
            }
        } else {
            ProblemJson.response(400, tokenNotFound(null))
        }
    }
}