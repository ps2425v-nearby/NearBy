package pt.isel.project.nearby.domain

/**
 * Represents a geographical location with its associated details.
 *
 * @property id The unique identifier of the location.
 * @property lat The latitude coordinate of the location.
 * @property lon The longitude coordinate of the location.
 * @property name The name of the location.
 * @property searchRadius The radius around the location for search purposes, in meters.
 * @property userID The ID of the user associated with this location.
 */
data class Location(
    val id : Int,
    val lat: Double,
    val lon: Double,
    val name: String,
    val searchRadius: Double,
    val userID: Int
)
