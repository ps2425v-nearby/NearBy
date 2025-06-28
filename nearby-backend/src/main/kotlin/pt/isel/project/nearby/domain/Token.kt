package pt.isel.project.nearby.domain

import java.util.UUID

/**
 * Represents a token used for user authentication.
 *
 * @property token The unique identifier for the token, typically a UUID.
 * @property userID The ID of the user associated with this token.
 */
class Token(
    val token: UUID,
    val userID: Int
)