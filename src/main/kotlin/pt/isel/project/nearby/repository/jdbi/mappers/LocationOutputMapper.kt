package pt.isel.project.nearby.Repository.jdbi.mappers

import org.jdbi.v3.core.mapper.RowMapper
import org.jdbi.v3.core.statement.StatementContext
import pt.isel.project.nearby.domain.LocationOutput
import java.sql.ResultSet
import java.sql.SQLException

class LocationOutputMapper : RowMapper<LocationOutput> {

    @Throws(SQLException::class)
    override fun map(rs: ResultSet?, ctx: StatementContext?): LocationOutput? {
        return if (rs != null) {
            LocationOutput(
                id = rs.getInt("id"),
                lat = rs.getDouble("lat"),
                lon = rs.getDouble("lng"),
                name = rs.getString("name"),
            )
        } else null
    }
}