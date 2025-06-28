package pt.isel.project.nearby.repository.jdbi.mappers

import org.jdbi.v3.core.mapper.RowMapper
import org.jdbi.v3.core.statement.StatementContext
import pt.isel.project.nearby.domain.User
import java.sql.ResultSet
import java.sql.SQLException

/**
 * Mapper for converting a ResultSet row into a User object.
 * This class implements the RowMapper interface from JDBI,
 * which is used to map rows of a ResultSet to objects.
 *
 * This mapper extracts the fields of a User from the ResultSet,
 * including id, email, username, and password.
 */
class UserMapper : RowMapper<User> {

    /**
     * Maps a ResultSet row to a User object.
     *
     * @param rs The ResultSet containing the data for the User.
     * @param ctx The StatementContext, which can be used for additional context if needed.
     * @return A User object populated with data from the ResultSet, or null if the ResultSet is null.
     * @throws SQLException If an error occurs while accessing the ResultSet.
     */
    @Throws(SQLException::class)
    override fun map(rs: ResultSet?, ctx: StatementContext?): User? {
        return if (rs != null) {
            User(
                id = rs.getInt("id"),
                email = rs.getString("email"),
                username = rs.getString("username"),
                password = rs.getString("password")
            )
        } else null
    }
}