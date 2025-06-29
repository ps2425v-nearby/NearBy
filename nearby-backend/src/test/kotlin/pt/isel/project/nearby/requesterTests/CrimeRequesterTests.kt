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

    private val validCityNames = listOf(
        "Lisboa",
        "Benfica",
    )

    private val invalidCityNames = listOf(
        "InvalidCity1",
        "InvalidCity2",
    )

    @Test
    fun `fetch crimes at not valid city`() {
        runBlocking {

            assertTrue(
                requester.fetchCrimesAsync(invalidCityNames).isEmpty(),
            )
        }
    }

    @Test
    fun `fetch crimes at valid city`() {
        runBlocking {

            assertTrue(
                requester.fetchCrimesAsync(validCityNames).isNotEmpty(),
            )
        }
    }
}