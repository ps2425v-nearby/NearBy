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

fun getBoundingBoxCenter(bbox: BoundingBox): MapCenter =
    MapCenter(
        lat = (bbox.minLat + bbox.maxLat) / 2,
        lon = (bbox.minLon + bbox.maxLon) / 2
    )

fun Request.Builder.withDefaultHeaders(): Request.Builder =
    this.header("User-Agent", "FilterSearchApp/1.0")
        .header("Accept-Language", "pt-PT")

fun buildBoundingBoxRequest(parish: String, municipality: String, district: String): Request {
    val fullAddress = "$parish, $municipality, $district, Portugal"
    val encodedAddress = URLEncoder.encode(fullAddress, StandardCharsets.UTF_8.name())
    val url = "$NOMINATIM_BASE_URL/search?q=$encodedAddress&format=json&limit=1"

    return Request.Builder()
        .url(url)
        .withDefaultHeaders()
        .build()
}

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

fun buildOverpassRequest(query: String): Request {
    val requestBody = query.toRequestBody("text/plain".toMediaTypeOrNull())
    return Request.Builder()
        .url(OVERPASS_API_URL)
        .post(requestBody)
        .withDefaultHeaders()
        .build()
}

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
