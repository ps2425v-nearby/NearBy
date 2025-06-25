package pt.isel.project.nearby.repository

interface TransactionManager {
    fun <R> executeTransaction(block: (Transaction) -> R): R
}