package pt.isel.project.nearby.repository

import pt.isel.project.nearby.controllers.models.LocationInputModel
import pt.isel.project.nearby.domain.Place
import pt.isel.project.nearby.domain.Location


interface LocationRepository {
    suspend fun fetchAllPlaces(lat: Double, long: Double, searchRadius: Double): List<Place>
    fun saveLocation(location: LocationInputModel): Int?
    fun getLocationByCoords(lat: Double, lon: Double): Location?
    fun getLocationByCoords(id: Int): Location?
    fun getLocationsByUser(userId: Int): List<Location>
    fun deleteLocation(id: Int): Int
    fun getLocation(id: Int): Location?


}