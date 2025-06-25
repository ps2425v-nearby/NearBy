package pt.isel.project.nearby.domain

data class Place(
    val type: String,
    val id: Long,
    val lat: Double,
    val lon: Double,
    val tags: Map<String, String>?,
)

data class TrafficInfo(
    val type: String,
    val id: Long,
    val node: List<Int>,
    val tags: Map<String, String>,
)



data class ZoneIdentifier(
    val road: String,
    val hamlet: String,
    val village: String,
    val suburb: String,
    val city: String,
    val town: String,
    val municipality: String,
    val county: String,
) {
    fun toSet(): Set<String> {
        return setOfNotNull(
            road.takeIf { it.isNotEmpty() },
            hamlet.takeIf { it.isNotEmpty() },
            village.takeIf { it.isNotEmpty() },
            suburb.takeIf { it.isNotEmpty() },
            city.takeIf { it.isNotEmpty() },
            town.takeIf { it.isNotEmpty() },
            municipality.takeIf { it.isNotEmpty() },
            county.takeIf { it.isNotEmpty() }
        )
    }
}


data class CrimesInfo(
    val city: String,
    val type: String,
    val valor: String
)




data class District (
    val name: String,
    val osm_id: Long,
)

data class LocationOutput(
    val id: Int,
    val lat: Double,
    val lon: Double,
    val name: String
)


