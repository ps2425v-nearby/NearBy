package pt.isel.project.nearby.request.zone

import pt.isel.project.nearby.domain.ZoneIdentifier

interface ZoneRequests {
    suspend fun fetchZoneAsync(lat: Double, long: Double): ZoneIdentifier
    fun fetchZoneSync(lat: Double, long: Double): ZoneIdentifier
}