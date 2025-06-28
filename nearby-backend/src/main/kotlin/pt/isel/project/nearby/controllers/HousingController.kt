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


@RestController
class HousingController(private val housingServices: HousingServices) {

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
