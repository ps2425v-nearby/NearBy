package pt.isel.project.nearby.request.openmeteo

import com.google.gson.Gson
import okhttp3.OkHttpClient
import okhttp3.Request
import org.springframework.stereotype.Component
import pt.isel.project.nearby.controllers.models.exceptions.ApiResponseException
import pt.isel.project.nearby.request.doAsync
import java.time.LocalDate
import java.time.format.DateTimeFormatter

// Estrutura para armazenar valores numéricos de temperatura e vento
data class WeatherInfo(
    val temperature: Double, // Temperatura média em °C
    val windSpeed: Double   // Velocidade média do vento em km/h
)

data class SeasonalWeatherValues(
    val season: String, // Ex.: "Verão"
    val morning: WeatherInfo, // Manhã (06:00-12:00)
    val afternoon: WeatherInfo, // Tarde (12:00-18:00)
    val night: WeatherInfo // Noite (18:00-00:00)
)

@Component
class OpenMeteoRequester(
    val client: OkHttpClient,
    val gson: Gson,
) : OpenMeteoRequests {

    override suspend fun fetchWindAsync(lat: Double, long: Double): List<SeasonalWeatherValues> {
        // Calcular datas dinamicamente
        val endDate = LocalDate.now().minusDays(1) // Dia anterior ao atual
        val startDate = endDate.minusYears(1).plusDays(1) // Um ano antes, ajustado
        val formatter = DateTimeFormatter.ISO_LOCAL_DATE
        val startDateStr = startDate.format(formatter)
        val endDateStr = endDate.format(formatter)

        val request = Request.Builder()
            .url("https://archive-api.open-meteo.com/v1/archive?latitude=$lat&longitude=$long&start_date=$startDateStr&end_date=$endDateStr&hourly=temperature_2m,wind_speed_10m")
            .build()

        return client.newCall(request).doAsync { response ->
            val body = response.body ?: throw ApiResponseException(message = response.message)
            val jsonResponse = gson.fromJson(body.string(), Map::class.java)
            val hourlyData = jsonResponse["hourly"] as? Map<*, *>
                ?: throw ApiResponseException(message = "Hourly data not found")

            val times = hourlyData["time"] as? List<String> ?: emptyList()
            val temperatures = (hourlyData["temperature_2m"] as? List<*>)?.mapNotNull { it as? Double } ?: emptyList()
            val windSpeeds = (hourlyData["wind_speed_10m"] as? List<*>)?.mapNotNull { it as? Double } ?: emptyList()


            if (times.isEmpty() || temperatures.isEmpty() || windSpeeds.isEmpty()) {
                throw ApiResponseException(message = "Invalid data format")
            }

            // Processar dados por estação e período
            processSeasonalData(times, temperatures, windSpeeds)
        }
    }
    private fun processSeasonalData(
        times: List<String>,
        temperatures: List<Double>,
        windSpeeds: List<Double>
    ): List<SeasonalWeatherValues>{
        // Definir estações (baseado em Portugal)
        val seasons = mapOf(
            "Verão" to (6..8),    // Junho a Agosto
            "Outono" to (9..11),  // Setembro a Novembro
            "Inverno" to (12..2), // Dezembro a Fevereiro
            "Primavera" to (3..5) // Março a Maio
        )

        // Agrupar dados por estação
        return seasons.map { (season, months) ->
            val morningTemps = mutableListOf<Double>()
            val morningWinds = mutableListOf<Double>()
            val afternoonTemps = mutableListOf<Double>()
            val afternoonWinds = mutableListOf<Double>()
            val nightTemps = mutableListOf<Double>()
            val nightWinds = mutableListOf<Double>()

            val dataSize = listOf(times.size, temperatures.size, windSpeeds.size).minOrNull() ?: 0

            for (index in 0 until dataSize) {
                val time = times[index]
                val date = LocalDate.parse(time.substring(0, 10), DateTimeFormatter.ISO_LOCAL_DATE)
                val hour = time.substring(11, 13).toInt()
                val month = date.monthValue

                val seasonMatch =
                    (season != "Inverno" && month in months) ||
                            (season == "Inverno" && (month == 12 || month == 1 || month == 2))

                if (seasonMatch) {
                    when (hour) {
                        in 6..11 -> {
                            morningTemps.add(temperatures[index])
                            morningWinds.add(windSpeeds[index])
                        }
                        in 12..17 -> {
                            afternoonTemps.add(temperatures[index])
                            afternoonWinds.add(windSpeeds[index])
                        }
                        in 18..23 -> {
                            nightTemps.add(temperatures[index])
                            nightWinds.add(windSpeeds[index])
                        }
                    }
                }
            }

            // Calcular médias numéricas
            SeasonalWeatherValues(
                season = season,
                morning = WeatherInfo(
                    temperature = morningTemps.average().takeIf { !it.isNaN() } ?: 0.0,
                    windSpeed = if (morningWinds.isNotEmpty()) morningWinds.average() else 0.0
                ),
                afternoon = WeatherInfo(
                    temperature = if (afternoonTemps.isNotEmpty()) afternoonTemps.average() else 0.0,
                    windSpeed = if (afternoonWinds.isNotEmpty()) afternoonWinds.average() else 0.0
                ),
                night = WeatherInfo(
                    temperature = if (nightTemps.isNotEmpty()) nightTemps.average() else 0.0,
                    windSpeed = if (nightWinds.isNotEmpty()) nightWinds.average() else 0.0
                )
            )
        }
    }
}
