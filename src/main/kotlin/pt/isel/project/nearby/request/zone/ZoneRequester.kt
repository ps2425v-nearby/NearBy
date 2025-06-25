package pt.isel.project.nearby.request.zone

import com.google.gson.Gson
import okhttp3.*
import org.springframework.stereotype.Component
import pt.isel.project.nearby.controllers.models.exceptions.ApiResponseException
import pt.isel.project.nearby.domain.ZoneIdentifier
import pt.isel.project.nearby.request.doAsync
import pt.isel.project.nearby.request.doSync

@Component
class ZoneRequester(
    val client: OkHttpClient,
    val gson: Gson,
) : ZoneRequests {

    override suspend fun fetchZoneAsync(lat: Double, long: Double): ZoneIdentifier {
        val request = buildZoneRequest(lat, long)
        return client.newCall(request).doAsync { response ->
            val body = response.body ?: throw ApiResponseException(message = response.message)
            parseZoneResponse(body)
        }
    }

    override fun fetchZoneSync(lat: Double, long: Double): ZoneIdentifier {
        val request = buildZoneRequest(lat, long)
        return client.newCall(request).doSync { response ->
            val body = response.body ?: throw ApiResponseException(message = response.message)
            parseZoneResponse(body)
        }
    }
    /**
     * Builds the request to fetch zone information based on latitude and longitude.
     * Uses Nominatim's reverse geocoding API to get detailed address information.
     */

    private fun buildZoneRequest(lat: Double, long: Double): Request {
        val link =
            "https://nominatim.openstreetmap.org/reverse?lat=$lat&lon=$long&format=json&addressdetails=1"
        return Request.Builder()
            .url(link)
            .header("User-Agent", "PostmanRuntime/7.43.4")
            .build()
    }
    /**
     * Parses the response body to extract zone information.
     * Expects a JSON structure with an "address" field containing various location details.
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
