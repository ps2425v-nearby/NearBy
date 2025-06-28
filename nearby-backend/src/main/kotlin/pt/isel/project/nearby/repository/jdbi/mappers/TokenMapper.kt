package pt.isel.project.nearby.repository.jdbi.mappers

import org.jdbi.v3.core.mapper.RowMapper
import org.jdbi.v3.core.statement.StatementContext
import pt.isel.project.nearby.domain.Token
import pt.isel.project.nearby.domain.User
import java.sql.ResultSet
import java.sql.SQLException
import java.util.*

/**
 * Mapper for converting a ResultSet row into a Token object.
 * This class implements the RowMapper interface from JDBI,
 * which is used to map rows of a ResultSet to objects.
 *
 * This mapper extracts the fields of a Token from the ResultSet,
 * including token and userID.
 */
class TokenMapper : RowMapper<Token> {

    /**
     * Maps a ResultSet row to a Token object.
     *
     * @param rs The ResultSet containing the data for the Token.
     * @param ctx The StatementContext, which can be used for additional context if needed.
     * @return A Token object populated with data from the ResultSet, or null if the ResultSet is null.
     * @throws SQLException If an error occurs while accessing the ResultSet.
     */
    @Throws(SQLException::class)
    override fun map(rs: ResultSet?, ctx: StatementContext?): Token? {
        return if (rs != null) {
            Token(
                token = UUID.fromString(rs.getString("token")),
                userID = rs.getInt("userID")
            )
        } else null
    }
}