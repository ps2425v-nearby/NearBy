package pt.isel.project.nearby.repository

interface Transaction {
    val userRepository: UserRepository
    val locationRepository: LocationRepository
    val commentsRepository: CommentsRepository
    fun rollback()
}