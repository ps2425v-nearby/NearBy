package pt.isel.project.nearby.repository.jdbi

import org.jdbi.v3.core.Handle
import pt.isel.project.nearby.repository.LocationRepository
import pt.isel.project.nearby.repository.Transaction
import pt.isel.project.nearby.repository.UserRepository

/**
 * JdbiTransaction is a class that implements the Transaction interface.
 * It provides access to repositories for user and location management,
 * and handles transaction management using JDBI.
 *
 * @property handle The JDBI handle used to manage the database connection and transactions.
 */
class JdbiTransaction(
    private val handle: Handle
) : Transaction {

    override val userRepository: UserRepository = JdbiUserRepository(handle)
    override val locationRepository: LocationRepository = JdbiLocationRepository(handle)
    override val commentsRepository = JdbiCommentsRepository(handle)

    /**
     * It rolls back the transaction, undoing all operations performed since the transaction began.
     */
    override fun rollback() {
        handle.rollback()
    }
}