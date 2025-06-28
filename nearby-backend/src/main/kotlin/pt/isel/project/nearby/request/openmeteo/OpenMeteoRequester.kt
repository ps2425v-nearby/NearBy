package pt.isel.project.nearby.request.openmeteo

import com.google.gson.Gson
import okhttp3.OkHttpClient
import okhttp3.Request
import org.springframework.stereotype.Component
import pt.isel.project.nearby.controllers.models.exceptions.ApiResponseException
import pt.isel.project.nearby.request.doAsync
import java.time.LocalDate
import java.time.format.DateTimeFormatter

/**
 * Data class representing weather information for a specific time period.
 *
 * @param temperature The average temperature in degrees Celsius.
 * @param windSpeed The average wind speed in kilometers per hour.
 */
data class WeatherInfo(
    val temperature: Double,
    val windSpeed: Double
)

/**
 * Data class representing seasonal weather values.
 *
 * @param season The name of the season (e.g., "Verão", "Outono", "Inverno", "Primavera").
 * @param morning Weather information for the morning period (06:00-12:00).
 * @param afternoon Weather information for the afternoon period (12:00-18:00).
 * @param night Weather information for the night period (18:00-00:00).
 */
data class SeasonalWeatherValues(
    val season: String,
    val morning: WeatherInfo,
    val afternoon: WeatherInfo,
    val night: WeatherInfo
)

/**
 * OpenMeteoRequester is a class that implements the OpenMeteoRequests interface.
 * It fetches wind and temperature data from the Open-Meteo API for a specified latitude and longitude,
 * and processes the data to return seasonal weather values.
 *
 * @property client The OkHttpClient used to make HTTP requests.
 * @property gson The Gson instance used for JSON parsing.
 */
@Component
class OpenMeteoRequester(
    val client: OkHttpClient,
    val gson: Gson,
) : OpenMeteoRequests {

    /**
     * Fetches wind and temperature data asynchronously for a given latitude and longitude.
     * This method retrieves historical weather data for the past year,
     * calculating the average temperature and wind speed for each season
     * and categorizing it by time of day (morning, afternoon, night).
     *
     * @param lat The latitude of the location.
     * @param long The longitude of the location.
     * @return A list of SeasonalWeatherValues containing weather data categorized by season.
     */
    override suspend fun fetchWindAsync(lat: Double, long: Double): List<SeasonalWeatherValues> {

        val endDate = LocalDate.now().minusDays(1)
        val startDate = endDate.minusYears(1).plusDays(1)
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

            processSeasonalData(times, temperatures, windSpeeds)
        }
    }

    /**
     * Processes the weather data to categorize it by season and time of day.
     * This method takes lists of timestamps, temperatures, and wind speeds,
     * and returns a list of SeasonalWeatherValues containing the average temperature and wind speed
     * for each season and time of day (morning, afternoon, night).
     *
     * @param times A list of timestamps in ISO format.
     * @param temperatures A list of temperatures corresponding to the timestamps.
     * @param windSpeeds A list of wind speeds corresponding to the timestamps.
     * @return A list of SeasonalWeatherValues containing categorized weather data.
     */
    private fun processSeasonalData(
        times: List<String>,
        temperatures: List<Double>,
        windSpeeds: List<Double>
    ): List<SeasonalWeatherValues>{

        val seasons = mapOf(
            "Verão" to (6..8),
            "Outono" to (9..11),
            "Inverno" to (12..2),
            "Primavera" to (3..5)
        )

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
