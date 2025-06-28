package pt.isel.project.nearby.controllers

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import pt.isel.project.nearby.PathTemplate
import pt.isel.project.nearby.controllers.models.ProblemJson
import pt.isel.project.nearby.controllers.models.exceptions.apiRequestError
import pt.isel.project.nearby.controllers.models.exceptions.apiResponseError
import pt.isel.project.nearby.controllers.models.exceptions.timeoutError
import pt.isel.project.nearby.domain.Either
import pt.isel.project.nearby.services.HousingServices
import pt.isel.project.nearby.utils.Error


/**
 * Controller for handling housing-related requests.
 * This controller provides an endpoint to fetch house sales data based on location data.
 * It uses the HousingServices to perform operations and returns appropriate HTTP responses.
 *
 * @property housingServices The service used to handle housing operations.
 * @constructor Creates a HousingController with the specified HousingServices.
 *
 * @RestController annotation indicates that this class is a Spring MVC controller.
 */
@RestController
class HousingController(private val housingServices: HousingServices) {

    /**
     * Fetches house sales data based on the provided location data.
     *
     * @param locationData A list of strings representing location data for fetching house sales.
     * @return A ResponseEntity containing the house sales data or an error response if the request fails.
     */
    @PostMapping(PathTemplate.HOUSING_PRICES)
    fun getHouseSales(@RequestBody locationData: List<String>): ResponseEntity<*> {
        return when (val res = housingServices.fetchHouseSales(locationData)) {
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
