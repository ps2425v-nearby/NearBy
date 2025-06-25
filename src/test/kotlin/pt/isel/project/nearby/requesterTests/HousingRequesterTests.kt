package pt.isel.project.nearby.requesterTests


import com.google.gson.Gson
import kotlinx.coroutines.test.runTest
import okhttp3.OkHttpClient
import org.junit.jupiter.api.Test
import pt.isel.project.nearby.request.housing.HousingRequester
import kotlin.test.assertEquals

class HousingRequesterTest {

    private val requester = HousingRequester(
        gson = Gson()
    )

    @Test
    fun `should return valid id`() {
        val councilId = requester.fetchCouncilIdSync(3600000010, "Amadora")
        assertEquals(1234567890L, councilId)
    }
}
