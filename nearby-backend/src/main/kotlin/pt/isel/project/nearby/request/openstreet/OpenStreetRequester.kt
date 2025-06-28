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


/**
 * OpenStreetRequester is a class that implements the OpenStreetRequests interface.
 * It provides methods to fetch places, traffic information, bounding boxes,
 * and amenities from the OpenStreetMap API using OkHttp for HTTP requests.
 * This class supports both asynchronous and synchronous operations for fetching data.
 *
 * @property client The OkHttpClient used to make HTTP requests.
 * @property gson The Gson instance used for JSON parsing.
 */
@Component
class OpenStreetRequester(
    private val client: OkHttpClient,
    private val gson: Gson,
) : OpenStreetRequests {

    /*** --- ASYNC METHODS --- ***/

    /**
     * Fetches places asynchronously based on latitude, longitude, and search radius.
     * It constructs an Overpass API query to retrieve nodes within the specified radius
     * and returns a list of Place objects.
     *
     * @param lat The latitude of the location.
     * @param long The longitude of the location.
     * @param searchRadius The radius in meters to search for places.
     * @return A list of Place objects found within the specified radius.
     */
    override suspend fun fetchPlacesAsync(lat: Double, long: Double, searchRadius: Double): List<Place> {
        val query = buildOverpassQuery(elementType = "node", filters = listOf(), lat = lat, long = long, radius = searchRadius)
        val request = buildOverpassRequest(query)

        return client.newCall(request).doAsync { response ->
            val body = response.body ?: throw ApiResponseException(message = response.message)
            val apiResponse = gson.fromJson(body.string(), ApiPlacesModel::class.java)
            apiResponse.elements.filter { it.tags != null }
        }
    }

    /**
     * Fetches traffic information asynchronously based on latitude, longitude, and search radius.
     * It constructs an Overpass API query to retrieve ways tagged as highways within the specified radius
     * and returns a list of TrafficInfo objects.
     *
     * @param lat The latitude of the location.
     * @param long The longitude of the location.
     * @param searchRadius The radius in meters to search for traffic information.
     * @return A list of TrafficInfo objects found within the specified radius.
     */
    override suspend fun fetchTrafficAsync(lat: Double, long: Double, searchRadius: Double): List<TrafficInfo> {
        val query = buildOverpassQuery(elementType = "way", filters = listOf("highway"), lat = lat, long = long, radius = searchRadius)
        val request = buildOverpassRequest(query)

        return client.newCall(request).doAsync { response ->
            val body = response.body ?: throw ApiResponseException(message = response.message)
            gson.fromJson(body.string(), ApiTrafficModel::class.java).elements
        }
    }

    /**
     * Fetches a bounding box asynchronously based on parish, municipality, and district.
     * It constructs a request to retrieve the bounding box coordinates for the specified location.
     *
     * @param parish The name of the parish.
     * @param municipality The name of the municipality.
     * @param district The name of the district.
     * @return A BoundingBox object containing the coordinates of the bounding box, or null if not found.
     */
    override suspend fun fetchBoundingBoxAsync(parish: String, municipality: String, district: String): BoundingBox? {
        val request = buildBoundingBoxRequest(parish, municipality, district)
        return client.newCall(request).doAsync { response ->
            val body = response.body ?: throw ApiResponseException(message = response.message)
            parseBoundingBoxResponse(body)
        }
    }

    /**
     * Fetches amenities within a specified bounding box and types asynchronously.
     * It prepares an Overpass API request
     * to retrieve amenities based on the provided bounding box and types.
     *
     * @param bbox The bounding box to search within.
     * @param types A list of amenity types to filter the results.
     * @return An AmenitiesResponse object containing the center of the bounding box and a list of amenities.
     */
    override suspend fun fetchAmenitiesByBoundingBoxAsync(bbox: BoundingBox, types: List<String>): AmenitiesResponse {
        val (request, emptyResponse) = prepareAmenitiesRequest(bbox, types)
        if (request == null) return emptyResponse!!

        return client.newCall(request).doAsync { response ->
            val body = response.body ?: throw ApiResponseException(message = response.message)
            parseAmenitiesResponse(body, bbox)
        }
    }


    /*** --- SYNC METHODS --- ***/

    /**
     * Retrieves the bounding box for a given location based on parish, municipality, and district.
     * This method sends a synchronous HTTP request to the Nominatim API to geocode the specified address
     * and extract the corresponding bounding box (minimum and maximum latitude and longitude).
     *
     * @param parish the name of the parish (freguesia)
     * @param municipality the name of the municipality (concelho)
     * @param district the name of the district (distrito)
     * @return the bounding box for the location if found, or null if no results are returned
     * @throws ApiResponseException if the API response is invalid or unsuccessful
     * @throws IllegalStateException if the response does not contain a bounding box
     */
    override fun fetchBoundingBoxSync(parish: String, municipality: String, district: String): BoundingBox? {
        val request = buildBoundingBoxRequest(parish, municipality, district)
        return client.newCall(request).doSync { response ->
            val body = response.body ?: throw ApiResponseException(message = response.message)
            parseBoundingBoxResponse(body)
        }
    }

    /**
     * Retrieves amenities within a specified bounding box for a given list of types.
     * This method builds and executes a synchronous HTTP request to an external service (e.g., Overpass API)
     * to fetch amenities such as restaurants, hospitals, or parks located inside the given bounding box.
     * If the request cannot be constructed (e.g., due to an empty list of types), a predefined empty response is returned.
     *
     * @param bbox the geographic bounding box that defines the search area
     * @param types a list of amenity types to filter (e.g., "restaurant", "hospital")
     * @return an [AmenitiesResponse] containing the list of found amenities or an empty result
     * @throws ApiResponseException if the API response is invalid or the body is null
     */
    override fun fetchAmenitiesByBoundingBoxSync(bbox: BoundingBox, types: List<String>): AmenitiesResponse {
        val (request, emptyResponse) = prepareAmenitiesRequest(bbox, types)
        if (request == null) return emptyResponse!!
        return client.newCall(request).doSync { response ->
            val body = response.body ?: throw ApiResponseException(message = response.message)
            parseAmenitiesResponse(body, bbox)
        }
    }
}
