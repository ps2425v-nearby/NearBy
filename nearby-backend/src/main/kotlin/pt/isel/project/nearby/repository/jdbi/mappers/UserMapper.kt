package pt.isel.project.nearby.repository.jdbi.mappers

import org.jdbi.v3.core.mapper.RowMapper
import org.jdbi.v3.core.statement.StatementContext
import pt.isel.project.nearby.domain.User
import java.sql.ResultSet
import java.sql.SQLException

class UserMapper : RowMapper<User> {

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