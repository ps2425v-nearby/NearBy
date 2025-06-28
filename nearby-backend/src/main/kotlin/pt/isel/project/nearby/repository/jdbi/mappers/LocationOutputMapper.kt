package pt.isel.project.nearby.Repository.jdbi.mappers

import org.jdbi.v3.core.mapper.RowMapper
import org.jdbi.v3.core.statement.StatementContext
import pt.isel.project.nearby.domain.LocationOutput
import java.sql.ResultSet
import java.sql.SQLException

/**
 * Mapper for converting a ResultSet row into a LocationOutput object.
 * This class implements the RowMapper interface from JDBI,
 * which is used to map rows of a ResultSet to objects.
 *
 * This mapper extracts the fields of a LocationOutput from the ResultSet,
 * including id, lat, lon, and name.
 */
class LocationOutputMapper : RowMapper<LocationOutput> {

    /**
     * Maps a ResultSet row to a LocationOutput object.
     *
     * @param rs The ResultSet containing the data for the LocationOutput.
     * @param ctx The StatementContext, which can be used for additional context if needed.
     * @return A LocationOutput object populated with data from the ResultSet, or null if the ResultSet is null.
     * @throws SQLException If an error occurs while accessing the ResultSet.
     */
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