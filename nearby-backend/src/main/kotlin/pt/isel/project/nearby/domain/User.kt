package pt.isel.project.nearby.domain

/**
 * Represents a user in the system.
 *
 * @property id The unique identifier for the user.
 * @property email The email address of the user.
 * @property username The username of the user.
 * @property password The password of the user (should be stored securely).
 */
data class User(
    val id: Int,
    val email: String,
    val username: String,
    val password: String,
)