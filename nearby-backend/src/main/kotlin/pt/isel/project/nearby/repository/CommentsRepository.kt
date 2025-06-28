package pt.isel.project.nearby.repository

import pt.isel.project.nearby.domain.Comment

/**
 * Interface for managing comments in the Nearby application.
 * Provides methods to retrieve, create, update, and delete comments.
 */
interface CommentsRepository {
    fun getCommentsByPlaceId(placeId: Int): List<Comment>
    fun getCommentsByUserId(userId: Int): List<Comment>
    fun createComment(userId: Int, placeId: Int, placeName: String, comment: String):Comment
    fun updateComment(commentId: Int, comment: String): Comment?
    fun deleteComment(commentId: Int): Int
    fun searchComments(lat: Double?, lon: Double?, radius: Int?): List<Comment>
}