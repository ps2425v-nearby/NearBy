package pt.isel.project.nearby.serviceTests

import io.mockk.coEvery
import io.mockk.every
import io.mockk.mockk
import io.mockk.spyk
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.test.StandardTestDispatcher
import kotlinx.coroutines.test.resetMain
import kotlinx.coroutines.test.setMain
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeEach

import pt.isel.project.nearby.request.housing.HousingRequester
import pt.isel.project.nearby.services.HousingServices
import kotlin.test.Test
import kotlin.test.assertEquals

@OptIn(ExperimentalCoroutinesApi::class)
class HousingServicesTest {

    private val houseRequester = mockk<HousingRequester>()

    val serviceSpy = spyk(HousingServices(houseRequester))

    private val testDispatcher = StandardTestDispatcher()

    @BeforeEach
    fun setup() {
        Dispatchers.setMain(testDispatcher)
    }

    @AfterEach
    fun teardown() {
        Dispatchers.resetMain()
    }

    @Test
    fun `fetchHouseSales returns district price when locationData size lower or equal than 2`() {
        val locationData = listOf("Lisbon", "Lisbon District")
        val osmId = 123L
        val expectedPrice = 5000

        every { serviceSpy.fetchOsmId(locationData.last()) } returns osmId
        coEvery { houseRequester.fetchDistrictPricesSync(osmId, locationData.last()) } returns expectedPrice

        val result = serviceSpy.fetchHouseSales(locationData)

        assertEquals(expectedPrice, result)
    }

    @Test
    fun `fetchHouseSales returns district price when councilID is zero`() {
        val locationData = listOf("Lisbon", "Benfica", "Lisbon Municipality", "Lisbon Council")
        val osmId = 100L
        val areaCouncil = osmId + 3600000000
        val council = locationData[locationData.size - 2]
        val district = locationData.last()

        every { serviceSpy.fetchOsmId(district) } returns osmId
        every { houseRequester.fetchCouncilIdSync(areaCouncil, council) } returns 0L
        coEvery { houseRequester.fetchDistrictPricesSync(osmId, district) } returns 4000

        val result = serviceSpy.fetchHouseSales(locationData)

        assertEquals(4000, result)
    }

    @Test
    fun `fetchHouseSales returns council price when councilID is not zero`() {
        val locationData = listOf("Lisbon", "Benfica", "Lisbon Municipality", "Lisbon Council")
        val osmId = 100L
        val areaCouncil = osmId + 3600000000
        val council = locationData[locationData.size - 2]
        val municipality = locationData[locationData.size - 3]
        val councilID = 999L

        every { serviceSpy.fetchOsmId(locationData.last()) } returns osmId
        every { houseRequester.fetchCouncilIdSync(areaCouncil, council) } returns councilID
        coEvery { houseRequester.fetchCouncilPricesSync(councilID, council, municipality) } returns 3000

        val result = serviceSpy.fetchHouseSales(locationData)

        assertEquals(3000, result)
    }
}