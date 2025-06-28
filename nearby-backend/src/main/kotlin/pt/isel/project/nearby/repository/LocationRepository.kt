package pt.isel.project.nearby.repository

import pt.isel.project.nearby.controllers.models.LocationInputModel
import pt.isel.project.nearby.domain.Place
import pt.isel.project.nearby.domain.Location

/**
 * Interface for managing locations in the Nearby application.
 * Provides methods to fetch, save, retrieve, and delete locations.
 */
interface LocationRepository {
    fun saveLocation(location: LocationInputModel): Int?
    fun getLocationByCoords(lat: Double, lon: Double): Location?
    fun getLocationsByUser(userId: Int): List<Location>
    fun deleteLocation(id: Int): Int
    fun getLocation(id: Int): Location?


}