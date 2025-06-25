
import io.mockk.every
import io.mockk.mockk
import org.junit.jupiter.api.BeforeEach
import pt.isel.project.nearby.controllers.CommentController
import pt.isel.project.nearby.controllers.LocationController
import pt.isel.project.nearby.controllers.models.*
import pt.isel.project.nearby.domain.Comment
import pt.isel.project.nearby.domain.Either
import pt.isel.project.nearby.domain.Location
import pt.isel.project.nearby.services.CommentService
import pt.isel.project.nearby.services.LocationService
import pt.isel.project.nearby.utils.Error
import java.time.LocalDateTime
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue


class CommentControllerTests {

    private val commentService = mockk<CommentService>()
    private lateinit var controller: CommentController

    private val comment = Comment(
        id = 1,
        userId = 2,
        placeId = 3,
        content = "Great place!",
        createdAt = LocalDateTime.now(),
        updatedAt = LocalDateTime.now(),
        placeName = "Central Park"
    )

    private fun commentOutputModelFromComment(c: Comment) = CommentOutputModel(
        id = c.id,
        userId = c.userId,
        placeId = c.placeId,
        content = c.content,
        createdAt = c.createdAt,
        updatedAt = c.updatedAt,
        placeName = c.placeName
    )

    @BeforeEach
    fun setup() {
        controller = CommentController(commentService)
    }

    @Test
    fun `getCommentsByPlaceId returns 200 and comments list`() {
        every { commentService.getCommentsByPlaceId(3) } returns Either.Right(listOf(comment))

        val response = controller.getCommentsByPlaceId(3)

        assertEquals(200, response.statusCode.value())
        val body = response.body!!
        assertTrue(body is List<*>)
        assertEquals(1, body.size)
        assertEquals(comment.id, (body[0] as CommentOutputModel).id)
    }

    @Test
    fun `getCommentsByPlaceId returns 500 on internal server error`() {
        every { commentService.getCommentsByPlaceId(3) } returns Either.Left(Error.InternalServerError)

        val response = controller.getCommentsByPlaceId(3)

        assertEquals(500, response.statusCode.value())
    }

    @Test
    fun `searchComments returns 200 and comments list`() {
        every { commentService.searchComments(any(), any(), any()) } returns Either.Right(listOf(comment))

        val response = controller.searchComments(40.0, -70.0, 10)

        assertEquals(200, response.statusCode.value())
        val body = response.body!!
        assertTrue(body is List<*>)
        assertEquals(comment.id, (body[0] as CommentOutputModel).id)
    }

    @Test
    fun `getCommentsByUserId returns 200 and comments list`() {
        every { commentService.getCommentsByUserId(2) } returns Either.Right(listOf(comment))

        val response = controller.getCommentsByUserId(2)

        assertEquals(200, response.statusCode.value())
        val body = response.body!!
        assertEquals(comment.id, (body[0] as CommentOutputModel).id)
    }

    @Test
    fun `createComment returns 201 and created comment`() {
        val input = CommentInputModel(userId = 2, placeId = 3, placeName = "Central Park", content = "Nice!")

        every { commentService.createComment(input.userId, input.placeId, input.placeName ?: "", input.content) } returns Either.Right(comment)

        val response = controller.createComment(input)

        assertEquals(201, response.statusCode.value())
        val body = response.body!!
        assertEquals(comment.id, body.id)
        assertEquals(comment.content, body.content)
    }

    @Test
    fun `updateComment returns 200 and updated comment`() {
        val input = CommentInputModel(userId = 2, placeId = 3, placeName = "Central Park", content = "Updated content")

        every { commentService.updateComment(1, input.content) } returns Either.Right(comment)

        val response = controller.updateComment(1, input)

        assertEquals(200, response.statusCode.value())
        val body = response.body!!
        assertEquals(comment.id, body.id)
    }

    @Test
    fun `deleteComment returns 204 on successful deletion`() {
        every { commentService.deleteComment(1) } returns Either.Right(true)

        val response = controller.deleteComment(1)

        assertEquals(204, response.statusCode.value())
    }

    @Test
    fun `deleteComment returns 404 when comment not found`() {
        every { commentService.deleteComment(1) } returns Either.Left(Error.CommentNotFound)

        val response = controller.deleteComment(1)

        assertEquals(404, response.statusCode.value())
    }
}