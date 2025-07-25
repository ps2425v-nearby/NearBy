package pt.isel.project.nearby.controllers


import pt.isel.project.nearby.services.ZoneService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import pt.isel.project.nearby.PathTemplate
import pt.isel.project.nearby.controllers.models.ProblemJson
import pt.isel.project.nearby.controllers.models.exceptions.*
import pt.isel.project.nearby.domain.Either
import pt.isel.project.nearby.domain.ZoneIdentifier
import pt.isel.project.nearby.utils.Error


/**
 * Controller for handling zone identifier requests.
 * This controller provides an endpoint to fetch zone information based on geographic coordinates.
 * It uses the ZoneService to perform operations and returns appropriate HTTP responses.
 *
 * @property zoneService The service used to handle zone operations.
 * @constructor Creates a ZoneIdentifierController with the specified ZoneService.
 *
 * @RestController annotation indicates that this class is a Spring MVC controller.
 */


@RestController
class ZoneIdentifierController(private val zoneService: ZoneService) {

    /**
     * Fetches zone information based on the provided latitude and longitude.
     *
     * @param lat the latitude of the location
     * @param lon the longitude of the location
     * @return a ResponseEntity containing the zone information or an error response if the request fails
     */
    @GetMapping(PathTemplate.ZONE_IDENTIFIER)
    fun zoneIdentifier(@RequestParam lat: Double, @RequestParam lon: Double): ResponseEntity<*> {
        return when (val res = zoneService.fetchZone(lat, lon)) {
            is Either.Right -> {
                ResponseEntity.ok(res.value)
            }
            is Either.Left -> when (res.value) {
                Error.ApiTimeoutResponse -> ProblemJson.response(404, timeoutError())
                Error.ApiRequestError -> ProblemJson.response(404, apiRequestError())
                Error.ApiResponseError -> ProblemJson.response(409, apiResponseError())
                else -> ProblemJson.response(500, ProblemJson.internalServerError())
            }
        }
    }

}