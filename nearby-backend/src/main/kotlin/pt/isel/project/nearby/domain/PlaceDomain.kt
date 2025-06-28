package pt.isel.project.nearby.domain

/**
 * Represents a geographical place with its associated details.
 *
 * @property type The type of the place (e.g., "node", "way", "relation").
 * @property id The unique identifier of the place.
 * @property lat The latitude coordinate of the place.
 * @property lon The longitude coordinate of the place.
 * @property tags A map of tags associated with the place, where keys are tag names and values are tag values.
 */
data class Place(
    val type: String,
    val id: Long,
    val lat: Double,
    val lon: Double,
    val tags: Map<String, String>?,
)

/**
 * Represents traffic information related to a place.
 *
 * @property type The type of traffic information (e.g., "traffic", "road_condition").
 * @property id The unique identifier of the traffic information.
 * @property node A list of node IDs associated with the traffic information.
 * @property tags A map of tags associated with the traffic information, where keys are tag names and values are tag values.
 */
data class TrafficInfo(
    val type: String,
    val id: Long,
    val node: List<Int>,
    val tags: Map<String, String>,
)

/**
 * Represents a zone identifier with various geographical levels.
 * This class encapsulates different levels of geographical identifiers such as road, hamlet, village, suburb, city, town, municipality, and county.
 * Each level is represented as a string, and the class provides a method to convert these identifiers into a set of non-empty strings.
 * This is useful for filtering out empty identifiers and obtaining a clean set of geographical identifiers.
 *
 * @property road The identifier for the road level.
 * @property hamlet The identifier for the hamlet level.
 * @property village The identifier for the village level.
 * @property suburb The identifier for the suburb level.
 * @property city The identifier for the city level.
 * @property town The identifier for the town level.
 * @property municipality The identifier for the municipality level.
 * @property county The identifier for the county level.
 */
data class ZoneIdentifier(
    val road: String,
    val hamlet: String,
    val village: String,
    val suburb: String,
    val city: String,
    val town: String,
    val municipality: String,
    val county: String,
) {
    /**
     * Converts the geographical identifiers into a set of non-empty strings.
     * This method filters out any empty identifiers and returns a set containing only the non-empty ones.
     *
     * @return A set of non-empty geographical identifiers.
     */
    fun toSet(): Set<String> {
        return setOfNotNull(
            road.takeIf { it.isNotEmpty() },
            hamlet.takeIf { it.isNotEmpty() },
            village.takeIf { it.isNotEmpty() },
            suburb.takeIf { it.isNotEmpty() },
            city.takeIf { it.isNotEmpty() },
            town.takeIf { it.isNotEmpty() },
            municipality.takeIf { it.isNotEmpty() },
            county.takeIf { it.isNotEmpty() }
        )
    }
}

/**
 * Represents information about crimes in a specific city.
 *
 * @property city The name of the city where the crime occurred.
 * @property type The type of crime (e.g., "theft", "assault").
 * @property valor The value or description of the crime.
 */
data class CrimesInfo(
    val city: String,
    val type: String,
    val valor: String
)


/**
 * Represents a District with its associated details.
 *
 * @property name The name of the district.
 * @property osm_id The OpenStreetMap identifier for the district.
 */
data class District (
    val name: String,
    val osm_id: Long,
)

/**
 * Represents a geographical location with its associated details.
 *
 * @property id The unique identifier of the location.
 * @property lat The latitude coordinate of the location.
 * @property lon The longitude coordinate of the location.
 * @property name The name of the location.
 */
data class LocationOutput(
    val id: Int,
    val lat: Double,
    val lon: Double,
    val name: String
)


