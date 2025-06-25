package pt.isel.project.nearby.controllers.models

import pt.isel.project.nearby.domain.*
import pt.isel.project.nearby.request.openmeteo.SeasonalWeatherValues

data class LocationInputModel(
    val lat: Double,
    val lon: Double,
    val name: String,
    val searchRadius: Double,
    val userID: Int
)

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

data class SimpleLocationOutputModel(
    val id: Int,
    val lat: Double,
    val lon: Double,
    val searchRadius: Double,
    val name: String?,
)


data class AmenitiesRequest(
    val district: String,
    val municipality: String,
    val parish: String,
    val points: List<String>
)

data class AmenitiesResponse(
    val center: MapCenter,
    val amenities: List<Amenity>
)
data class MapCenter(
    val lat: Double,
    val lon: Double
)
data class Amenity(
    val id: String,
    val lat: Double,
    val lon: Double,
    val tags: Map<String, String>
)

