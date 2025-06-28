package pt.isel.project.nearby.repository

import pt.isel.project.nearby.domain.Token
import pt.isel.project.nearby.domain.User

/**
 * Interface for managing users in the Nearby application.
 * Provides methods to retrieve users by various criteria,
 */
interface UserRepository {
    fun getById(id: Int): User?
    fun getByName(username: String): User?
    fun getByEmail(email: String): User?
    fun getByCredentials(username: String, password: String): User?
    fun createUser( name: String,email: String, password: String): User
    fun createToken(token: Token, maxTokens: Int)
    fun getTokenById(id: Int): Token?
    fun removeToken(token: String): Int
    fun getUserID(token: String): Int?

}