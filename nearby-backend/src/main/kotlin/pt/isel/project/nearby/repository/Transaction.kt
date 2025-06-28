package pt.isel.project.nearby.repository

/**
 * Interface for managing transactions in the Nearby application.
 * Provides access to repositories and a rollback mechanism.
 */
interface Transaction {
    val userRepository: UserRepository
    val locationRepository: LocationRepository
    val commentsRepository: CommentsRepository
    fun rollback()
}