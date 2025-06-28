package pt.isel.project.nearby.services


import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import kotlinx.coroutines.TimeoutCancellationException
import kotlinx.coroutines.runBlocking
import org.springframework.stereotype.Service
import pt.isel.project.nearby.controllers.models.exceptions.ApiRequestException
import pt.isel.project.nearby.controllers.models.exceptions.ApiResponseException
import pt.isel.project.nearby.domain.District
import pt.isel.project.nearby.domain.HousingSalesAccessingResult
import pt.isel.project.nearby.domain.failure
import pt.isel.project.nearby.domain.success
import pt.isel.project.nearby.request.housing.HousingRequester
import pt.isel.project.nearby.utils.Error
import java.io.FileNotFoundException
import kotlin.coroutines.cancellation.CancellationException

@Service
class HousingServices(private val housingRequester: HousingRequester) {

    fun fetchHouseSales(locationData: List<String>): HousingSalesAccessingResult = runBlocking {
        try {
            val district = locationData.last()
            val osmId = fetchOsmId(district)
            val areaCouncil = osmId?.let { osmId + 3600000000 } // area para procurar
            if (locationData.size <= 2) {
                val districtInfo = housingRequester.fetchDistrictPricesSync(osmId, district)
                success(districtInfo)

            }
            val council = locationData[locationData.size - 2]
            val municipality = locationData[locationData.size - 3]
            val councilID = housingRequester.fetchCouncilIdSync(areaCouncil, council)

            if (councilID == 0L) {
                success(housingRequester.fetchDistrictPricesSync(osmId, district))
            }

            success(housingRequester.fetchCouncilPricesSync(councilID, council, municipality))

        } catch (e: Exception) {
            when (e) {
                is TimeoutCancellationException, is CancellationException -> failure(Error.ApiTimeoutResponse)
                is ApiRequestException -> failure(Error.ApiRequestError)
                is ApiResponseException -> failure(Error.ApiResponseError)
                else -> failure(Error.InternalServerError)
            }
        }

    }

    fun fetchOsmId(districtName: String): Long? {
        val mapper = jacksonObjectMapper()


        // Opção 1: Usando Thread.currentThread().contextClassLoader (Recomendado)
        val inputStream = Thread.currentThread().contextClassLoader.getResourceAsStream("osmID.json")
            ?: this::class.java.classLoader.getResourceAsStream("osmID.json")
            ?: throw FileNotFoundException("Arquivo osmID.json não encontrado no classpath.")

        // Ler o arquivo JSON usando o InputStream
        val districts: List<District> = mapper.readValue(inputStream)
        return districts.find { it.name.equals(districtName, ignoreCase = true) }?.osm_id
    }

}