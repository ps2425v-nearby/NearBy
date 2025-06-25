package pt.isel.project.nearby.repositoryTests

import org.jdbi.v3.core.Jdbi
import org.junit.jupiter.api.AfterEach
import org.postgresql.ds.PGSimpleDataSource
import pt.isel.project.nearby.controllers.models.LocationInputModel
import pt.isel.project.nearby.domain.Location
import pt.isel.project.nearby.repository.jdbi.JdbiCommentsRepository
import pt.isel.project.nearby.repository.jdbi.JdbiLocationRepository
import pt.isel.project.nearby.repository.jdbi.mappers.CommentMapper
import pt.isel.project.nearby.repository.jdbi.mappers.LocationMapper
import pt.isel.project.nearby.repository.jdbi.mappers.TokenMapper
import pt.isel.project.nearby.repository.jdbi.mappers.UserMapper
import kotlin.test.*

class CommmentsRepositoryTests {

    companion object {
        private const val DB_URL = "jdbc:postgresql://localhost:5432/projeto_tests"
        private const val DB_USER = "postgres"
        private const val DB_PASSWORD = "PedroAdmin"
    }

    private val jdbi = Jdbi.create(
        PGSimpleDataSource().apply {
            setURL(DB_URL)
            user = DB_USER
            password = DB_PASSWORD
        }
    )
        .registerRowMapper(UserMapper())
        .registerRowMapper(TokenMapper())
        .registerRowMapper(CommentMapper())
        .registerRowMapper(LocationMapper())

    private val handle = jdbi.open().apply {
        connection.autoCommit = false
    }
    private val commentsRepository = JdbiCommentsRepository(handle)

    @AfterEach
    fun teardown() {
        handle.rollback()
    }

    @Test
    fun `create comment and retrieve it by place id`() {
        val comment = commentsRepository.createComment(
            userId = 1,
            placeId = 1,
            placeName = "Save 1",
            comment = "Nice place!"
        )

        assertNotNull(comment.id)
        assertEquals("Nice place!", comment.content)

        val commentsByPlace = commentsRepository.getCommentsByPlaceId(1)
        assertEquals(1, commentsByPlace.size)
        assertEquals("Nice place!", commentsByPlace.first().content)
    }

    @Test
    fun `get comments by user id`() {
        commentsRepository.createComment(1, 1, "Save 1", "User comment 1")
        commentsRepository.createComment(1, 1, "Save 1", "User comment 2")

        val comments = commentsRepository.getCommentsByUserId(1)
        assertEquals(2, comments.size)
        assertTrue(comments.all { it.userId == 1 })
    }

    @Test
    fun `update comment content`() {
        val original = commentsRepository.createComment(1, 1, "Save 1", "Old content")

        val updated = commentsRepository.updateComment(original.id, "New content")
        assertNotNull(updated)
        assertEquals("New content", updated.content)
    }

    @Test
    fun `delete comment by id`() {
        val comment = commentsRepository.createComment(1, 1, "Save 1", "To delete")

        val deletedCount = commentsRepository.deleteComment(comment.id!!)
        assertEquals(1, deletedCount)

        val remaining = commentsRepository.getCommentsByPlaceId(1)
        assertTrue(remaining.none { it.id == comment.id })
    }

    @Test
    fun `search comments by radius`() {
        commentsRepository.createComment(1, 2, "Nearby Place", "Close enough")
        commentsRepository.createComment(1, 1, "Save 1", "Also close")

        val result = commentsRepository.searchComments(38.7369, -9.1427, 100)
        assertTrue(result.isNotEmpty())
        assertTrue(result.any { it.placeName == "Save 1" || it.placeName == "Nearby Place" })
    }

    @Test
    fun `search comments without coordinates returns all`() {
        commentsRepository.createComment(1, 1, "Save 1", "Generic")

        val result = commentsRepository.searchComments(null, null, null)
        assertTrue(result.isNotEmpty())
    }

}