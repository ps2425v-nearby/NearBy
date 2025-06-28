package pt.isel.project.nearby.repository

/**
 * Interface for managing transactions in the Nearby application.
 * Provides a method to execute a block of code within a transaction context.
 */
interface TransactionManager {
    fun <R> executeTransaction(block: (Transaction) -> R): R
}