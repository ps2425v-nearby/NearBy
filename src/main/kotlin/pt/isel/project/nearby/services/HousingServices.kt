package pt.isel.project.nearby.services


import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import kotlinx.coroutines.runBlocking
import org.springframework.stereotype.Service
import pt.isel.project.nearby.domain.District
import pt.isel.project.nearby.request.housing.HousingRequester
import java.io.FileNotFoundException

@Service
class HousingServices(private val housingRequester: HousingRequester) {

    fun fetchHouseSales(locationData: List<String>): Int =
        runBlocking {
            val district = locationData.last()
            val osmId = fetchOsmId(district)
            val areaCouncil = osmId?.let { osmId + 3600000000  } // area para procurar
            if(locationData.size <=2){
                val districtInfo = housingRequester.fetchDistrictPricesSync(osmId, district)
                return@runBlocking districtInfo

            }
            val council = locationData[locationData.size - 2]
            val municipality = locationData[locationData.size - 3]
            val councilID = housingRequester.fetchCouncilIdSync(areaCouncil, council)

            if(councilID == 0L) {
                return@runBlocking housingRequester.fetchDistrictPricesSync(osmId, district)
            }

            return@runBlocking housingRequester.fetchCouncilPricesSync(councilID, council, municipality)

        }

    fun fetchOsmId(districtName: String): Long? {
        val mapper = jacksonObjectMapper()

        // Carregar o arquivo JSON a partir do classpath
        val inputStream = ClassLoader.getSystemClassLoader().getResourceAsStream("osmID.json")
            ?: throw FileNotFoundException("Arquivo districts_osm.json não encontrado no classpath.")

        // Ler o arquivo JSON usando o InputStream
        val districts: List<District> = mapper.readValue(inputStream)
        return districts.find { it.name.equals(districtName, ignoreCase = true) }?.osm_id
    }

}