package pt.isel.project.nearby.repository.jdbi.mappers

import org.jdbi.v3.core.mapper.RowMapper
import org.jdbi.v3.core.statement.StatementContext
import pt.isel.project.nearby.domain.Token
import pt.isel.project.nearby.domain.User
import java.sql.ResultSet
import java.sql.SQLException
import java.util.*

class TokenMapper : RowMapper<Token> {

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