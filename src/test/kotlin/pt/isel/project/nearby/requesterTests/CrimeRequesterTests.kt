package pt.isel.project.nearby.requesterTests

import com.google.gson.Gson
import kotlinx.coroutines.runBlocking
import okhttp3.OkHttpClient
import pt.isel.project.nearby.request.crime.CrimesRequester
import kotlin.test.Test
import kotlin.test.assertTrue

class CrimeRequesterTests {
    private val requester = CrimesRequester(
        client = OkHttpClient(),
        gson = Gson()
    )

    private val cityNames = listOf(
        "Lisbon",
        "Benfica",
    )

    @Test
    fun `fetch crimes at not valid city`() {
        runBlocking {

            assertTrue(
                requester.fetchCrimesAsync(cityNames).isEmpty(),
                "Expected empty list when fetching crimes with invalid longitude"
            )
        }
    }

    @Test
    fun `fetch crimes at valid city`() {
        runBlocking {

            assertTrue(
                requester.fetchCrimesAsync(cityNames).isNotEmpty(),
                "Expected empty list when fetching crimes with invalid latitude"
            )
        }
    }
}