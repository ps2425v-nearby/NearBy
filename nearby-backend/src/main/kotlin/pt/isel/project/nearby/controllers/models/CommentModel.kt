package pt.isel.project.nearby.controllers.models

import java.time.LocalDateTime

/**
 * Represents the input data required to create or update a comment.
 *
 * @property userId the ID of the user who made the comment
 * @property placeId the ID of the place the comment refers to
 * @property placeName the name of the place (used for display or identification)
 * @property content the textual content of the comment
 */
data class CommentInputModel(
    val userId: Int,
    val placeId: Int,
    val placeName: String,
    val content: String
)

/**
 * Represents the output data returned when retrieving a comment.
 *
 * @property id the unique identifier of the comment
 * @property userId the ID of the user who made the comment
 * @property placeId the ID of the place the comment refers to
 * @property content the textual content of the comment
 * @property createdAt the timestamp when the comment was created
 * @property updatedAt the timestamp of the last update to the comment
 * @property placeName the name of the place, if available
 */
data class CommentOutputModel(
    val id: Int,
    val userId: Int,
    val placeId: Int,
    val content: String,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime,
    val placeName: String?
)