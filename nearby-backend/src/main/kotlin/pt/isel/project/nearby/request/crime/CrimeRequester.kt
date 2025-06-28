package pt.isel.project.nearby.request.crime

import com.google.gson.Gson
import okhttp3.*
import org.springframework.stereotype.Component
import pt.isel.project.nearby.controllers.models.exceptions.ApiResponseException
import pt.isel.project.nearby.domain.CrimesInfo
import pt.isel.project.nearby.request.doAsync
import pt.isel.project.nearby.request.model.ApiCrimeModel

/**
 * CrimesRequester is a class that implements the CrimeRequests interface.
 * It fetches crime data from an external API and processes it to return a list of CrimesInfo.
 *
 * @property client The OkHttpClient used to make HTTP requests.
 * @property gson The Gson instance used for JSON parsing.
 */
@Component
class CrimesRequester(
    private val client: OkHttpClient,
    private val gson: Gson
) : CrimeRequests {

    private val url = "https://www.ine.pt/ine/json_indicador/pindica.jsp?op=2&varcd=0008074&Dim1=S7A2022&lang=PT"

    /**
     * Fetches crime data for a collection of city names asynchronously.
     *
     * @param cityNames A collection of city names to filter the crime data.
     * @return A list of CrimesInfo containing crime details for the specified cities.
     */
    override suspend fun fetchCrimesAsync(cityNames: Collection<String>): List<CrimesInfo> {
        val request = Request.Builder()
            .url(url)
            .get()
            .build()

        return client.newCall(request).doAsync { response ->
            val body = response.body ?: throw ApiResponseException(message = response.message)
            val parsedList = gson.fromJson(body.string(), Array<ApiCrimeModel>::class.java).toList()
            val crimes = parsedList
                .flatMap { it.Dados["2022"] ?: emptyList() }

            val cleanedCityNames = cityNames
                .flatMap { it.split(",") }
                .map { it.trim().lowercase() }
                .distinct()

            cleanedCityNames.firstNotNullOfOrNull { city ->
                val crimesForCity = crimes.filter { crime -> crime.geodsg.trim().lowercase().contains(city) }
                if (crimesForCity.isNotEmpty()) {
                    crimesForCity.map {
                        CrimesInfo(
                            city = it.geodsg,
                            type = it.dim_3_t,
                            valor = it.valor ?: "0" // Default to "0" if valor is null
                        )
                    }
                } else null
            } ?: emptyList()
        }
    }
}

/**
 * Data class representing a crime entry.
 *
 * @property geodsg The name of the city.
 * @property dim_3_t The type of crime (description).
 * @property valor The value as a string, formatted with a comma.
 */
data class CrimeEntry(
    val geodsg: String,
    val dim_3_t: String,
    val valor: String?
)

