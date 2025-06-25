/*
import com.fasterxml.jackson.databind.ObjectMapper
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import pt.isel.project.nearby.Domain.Crimes
import pt.isel.project.nearby.Domain.Place
import pt.isel.project.nearby.Domain.SavePlacesRequest
import pt.isel.project.nearby.NearbyApplication


@SpringBootTest(classes = [NearbyApplication::class]) // Substitua com a sua classe principal
@AutoConfigureMockMvc
class HousingControllerTests {

    @Autowired
    lateinit var mockMvc: MockMvc

    @Test
    fun testGetZoneMarker() {
        val lat = 51.505
        val lon = -0.09
        val searchRadius = 50.0  // 1000 metros de raio, por exemplo

        mockMvc.perform(
            get("/places/getZoneMarker")
                .param("lat", lat.toString())  // Passando o parâmetro lat
                .param("lon", lon.toString())  // Passando o parâmetro lon
                .param("searchRadius", searchRadius.toString())  // Passando o parâmetro searchRadius
        )
            .andExpect(status().isOk)  // Esperando um status 200 OK
            .andExpect(jsonPath("$.length()").value(52))  // Esperando que a lista tenha 52 elementos
    }

    @Test
    fun `save the place`() {
        val saveplace = SavePlacesRequest(
            name = "Teste",
            lat = 51.505,
            lon = -0.09,
            searchRadius = 50.0,
            wind = "5",
            trafficLevel = "muito movimentada",
            places = listOf(
                Place(
                    type = "node",
                    id = 1,
                    lat = 51.505,
                    lon = -0.09,
                    tags = mapOf("highway" to "motorway")
                )
            ),
            crimes = listOf(
                Crimes(
                    tipo = "Roubo",
                    desc = "Roubo de bicicleta"
                )
            ),
            parkingSpaces = listOf(
                pt.isel.project.nearby.Domain.ParkingSpaces(
                    parkingId = 1,
                    lat = 51.505,
                    lon = -0.09,
                    tags = mapOf("amenity" to "parking")
                )

            ),
            userID = 1
        )
        mockMvc.perform(
            post("/places/save")
                .contentType(MediaType.APPLICATION_JSON)
                .content(ObjectMapper().writeValueAsString(saveplace))
        )
            .andExpect(MockMvcResultMatchers.status().isOk) // Esperando um status 200 OK
    }

}
*/
