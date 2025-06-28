package pt.isel.project.nearby.controllers
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import pt.isel.project.nearby.controllers.models.LocationInputModel
import pt.isel.project.nearby.controllers.models.ProblemJson
import pt.isel.project.nearby.controllers.models.exceptions.*
import pt.isel.project.nearby.domain.Either
import pt.isel.project.nearby.PathTemplate
import pt.isel.project.nearby.controllers.models.AmenitiesRequest
import pt.isel.project.nearby.services.LocationService
import pt.isel.project.nearby.utils.Error

/**
 * Controller for handling location-related requests.
 * This controller provides endpoints for saving, retrieving, deleting locations,
 * and fetching zone markers based on geographic coordinates.
 *
 * @property locationService The service used to handle location operations.
 * @constructor Creates a LocationController with the specified LocationService.
 *
 * @RestController annotation indicates that this class is a Spring MVC controller.
 */
@RestController
class LocationController(
    private val locationService: LocationService,
) {

    /**
     * Saves a new location based on the provided input model.
     *
     * @param loc The input model containing location details to be saved.
     * @return A ResponseEntity containing the saved location or an error response if the request fails.
     */
    @PostMapping(PathTemplate.SAVE)
    fun saveLocation(@RequestBody loc: LocationInputModel): ResponseEntity<*> {
        return when (val res = locationService.saveLocation(loc)) {
            is Either.Right -> {
                ResponseEntity.ok(res.value)
            }

            is Either.Left -> when (res.value) {
                Error.LocationRepositoryError -> ProblemJson.response(409, locationRepositoryError(null))
                else -> ProblemJson.response(500, ProblemJson.internalServerError())
            }
        }
    }

    /**
     * Retrieves a zone marker based on geographic coordinates and search radius.
     *
     * @param lat The latitude of the center point for the search.
     * @param lon The longitude of the center point for the search.
     * @param searchRadius The radius within which to search for locations.
     * @return A ResponseEntity containing the zone marker data or an error response if the request fails.
     */
    @GetMapping(PathTemplate.GET_ZONE_MARKER)
    fun getZoneMarker(
        @RequestParam lat: Double,
        @RequestParam lon: Double,
        @RequestParam searchRadius: Double
    ): ResponseEntity<*> {
        return when (val data = locationService.fetchAllAsync(lat, lon, searchRadius)) {
            is Either.Right -> {
                ResponseEntity.ok(data.value)
            }

            is Either.Left -> when (data.value) {
                Error.ApiRequestError -> ProblemJson.response(404, apiRequestError())
                Error.ApiResponseError -> ProblemJson.response(409, apiResponseError())
                Error.ApiTimeoutResponse -> ProblemJson.response(404, timeoutError())
                else -> ProblemJson.response(500, ProblemJson.internalServerError())
            }
        }
    }

    /**
     * Deletes a location by its ID.
     *
     * @param locationId The ID of the location to be deleted.
     * @return A ResponseEntity indicating the result of the deletion operation or an error response if the request fails.
     */
    @DeleteMapping(PathTemplate.DELETE)
    fun deleteLocation(
        @PathVariable locationId: Int,
    ): ResponseEntity<*> {
        return when (val res = locationService.deleteLocation(locationId)) {
            is Either.Right -> {
                ResponseEntity.ok(res.value)
            }

            is Either.Left -> when (res.value) {
                Error.LocationNotFound -> ProblemJson.response(404, locationNotFound(locationId))
                Error.LocationRepositoryError -> ProblemJson.response(409, locationRepositoryError(locationId))
                Error.LocationHasComments -> ProblemJson.response(409, locationHasComments(locationId))
                else -> ProblemJson.response(500, ProblemJson.internalServerError())
            }
        }
    }

    /**
     * Retrieves saved name locations for a specific user.
     *
     * @param userID The ID of the user whose saved locations are to be retrieved.
     * @return A ResponseEntity containing the list of saved locations or an error response if the request fails.
     */
    @GetMapping(PathTemplate.SAVED_NAME_LOCATIONS)
    fun savedNameLocations(
        @RequestParam userID: Int
    ): ResponseEntity<*> {
        return when (val locations = locationService.getLocationsByUser(userID)) {
            is Either.Right -> {
                ResponseEntity.ok(locations.value)
            }

            is Either.Left -> {
                when (locations.value) {
                    Error.UserNotFound -> ProblemJson.response(404, userNotFound(null))
                    Error.LocationNotFound -> ProblemJson.response(404, locationNotFound(null))
                    else -> ProblemJson.response(500, ProblemJson.internalServerError())
                }
            }
        }

    }

    /**
     * Retrieves locations based on latitude and longitude.
     *
     * @param lat The latitude of the location to be retrieved.
     * @param lon The longitude of the location to be retrieved.
     * @return A ResponseEntity containing the list of locations or an error response if the request fails.
     */
    @GetMapping(PathTemplate.LOCATIONS_LAT_LON)
    fun getLocationsByLatLon(
        @RequestParam lat: Double,
        @RequestParam lon: Double
    ): ResponseEntity<*> {
        return when (val res = locationService.getLocationsByLatLon(lat, lon)) {
            is Either.Right -> {
                ResponseEntity.ok(res.value)
            }

            is Either.Left -> when (res.value) {
                Error.LocationNotFound -> ProblemJson.response(404, locationNotFound(null))
                else -> ProblemJson.response(500, ProblemJson.internalServerError())
            }
        }
    }

    /**
     * Retrieves a location by its ID.
     *
     * @param locationId The ID of the location to be retrieved.
     * @return A ResponseEntity containing the location data or an error response if the request fails.
     */
    @GetMapping(PathTemplate.LOCATION_BY_ID)
    fun getLocationById(
        @PathVariable locationId: Int
    ): ResponseEntity<*> {
        return when (val res = locationService.getLocationById(locationId)) {
            is Either.Right -> {
                val location = res.value
                when (val data = locationService.fetchAllAsync(location.lat, location.lon, location.searchRadius)) {
                    is Either.Right -> {
                        ResponseEntity.ok(data.value)
                    }
                    is Either.Left -> {
                        when (data.value) {
                            Error.ApiRequestError -> ProblemJson.response(404, apiRequestError())
                            Error.ApiResponseError -> ProblemJson.response(409, apiResponseError())
                            Error.ApiTimeoutResponse -> ProblemJson.response(404, timeoutError())
                            else -> ProblemJson.response(500, ProblemJson.internalServerError())
                        }
                    }
                }
            }

            is Either.Left -> when (res.value) {
                Error.LocationNotFound -> ProblemJson.response(404, locationNotFound(null))
                else -> ProblemJson.response(500, ProblemJson.internalServerError())
            }
        }
    }

    /**
     * Filters amenities based on the provided request data.
     *
     * @param request The request containing criteria for filtering amenities.
     * @return A ResponseEntity containing the filtered amenities or an error response if the request fails.
     */
    @PostMapping(PathTemplate.MAP_AMENITIES)
    fun filterAmenities(@RequestBody request: AmenitiesRequest): ResponseEntity<Any> {
        return when (val result = locationService.fetchAmenities(request)) {
            is Either.Right -> ResponseEntity.ok(result.value)
            is Either.Left -> ResponseEntity.status(400).body("Erro ao obter amenities: ${result.value}")
        }
    }




}
