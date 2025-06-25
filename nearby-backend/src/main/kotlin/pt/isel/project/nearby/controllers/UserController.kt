package pt.isel.project.nearby.controllers

import org.springframework.http.ResponseCookie
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import pt.isel.project.nearby.PathTemplate
import pt.isel.project.nearby.controllers.models.ProblemJson
import pt.isel.project.nearby.controllers.models.UserCreateModel
import pt.isel.project.nearby.controllers.models.exceptions.emailAlreadyTaken
import pt.isel.project.nearby.controllers.models.exceptions.userAlreadyExist
import pt.isel.project.nearby.controllers.models.exceptions.userNotFound
import pt.isel.project.nearby.domain.Either
import pt.isel.project.nearby.services.UserService
import pt.isel.project.nearby.utils.Error

@RestController
class UserController(val userServices: UserService) {
    @GetMapping(PathTemplate.USER_ID)
    fun get(@PathVariable id: Int): ResponseEntity<*> {
        return when (val res = userServices.getById(id)) {
            is Either.Right -> ResponseEntity.status(200).header("Content-Type", "application/json")
                .body(res.value)

            is Either.Left -> when (res.value) {
                Error.UserNotFound -> ProblemJson.response(404, userNotFound(id))
                else -> ProblemJson.response(500, ProblemJson.internalServerError())
            }
        }
    }

    @PostMapping(PathTemplate.CREATE_USER)
    fun create(@RequestBody user: UserCreateModel): ResponseEntity<*> {
        return when (val res = userServices.createUser(user.name, user.email,user.password)) {
            is Either.Right -> {
                ResponseEntity.status(201)
                    .header("Content-Type", "application/json")
                    .body(mapOf("message" to "User created successfully"))
            }

            is Either.Left -> when (res.value) {
                Error.UserAlreadyExists -> ProblemJson.response(409, userAlreadyExist(user.name))
                Error.EmailAlreadyTaken -> ProblemJson.response(409, emailAlreadyTaken(user.email))
                else -> ProblemJson.response(500, ProblemJson.internalServerError())
            }
        }
    }
}