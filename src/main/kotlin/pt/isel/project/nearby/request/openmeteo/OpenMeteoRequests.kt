package pt.isel.project.nearby.request.openmeteo

interface OpenMeteoRequests {
    suspend fun fetchWindAsync(lat: Double, long: Double): List<SeasonalWeatherValues>

}