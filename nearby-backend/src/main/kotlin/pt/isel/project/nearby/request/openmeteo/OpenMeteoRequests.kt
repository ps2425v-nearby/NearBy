package pt.isel.project.nearby.request.openmeteo

/**
 * OpenMeteoRequests is an interface that defines a method to fetch wind data
 * for a given latitude and longitude asynchronously.
 *
 * This interface is intended to be implemented by classes that handle the retrieval
 * of weather data.
 */
interface OpenMeteoRequests {
    suspend fun fetchWindAsync(lat: Double, long: Double): List<SeasonalWeatherValues>

}