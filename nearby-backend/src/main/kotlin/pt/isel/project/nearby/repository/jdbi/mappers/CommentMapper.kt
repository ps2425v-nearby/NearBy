package pt.isel.project.nearby.repository.jdbi.mappers

import pt.isel.project.nearby.domain.Comment
import org.jdbi.v3.core.mapper.RowMapper
import org.jdbi.v3.core.statement.StatementContext
import java.sql.ResultSet
import java.sql.SQLException

/**
 * Mapper for converting a ResultSet row into a Comment object.
 * This class implements the RowMapper interface from JDBI,
 * which is used to map rows of a ResultSet to objects.
 *
 * This mapper extracts the fields of a Comment from the ResultSet,
 * including id, userId, placeId, content, createdAt, updatedAt, and placeName.
 */
class CommentMapper : RowMapper<Comment> {

    /**
     * Maps a ResultSet row to a Comment object.
     *
     * @param rs The ResultSet containing the data for the Comment.
     * @param ctx The StatementContext, which can be used for additional context if needed.
     * @return A Comment object populated with data from the ResultSet, or null if the ResultSet is null.
     * @throws SQLException If an error occurs while accessing the ResultSet.
     */
    @Throws(SQLException::class)
    override fun map(
        rs: ResultSet?,
        ctx: StatementContext?
    ): Comment? {
        return if (rs != null) {
            Comment(
                id = rs.getInt("id"),
                userId = rs.getInt("userId"),
                placeId = rs.getInt("placeId"),
                content = rs.getString("content"),
                createdAt = rs.getTimestamp("createdAt").toLocalDateTime(),
                updatedAt = rs.getTimestamp("updatedAt").toLocalDateTime(),
                placeName = rs.getString("placeName")
            )
        } else null
    }
}