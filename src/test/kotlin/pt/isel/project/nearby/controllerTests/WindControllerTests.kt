import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.server.LocalServerPort
import org.springframework.test.context.ContextConfiguration
import pt.isel.project.nearby.NearbyApplication
import java.net.URI
import java.net.http.HttpClient
import java.net.http.HttpRequest
import java.net.http.HttpResponse
import kotlin.test.assertEquals

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ContextConfiguration(classes = [NearbyApplication::class])
class WindApiIntegrationTest {

    @LocalServerPort
    var port: Int = 0

    @Test
    fun `should return 200 OK when fetching wind`() {
        val client = HttpClient.newHttpClient()
        val request = HttpRequest.newBuilder()
            .uri(URI.create("http://localhost:$port/wind/getWindZoneMarker?lat=38.73694&lon=-9.142685"))
            .GET()
            .build()

        val response = client.send(request, HttpResponse.BodyHandlers.ofString())

        // Verifica se a resposta HTTP foi 200 OK
        assertEquals(200, response.statusCode())
    }
}
