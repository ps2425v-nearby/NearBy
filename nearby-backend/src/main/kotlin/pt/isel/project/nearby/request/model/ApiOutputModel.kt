package pt.isel.project.nearby.request.model

import pt.isel.project.nearby.domain.Place
import pt.isel.project.nearby.domain.TrafficInfo
import pt.isel.project.nearby.request.crime.CrimeEntry

/**
 * Data model representing the output of OpenStreetMap API requests.
 * This model contains a list of Place objects, each representing a place
 */
data class ApiPlacesModel(
    val elements: List<Place>
)

/**
 * Data model representing the output of OpenStreetMap API requests for traffic information.
 * This model contains a list of TrafficInfo objects, each representing traffic-related data.
 */
data class ApiTrafficModel(
    val elements: List<TrafficInfo>
)

/**
 * Data model representing the output of crime data requests.
 * This model contains a map where the key is a year and the value is a list of CrimeEntry objects.
 */
data class ApiCrimeModel(
    val Dados: Map<String, List<CrimeEntry>>
)
