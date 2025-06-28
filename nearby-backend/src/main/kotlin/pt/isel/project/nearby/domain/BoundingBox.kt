package pt.isel.project.nearby.domain

/**
 * Represents a geographical bounding box defined by latitude and longitude coordinates.
 *
 * @property minLat The minimum latitude of the bounding box.
 * @property maxLat The maximum latitude of the bounding box.
 * @property minLon The minimum longitude of the bounding box.
 * @property maxLon The maximum longitude of the bounding box.
 */
data class BoundingBox(
    val minLat: Double,
    val maxLat: Double,
    val minLon: Double,
    val maxLon: Double
)
