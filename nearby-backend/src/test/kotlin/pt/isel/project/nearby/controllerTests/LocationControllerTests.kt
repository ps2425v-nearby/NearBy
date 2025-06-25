
import io.mockk.every
import io.mockk.mockk
import org.junit.jupiter.api.BeforeEach
import pt.isel.project.nearby.controllers.LocationController
import pt.isel.project.nearby.controllers.models.*
import pt.isel.project.nearby.domain.Either
import pt.isel.project.nearby.domain.Location
import pt.isel.project.nearby.services.LocationService
import pt.isel.project.nearby.utils.Error
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue


class LocationControllerTests {

    private val locationService = mockk<LocationService>()
    private lateinit var controller: LocationController

    private val sampleLocationOutput = SimpleLocationOutputModel(
        id = 1,
        lat = 38.7,
        lon = -9.1,
        searchRadius = 100.0,
        name = "Test Location"
    )

    private val sampleFullLocationOutput = LocationOutputModel(
        id = 1,
        lat = 38.7,
        lon = -9.1,
        searchRadius = 100.0,
        name = "Test Location",
        places = emptyList(),
        wind = emptyList(),
        trafficLevel = "Sem dados de tráfego",
        crimes = emptyList(),
        parkingSpaces = emptyList()
    )

    private val sampleAmenitiesResponse = AmenitiesResponse(
        center = MapCenter(lat = 0.0, lon = 0.0),
        amenities = listOf()
    )

    @BeforeEach
    fun setup() {
        controller = LocationController(locationService)
    }

    @Test
    fun `saveLocation returns 200 on success`() {
        val input = LocationInputModel(38.7, -9.1, "Test", 100.0, 1)
        val id = 1
        every { locationService.saveLocation(input) } returns Either.Right(id)

        val response = controller.saveLocation(input)

        assertEquals(200, response.statusCode.value())
        assertEquals(id, response.body)
    }

    @Test
    fun `saveLocation returns 409 on LocationRepositoryError`() {
        val input = LocationInputModel(38.7, -9.1, "Test", 100.0, 1)
        every { locationService.saveLocation(input) } returns Either.Left(Error.LocationRepositoryError)

        val response = controller.saveLocation(input)

        assertEquals(409, response.statusCode.value())
        val body = response.body as ProblemJson
        assertTrue(body.title.equals("Location repository error", ignoreCase = true))
    }

    @Test
    fun `getZoneMarker returns 200 on success`() {
        every { locationService.fetchAllAsync(38.7, -9.1, 100.0) } returns Either.Right(sampleFullLocationOutput)

        val response = controller.getZoneMarker(38.7, -9.1, 100.0)

        assertEquals(200, response.statusCode.value())
        assertEquals(sampleFullLocationOutput, response.body)
    }

    @Test
    fun `getZoneMarker returns 404 on ApiRequestError`() {
        every { locationService.fetchAllAsync(38.7, -9.1, 100.0) } returns Either.Left(Error.ApiRequestError)

        val response = controller.getZoneMarker(38.7, -9.1, 100.0)

        assertEquals(404, response.statusCode.value())
    }

    @Test
    fun `deleteLocation returns 200 on success`() {
        every { locationService.deleteLocation(1) } returns Either.Right(true)

        val response = controller.deleteLocation(1)

        assertEquals(200, response.statusCode.value())
        assertEquals(true, response.body)
    }

    @Test
    fun `deleteLocation returns 404 on LocationNotFound`() {
        every { locationService.deleteLocation(1) } returns Either.Left(Error.LocationNotFound)

        val response = controller.deleteLocation(1)

        assertEquals(404, response.statusCode.value())
    }

    @Test
    fun `savedNameLocations returns 200 on success`() {
        val locations = listOf(
            Location(
                id = 1,
                lat = 38.7,
                lon = -9.1,
                searchRadius = 100.0,
                name = "Test Location",
                userID = 1
        ))
        every { locationService.getLocationsByUser(1) } returns Either.Right(locations)

        val response = controller.savedNameLocations(1)

        assertEquals(200, response.statusCode.value())
        assertEquals(locations, response.body)
    }

    @Test
    fun `savedNameLocations returns 404 on UserNotFound`() {
        every { locationService.getLocationsByUser(1) } returns Either.Left(Error.UserNotFound)

        val response = controller.savedNameLocations(1)

        assertEquals(404, response.statusCode.value())
    }

    @Test
    fun `getLocationsByLatLon returns 200 on success`() {
        every { locationService.getLocationsByLatLon(38.7, -9.1) } returns Either.Right(sampleLocationOutput)

        val response = controller.getLocationsByLatLon(38.7, -9.1)

        assertEquals(200, response.statusCode.value())
        assertEquals(sampleLocationOutput, response.body)
    }

    @Test
    fun `getLocationsByLatLon returns 404 on LocationNotFound`() {
        every { locationService.getLocationsByLatLon(38.7, -9.1) } returns Either.Left(Error.LocationNotFound)

        val response = controller.getLocationsByLatLon(38.7, -9.1)

        assertEquals(404, response.statusCode.value())
    }

    @Test
    fun `getLocationById returns 200 with full location data on success`() {
        every { locationService.getLocationById(1) } returns Either.Right(sampleLocationOutput)
        every { locationService.fetchAllAsync(sampleLocationOutput.lat, sampleLocationOutput.lon, sampleLocationOutput.searchRadius) } returns Either.Right(sampleFullLocationOutput)

        val response = controller.getLocationById(1)

        assertEquals(200, response.statusCode.value())
        assertEquals(sampleFullLocationOutput, response.body)
    }

    @Test
    fun `getLocationById returns 404 when location not found`() {
        every { locationService.getLocationById(1) } returns Either.Left(Error.LocationNotFound)

        val response = controller.getLocationById(1)

        assertEquals(404, response.statusCode.value())
    }

    @Test
    fun `filterAmenities returns 200 with amenities on success`() {
        every { locationService.fetchAmenities(any()) } returns Either.Right(sampleAmenitiesResponse)

        val request = AmenitiesRequest("Parish", "Municipality", "District", listOf())

        val response = controller.filterAmenities(request)

        assertEquals(200, response.statusCode.value())
        assertEquals(sampleAmenitiesResponse, response.body)
    }

    @Test
    fun `filterAmenities returns 400 on error`() {
        every { locationService.fetchAmenities(any()) } returns Either.Left(pt.isel.project.nearby.utils.Error.InternalServerError)

        val request = AmenitiesRequest("Parish", "Municipality", "District", listOf())

        val response = controller.filterAmenities(request)

        assertEquals(400, response.statusCode.value())
        assertTrue((response.body as String).contains("Erro"))
    }
}