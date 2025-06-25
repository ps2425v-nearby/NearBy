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

@RestController
class LocationController(
    private val locationService: LocationService,
) {

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
    @PostMapping(PathTemplate.MAP_AMENITIES)
    fun filterAmenities(@RequestBody request: AmenitiesRequest): ResponseEntity<Any> {
        return when (val result = locationService.fetchAmenities(request)) {
            is Either.Right -> ResponseEntity.ok(result.value)
            is Either.Left -> ResponseEntity.status(400).body("Erro ao obter amenities: ${result.value}")
        }
    }




}
