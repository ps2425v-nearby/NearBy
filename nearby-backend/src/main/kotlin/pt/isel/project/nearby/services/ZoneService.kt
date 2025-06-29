package pt.isel.project.nearby.services

import kotlinx.coroutines.TimeoutCancellationException
import kotlinx.coroutines.runBlocking
import org.springframework.stereotype.Service
import pt.isel.project.nearby.controllers.models.exceptions.ApiRequestException
import pt.isel.project.nearby.controllers.models.exceptions.ApiResponseException
import pt.isel.project.nearby.domain.ZoneAccessingResult
import pt.isel.project.nearby.domain.ZoneIdentifier
import pt.isel.project.nearby.domain.failure
import pt.isel.project.nearby.domain.success
import pt.isel.project.nearby.request.zone.ZoneRequester
import pt.isel.project.nearby.utils.Error
import kotlin.coroutines.cancellation.CancellationException


/**
 * ZoneService is a service class that provides methods to fetch zone information
 * based on geographical coordinates (latitude and longitude). It interacts with the
 * ZoneRequester to perform API requests and handle the results.
 *
 * @property zoneRequester The ZoneRequester used to make API requests for zone data.
 */
@Service
class ZoneService(private val zoneRequester: ZoneRequester) {

    /**
     * Fetches zone information based on the provided latitude and longitude.
     * It uses the ZoneRequester to perform a synchronous API request to fetch the zone data.
     *
     * @param lat The latitude of the location.
     * @param long The longitude of the location.
     * @return A ZoneAccessingResult containing the fetched zone data or an error.
     */
    fun fetchZone(lat: Double, long: Double): ZoneAccessingResult =
        try {
            val zone = zoneRequester.fetchZoneSync(lat, long)
            success(zone)
        } catch (e: Exception) {
            when (e) {
                is TimeoutCancellationException, is CancellationException -> failure(Error.ApiTimeoutResponse)
                is ApiRequestException -> failure(Error.ApiRequestError)
                is ApiResponseException -> failure(Error.ApiResponseError)
                else -> failure(Error.InternalServerError)
            }
        }

}
