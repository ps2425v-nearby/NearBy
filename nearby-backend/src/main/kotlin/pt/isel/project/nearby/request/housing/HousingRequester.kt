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

data class HouseResponse(
    val elements: List<Map<String, Any>>
)

@Component
class HousingRequester(
    val gson: Gson,
) : HousingRequests {

    val client = OkHttpClient.Builder()
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(60, TimeUnit.SECONDS)
        .writeTimeout(60, TimeUnit.SECONDS)
        .build()

    override suspend fun fetchCouncilIdAsync(areaCouncil: Long?, council: String): Long {
        val request = buildCouncilRequest(areaCouncil)
        return client.newCall(request).doAsync { response ->
            parseCouncilIdResponse(response, council)
        }
    }

    override fun fetchCouncilIdSync(areaCouncil: Long?, council: String): Long {
        val request = buildCouncilRequest(areaCouncil)
        return client.newCall(request).doSync { response ->
            parseCouncilIdResponse(response, council)
        }
    }

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
