package pt.isel.project.nearby.controllers.models

import pt.isel.project.nearby.domain.*
import pt.isel.project.nearby.request.openmeteo.SeasonalWeatherValues


/**
 * Data class representing the input model for a location.
 * This class contains the necessary fields to create or update a location.
 *
 * @property lat The latitude of the location.
 * @property lon The longitude of the location.
 * @property name The name of the location.
 * @property searchRadius The search radius around the location.
 * @property userID The ID of the user associated with the location.
 */
data class LocationInputModel(
    val lat: Double,
    val lon: Double,
    val name: String,
    val searchRadius: Double,
    val userID: Int
)

/**
 * Data class representing the output model for a location.
 * This class contains the details of a location.
 *
 * @property id The unique identifier of the location.
 * @property lat The latitude of the location.
 * @property lon The longitude of the location.
 * @property searchRadius The search radius around the location.
 * @property name The name of the location.
 * @property places A list of places associated with the location.
 * @property wind A list of seasonal weather values for the location.
 * @property trafficLevel The traffic level at the location.
 * @property crimes A list of crime information related to the location.
 * @property parkingSpaces A list of parking spaces available at the location.
 */
data class LocationOutputModel(
    val id: Int?,
    val lat: Double,
    val lon: Double,
    val searchRadius: Double,
    val name: String?,
    val places: List<Place>,
    val wind: List<SeasonalWeatherValues>,
    val trafficLevel: String,
    val crimes: List<CrimesInfo>,
    val parkingSpaces: List<Place>,
)

/**
 * Data class representing a simple output model for a location.
 * This class contains the essential details of a location.
 *
 * @property id The unique identifier of the location.
 * @property lat The latitude of the location.
 * @property lon The longitude of the location.
 * @property searchRadius The search radius around the location.
 * @property name The name of the location.
 */
data class SimpleLocationOutputModel(
    val id: Int,
    val lat: Double,
    val lon: Double,
    val searchRadius: Double,
    val name: String?,
)

/**
 * Data class representing a request for amenities in a specific area.
 * This class contains the necessary fields to request amenities based on district, municipality, parish, and points of interest.
 *
 * @property district The district where the amenities are requested.
 * @property municipality The municipality where the amenities are requested.
 * @property parish The parish where the amenities are requested.
 * @property points A list of points of interest for which amenities are requested.
 */
data class AmenitiesRequest(
    val district: String,
    val municipality: String,
    val parish: String,
    val points: List<String>
)

/*
 * Data class representing the response containing amenities information.
 * This class includes the center of the map and a list of amenities.
 *
 * @property center The geographical center of the map.
 * @property amenities A list of amenities available in the specified area.
 */
data class AmenitiesResponse(
    val center: MapCenter,
    val amenities: List<Amenity>
)

/**
 * Data class representing the center of a map.
 * This class contains the latitude and longitude of the center point.
 *
 * @property lat The latitude of the map center.
 * @property lon The longitude of the map center.
 */
data class MapCenter(
    val lat: Double,
    val lon: Double
)

/**
 * Data class representing an amenity.
 * This class contains the ID, geographical coordinates, and tags associated with the amenity.
 *
 * @property id The unique identifier of the amenity.
 * @property lat The latitude of the amenity's location.
 * @property lon The longitude of the amenity's location.
 * @property tags A map of tags associated with the amenity, providing additional information.
 */
data class Amenity(
    val id: String,
    val lat: Double,
    val lon: Double,
    val tags: Map<String, String>
)

