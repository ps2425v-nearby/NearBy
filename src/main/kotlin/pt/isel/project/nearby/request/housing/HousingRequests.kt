package pt.isel.project.nearby.request.housing

interface HousingRequests {
    suspend fun fetchCouncilIdAsync(areaCouncil: Long?, council: String): Long
    fun fetchCouncilIdSync(areaCouncil: Long?, council: String): Long
    suspend fun fetchCouncilPricesSync(councilID: Long, council: String, municipality: String): Int
    suspend fun fetchDistrictPricesSync(id: Long?, district: String): Int
}