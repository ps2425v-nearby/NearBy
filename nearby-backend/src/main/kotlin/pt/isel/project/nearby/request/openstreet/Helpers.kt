package pt.isel.project.nearby.request.openstreet

import com.google.gson.Gson
import com.google.common.reflect.TypeToken
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import okhttp3.ResponseBody
import pt.isel.project.nearby.controllers.models.AmenitiesResponse
import pt.isel.project.nearby.controllers.models.Amenity
import pt.isel.project.nearby.controllers.models.MapCenter
import pt.isel.project.nearby.domain.BoundingBox
import pt.isel.project.nearby.request.model.ApiPlacesModel
import pt.isel.project.nearby.utils.NOMINATIM_BASE_URL
import pt.isel.project.nearby.utils.OVERPASS_API_URL
import pt.isel.project.nearby.utils.interestedPointsMap
import java.net.URLEncoder
import java.nio.charset.StandardCharsets

private val gson = Gson()

/**
 * Calculates the center of a bounding box.
 *
 * @param bbox The bounding box to calculate the center for.
 * @return A MapCenter object representing the center of the bounding box.
 */
fun getBoundingBoxCenter(bbox: BoundingBox): MapCenter =
    MapCenter(
        lat = (bbox.minLat + bbox.maxLat) / 2,
        lon = (bbox.minLon + bbox.maxLon) / 2
    )

/**
 * Extension function to add default headers to an OkHttp Request.Builder.
 *
 * @return The modified Request.Builder with default headers added.
 */
fun Request.Builder.withDefaultHeaders(): Request.Builder =
    this.header("User-Agent", "FilterSearchApp/1.0")
        .header("Accept-Language", "pt-PT")

/**
 * Builds a request to the Nominatim API to get the bounding box for a given parish, municipality, and district.
 *
 * @param parish The name of the parish.
 * @param municipality The name of the municipality.
 * @param district The name of the district.
 * @return A Request object configured to query the Nominatim API.
 */
fun buildBoundingBoxRequest(parish: String, municipality: String, district: String): Request {
    val fullAddress = "$parish, $municipality, $district, Portugal"
    val encodedAddress = URLEncoder.encode(fullAddress, StandardCharsets.UTF_8.name())
    val url = "$NOMINATIM_BASE_URL/search?q=$encodedAddress&format=json&limit=1"

    return Request.Builder()
        .url(url)
        .withDefaultHeaders()
        .build()
}

/**
 * Parses the response body from the Nominatim API to extract the bounding box.
 *
 * @param body The response body from the Nominatim API.
 * @return A BoundingBox object containing the minimum and maximum latitude and longitude.
 * @throws IllegalStateException if the bounding box is not available in the response.
 */
fun parseBoundingBoxResponse(body: ResponseBody): BoundingBox? {
    val type = object : TypeToken<List<Map<String, Any>>>() {}.type
    val results: List<Map<String, Any>> = gson.fromJson(body.string(), type)
    if (results.isEmpty()) return null
    val bbox = results[0]["boundingbox"] as? List<String>
        ?: throw IllegalStateException("Bounding box not available")
    return BoundingBox(
        minLat = bbox[0].toDouble(),
        maxLat = bbox[1].toDouble(),
        minLon = bbox[2].toDouble(),
        maxLon = bbox[3].toDouble()
    )
}

/**
 * Builds an Overpass API query to fetch amenities within a specified bounding box.
 *
 * @param bbox The bounding box to search within.
 * @param translatedTypes A list of amenity types to include in the query.
 * @return A string representing the Overpass API query.
 */
fun buildAmenitiesQuery(bbox: BoundingBox, translatedTypes: List<String>): String {
    return """
        [out:json][timeout:25];
        (
            ${translatedTypes.joinToString("\n") { fullTag ->
        val (key, value) = fullTag.split("=")
        """node["$key"="$value"](${bbox.minLat},${bbox.minLon},${bbox.maxLat},${bbox.maxLon});"""
    }}
        );
        out center;
    """.trimIndent()
}

/**
 * Parses the response body from the Overpass API to extract amenities.
 *
 * @param body The response body from the Overpass API.
 * @param bbox The bounding box used to fetch the amenities.
 * @return An AmenitiesResponse object containing the center of the bounding box and a list of amenities.
 */
fun parseAmenitiesResponse(body: ResponseBody, bbox: BoundingBox): AmenitiesResponse {
    val overpassResponse = gson.fromJson(body.string(), ApiPlacesModel::class.java)
    val amenities = overpassResponse.elements.map { el ->
        Amenity(
            id = el.id.toString(),
            lat = el.lat,
            lon = el.lon,
            tags = el.tags ?: emptyMap()
        )
    }
    return AmenitiesResponse(
        center = getBoundingBoxCenter(bbox),
        amenities = amenities
    )
}

/**
 * Builds an Overpass API query to fetch elements of a specific type with optional filters.
 * This function constructs a query string that can be used to request data from the Overpass API.
 * The query includes a specified element type (e.g., "node", "way", "relation"),
 * applies any provided filters, and defines a search area based on latitude, longitude, and radius.
 *
 * @param elementType The type of element to query (e.g., "node", "way", "relation").
 * @param filters A list of filters to apply to the query (e.g., "amenity=restaurant").
 * @param lat The latitude for the center point of the query.
 * @param long The longitude for the center point of the query.
 * @param radius The radius around the center point in meters.
 * @return A string representing the Overpass API query.
 */
fun buildOverpassQuery(elementType: String, filters: List<String>, lat: Double, long: Double, radius: Double): String {
    val filterString = if (filters.isEmpty()) "" else filters.joinToString(separator = "") { "[$it]" }
    return """
        [out:json][timeout:25];
        (
            $elementType(around:$radius,$lat,$long)$filterString;
        );
        out body;
    """.trimIndent()
}

/**
 * Builds an Overpass API request with the specified query.
 * This function creates a POST request to the Overpass API with the provided query string.
 * The query is sent as the request body with the content type set to "text/plain".
 *
 * @param query The Overpass API query string.
 * @return A Request object configured to send the query to the Overpass API.
 */
fun buildOverpassRequest(query: String): Request {
    val requestBody = query.toRequestBody("text/plain".toMediaTypeOrNull())
    return Request.Builder()
        .url(OVERPASS_API_URL)
        .post(requestBody)
        .withDefaultHeaders()
        .build()
}

/**
 * Prepares a request to fetch amenities within a specified bounding box and types.
 * This function checks if there are any valid amenity types to query.
 * If no valid types are provided, it returns a default AmenitiesResponse with an empty list.
 *
 * @param bbox The bounding box to search within.
 * @param types A list of amenity types to include in the query.
 * @return A pair containing the Request object and an optional AmenitiesResponse.
 */
fun prepareAmenitiesRequest(bbox: BoundingBox, types: List<String>): Pair<Request?, AmenitiesResponse?> {
    val translatedTypes = types.mapNotNull { interestedPointsMap[it] }.filter { it.isNotBlank() }
    if (translatedTypes.isEmpty()) {
        return null to AmenitiesResponse(
            center = getBoundingBoxCenter(bbox),
            amenities = emptyList()
        )
    }
    val query = buildAmenitiesQuery(bbox, translatedTypes)
    val request = buildOverpassRequest(query)
    return request to null
}
