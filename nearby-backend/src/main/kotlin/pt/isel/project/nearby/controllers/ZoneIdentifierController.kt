package pt.isel.project.nearby.controllers


import pt.isel.project.nearby.services.ZoneService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import pt.isel.project.nearby.PathTemplate
import pt.isel.project.nearby.controllers.models.ProblemJson
import pt.isel.project.nearby.controllers.models.exceptions.*
import pt.isel.project.nearby.domain.Either
import pt.isel.project.nearby.utils.Error


@RestController
class ZoneIdentifierController(private val zoneService: ZoneService) {
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