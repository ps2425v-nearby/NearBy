package pt.isel.project.nearby.requesterTests

import com.google.gson.Gson
import kotlinx.coroutines.runBlocking
import okhttp3.OkHttpClient
import org.junit.jupiter.api.assertDoesNotThrow
import pt.isel.project.nearby.controllers.models.exceptions.ApiResponseException
import pt.isel.project.nearby.request.openmeteo.OpenMeteoRequester
import kotlin.test.Test
import kotlin.test.assertFailsWith

class OpenMeteoRequesterTests {

    private val requester = OpenMeteoRequester(
        client = OkHttpClient(),
        gson = Gson()
    )

    @Test
    fun `fetch wind at wrong lon`() {
        runBlocking {
            val lat = 48.8588443
            val lon = 360.0

            assertFailsWith<ApiResponseException> {
                requester.fetchWindAsync(lat, lon)
            }
        }
    }

    @Test
    fun `fetch wind at wrong lat`() {
        runBlocking {
            val lat = 100.0
            val lon = 2.3522219

            assertFailsWith<ApiResponseException> {
                requester.fetchWindAsync(lat, lon)
            }

        }
    }


    @Test
    fun `fetch wind from valid location`() {
        runBlocking {
            val lat = 38.736946
            val lon = -9.142685

            assertDoesNotThrow {
                requester.fetchWindAsync(lat, lon)
            }

        }
    }
}