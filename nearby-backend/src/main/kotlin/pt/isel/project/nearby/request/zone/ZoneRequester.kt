package pt.isel.project.nearby.request.zone

import com.google.gson.Gson
import okhttp3.*
import org.springframework.stereotype.Component
import pt.isel.project.nearby.controllers.models.exceptions.ApiResponseException
import pt.isel.project.nearby.domain.ZoneIdentifier
import pt.isel.project.nearby.request.doAsync
import pt.isel.project.nearby.request.doSync

/**
 * ZoneRequester is a class that implements the ZoneRequests interface.
 * It fetches zone information based on geographical coordinates (latitude and longitude)
 * using the Nominatim reverse geocoding API.
 *
 * @property client The OkHttpClient used to make HTTP requests.
 * @property gson The Gson instance used for JSON parsing.
 */
@Component
class ZoneRequester(
    val client: OkHttpClient,
    val gson: Gson,
) : ZoneRequests {

    /**
     * Fetches zone information asynchronously based on latitude and longitude.
     * Uses Nominatim's reverse geocoding API to get detailed address information.
     *
     * @param lat The latitude of the location.
     * @param long The longitude of the location.
     * @return A ZoneIdentifier object containing zone details.
     */
    override suspend fun fetchZoneAsync(lat: Double, long: Double): ZoneIdentifier {
        val request = buildZoneRequest(lat, long)
        return client.newCall(request).doAsync { response ->
            val body = response.body ?: throw ApiResponseException(message = response.message)
            parseZoneResponse(body)
        }
    }

    /**
     * Fetches zone information synchronously based on latitude and longitude.
     * Uses Nominatim's reverse geocoding API to get detailed address information.
     *
     * @param lat The latitude of the location.
     * @param long The longitude of the location.
     * @return A ZoneIdentifier object containing zone details.
     */
    override fun fetchZoneSync(lat: Double, long: Double): ZoneIdentifier {
        val request = buildZoneRequest(lat, long)
        return client.newCall(request).doSync { response ->
            val body = response.body ?: throw ApiResponseException(message = response.message)
            parseZoneResponse(body)
        }
    }

    /**
     * Builds the HTTP request to fetch zone data from the Nominatim reverse geocoding API.
     *
     * @param lat The latitude of the location.
     * @param long The longitude of the location.
     * @return A Request object configured with the appropriate URL and headers.
     */
    private fun buildZoneRequest(lat: Double, long: Double): Request {
        val link =
            "https://nominatim.openstreetmap.org/reverse?lat=$lat&lon=$long&format=json&addressdetails=1"
        return Request.Builder()
            .url(link)
            .header("User-Agent", "NearbyProject/1.0 melsalinho2@gmail.com")
            .build()
    }


    /**
     * Parses the response body from the Nominatim API to extract zone information.
     *
     * @param body The response body containing JSON data.
     * @return A ZoneIdentifier object populated with the parsed address details.
     * @throws ApiResponseException if the address data is not found in the response.
     */
    private fun parseZoneResponse(body: ResponseBody): ZoneIdentifier {
        val jsonResponse = gson.fromJson(body.string(), Map::class.java)
        val address = jsonResponse["address"] as? Map<*, *>
            ?: throw ApiResponseException("Address data not found in response")

        return ZoneIdentifier(
            hamlet = address["hamlet"] as? String ?: "",
            village = address["village"] as? String ?: "",
            suburb = address["suburb"] as? String ?: "",
            city = address["city"] as? String ?: "",
            municipality = address["municipality"] as? String ?: "",
            county = address["county"] as? String ?: "",
            road = address["road"] as? String ?: "",
            town = address["town"] as? String ?: ""
        )
    }
}
