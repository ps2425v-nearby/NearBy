package pt.isel.project.nearby.repository.jdbi.mappers

import org.jdbi.v3.core.mapper.RowMapper
import org.jdbi.v3.core.statement.StatementContext
import pt.isel.project.nearby.domain.Location
import java.sql.ResultSet
import java.sql.SQLException

class LocationMapper : RowMapper<Location> {

    @Throws(SQLException::class)
    override fun map(rs: ResultSet?, ctx: StatementContext?): Location? {
        return if (rs != null) {
            Location(
                id = rs.getInt("id"),
                userID = rs.getInt("userID"),
                lat = rs.getDouble("lat"),
                lon = rs.getDouble("lng"),
                searchRadius = rs.getDouble("searchRadius"),
                name = rs.getString("name"),
            )
        } else null
    }
}