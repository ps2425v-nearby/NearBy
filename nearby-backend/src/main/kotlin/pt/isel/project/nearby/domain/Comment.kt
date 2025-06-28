package pt.isel.project.nearby.domain

import java.time.LocalDateTime

/**
 * Represents a comment made by a user on a place.
 *
 * @property id The unique identifier of the comment.
 * @property userId The ID of the user who made the comment.
 * @property placeId The ID of the place the comment refers to.
 * @property content The textual content of the comment.
 * @property createdAt The timestamp when the comment was created.
 * @property updatedAt The timestamp when the comment was last updated.
 * @property placeName Optional field for the name of the place, if available.
 */
data class Comment(
    val id: Int,
    val userId: Int,
    val placeId: Int,
    val content: String,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime,
    val placeName: String? = null
)