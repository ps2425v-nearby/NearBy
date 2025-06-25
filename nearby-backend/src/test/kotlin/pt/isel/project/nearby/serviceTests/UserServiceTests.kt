package pt.isel.project.nearby.serviceTests

import io.mockk.*
import kotlinx.coroutines.*
import kotlinx.coroutines.test.*
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeEach
import pt.isel.project.nearby.controllers.models.*
import pt.isel.project.nearby.domain.*
import pt.isel.project.nearby.repository.*
import pt.isel.project.nearby.request.crime.CrimesRequester
import pt.isel.project.nearby.request.openmeteo.OpenMeteoRequester
import pt.isel.project.nearby.request.openmeteo.SeasonalWeatherValues
import pt.isel.project.nearby.request.openmeteo.WeatherInfo
import pt.isel.project.nearby.request.openstreet.OpenStreetRequester
import pt.isel.project.nearby.request.zone.ZoneRequester
import pt.isel.project.nearby.services.LocationService
import pt.isel.project.nearby.services.UserService
import pt.isel.project.nearby.utils.Error
import pt.isel.project.nearby.utils.hashWithoutSalt
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertNotNull
import kotlin.test.assertTrue


@OptIn(ExperimentalCoroutinesApi::class)
class UserServiceTests {

    private val transactionManager = mockk<TransactionManager>()

    val mockLocationRepository = mockk<LocationRepository>()
    val mockCommentsRepository = mockk<CommentsRepository>()
    val mockUserRepository = mockk<UserRepository>()

    val mockTransaction = object : Transaction {
        override val userRepository = mockUserRepository
        override val locationRepository = mockLocationRepository
        override val commentsRepository = mockCommentsRepository
        override fun rollback() { /* noop */ }
    }

    private lateinit var service: UserService

    private val testDispatcher = StandardTestDispatcher()


    @BeforeEach
    fun setup() {
        Dispatchers.setMain(testDispatcher)
        service = UserService(
            transactionManager,
        )
    }

    @AfterEach
    fun teardown() {
        Dispatchers.resetMain()
    }

    @Test
    fun `getById returns user when exists`() {
        val user = User(1, "Pedro", "p@x.com", "abc123")

        every {
            transactionManager.executeTransaction<UserAccessingResult>(any())
        } answers {
            val block = it.invocation.args[0] as (Transaction) -> UserAccessingResult
            block(mockTransaction)
        }

        every { mockUserRepository.getById(1) } returns user

        val result = service.getById(1)

        assertTrue(result is Either.Right)
        assertEquals(user, result.value)
    }


    @Test
    fun `getById returns error when user does not exist`() {
        every {
            transactionManager.executeTransaction<UserAccessingResult>(any())
        } answers {
            val block = it.invocation.args[0] as (Transaction) -> UserAccessingResult
            block(mockTransaction)
        }

        every { mockUserRepository.getById(1) } returns null

        val result = service.getById(1)

        assertTrue(result is Either.Left)
        assertEquals(Error.UserNotFound, result.value)
    }

    @Test
    fun `createUser returns token when user is created successfully`() {
        val name = "user"
        val email = "user@test.com"
        val password = "abc123"
        val createdUser = User(1, name, email, password)

        every {
            transactionManager.executeTransaction<UserCreationResult>(any())
        } answers {
            val block = it.invocation.args[0] as (Transaction) -> UserCreationResult
            block(mockTransaction)
        }

        every { mockUserRepository.getByName(name) } returns null
        every { mockUserRepository.getByEmail(email) } returns null
        every { mockUserRepository.createUser(name, email, password) } returns createdUser
        every { mockUserRepository.createToken(any(), 1) } just Runs

        val result = service.createUser(name, email, password)

        assertTrue(result is Either.Right)
        assertEquals(createdUser.id, (result.value).userID)
    }

    @Test
    fun `createUser returns error when username already exists`() {
        val name = "user"
        val email = "email@test.com"
        val password = "pass"
        val createdUser = User(1, name, email, password)

        every {
            transactionManager.executeTransaction<UserCreationResult>(any())
        } answers {
            val block = it.invocation.args[0] as (Transaction) -> UserCreationResult
            block(mockTransaction)
        }

        every { mockUserRepository.getByName(name) } returns createdUser

        val result = service.createUser(name, email, password)

        assertTrue(result is Either.Left)
        assertEquals(Error.UserAlreadyExists, result.value)
    }

    @Test
    fun `createUser returns error when email already taken`() {
        val name = "user"
        val email = "email@test.com"
        val password = "pass"
        val createdUser = User(1, name, email, password)
        every {
            transactionManager.executeTransaction<UserCreationResult>(any())
        } answers {
            val block = it.invocation.args[0] as (Transaction) -> UserCreationResult
            block(mockTransaction)
        }

        every { mockUserRepository.getByName(name) } returns null
        every { mockUserRepository.getByEmail(email) } returns createdUser

        val result = service.createUser(name, email, password)

        assertTrue(result is Either.Left)
        assertEquals(Error.EmailAlreadyTaken, result.value)
    }

    @Test
    fun `createToken returns token when credentials are valid`() {
        val username = "pedro"
        val password = "123"
        val hashed = hashWithoutSalt(password)
        val user = User(1, username, "p@x.com", hashed)

        every {
            transactionManager.executeTransaction<TokenCreationResult>(any())
        } answers {
            val block = it.invocation.args[0] as (Transaction) -> TokenCreationResult
            block(mockTransaction)
        }

        every { mockUserRepository.getByCredentials(username, hashed) } returns user
        every { mockUserRepository.createToken(any(), 1) } just Runs

        val result = service.createToken(username, password)

        assertTrue(result is Either.Right)
        assertEquals(user.id, (result.value as Token).userID)
    }

    @Test
    fun `removeToken returns error when token is not found`() {
        every {
            transactionManager.executeTransaction<TokenRemoveResult>(any())
        } answers {
            val block = it.invocation.args[0] as (Transaction) -> TokenRemoveResult
            block(mockTransaction)
        }

        every { mockUserRepository.removeToken("invalid") } returns 0

        val result = service.removeToken("invalid")

        assertTrue(result is Either.Left)
        assertEquals(Error.TokenNotFound, result.value)
    }

    @Test
    fun `isTokenValid returns true when token is valid`() {
        every {
            transactionManager.executeTransaction<TokenAccessingResult>(any())
        } answers {
            val block = it.invocation.args[0] as (Transaction) -> TokenAccessingResult
            block(mockTransaction)
        }

        every { mockUserRepository.getUserID("valid-token") } returns 1

        val result = service.isTokenValid("valid-token")

        assertTrue(result is Either.Right)
        assertEquals(true, result.value)
    }
}
