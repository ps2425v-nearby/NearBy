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
import pt.isel.project.nearby.services.CommentService
import pt.isel.project.nearby.services.LocationService
import pt.isel.project.nearby.services.UserService
import pt.isel.project.nearby.utils.Error
import pt.isel.project.nearby.utils.hashWithoutSalt
import java.time.LocalDateTime
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertNotNull
import kotlin.test.assertTrue


@OptIn(ExperimentalCoroutinesApi::class)
class CommentServiceTests {

    private val transactionManager = mockk<TransactionManager>()

    val mockLocationRepository = mockk<LocationRepository>()
    val mockCommentRepository = mockk<CommentsRepository>()
    val mockUserRepository = mockk<UserRepository>()

    val mockTransaction = object : Transaction {
        override val userRepository = mockUserRepository
        override val locationRepository = mockLocationRepository
        override val commentsRepository = mockCommentRepository
        override fun rollback() { /* noop */ }
    }

    private lateinit var service: CommentService

    private val testDispatcher = StandardTestDispatcher()

    val now = LocalDateTime.now()

    val comment = Comment(
        id = 1,
        userId = 1,
        placeId = 1,
        content = "Great place!",
        createdAt = now,
        updatedAt = now,
        placeName = "Park"
    )

    @BeforeEach
    fun setup() {
        Dispatchers.setMain(testDispatcher)
        service = CommentService(
            transactionManager,
        )
    }

    @AfterEach
    fun teardown() {
        Dispatchers.resetMain()
    }

    @Test
    fun `getCommentsByPlaceId returns comments list`() {
        val commentList = listOf(comment)

        every {
            transactionManager.executeTransaction<Either<Error, List<Comment>>>(any())
        } answers {
            val block = it.invocation.args[0] as (Transaction) -> Either<Error, List<Comment>>
            block(mockTransaction)
        }

        every { mockCommentRepository.getCommentsByPlaceId(1) } returns commentList

        val result = service.getCommentsByPlaceId(1)

        assertTrue(result is Either.Right)
        val comments = result.value
        assertEquals(1, comments.size)
    }

    @Test
    fun `searchComments returns comments list`() {
        val commentList = listOf(comment)

        val lat = 40.0
        val lon = -8.0
        val radius = 1000

        every {
            transactionManager.executeTransaction<Either<Error, List<Comment>>>(any())
        } answers {
            val block = it.invocation.args[0] as (Transaction) -> Either<Error, List<Comment>>
            block(mockTransaction)
        }

        every { mockCommentRepository.searchComments(lat, lon, radius) } returns commentList

        val result = service.searchComments(lat, lon, radius)

        assertTrue(result is Either.Right)
        val comments = result.value
        assertEquals(1, comments.size)
        assertEquals("Great place!", comments[0].content)
    }

    @Test
    fun `createComment fails when user exceeds comment limit`() {
        every {
            transactionManager.executeTransaction<Either<Error, Comment>>(any())
        } answers {
            val block = it.invocation.args[0] as (Transaction) -> Either<Error, Comment>
            block(mockTransaction)
        }

        every { mockCommentRepository.getCommentsByUserId(1) } returns List(3) { comment }

        val result = service.createComment(1, 1, "place name", "Too many")

        assertTrue(result is Either.Left)
        assertEquals(Error.ExceededCommentLimit, result.value)
    }

    @Test
    fun `createComment success when under limit`() {
        every {
            transactionManager.executeTransaction<Either<Error, Comment>>(any())
        } answers {
            val block = it.invocation.args[0] as (Transaction) -> Either<Error, Comment>
            block(mockTransaction)
        }

        every { mockCommentRepository.getCommentsByUserId(1) } returns listOf()
        every { mockCommentRepository.createComment(1, 1, "place name", "Nice") } returns comment

        val result = service.createComment(1, 1, "place name", "Nice")

        assertTrue(result is Either.Right)
        assertEquals(comment, result.value)
    }

    @Test
    fun `updateComment returns updated comment`() {
        every {
            transactionManager.executeTransaction<Either<Error, Comment>>(any())
        } answers {
            val block = it.invocation.args[0] as (Transaction) -> Either<Error, Comment>
            block(mockTransaction)
        }

        every { mockCommentRepository.updateComment(1, "Updated") } returns comment

        val result = service.updateComment(1, "Updated")

        assertTrue(result is Either.Right)
        assertEquals(comment, result.value)
    }

    @Test
    fun `updateComment returns error when not found`() {
        every {
            transactionManager.executeTransaction<Either<Error, Comment>>(any())
        } answers {
            val block = it.invocation.args[0] as (Transaction) -> Either<Error, Comment>
            block(mockTransaction)
        }

        every { mockCommentRepository.updateComment(1, "fail") } returns null

        val result = service.updateComment(1, "fail")

        assertTrue(result is Either.Left)
        assertEquals(Error.CommentNotFound, result.value)
    }

    @Test
    fun `deleteComment returns success when comment exists`() {
        every {
            transactionManager.executeTransaction<Either<Error, Boolean>>(any())
        } answers {
            val block = it.invocation.args[0] as (Transaction) -> Either<Error, Boolean>
            block(mockTransaction)
        }

        every { mockCommentRepository.deleteComment(1) } returns 1

        val result = service.deleteComment(1)

        assertTrue(result is Either.Right)
        assertEquals(true, result.value)
    }

    @Test
    fun `deleteComment returns error when not found`() {
        every {
            transactionManager.executeTransaction<Either<Error, Boolean>>(any())
        } answers {
            val block = it.invocation.args[0] as (Transaction) -> Either<Error, Boolean>
            block(mockTransaction)
        }

        every { mockCommentRepository.deleteComment(1) } returns 0

        val result = service.deleteComment(1)

        assertTrue(result is Either.Left)
        assertEquals(Error.CommentNotFound, result.value)
    }
}
