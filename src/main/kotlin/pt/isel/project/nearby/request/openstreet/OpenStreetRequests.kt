package pt.isel.project.nearby.request.openstreet

import pt.isel.project.nearby.controllers.models.AmenitiesResponse
import pt.isel.project.nearby.domain.BoundingBox

import pt.isel.project.nearby.domain.Place
import pt.isel.project.nearby.domain.TrafficInfo


interface OpenStreetRequests {
    suspend fun fetchPlacesAsync(lat: Double, long: Double, searchRadius: Double): List<Place>
    suspend fun fetchTrafficAsync(lat: Double, long: Double, searchRadius: Double): List<TrafficInfo>
    suspend fun fetchAmenitiesByBoundingBoxAsync(bbox: BoundingBox, types: List<String>): AmenitiesResponse
    suspend fun fetchBoundingBoxAsync(parish: String, municipality: String, district: String): BoundingBox?



    fun fetchAmenitiesByBoundingBoxSync(bbox: BoundingBox, types: List<String>): AmenitiesResponse
    fun fetchBoundingBoxSync(parish: String, municipality: String, district: String): BoundingBox?


}