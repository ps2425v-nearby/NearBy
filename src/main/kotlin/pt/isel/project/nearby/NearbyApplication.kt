package pt.isel.project.nearby

import com.google.gson.Gson
import okhttp3.OkHttpClient
import org.jdbi.v3.core.Jdbi
import org.postgresql.ds.PGSimpleDataSource
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.annotation.Bean
import pt.isel.project.nearby.Repository.jdbi.mappers.LocationOutputMapper
import pt.isel.project.nearby.repository.jdbi.mappers.LocationMapper
import pt.isel.project.nearby.repository.jdbi.mappers.UserMapper

@SpringBootApplication
class NearbyApplication {

	@Bean
	fun jdbi(): Jdbi =
		Jdbi.create(
			PGSimpleDataSource().apply {
				setURL(Environment.getDbUrl())
				user = Environment.getDbUser()
				password = Environment.getDbPassword()
			}
		)
			.registerRowMapper(UserMapper())
			.registerRowMapper(LocationMapper())
			.registerRowMapper(LocationOutputMapper())


	@Bean
	fun httpClient(): OkHttpClient = OkHttpClient.Builder().build()

	@Bean
	fun gson(): Gson = Gson()



}

fun main() {
	runApplication<NearbyApplication>()
}