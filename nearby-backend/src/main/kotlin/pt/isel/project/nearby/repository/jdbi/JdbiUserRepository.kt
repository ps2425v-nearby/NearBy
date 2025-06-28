package pt.isel.project.nearby.repository.jdbi

import org.jdbi.v3.core.Handle
import pt.isel.project.nearby.domain.Token
import pt.isel.project.nearby.domain.User
import pt.isel.project.nearby.repository.UserRepository
import pt.isel.project.nearby.utils.hashWithoutSalt
import java.util.UUID

/**
 * JdbiUserRepository is a concrete implementation of the UserRepository interface.
 * It uses JDBI to interact with the database for user-related operations.
 *
 * @property handle The JDBI handle used to manage the database connection and transactions.
 */
class JdbiUserRepository(private val handle: Handle) : UserRepository {

    /**
     * Retrieves a list of all users in the database.
     *
     * @param id The ID of the user to retrieve.
     * @return A list of User objects representing all users.
     */
    override fun getById(id: Int): User? =
        handle.createQuery("select * from Client where id = :id")
            .bind("id", id)
            .mapTo(User::class.java)
            .singleOrNull()

    /**
     * Retrieves a user by their username.
     *
     * @param username The username of the user to retrieve.
     * @return A User object if found, or null if no user with the given username exists.
     */
    override fun getByName(username: String): User? =
        handle.createQuery("select * from Client where username = :username")
            .bind("username", username)
            .mapTo(User::class.java)
            .singleOrNull()

    /**
     * Retrieves a user by their email address.
     *
     * @param email The email address of the user to retrieve.
     * @return A User object if found, or null if no user with the given email exists.
     */
    override fun getByEmail(email: String): User? =
        handle.createQuery("select * from Client where email = :email")
            .bind("email", email)
            .mapTo(User::class.java)
            .singleOrNull()

    /**
     * Retrieves a user by their username and password.
     *
     * @param username The username of the user to retrieve.
     * @param password The password of the user to retrieve.
     * @return A User object if found, or null if no user with the given credentials exists.
     */
    override fun getByCredentials(username: String, password: String): User? =
        handle.createQuery("select * from Client where username = :username AND password = :password")
            .bind("username", username)
            .bind("password", password)
            .mapTo(User::class.java)
            .singleOrNull()

    /**
     * Creates a new user in the database.
     *
     * @param name The username of the new user.
     * @param email The email address of the new user.
     * @param password The password of the new user, which will be hashed before storage.
     * @return A User object representing the newly created user.
     */
    override fun createUser(name: String, email: String, password: String): User {
        handle.createUpdate(
            "insert into Client(email,username, password) values (:email,:username, :password)"
        )
            .bind("email", email)
            .bind("username", name)
            .bind("password", hashWithoutSalt( password))
            .execute()

        return handle.createQuery("select * from Client where username = :username")
            .bind("username", name)
            .mapTo(User::class.java)
            .first()
    }

    /**
     * Updates an existing user in the database.
     *
     * @param token The Token object containing the user ID and the new token to be created.
     * @param maxTokens The maximum number of tokens to keep for the user.
     * @return The updated User object.
     */
    override fun createToken(token: Token, maxTokens: Int) {
        handle.createUpdate(
            """
            delete from token
            where userID = :userID 
                and token in (
                    select token from token where userID = :userID 
                        offset :offset
                )
            """.trimIndent()
        )
            .bind("userID", token.userID)
            .bind("offset", maxTokens - 1)
            .execute()

        handle.createUpdate(
            """
                insert into token(userID, token) 
                values (:userID, :token)
            """.trimIndent()
        )
            .bind("userID", token.userID)
            .bind("token", token.token)
            .execute()
    }

    /**
     * Removes a token from the database.
     *
     * @param token The token to be removed.
     * @return The number of rows affected by the delete operation.
     */
    override fun removeToken(token: String): Int =
        handle.createUpdate(
            "delete from token where token = :token"
        )
            .bind("token", token)
            .execute()

    /**
     * Retrieves a token by its ID.
     *
     * @param id The ID of the user whose token is to be retrieved.
     * @return A Token object if found, or null if no token exists for the given user ID.
     */
    override fun getTokenById(id: Int): Token? =
        handle.createQuery("select token, userID from token where userID = :userID")
            .bind("userID", id)
            .mapTo(Token::class.java)
            .firstOrNull()

    /**
     * Retrieves a user ID by its token value.
     *
     * @param token The token value for which the user ID is to be retrieved.
     * @return The user ID associated with the token, or null if no such token exists.
     */
    override fun  getUserID(token: String): Int? {
        return handle.createQuery("select userid from token where token = :token")
            .bind("token", token)
            .mapTo(Int::class.java)
            .firstOrNull()
    }
}