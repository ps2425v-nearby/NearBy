package pt.isel.project.nearby.request.crime

import com.google.gson.Gson
import okhttp3.*
import org.springframework.stereotype.Component
import pt.isel.project.nearby.controllers.models.exceptions.ApiResponseException
import pt.isel.project.nearby.domain.CrimesInfo
import pt.isel.project.nearby.request.doAsync
import pt.isel.project.nearby.request.model.ApiCrimeModel

@Component
class CrimesRequester(
    private val client: OkHttpClient,
    private val gson: Gson
) : CrimeRequests {

    private val url = "https://www.ine.pt/ine/json_indicador/pindica.jsp?op=2&varcd=0008074&Dim1=S7A2022&lang=PT"

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


data class CrimeEntry(
    val geodsg: String,     // Nome da cidade
    val dim_3_t: String,    // Tipo de crime (descrição)
    val valor: String?       // Valor como string com ","
)

