package pt.isel.project.nearby.request.housing

/**
 * HousingRequests is an interface that defines methods for fetching housing-related data.
 * It includes methods to fetch council IDs, council prices, and district prices.
 *
 * This interface is intended to be implemented by classes that handle the retrieval
 * of housing data.
 */
interface HousingRequests {
    suspend fun fetchCouncilIdAsync(areaCouncil: Long?, council: String): Long
    fun fetchCouncilIdSync(areaCouncil: Long?, council: String): Long
    suspend fun fetchCouncilPricesSync(councilID: Long, council: String, municipality: String): Int
    suspend fun fetchDistrictPricesSync(id: Long?, district: String): Int
}