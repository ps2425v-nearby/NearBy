package pt.isel.project.nearby.controllers

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import pt.isel.project.nearby.PathTemplate
import pt.isel.project.nearby.services.HousingServices


@RestController
class HousingController(private val housingServices: HousingServices) {

    @PostMapping(PathTemplate.HOUSING_PRICES)
    fun getHouseSales(@RequestBody locationData: List<String>): ResponseEntity<Int> {
        try {
            val housingPrices = housingServices.fetchHouseSales(locationData)

            return ResponseEntity.ok(housingPrices)
        } catch (e: Exception) {
            e.printStackTrace() // Isso vai ajudar a ver onde ocorreu o erro
            throw Exception("Erro ao buscar os preços de venda de imóveis.", e)
        }

    }

}
