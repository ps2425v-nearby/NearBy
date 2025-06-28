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

/**
 * HousingServices is a service class that provides methods to fetch housing sales data
 * based on location information. It interacts with the HousingRequester to perform API requests
 * and handle the results.
 *
 * @property housingRequester The HousingRequester used to make API requests for housing data.
 */
@Service
class HousingServices(private val housingRequester: HousingRequester) {

    /**
     * Fetches housing sales data based on the provided location data.
     * It retrieves the district, council, and municipality information from the location data
     * and uses the HousingRequester to fetch the corresponding housing sales information.
     *
     * @param locationData A list of strings containing location information (district, council, municipality).
     * @return A HousingSalesAccessingResult containing the fetched housing sales data or an error.
     */
    fun fetchHouseSales(locationData: List<String>): HousingSalesAccessingResult = runBlocking {
        try {
            val district = locationData.last()
            val osmId = fetchOsmId(district)
            val areaCouncil = osmId?.let { osmId + 3600000000 }
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

    /**
     * Fetches the OSM ID for a given district name from a JSON file.
     * The JSON file is expected to contain a list of districts with their names and OSM IDs.
     *
     * @param districtName The name of the district for which to fetch the OSM ID.
     * @return The OSM ID of the district if found, or null if not found.
     * @throws FileNotFoundException if the JSON file is not found in the classpath.
     */
    fun fetchOsmId(districtName: String): Long? {
        val mapper = jacksonObjectMapper()


        val inputStream = Thread.currentThread().contextClassLoader.getResourceAsStream("osmID.json")
            ?: this::class.java.classLoader.getResourceAsStream("osmID.json")
            ?: throw FileNotFoundException("Arquivo osmID.json não encontrado no classpath.")

        val districts: List<District> = mapper.readValue(inputStream)
        return districts.find { it.name.equals(districtName, ignoreCase = true) }?.osm_id
    }

}