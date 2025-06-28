package pt.isel.project.nearby.repository.jdbi.mappers

import org.jdbi.v3.core.mapper.RowMapper
import org.jdbi.v3.core.statement.StatementContext
import pt.isel.project.nearby.domain.Location
import java.sql.ResultSet
import java.sql.SQLException

/**
 * Mapper for converting a ResultSet row into a Location object.
 * This class implements the RowMapper interface from JDBI,
 * which is used to map rows of a ResultSet to objects.
 *
 * This mapper extracts the fields of a Location from the ResultSet,
 * including id, userID, lat, lon, searchRadius, and name.
 */
class LocationMapper : RowMapper<Location> {

    /**
     * Maps a ResultSet row to a Location object.
     *
     * @param rs The ResultSet containing the data for the Location.
     * @param ctx The StatementContext, which can be used for additional context if needed.
     * @return A Location object populated with data from the ResultSet, or null if the ResultSet is null.
     * @throws SQLException If an error occurs while accessing the ResultSet.
     */
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