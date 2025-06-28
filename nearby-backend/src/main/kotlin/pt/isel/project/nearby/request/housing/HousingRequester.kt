package pt.isel.project.nearby.request.housing

import com.google.gson.Gson
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.RequestBody.Companion.toRequestBody
import org.springframework.stereotype.Component
import pt.isel.project.nearby.controllers.models.exceptions.ApiResponseException
import pt.isel.project.nearby.request.doAsync
import pt.isel.project.nearby.request.doSync
import java.util.concurrent.TimeUnit

/**
 * HousingRequester is a class that implements the HousingRequests interface.
 * It provides methods to fetch council IDs, council prices, and district prices
 * from an external housing API using OkHttp for HTTP requests.
 *
 * @property gson The Gson instance used for JSON parsing.
 */
@Component
class HousingRequester(
    val gson: Gson,
) : HousingRequests {

    val client = OkHttpClient.Builder()
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(60, TimeUnit.SECONDS)
        .writeTimeout(60, TimeUnit.SECONDS)
        .build()

    /**
     * Fetches the council ID asynchronously based on the area council and council name.
     *
     * @param areaCouncil The ID of the area council to search within.
     * @param council The name of the council to find the ID for.
     * @return The ID of the council as a Long.
     */
    override suspend fun fetchCouncilIdAsync(areaCouncil: Long?, council: String): Long {
        val request = buildCouncilRequest(areaCouncil)
        return client.newCall(request).doAsync { response ->
            parseCouncilIdResponse(response, council)
        }
    }

    /**
     * Fetches the council ID synchronously based on the area council and council name.
     *
     * @param areaCouncil The ID of the area council to search within.
     * @param council The name of the council to find the ID for.
     * @return The ID of the council as a Long.
     */
    override fun fetchCouncilIdSync(areaCouncil: Long?, council: String): Long {
        val request = buildCouncilRequest(areaCouncil)
        return client.newCall(request).doSync { response ->
            parseCouncilIdResponse(response, council)
        }
    }

    /**
     * Builds the HTTP request to fetch council data from the Overpass API.
     *
     * @param areaCouncil The ID of the area council to search within.
     * @return A Request object configured for the Overpass API.
     */
    private fun buildCouncilRequest(areaCouncil: Long?): Request {
        val requestBody = """
            [out:json];
            area($areaCouncil)->.searchArea;
            (
              relation(area.searchArea)[admin_level=7];
            );
            out tags;
        """.trimIndent()
            .toRequestBody("text/plain".toMediaTypeOrNull())

        return Request.Builder()
            .url("https://overpass-api.de/api/interpreter")
            .post(requestBody)
            .build()
    }

    /**
     * Parses the response from the council ID request and extracts the council ID.
     *
     * @param response The HTTP response from the API call.
     * @param council The name of the council to match against the response.
     * @return The ID of the council as a Long.
     * @throws ApiResponseException if the response is invalid or does not contain the expected data.
     */
    private fun parseCouncilIdResponse(response: Response, council: String): Long {
        val body = response.body ?: throw ApiResponseException(message = response.message)
        val jsonResponse = gson.fromJson(body.string(), HouseResponse::class.java)
        val elements = jsonResponse.elements

        return elements.firstNotNullOfOrNull { element ->
            val tags = element["tags"] as? Map<*, *>
            val name = tags?.get("name") as? String
            if (council == name) {
                (element["id"] as? Double)?.toLong()
            } else {
                null
            }
        } ?: 0L
    }

    /**
     * Fetches the council prices synchronously based on the council ID, council name, and municipality.
     *
     * @param councilID The ID of the council to fetch prices for.
     * @param council The name of the council.
     * @param municipality The name of the municipality.
     * @return The price as an Int.
     */
    override suspend fun fetchCouncilPricesSync(councilID: Long, council: String, municipality: String): Int {
        val request = Request.Builder().url("https://api.habitacao.net/graph/concelho/${councilID}")
            .build()

        return client.newCall(request).doSync { response ->
            val body = response.body ?: throw ApiResponseException(message = response.message)
            val jsonResponse = gson.fromJson(body.string(), List::class.java) as? List<Map<String, Any>>
            if (!jsonResponse.isNullOrEmpty()) {
                val entry = jsonResponse.lastOrNull()
                    ?: throw ApiResponseException(message = "Invalid or empty JSON response")

                val priceFromMunicipality = entry.entries.find { (key, _) ->
                    key.contains(municipality, ignoreCase = true)
                }?.value as? Double

                if (priceFromMunicipality != null) return@doSync priceFromMunicipality.toInt()

                val priceFromCouncil = entry.entries.find { (key, _) ->
                    key.contains(council, ignoreCase = true)
                }?.value as? Double

                if (priceFromCouncil != null) return@doSync priceFromCouncil.toInt()

                val priceFromMun = entry.entries.find { (key, _) ->
                    key.contains(municipality, ignoreCase = true)
                }?.value as? Double

                if (priceFromMun != null) return@doSync priceFromMun.toInt()

                return@doSync 0
            } else {
                throw ApiResponseException(message = "Invalid or empty JSON response")
            }
        }
    }

    /**
     * Fetches the district prices synchronously based on the district ID and district name.
     *
     * @param id The ID of the district to fetch prices for.
     * @param district The name of the district.
     * @return The price as an Int.
     */
    override suspend fun fetchDistrictPricesSync(id: Long?, district: String): Int {
        val request = Request.Builder().url("https://api.habitacao.net/graph/distrito/${id}")
            .build()

        return client.newCall(request).doSync { response ->
            val body = response.body ?: throw ApiResponseException(message = response.message)
            val jsonResponse = gson.fromJson(body.string(), List::class.java) as? List<Map<String, Any>>
            if (!jsonResponse.isNullOrEmpty()) {
                val prices = jsonResponse.mapNotNull { it[district] as? Double }
                if (prices.isNotEmpty()) {
                    return@doSync prices.last().toInt()
                } else {
                    return@doSync 0
                }
            } else {
                throw ApiResponseException(message = "Invalid or empty JSON response")
            }
        }
    }
}

/*
 * Data class representing the response from the housing API.
 * It contains a list of elements, each of which is a map with string keys and any type of values.
 * This structure is used to hold the data returned from the API, which includes various properties
 * related to housing, such as council names, IDs, and other relevant information.
 *
 * @property elements A list of maps, where each map represents an element with string keys and values of any type.
 */
data class HouseResponse(
    val elements: List<Map<String, Any>>
)
