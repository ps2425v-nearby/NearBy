package pt.isel.project.nearby.domain

data class Location(
    val id : Int,
    val lat: Double,
    val lon: Double,
    val name: String,
    val searchRadius: Double,
    val userID: Int
)
