package pt.isel.project.nearby.controllerTests

import io.mockk.every
import io.mockk.mockk
import org.junit.jupiter.api.BeforeEach
import pt.isel.project.nearby.controllers.LocationController
import pt.isel.project.nearby.controllers.UserController
import pt.isel.project.nearby.controllers.models.*
import pt.isel.project.nearby.domain.Either
import pt.isel.project.nearby.domain.Location
import pt.isel.project.nearby.domain.Token
import pt.isel.project.nearby.domain.User
import pt.isel.project.nearby.services.LocationService
import pt.isel.project.nearby.services.UserService
import pt.isel.project.nearby.utils.Error
import java.util.*
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue


class UserControllerTests {

    private val userService = mockk<UserService>()
    private lateinit var controller: UserController

    @BeforeEach
    fun setup() {
        controller = UserController(userService)
    }

    @Test
    fun `get returns 200 with user when user found`() {
        val user = User(id = 1, username = "TestUser", email = "test@example.com", password = "hashed")
        every { userService.getById(1) } returns Either.Right(user)

        val response = controller.get(1)

        assertEquals(200, response.statusCode.value())
        assertEquals(user, response.body)
    }

    @Test
    fun `get returns 404 when user not found`() {
        every { userService.getById(1) } returns Either.Left(Error.UserNotFound)

        val response = controller.get(1)

        assertEquals(404, response.statusCode.value())
        val problemJson = response.body as ProblemJson
        assertTrue(problemJson.title.contains("User not found"))
    }

    @Test
    fun `create returns 201 with token when user created successfully`() {
        val token = Token(UUID.randomUUID(), 1)
        val createModel = UserCreateModel(name = "newuser", email = "new@example.com", password = "pass123")

        every { userService.createUser(createModel.name, createModel.email, createModel.password) } returns Either.Right(true)

        val response = controller.create(createModel)

        assertEquals(201, response.statusCode.value())
    }

    @Test
    fun `create returns 409 when user already exists`() {
        val createModel = UserCreateModel(name = "existing", email = "existing@example.com", password = "pass123")

        every { userService.createUser(createModel.name, createModel.email, createModel.password) } returns Either.Left(Error.UserAlreadyExists)

        val response = controller.create(createModel)

        assertEquals(409, response.statusCode.value())
        val problemJson = response.body as ProblemJson
        assertTrue(problemJson.title.contains("already exists", ignoreCase = true))
    }

    @Test
    fun `create returns 409 when email already taken`() {
        val createModel = UserCreateModel(name = "newuser", email = "taken@example.com", password = "pass123")

        every { userService.createUser(createModel.name, createModel.email, createModel.password) } returns Either.Left(Error.EmailAlreadyTaken)

        val response = controller.create(createModel)

        assertEquals(409, response.statusCode.value())
        val problemJson = response.body as ProblemJson
        assertTrue(problemJson.title.contains("email already taken", ignoreCase = true))
    }
}