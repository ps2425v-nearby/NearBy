package pt.isel.project.nearby.services
import org.springframework.stereotype.Service
import pt.isel.project.nearby.domain.*
import pt.isel.project.nearby.repository.TransactionManager
import java.util.UUID
import pt.isel.project.nearby.utils.Error
import pt.isel.project.nearby.utils.hashWithoutSalt

@Service
class UserService(
    private val transactionManager: TransactionManager
) {
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
    // register function

    fun createUser(name: String, email: String, password: String): UserCreationResult {
        return transactionManager.executeTransaction {
            try {
                if (it.userRepository.getByName(name) != null) {
                    failure(Error.UserAlreadyExists)
                } else if (it.userRepository.getByEmail(email) != null) {
                    failure(Error.EmailAlreadyTaken)
                } else {

                    val player = it.userRepository.createUser(name, email, password)
                    success(true)
                }

            } catch (e: Exception) {
                e.printStackTrace()
                return@executeTransaction failure(Error.InternalServerError)
            }
        }
    }

    // login function
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

    fun removeToken(token: String): TokenRemoveResult =
        transactionManager.executeTransaction {
            try {
                val res = it.userRepository.removeToken(token)
                if (res <= 0) failure(Error.TokenNotFound)
                else success(true)
            } catch (_: Exception) {
                return@executeTransaction failure(Error.InternalServerError)
            }
        }


    fun getUserIdByToken(token: String): UserAccessingByTokenResult =
        transactionManager.executeTransaction {
            try {
                val res = it.userRepository.getUserID(token) ?: return@executeTransaction failure(Error.UserNotFound)
                success(res)
            } catch (_: Exception) {
                return@executeTransaction failure(Error.InternalServerError)
            }
        }

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