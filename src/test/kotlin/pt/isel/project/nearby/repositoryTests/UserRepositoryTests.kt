package pt.isel.project.nearby.repositoryTests

import org.jdbi.v3.core.Jdbi
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeEach
import org.postgresql.ds.PGSimpleDataSource
import pt.isel.project.nearby.domain.Token
import pt.isel.project.nearby.repository.jdbi.JdbiUserRepository
import pt.isel.project.nearby.repository.jdbi.mappers.TokenMapper
import pt.isel.project.nearby.repository.jdbi.mappers.UserMapper
import java.util.*
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertNotNull
import kotlin.test.assertNull

class UserRepositoryTests {

    companion object {
        private const val DB_URL = "jdbc:postgresql://localhost:5432/projeto_tests"
        private const val DB_USER = "postgres"
        private const val DB_PASSWORD = "PedroAdmin"
    }

    private val jdbi = Jdbi.create(
        PGSimpleDataSource().apply {
            setURL(DB_URL)
            user = DB_USER
            password = DB_PASSWORD
        }
    )
        .registerRowMapper(UserMapper())
        .registerRowMapper(TokenMapper())

    private val handle = jdbi.open().apply {
        connection.autoCommit = false
    }
    private val userRepository = JdbiUserRepository(handle)



    @AfterEach
    fun teardown() {
        handle.rollback()
    }

    @Test
    fun `create a valid user`() {
        val name = "testUser"
        val email = "test@gmail.com"
        val password = "testPassword"
        val user = userRepository.createUser(name, email, password)
        assertEquals(name, user.username)
    }

    @Test
    fun `get user by id`() {
        val retrievedUser = userRepository.getById(1)
        assertNotNull(retrievedUser)
        assertEquals(1, retrievedUser.id)
        assertEquals("test0", retrievedUser.username)
        assertEquals("test0@gmail.com", retrievedUser.email)
        assertEquals("test0", retrievedUser.password)

    }

    @Test
    fun `get user by name`() {
        val name = "test0"
        val retrievedUser = userRepository.getByName(name)
        assertNotNull(retrievedUser)
        assertEquals(name, retrievedUser.username)
    }

    @Test
    fun `get user by credentials`() {
        val name = "test0"
        val password = "test0"
        val retrievedUser = userRepository.getByCredentials(name, password)
        assertNotNull(retrievedUser)
        assertEquals(name, retrievedUser.username)
    }

    @Test
    fun `get user by invalid credentials`() {
        val name = "test0"
        val password = "test0.1"
        val retrievedUser = userRepository.getByCredentials(name, password)
        assertNull(retrievedUser)
    }

    @Test
    fun `get user by non-existent id`() {
        val retrievedUser = userRepository.getById(-1)
        assertNull(retrievedUser)
    }

    @Test
    fun `get user by non-existent name`() {
        val name = "test0.1"

        val retrievedUser = userRepository.getByName(name)
        assertNull(retrievedUser)
    }

    @Test
    fun `create token`() {
        val userID = 1
        val token = Token(UUID.randomUUID(), userID)
        userRepository.createToken(token, 1)
        val retrievedToken = userRepository.getTokenById(userID)
        assertNotNull(retrievedToken)
        assertEquals(token.token, retrievedToken.token)
    }

    @Test
    fun `remove token`() {
        val userID = 1
        val token = Token(UUID.randomUUID(), userID)
        userRepository.createToken(token, 1)
        val removedCount = userRepository.removeToken(token.token.toString())
        assertEquals(1, removedCount)
    }

    @Test
    fun `get player ID by token`() {
        val userID = 1
        val token = Token(UUID.randomUUID(), userID)
        userRepository.createToken(token, 1)
        val retrievedPlayerID = userRepository.getUserID(token.token.toString())
        assertNotNull(retrievedPlayerID)
        assertEquals(userID, retrievedPlayerID)
    }

    @Test
    fun `get player ID by non-existent token`() {
        val retrievedPlayerID = userRepository.getUserID(UUID.randomUUID().toString())
        assertNull(retrievedPlayerID)
    }

    @Test
    fun `remove non-existent token`() {
        val removedCount = userRepository.removeToken(UUID.randomUUID().toString())
        assertEquals(0, removedCount)
    }

    @Test
    fun `create token with max tokens limit`() {
        val userID = 1
        val token1 = Token(UUID.randomUUID(), userID)
        val token2 = Token(UUID.randomUUID(), userID)
        userRepository.createToken(token1, 1)
        userRepository.createToken(token2, 1)

        val retrievedToken = userRepository.getTokenById(userID)
        assertNotNull(retrievedToken)
        assertEquals(token2.token, retrievedToken.token)
    }

}