package pt.isel.project.nearby.repositoryTests

import org.jdbi.v3.core.Jdbi
import org.junit.jupiter.api.AfterEach
import org.postgresql.ds.PGSimpleDataSource
import pt.isel.project.nearby.controllers.models.LocationInputModel
import pt.isel.project.nearby.domain.Location
import pt.isel.project.nearby.repository.jdbi.JdbiLocationRepository
import pt.isel.project.nearby.repository.jdbi.mappers.LocationMapper
import pt.isel.project.nearby.repository.jdbi.mappers.TokenMapper
import pt.isel.project.nearby.repository.jdbi.mappers.UserMapper
import kotlin.test.*

class LocationRepositoryTests {

    companion object {
        private const val DB_URL = "jdbc:postgresql://localhost:5432/projeto_tests"
        private const val DB_USER = "postgres"
        private const val DB_PASSWORD = "PedroAdmin"
    }

    private val jdbi = Jdbi.create(
        PGSimpleDataSource().apply {
            setURL(DB_URL)
            user = DB_USER
            password = DB_PASSWORD
        }
    )
        .registerRowMapper(UserMapper())
        .registerRowMapper(TokenMapper())
        .registerRowMapper(LocationMapper())

    private val handle = jdbi.open().apply {
        connection.autoCommit = false
    }
    private val locationRepository = JdbiLocationRepository(handle)

    @AfterEach
    fun teardown() {
        handle.rollback()
    }


    @Test
    fun `create a new location for user`() {
        val location = LocationInputModel(
            lat = 12.34,
            lon = 56.78,
            name = "test",
            searchRadius = 100.0,
            userID = 1
        )
        val res = locationRepository.saveLocation(location)
        assertNotNull(res)
    }


    @Test
    fun `get location by id`() {
        val res = locationRepository.getLocation(1)
        assertNotNull(res)
        assertEquals("Save 1", res.name)
        assertEquals(38.736946, res.lat)
        assertEquals(-9.142685, res.lon)
        assertEquals(1000.0, res.searchRadius)
        assertEquals(1, res.userID)
    }

    @Test
    fun `get all locations for user`() {
        val res = locationRepository.getLocationsByUser(1)
        assertTrue(res.isNotEmpty())

        assertEquals(2, res.size)
        for (location in res) {
            assertEquals(1, location.userID)
        }
    }

    @Test
    fun `delete location by id`() {
        val res = locationRepository.deleteLocation(1)
        assertEquals(1, res)
    }

    @Test
    fun `get location by non-existent id`() {
        val res = locationRepository.getLocation(-1)
        assertNull(res)
    }

    @Test
    fun `delete non-existent location`() {
        val res = locationRepository.deleteLocation(-1)
        assertEquals(0, res)
    }

    @Test
    fun `get all locations for non-existent user`() {
        val res = locationRepository.getLocationsByUser(-1)
        assertTrue(res.isEmpty())
    }

}