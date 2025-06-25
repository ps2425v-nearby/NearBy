package pt.isel.project.nearby.services

import kotlinx.coroutines.runBlocking
import org.springframework.stereotype.Service
import pt.isel.project.nearby.domain.ZoneIdentifier
import pt.isel.project.nearby.request.zone.ZoneRequester

@Service
class ZoneService(private val zoneRequester: ZoneRequester) {
    fun fetchZone(lat: Double, long: Double): ZoneIdentifier {
        val zoneInfo = runBlocking {
            zoneRequester.fetchZoneAsync(lat, long)
        }
        return ZoneIdentifier(
            hamlet = zoneInfo.hamlet,
            village = zoneInfo.village,
            suburb = zoneInfo.suburb,
            city = zoneInfo.city,
            municipality = zoneInfo.municipality,
            county = zoneInfo.county,
            road = zoneInfo.road,
            town = zoneInfo.town
        )
}
}
