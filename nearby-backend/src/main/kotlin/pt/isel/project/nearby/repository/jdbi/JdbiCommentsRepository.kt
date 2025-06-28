package pt.isel.project.nearby.repository.jdbi

import org.jdbi.v3.core.Handle
import pt.isel.project.nearby.domain.Comment
import pt.isel.project.nearby.repository.CommentsRepository
import pt.isel.project.nearby.repository.jdbi.mappers.CommentMapper


/**
 * JdbiCommentsRepository is an implementation of CommentsRepository that uses JDBI to interact with the database.
 * It provides methods to get, create, update, delete, and search comments related to places.
 *
 * @property handle The JDBI Handle used to execute SQL queries.
 */
class JdbiCommentsRepository(private val handle: Handle) : CommentsRepository {

    /**
     * Retrieves a list of comments associated with a specific place ID.
     *
     * @param placeId The ID of the place for which comments are to be retrieved.
     * @return A list of Comment objects associated with the specified place ID.
     */
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

    /**
     * Retrieves a list of comments made by a specific user.
     *
     * @param userId The ID of the user for whom comments are to be retrieved.
     * @return A list of Comment objects made by the specified user.
     */
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

    /**
     * Creates a new comment for a specific place.
     *
     * @param userId The ID of the user creating the comment.
     * @param placeId The ID of the place for which the comment is being created.
     * @param placeName The name of the place for which the comment is being created.
     * @param comment The content of the comment.
     * @return The created Comment object.
     */
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

    /**
     * Updates an existing comment by its ID.
     *
     * @param commentId The ID of the comment to be updated.
     * @param comment The new content for the comment.
     * @return The updated Comment object, or null if the comment was not found.
     */
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

    /**
     * Deletes a comment by its ID.
     *
     * @param commentId The ID of the comment to be deleted.
     * @return The number of rows affected by the delete operation (should be 1 if successful).
     */
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

    /**
     * Searches for comments within a specified radius around a given latitude and longitude.
     *
     * @param lat The latitude to search around.
     * @param lon The longitude to search around.
     * @param radius The search radius in meters.
     * @return A list of Comment objects that match the search criteria.
     */
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