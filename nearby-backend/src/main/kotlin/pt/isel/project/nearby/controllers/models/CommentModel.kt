package pt.isel.project.nearby.controllers.models

import java.time.LocalDateTime

data class CommentInputModel(
    val userId: Int,
    val placeId: Int,
    val placeName: String,
    val content: String
)

data class CommentOutputModel(
    val id: Int,
    val userId: Int,
    val placeId: Int,
    val content: String,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime,
    val placeName: String?
)