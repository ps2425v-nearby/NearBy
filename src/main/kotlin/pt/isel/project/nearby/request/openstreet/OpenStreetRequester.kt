package pt.isel.project.nearby.request.openstreet

import com.google.gson.Gson
import okhttp3.*
import org.springframework.stereotype.Component
import pt.isel.project.nearby.controllers.models.AmenitiesResponse
import pt.isel.project.nearby.controllers.models.exceptions.ApiResponseException
import pt.isel.project.nearby.domain.BoundingBox
import pt.isel.project.nearby.domain.Place
import pt.isel.project.nearby.domain.TrafficInfo
import pt.isel.project.nearby.request.doAsync
import pt.isel.project.nearby.request.doSync
import pt.isel.project.nearby.request.model.ApiPlacesModel
import pt.isel.project.nearby.request.model.ApiTrafficModel


@Component
class OpenStreetRequester(
    private val client: OkHttpClient,
    private val gson: Gson,
) : OpenStreetRequests {

    /*** --- ASYNC METHODS --- ***/

    override suspend fun fetchPlacesAsync(lat: Double, long: Double, searchRadius: Double): List<Place> {
        val query = buildOverpassQuery(elementType = "node", filters = listOf(), lat = lat, long = long, radius = searchRadius)
        val request = buildOverpassRequest(query)

        return client.newCall(request).doAsync { response ->
            val body = response.body ?: throw ApiResponseException(message = response.message)
            val apiResponse = gson.fromJson(body.string(), ApiPlacesModel::class.java)
            apiResponse.elements.filter { it.tags != null }
        }
    }

    override suspend fun fetchTrafficAsync(lat: Double, long: Double, searchRadius: Double): List<TrafficInfo> {
        val query = buildOverpassQuery(elementType = "way", filters = listOf("highway"), lat = lat, long = long, radius = searchRadius)
        val request = buildOverpassRequest(query)

        return client.newCall(request).doAsync { response ->
            val body = response.body ?: throw ApiResponseException(message = response.message)
            gson.fromJson(body.string(), ApiTrafficModel::class.java).elements
        }
    }

    override suspend fun fetchBoundingBoxAsync(parish: String, municipality: String, district: String): BoundingBox? {
        val request = buildBoundingBoxRequest(parish, municipality, district)
        return client.newCall(request).doAsync { response ->
            val body = response.body ?: throw ApiResponseException(message = response.message)
            parseBoundingBoxResponse(body)
        }
    }

    override suspend fun fetchAmenitiesByBoundingBoxAsync(bbox: BoundingBox, types: List<String>): AmenitiesResponse {
        val (request, emptyResponse) = prepareAmenitiesRequest(bbox, types)
        if (request == null) return emptyResponse!!

        return client.newCall(request).doAsync { response ->
            val body = response.body ?: throw ApiResponseException(message = response.message)
            parseAmenitiesResponse(body, bbox)
        }
    }


    /*** --- SYNC METHODS --- ***/

    override fun fetchBoundingBoxSync(parish: String, municipality: String, district: String): BoundingBox? {
        val request = buildBoundingBoxRequest(parish, municipality, district)
        return client.newCall(request).doSync { response ->
            val body = response.body ?: throw ApiResponseException(message = response.message)
            parseBoundingBoxResponse(body)
        }
    }

    override fun fetchAmenitiesByBoundingBoxSync(bbox: BoundingBox, types: List<String>): AmenitiesResponse {
        val (request, emptyResponse) = prepareAmenitiesRequest(bbox, types)
        if (request == null) return emptyResponse!!
        return client.newCall(request).doSync { response ->
            val body = response.body ?: throw ApiResponseException(message = response.message)
            parseAmenitiesResponse(body, bbox)
        }
    }
}
