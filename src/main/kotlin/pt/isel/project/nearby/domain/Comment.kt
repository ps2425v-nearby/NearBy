package pt.isel.project.nearby.domain

import java.time.LocalDateTime

data class Comment(
    val id: Int,
    val userId: Int,
    val placeId: Int,
    val content: String,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime,
    val placeName: String? = null // Optional field for place name
)