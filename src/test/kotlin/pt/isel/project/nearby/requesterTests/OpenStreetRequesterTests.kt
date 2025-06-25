package pt.isel.project.nearby.requesterTests

import com.google.gson.Gson
import kotlinx.coroutines.runBlocking
import okhttp3.OkHttpClient
import org.junit.jupiter.api.assertDoesNotThrow
import pt.isel.project.nearby.controllers.models.exceptions.ApiResponseException
import pt.isel.project.nearby.request.openstreet.OpenStreetRequester
import kotlin.test.Test
import kotlin.test.assertFailsWith

class OpenStreetRequesterTests {

    private val requester = OpenStreetRequester(
        client = OkHttpClient(),
        gson = Gson()
    )

    @Test
    fun `fetch places at wrong lon`() {
        runBlocking {
            val lat = 48.8588443
            val lon = 360.0
            val radius = 300.0

            assertFailsWith<ApiResponseException> {
                requester.fetchPlacesAsync(lat, lon, radius)
            }
        }
    }

    @Test
    fun `fetch places at wrong lat`() {
        runBlocking {
            val lat = 100.0
            val lon = 2.3522219
            val radius = 300.0

            assertFailsWith<ApiResponseException> {
                requester.fetchPlacesAsync(lat, lon, radius)
            }

        }
    }

    @Test
    fun `fetch places at wrong radius`() {
        runBlocking {
            val lat = 48.8588443
            val lon = 2.3522219
            val radius = -300.0

            assertFailsWith<ApiResponseException> {
                requester.fetchPlacesAsync(lat, lon, radius)
            }


        }
    }

    @Test
    fun `fetch parking spaces at wrong lon`() {
        runBlocking {
            val lat = 48.8588443
            val lon = 360.0
            val radius = 300.0

            assertFailsWith<ApiResponseException> {
                requester.fetchTrafficAsync(lat, lon, radius)
            }


        }
    }

    @Test
    fun `fetch parking spaces at wrong lat`() {
        runBlocking {
            val lat = 100.0
            val lon = 2.3522219
            val radius = 300.0

            assertFailsWith<ApiResponseException> {
                requester.fetchTrafficAsync(lat, lon, radius)
            }

        }
    }

    @Test
    fun `fetch parking spaces at wrong radius`() {
        runBlocking {
            val lat = 48.8588443
            val lon = 2.3522219
            val radius = -300.0

            assertFailsWith<ApiResponseException> {
                requester.fetchTrafficAsync(lat, lon, radius)
            }


        }
    }

    @Test
    fun `fetch traffic at wrong lon`() {
        runBlocking {
            val lat = 48.8588443
            val lon = 360.0
            val radius = 300.0

            assertFailsWith<ApiResponseException> {
                requester.fetchTrafficAsync(lat, lon, radius)
            }
        }
    }

    @Test
    fun `fetch traffic at wrong lat`() {
        runBlocking {
            val lat = 100.0
            val lon = 2.3522219
            val radius = 300.0

            assertFailsWith<ApiResponseException> {
                requester.fetchTrafficAsync(lat, lon, radius)
            }


        }
    }

    @Test
    fun `fetch traffic at wrong radius`() {
        runBlocking {
            val lat = 48.8588443
            val lon = 2.3522219
            val radius = -300.0

            assertFailsWith<ApiResponseException> {
                requester.fetchTrafficAsync(lat, lon, radius)
            }


        }
    }

    @Test
    fun `fetch places from valid location`() {
        runBlocking {
            val lat = 38.736946
            val lon = -9.142685
            val radius = 100.0

            assertDoesNotThrow {
                requester.fetchPlacesAsync(lat, lon, radius)
            }

        }
    }




    @Test
    fun `fetch traffic from valid location`() {
        runBlocking {
            val lat = 38.736946
            val lon = -9.142685
            val radius = 100.0

            assertDoesNotThrow {
                requester.fetchTrafficAsync(lat, lon, radius)
            }

        }
    }
}