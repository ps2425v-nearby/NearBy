package pt.isel.project.nearby.controllerTests

import io.mockk.every
import io.mockk.mockk
import org.junit.jupiter.api.BeforeEach
import pt.isel.project.nearby.controllers.TokenController
import pt.isel.project.nearby.controllers.models.*
import pt.isel.project.nearby.domain.Either
import pt.isel.project.nearby.domain.Token
import pt.isel.project.nearby.services.UserService
import pt.isel.project.nearby.utils.Error
import java.util.*
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue


class TokenControllerTests {

    private val userService = mockk<UserService>()
    private lateinit var controller: TokenController

    @BeforeEach
    fun setup() {
        controller = TokenController(userService)
    }

    @Test
    fun `login returns 200 when credentials are valid`() {
        val token = Token(UUID.randomUUID(), 1)
        val userInput = UserInputModel("testuser", "secret")

        every { userService.createToken("testuser", "secret") } returns Either.Right(token)

        val response = controller.login(userInput)

        assertEquals(200, response.statusCode.value())
        val body = response.body as UserTokenCreateOutputModel
        assertEquals(token.token.toString(), body.token)
        assertEquals(token.userID, body.userID)
    }

    @Test
    fun `login returns 400 when credentials are invalid`() {
        val userInput = UserInputModel("wronguser", "wrongpass")

        every { userService.createToken("wronguser", "wrongpass") } returns Either.Left(Error.UserOrPasswordInvalid)

        val response = controller.login(userInput)

        assertEquals(400, response.statusCode.value())
        val body = response.body as ProblemJson
        assertTrue(body.title.contains("invalid", ignoreCase = true))
    }

    @Test
    fun `logout returns 200 when token removal is successful`() {
        val tokenModel = UserLogoutModel(token = "valid-token")

        every { userService.removeToken("valid-token") } returns Either.Right(true)

        val response = controller.logout(tokenModel)

        assertEquals(200, response.statusCode.value())
        val body = response.body as UserTokenRemoveOutputModel
        assertTrue(body.sucess)
    }

    @Test
    fun `logout returns 404 when token not found`() {
        val tokenModel = UserLogoutModel(token = "invalid-token")

        every { userService.removeToken("invalid-token") } returns Either.Left(Error.TokenNotFound)

        val response = controller.logout(tokenModel)

        assertEquals(404, response.statusCode.value())
        val body = response.body as ProblemJson
        assertTrue(body.title.contains("not found", ignoreCase = true))
    }

    @Test
    fun `logout returns 500 on internal server error`() {
        val tokenModel = UserLogoutModel(token = "token-error")

        every { userService.removeToken("token-error") } returns Either.Left(Error.InternalServerError)

        val response = controller.logout(tokenModel)

        assertEquals(500, response.statusCode.value())
        val body = response.body as ProblemJson
        assertTrue(body.title.contains("internal", ignoreCase = true))
    }

    @Test
    fun `readCookie returns 200 with userId when token is valid`() {
        val token = "valid-token"
        every { userService.getUserIdByToken(token) } returns Either.Right(123)

        val response = controller.readCookie(token)

        assertEquals(200, response.statusCode.value())
        assertEquals(123, response.body)
    }

    @Test
    fun `readCookie returns 404 when user not found`() {
        val token = "token-user-not-found"
        every { userService.getUserIdByToken(token) } returns Either.Left(Error.UserNotFound)

        val response = controller.readCookie(token)

        assertEquals(404, response.statusCode.value())
        val body = response.body as ProblemJson
        assertTrue(body.title.contains("not found", ignoreCase = true))
    }

    @Test
    fun `readCookie returns 500 on internal server error`() {
        val token = "token-error"
        every { userService.getUserIdByToken(token) } returns Either.Left(Error.InternalServerError)

        val response = controller.readCookie(token)

        assertEquals(500, response.statusCode.value())
        val body = response.body as ProblemJson
        assertTrue(body.title.contains("internal", ignoreCase = true))
    }

    @Test
    fun `readCookie returns 400 when token is null`() {
        val response = controller.readCookie(null)

        assertEquals(400, response.statusCode.value())
        val body = response.body as ProblemJson
        assertTrue(body.title.contains("token", ignoreCase = true))
    }
}