package pt.isel.project.nearby.repository.jdbi.mappers

import pt.isel.project.nearby.domain.Comment
import org.jdbi.v3.core.mapper.RowMapper
import org.jdbi.v3.core.statement.StatementContext
import java.sql.ResultSet


class CommentMapper : RowMapper<Comment> {
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