package pt.isel.project.nearby.repository.jdbi

import org.jdbi.v3.core.Handle
import pt.isel.project.nearby.domain.Token
import pt.isel.project.nearby.domain.User
import pt.isel.project.nearby.repository.UserRepository
import pt.isel.project.nearby.utils.hashWithoutSalt
import java.util.UUID

class JdbiUserRepository(private val handle: Handle) : UserRepository {

    override fun getById(id: Int): User? =
        handle.createQuery("select * from Client where id = :id")
            .bind("id", id)
            .mapTo(User::class.java)
            .singleOrNull()

    override fun getByName(username: String): User? =
        handle.createQuery("select * from Client where username = :username")
            .bind("username", username)
            .mapTo(User::class.java)
            .singleOrNull()

    override fun getByEmail(email: String): User? =
        handle.createQuery("select * from Client where email = :email")
            .bind("email", email)
            .mapTo(User::class.java)
            .singleOrNull()

    override fun getByCredentials(username: String, password: String): User? =
        handle.createQuery("select * from Client where username = :username AND password = :password")
            .bind("username", username)
            .bind("password", password)
            .mapTo(User::class.java)
            .singleOrNull()

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

    override fun removeToken(token: String): Int =
        handle.createUpdate(
            "delete from token where token = :token"
        )
            .bind("token", token)
            .execute()

    override fun getTokenById(id: Int): Token? =
        handle.createQuery("select token, userID from token where userID = :userID")
            .bind("userID", id)
            .mapTo(Token::class.java)
            .firstOrNull()


    override fun  getUserID(token: String): Int? {
        return handle.createQuery("select userid from token where token = :token")
            .bind("token", token)
            .mapTo(Int::class.java)
            .firstOrNull()
    }
}