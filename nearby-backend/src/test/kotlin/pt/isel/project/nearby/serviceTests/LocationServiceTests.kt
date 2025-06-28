package pt.isel.project.nearby.serviceTests

import io.mockk.coEvery
import io.mockk.every
import io.mockk.mockk
import kotlinx.coroutines.*
import kotlinx.coroutines.test.*
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeEach
import pt.isel.project.nearby.controllers.models.*
import pt.isel.project.nearby.domain.*
import pt.isel.project.nearby.repository.*
import pt.isel.project.nearby.request.crime.CrimesRequester
import pt.isel.project.nearby.request.openmeteo.OpenMeteoRequester
import pt.isel.project.nearby.request.openmeteo.SeasonalWeatherValues
import pt.isel.project.nearby.request.openmeteo.WeatherInfo
import pt.isel.project.nearby.request.openstreet.OpenStreetRequester
import pt.isel.project.nearby.request.zone.ZoneRequester
import pt.isel.project.nearby.services.LocationService
import pt.isel.project.nearby.utils.Error
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertNotNull
import kotlin.test.assertTrue


@OptIn(ExperimentalCoroutinesApi::class)
class LocationServiceTests {

    private val transactionManager = mockk<TransactionManager>()
    private val openStreetRequester = mockk<OpenStreetRequester>()
    private val openWeatherRequester = mockk<OpenMeteoRequester>()
    private val crimesRequester = mockk<CrimesRequester>()
    private val zoneRequester = mockk<ZoneRequester>()

    val mockLocationRepository = mockk<LocationRepository>()
    val mockCommentsRepository = mockk<CommentsRepository>()
    val mockUserRepository = mockk<UserRepository>()

    val mockTransaction = object : Transaction {
        override val userRepository = mockUserRepository
        override val locationRepository = mockLocationRepository
        override val commentsRepository = mockCommentsRepository
        override fun rollback() { /* noop */ }
    }

    private lateinit var service: LocationService

    private val testDispatcher = StandardTestDispatcher()

    private val lat = 38.7369
    private val lon = -9.1427
    private val radius = 100.0

    private val mockPlaces = listOf(
        Place(
            type = "parking",
            id = 1L,
            lat = lat,
            lon = lon,
            tags = mapOf("amenity" to "parking")
        ),
        Place(
            type = "restaurant",
            id = 2L,
            lat = lat,
            lon = lon,
            tags = mapOf("amenity" to "restaurant")
        )
    )

    private val mockWind = listOf(
        SeasonalWeatherValues(
            "spring",
            WeatherInfo(1.0, 10.0),
            WeatherInfo(2.0, 20.0),
            WeatherInfo(3.0, 30.0)
        )
    )

    private val mockZones =
        ZoneIdentifier(
            road = "zoneA",
            hamlet = "Zone A",
            village = "Description of Zone A",
            suburb = "Suburb A",
            city = "City A",
            town = "Town A",
            municipality = "Municipality A",
            county = "Country A"
        )

    val mockCrimes = listOf(
        CrimesInfo("zoneA", "robbery", "1.5")
    )


    val input = LocationInputModel(
        lat = 38.7369,
        lon = -9.1427,
        name = "Test Location",
        searchRadius = 100.0,
        userID = 1
    )

    @BeforeEach
    fun setup() {
        Dispatchers.setMain(testDispatcher)
        service = LocationService(
            transactionManager,
            openStreetRequester,
            openWeatherRequester,
            crimesRequester,
            zoneRequester
        )
    }

    @AfterEach
    fun teardown() {
        Dispatchers.resetMain()
    }

    @Test
    fun `fetchAllAsync returns LocationOutputModel successfully`() {

        coEvery { openStreetRequester.fetchPlacesAsync(lat, lon, radius) } returns mockPlaces
        coEvery { openStreetRequester.fetchTrafficAsync(lat, lon, radius) } returns emptyList()
        coEvery { openWeatherRequester.fetchWindAsync(lat, lon) } returns mockWind
        coEvery { zoneRequester.fetchZoneAsync(lat, lon) } returns mockZones
        coEvery { crimesRequester.fetchCrimesAsync(mockZones.toSet()) } returns mockCrimes

        val result  =service.fetchAllAsync(lat, lon, radius)

        assertTrue(result is Either.Right)
        val output = result.value
        assertEquals(lat, output.lat)
        assertEquals(lon, output.lon)
        assertEquals(mockWind, output.wind)
        assertEquals(mockPlaces, output.places)
        assertEquals(mockCrimes, output.crimes)
        assertEquals("Sem dados de tráfego", output.trafficLevel)
        assertEquals(1, output.parkingSpaces.size)
    }


    @Test
    fun `fetchAllAsync returns Timeout error`() {

        coEvery { openStreetRequester.fetchPlacesAsync(lat, lon, radius) } returns mockPlaces
        coEvery { openStreetRequester.fetchTrafficAsync(lat, lon, radius) } returns emptyList()
        coEvery { openWeatherRequester.fetchWindAsync(lat, lon) } returns mockWind
        coEvery { zoneRequester.fetchZoneAsync(lat, lon) } returns mockZones
        coEvery { crimesRequester.fetchCrimesAsync(mockZones.toSet()) } throws CancellationException()

        val result = service.fetchAllAsync(lat, lon, radius)

        assertTrue(result is Either.Left)
        val output = result.value
        assertEquals(Error.ApiTimeoutResponse, output)
    }

    @Test
    fun `saveLocation returns LocationAlreadyExists when location exists`() {

        val input = LocationInputModel(
            lat = 38.7369,
            lon = -9.1427,
            name = "Test Location",
            searchRadius = 100.0,
            userID = 1
        )

        every {
            transactionManager.executeTransaction<Either<Error, Location>>(any())
        } answers {
            val block = it.invocation.args[0] as (Transaction) -> Either<Error, Location>
            block(mockTransaction)
        }

        every { mockLocationRepository.getLocationByCoords(input.lat, input.lon) } returns mockk()

        val locationService = LocationService(
            transactionManager,
            openStreetRequester = mockk(relaxed = true),
            openWeatherRequester = mockk(relaxed = true),
            crimesRequester = mockk(relaxed = true),
            zoneRequester = mockk(relaxed = true)
        )

        val result = locationService.saveLocation(input)

        assertTrue(result is Either.Left)
        assertEquals(Error.LocationAlreadyExists, result.value)
    }

    @Test
    fun `saveLocation returns success when location does not exist`() {

        every {
            transactionManager.executeTransaction<Either<Error, Int>>(any())
        } answers {
            val block = it.invocation.args[0] as (Transaction) -> Either<Error, Int>
            block(mockTransaction)
        }

        every { mockLocationRepository.getLocationByCoords(input.lat, input.lon) } returns null
        every { mockLocationRepository.saveLocation(input) } returns 1

        val locationService = LocationService(
            transactionManager,
            openStreetRequester = mockk(relaxed = true),
            openWeatherRequester = mockk(relaxed = true),
            crimesRequester = mockk(relaxed = true),
            zoneRequester = mockk(relaxed = true)
        )

        val result = locationService.saveLocation(input)

        assertTrue(result is Either.Right)
        assertEquals(1, result.value)
    }

    @Test
    fun `getLocationsByLatLon returns success when location exists`() {
        val existingLocation = Location(
            id = 42,
            lat = lat,
            lon = lon,
            name = "Lisboa",
            searchRadius = 250.0,
            userID = 1
        )

        every {
            transactionManager.executeTransaction<Either<Error, SimpleLocationOutputModel>>(any())
        } answers {
            val block = it.invocation.args[0] as (Transaction) -> Either<Error, SimpleLocationOutputModel>
            block(mockTransaction)
        }

        every { mockLocationRepository.getLocationByCoords(lat, lon) } returns existingLocation

        val result = service.getLocationsByLatLon(lat, lon)

        assertTrue(result is Either.Right)
        val output = result.value
        assertNotNull(output)
        assertEquals(existingLocation.id, output.id)
        assertEquals(existingLocation.lat, output.lat)
        assertEquals(existingLocation.lon, output.lon)
        assertEquals(existingLocation.searchRadius, output.searchRadius)
        assertEquals(existingLocation.name, output.name)
    }

    @Test
    fun `getLocationsByLatLon returns LocationNotFound when location does not exist`() {
        every {
            transactionManager.executeTransaction<Either<Error, SimpleLocationOutputModel>>(any())
        } answers {
            val block = it.invocation.args[0] as (Transaction) -> Either<Error, SimpleLocationOutputModel>
            block(mockTransaction)
        }

        every { mockLocationRepository.getLocationByCoords(lat, lon) } returns null

        val result = service.getLocationsByLatLon(lat, lon)

        assertTrue(result is Either.Left)
        assertEquals(Error.LocationNotFound, result.value)
    }

    @Test
    fun `getLocationById returns success when location exists`() {
        val existingLocation = Location(
            id = 42,
            lat = lat,
            lon = lon,
            name = "Lisboa",
            searchRadius = 250.0,
            userID = 1
        )

        every {
            transactionManager.executeTransaction<Either<Error, SimpleLocationOutputModel>>(any())
        } answers {
            val block = it.invocation.args[0] as (Transaction) -> Either<Error, SimpleLocationOutputModel>
            block(mockTransaction)
        }

        every { mockLocationRepository.getLocation(existingLocation.id) } returns existingLocation

        val result = service.getLocationById(existingLocation.id)

        assertTrue(result is Either.Right)
        val output = result.value
        assertNotNull(output)
        assertEquals(existingLocation.id, output.id)
        assertEquals(existingLocation.lat, output.lat)
        assertEquals(existingLocation.lon, output.lon)
        assertEquals(existingLocation.searchRadius, output.searchRadius)
        assertEquals(existingLocation.name, output.name)
    }

    @Test
    fun `getLocationById returns LocationNotFound when location does not exist`() {
        val id = 123

        every {
            transactionManager.executeTransaction<Either<Error, SimpleLocationOutputModel>>(any())
        } answers {
            val block = it.invocation.args[0] as (Transaction) -> Either<Error, SimpleLocationOutputModel>
            block(mockTransaction)
        }

        every { mockLocationRepository.getLocation(id) } returns null

        val result = service.getLocationById(id)

        assertTrue(result is Either.Left)
        assertEquals(Error.LocationNotFound, result.value)
    }

    @Test
    fun `getLocationsByUser returns list of locations successfully`() {
        val userId = 1
        val locations = listOf(
            Location(id = 1, lat = lat, lon = lon, name = "Loc1", searchRadius = 100.0, userID = userId),
            Location(id = 2, lat = lat + 1, lon = lon + 1, name = "Loc2", searchRadius = 200.0, userID = userId)
        )

        every {
            transactionManager.executeTransaction<Either<Error, List<Location>>>(any())
        } answers {
            val block = it.invocation.args[0] as (Transaction) -> Either<Error, List<Location>>
            block(mockTransaction)
        }

        every { mockLocationRepository.getLocationsByUser(userId) } returns locations

        val result = service.getLocationsByUser(userId)

        assertTrue(result is Either.Right)
        val output = result.value
        assertEquals(2, output.size)
        assertEquals(locations, output)
    }

    @Test
    fun `deleteLocation returns success when location deleted and no comments`() {
        val locationId = 42

        every {
            transactionManager.executeTransaction<Either<Error, Boolean>>(any())
        } answers {
            val block = it.invocation.args[0] as (Transaction) -> Either<Error, Boolean>
            block(mockTransaction)
        }

        every { mockLocationRepository.deleteLocation(locationId) } returns 1
        every { mockCommentsRepository.getCommentsByPlaceId(locationId) } returns emptyList()

        val result = service.deleteLocation(locationId)

        assertTrue(result is Either.Right)
        assertTrue(result.value)
    }

    @Test
    fun `deleteLocation returns LocationHasComments error when location has comments`() {
        val locationId = 42
        val comments = listOf(mockk<Comment>())

        every {
            transactionManager.executeTransaction<Either<Error, Boolean>>(any())
        } answers {
            val block = it.invocation.args[0] as (Transaction) -> Either<Error, Boolean>
            block(mockTransaction)
        }

        every { mockLocationRepository.deleteLocation(locationId) } returns 1
        every { mockCommentsRepository.getCommentsByPlaceId(locationId) } returns comments

        val result = service.deleteLocation(locationId)

        assertTrue(result is Either.Left)
        assertEquals(Error.LocationHasComments, result.value)
    }

    @Test
    fun `deleteLocation returns LocationNotFound when delete affected no rows`() {
        val locationId = 42

        every {
            transactionManager.executeTransaction<Either<Error, Boolean>>(any())
        } answers {
            val block = it.invocation.args[0] as (Transaction) -> Either<Error, Boolean>
            block(mockTransaction)
        }

        every { mockLocationRepository.deleteLocation(locationId) } returns 0
        every { mockCommentsRepository.getCommentsByPlaceId(locationId) } returns emptyList()

        val result = service.deleteLocation(locationId)

        assertTrue(result is Either.Left)
        assertEquals(Error.LocationNotFound, result.value)
    }
}
