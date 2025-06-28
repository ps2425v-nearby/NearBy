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

@Service
class ZoneService(private val zoneRequester: ZoneRequester) {
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
