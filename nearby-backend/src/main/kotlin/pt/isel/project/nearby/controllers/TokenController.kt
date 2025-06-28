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

@RestController

class TokenController(val userService: UserService) {

    val mediaType = "application/json"

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

    @PostMapping(PathTemplate.LOGOUT)
    fun logout(@RequestBody token: UserLogoutModel): ResponseEntity<*> {
        return when (val res = userService.removeToken(token.token)) {
            is Either.Right -> ResponseEntity.status(200).header("Content-Type", mediaType)
          //      .header(HttpHeaders.SET_COOKIE, authCookie.toString())
                .body(UserTokenRemoveOutputModel(success = res.value))

            is Either.Left -> when (res.value) {
                Error.TokenNotFound -> ProblemJson.response(404, tokenNotFound(token))
                else -> ProblemJson.response(500, ProblemJson.internalServerError())
            }
        }
    }

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