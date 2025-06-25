package pt.isel.project.nearby.requesterTests

import com.google.gson.Gson
import kotlinx.coroutines.runBlocking
import okhttp3.OkHttpClient
import org.junit.jupiter.api.assertDoesNotThrow
import pt.isel.project.nearby.controllers.models.exceptions.ApiResponseException
import pt.isel.project.nearby.request.openstreet.OpenStreetRequester
import pt.isel.project.nearby.request.zone.ZoneRequester
import kotlin.test.Test
import kotlin.test.assertFailsWith

class ZoneRequesterTests {
    private val requester = ZoneRequester(
        client = OkHttpClient(),
        gson = Gson()
    )

    @Test
    fun `fetch zone at wrong lon`() {
        runBlocking {
            val lat = 48.8588443
            val lon = 360.0

            assertFailsWith<ApiResponseException> {
                requester.fetchZoneAsync(lat, lon)
            }

            assertFailsWith<ApiResponseException> {
                requester.fetchZoneSync(lat, lon)
            }
        }
    }

    @Test
    fun `fetch zone at wrong lat`() {
        runBlocking {
            val lat = 100.0
            val lon = 2.3522219

            assertFailsWith<ApiResponseException> {
                requester.fetchZoneAsync(lat, lon)
            }

            assertFailsWith<ApiResponseException> {
                requester.fetchZoneSync(lat, lon)
            }

        }
    }



    @Test
    fun `fetch zone from valid location`() {
        runBlocking {
            val lat = 38.736946
            val lon = -9.142685

            assertDoesNotThrow {
                requester.fetchZoneAsync(lat, lon)
            }

            assertDoesNotThrow {
                requester.fetchZoneSync(lat, lon)
            }

        }
    }
}