package pt.isel.project.nearby.repository.jdbi

import org.jdbi.v3.core.Jdbi
import org.springframework.stereotype.Component
import pt.isel.project.nearby.repository.Transaction
import pt.isel.project.nearby.repository.TransactionManager

/**
 * JdbiTransactionManager is a class that implements the TransactionManager interface.
 * It provides a method to execute transactions using JDBI.
 *
 * @property jdbi The JDBI instance used to manage database connections and transactions.
 */
@Component
class JdbiTransactionManager(
    private val jdbi: Jdbi
) : TransactionManager {

    /**
     * Executes a transaction block using JDBI.
     *
     * @param block The block of code to be executed within the transaction.
     * @return The result of the block execution.
     */
    override fun <R> executeTransaction(block: (Transaction) -> R): R =
        jdbi.inTransaction<R, Exception> { handle ->
            val transaction = JdbiTransaction(handle)
            block(transaction)
        }
}