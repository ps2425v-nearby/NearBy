package pt.isel.project.nearby.repository.jdbi

import org.jdbi.v3.core.Handle
import pt.isel.project.nearby.domain.Comment
import pt.isel.project.nearby.repository.CommentsRepository
import pt.isel.project.nearby.repository.jdbi.mappers.CommentMapper


class JdbiCommentsRepository(private val handle: Handle) : CommentsRepository {
    init {
        handle.registerRowMapper(CommentMapper())
    }

    override fun getCommentsByPlaceId(placeId: Int): List<Comment> {
        return handle.createQuery(
            """
                SELECT id, user_id AS userId, location_id AS placeId, place_name AS placeName,
                       content, created_at AS createdAt, updated_at AS updatedAt
                FROM comments
                WHERE location_id = :placeId
                ORDER BY created_at DESC
            """
        )
            .bind("placeId", placeId)
            .map(CommentMapper())
            .list() as List<Comment>
    }

    override fun getCommentsByUserId(userId: Int): List<Comment> {
        return handle.createQuery(
            """
            SELECT id, user_id AS userId, location_id AS placeId, place_name AS placeName,
                   content, created_at AS createdAt, updated_at AS updatedAt
            FROM comments
            WHERE user_id = :userId
            ORDER BY created_at DESC
        """
        )
            .bind("userId", userId)
            .map(CommentMapper())
            .list()
    }

    override fun createComment(userId: Int, placeId: Int, placeName: String, comment: String): Comment {
        return handle.createQuery(
            """
        INSERT INTO comments (user_id, location_id, place_name, content, created_at, updated_at)
        VALUES (:userId, :placeId, :placeName, :content, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING id, user_id AS userId, location_id AS placeId, place_name AS placeName,
                  content, created_at AS createdAt, updated_at AS updatedAt
        """
        )
            .bind("userId", userId)
            .bind("placeId", placeId)
            .bind("placeName", placeName)
            .bind("content", comment)
            .map(CommentMapper())
            .one()
    }

    override fun updateComment(commentId: Int, comment: String): Comment? {
        return handle.createQuery(
            """
        UPDATE comments
        SET content = :content, created_at = CURRENT_TIMESTAMP
        WHERE id = :commentId
        RETURNING id, user_id AS userId, location_id AS placeId, place_name AS placeName,
                  content, created_at AS createdAt, updated_at AS updatedAt
        """
        )
            .bind("commentId", commentId)
            .bind("content", comment)
            .map(CommentMapper())
            .findOne()
            .orElse(null)
    }

    override fun deleteComment(commentId: Int): Int {
        return handle.createUpdate(
            """
            DELETE FROM comments
            WHERE id = :commentId
        """
        )
            .bind("commentId", commentId)
            .execute()
    }

    override fun searchComments(
        lat: Double?,
        lon: Double?,
        radius: Int?
    ): List<Comment> {
        val query = StringBuilder("""
        SELECT c.id, c.user_id AS userId, c.location_id AS placeId, c.place_name AS placeName,
               c.content, c.created_at AS createdAt, c.updated_at AS updatedAt
        FROM comments c
        JOIN location l ON c.location_id = l.id
    """)

        if (lat != null && lon != null && radius != null) {
            query.append("""
            WHERE (
                6371000 * acos(
                    cos(radians(:lat)) * cos(radians(l.lat)) * 
                    cos(radians(l.lng) - radians(:lon)) + 
                    sin(radians(:lat)) * sin(radians(l.lat))
                )
            ) <= :radius
        """)
        }

        query.append(" ORDER BY c.created_at DESC")

        val finalQuery = handle.createQuery(query.toString())

        if (lat != null && lon != null && radius != null) {
            finalQuery.bind("lat", lat)
                .bind("lon", lon)
                .bind("radius", radius)
        }

        return finalQuery.map(CommentMapper()).list() as List<Comment>
    }
}