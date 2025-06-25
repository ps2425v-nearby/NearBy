package pt.isel.project.nearby.repository.jdbi

import org.jdbi.v3.core.Handle
import pt.isel.project.nearby.repository.LocationRepository
import pt.isel.project.nearby.repository.Transaction
import pt.isel.project.nearby.repository.UserRepository

class JdbiTransaction(
    private val handle: Handle
) : Transaction {

    override val userRepository: UserRepository = JdbiUserRepository(handle)
    override val locationRepository: LocationRepository = JdbiLocationRepository(handle)
    override val commentsRepository = JdbiCommentsRepository(handle)
    override fun rollback() {
        handle.rollback()
    }
}