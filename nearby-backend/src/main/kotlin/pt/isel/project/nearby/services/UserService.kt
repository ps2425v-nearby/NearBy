package pt.isel.project.nearby.services
import org.springframework.stereotype.Service
import pt.isel.project.nearby.domain.*
import pt.isel.project.nearby.repository.TransactionManager
import java.util.UUID
import pt.isel.project.nearby.utils.Error
import pt.isel.project.nearby.utils.hashWithoutSalt


/**
 * UserService is a service class that provides methods to manage user-related operations.
 * It interacts with the user repository through a transaction manager to perform operations
 * such as retrieving users, creating new users, and managing authentication tokens.
 *
 * This service handles user access, creation, and token management,
 * ensuring that user data is processed within a transaction context.
 *
 * @property transactionManager The TransactionManager used to handle database transactions.
 */
@Service
class UserService(
    private val transactionManager: TransactionManager
) {

    /**
     * Retrieves a user by their ID.
     * This method executes a transaction to fetch the user from the repository
     * and returns the result as a UserAccessingResult.
     *
     * @param id The ID of the user to retrieve.
     * @return A UserAccessingResult containing the user or an error.
     */
    fun getById(id: Int): UserAccessingResult =
        transactionManager.executeTransaction {
            try {
                val player: User? = it.userRepository.getById(id)
                if (player == null) {
                    failure(Error.UserNotFound)
                } else {
                    success(player)
                }
            } catch (_: Exception) {
                return@executeTransaction failure(Error.InternalServerError)
            }
        }

    /**
     * Retrieves a user by their name.
     * This method executes a transaction to fetch the user from the repository
     * and returns the result as a UserAccessingResult.
     *
     * @param name The name of the user to retrieve.
     * @param email The email of the user to retrieve.
     * @param password The password of the user to retrieve.
     * @return A UserAccessingResult containing the user or an error.
     */
    fun createUser(name: String, email: String, password: String): UserCreationResult {
        return transactionManager.executeTransaction {
            try {
                if (it.userRepository.getByName(name) != null) {
                    failure(Error.UserAlreadyExists)
                } else if (it.userRepository.getByEmail(email) != null) {
                    failure(Error.EmailAlreadyTaken)
                } else {

                     it.userRepository.createUser(name, email, password)
                    success(true)
                }

            } catch (e: Exception) {
                e.printStackTrace()
                return@executeTransaction failure(Error.InternalServerError)
            }
        }
    }

    /**
     * Creates a token for a user based on their username and password.
     * This method executes a transaction to validate the user's credentials
     * and generate a token if the credentials are valid.
     *
     * This method checks if the user exists and if the provided password matches
     * the stored password hash. If the credentials are valid,
     * a new token is generated and stored in the repository.
     *
     * @param username The username of the user.
     * @param password The password of the user.
     * @return A TokenCreationResult containing the created token or an error.
     */
    fun createToken(username: String, password: String): TokenCreationResult =
        transactionManager.executeTransaction {
            try {
                val pass = hashWithoutSalt(password)

                val user = it.userRepository.getByCredentials(username, pass)
                if (user == null)
                    failure(Error.UserOrPasswordInvalid)
                else {
                    if(user.password != pass) {
                        return@executeTransaction failure(Error.UserOrPasswordInvalid)
                    }

                    val tokenValue = UUID.randomUUID()
                    val token = Token(
                        token = tokenValue,
                        userID = user.id
                    )
                    it.userRepository.createToken(token, 1)
                    success(token)
                }
            } catch (_: Exception) {
                return@executeTransaction failure(Error.InternalServerError)
            }
        }

    /**
     * Removes a token from the repository.
     * This method executes a transaction to remove the specified token
     * and returns the result as a TokenRemoveResult.
     *
     * If the token is not found, it returns an error indicating that the token does not exist.
     * If the removal operation fails, it returns an internal server error.
     *
     * @param token The token to remove.
     * @return A TokenRemoveResult indicating success or failure of the removal operation.
     */
    fun removeToken(token: String): TokenRemoveResult =
        transactionManager.executeTransaction {
            try {
                val res = it.userRepository.removeToken(token)
                if (res <= 0)
                    return@executeTransaction failure(Error.TokenNotFound)
                else {
                    return@executeTransaction success(true)
                }
            } catch (_: Exception) {
                return@executeTransaction failure(Error.InternalServerError)
            }
        }

    /**
     * Retrieves the user ID associated with a given token.
     * This method executes a transaction to fetch the user ID from the repository
     * based on the provided token.
     *
     * If the token is not found, it returns an error indicating that the user does not exist.
     * If an internal error occurs during the operation, it returns an internal server error.
     *
     * @param token The token for which to retrieve the user ID.
     * @return A UserAccessingByTokenResult containing the user ID or an error.
     */
    fun getUserIdByToken(token: String): UserAccessingByTokenResult =
        transactionManager.executeTransaction {
            try {
                val res = it.userRepository.getUserID(token) ?: return@executeTransaction failure(Error.UserNotFound)
                success(res)
            } catch (_: Exception) {
                return@executeTransaction failure(Error.InternalServerError)
            }
        }

    /**
     * Checks if a token is valid by verifying its existence in the repository.
     * This method executes a transaction to check if the token exists
     * and returns the result as a TokenAccessingResult.
     *
     * If the token is found, it returns success with a true value.
     * If the token is not found, it returns success with a false value indicating that the token does not exist.
     *
     * @param token The token to validate.
     * @return A TokenAccessingResult indicating whether the token is valid or not.
     */
    fun isTokenValid(token: String): TokenAccessingResult {
        return transactionManager.executeTransaction {
            try {
                val res = it.userRepository.getUserID(token) != null
                success(res)
            } catch (_: Exception) {
                return@executeTransaction failure(Error.InternalServerError)
            }
        }
    }
}