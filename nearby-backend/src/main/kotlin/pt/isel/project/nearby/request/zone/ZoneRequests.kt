package pt.isel.project.nearby.request.zone

import pt.isel.project.nearby.domain.ZoneIdentifier

/**
 * ZoneRequests is an interface that defines methods for fetching zone information
 * based on geographical coordinates (latitude and longitude).
 * It includes both asynchronous and synchronous methods to retrieve zone identifiers.
 *
 * This interface is intended to be implemented by classes that handle the retrieval
 * of zone data.
 */
interface ZoneRequests {
    suspend fun fetchZoneAsync(lat: Double, long: Double): ZoneIdentifier
    fun fetchZoneSync(lat: Double, long: Double): ZoneIdentifier
}