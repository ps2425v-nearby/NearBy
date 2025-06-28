package pt.isel.project.nearby

import com.google.gson.Gson
import okhttp3.OkHttpClient
import org.jdbi.v3.core.Jdbi
import org.postgresql.ds.PGSimpleDataSource
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.annotation.Bean
import pt.isel.project.nearby.Repository.jdbi.mappers.LocationOutputMapper
import pt.isel.project.nearby.repository.jdbi.mappers.CommentMapper
import pt.isel.project.nearby.repository.jdbi.mappers.LocationMapper
import pt.isel.project.nearby.repository.jdbi.mappers.TokenMapper
import pt.isel.project.nearby.repository.jdbi.mappers.UserMapper


/**
 * NearbyApplication is the main entry point for the Nearby application.
 * It sets up the Spring Boot application and configures the necessary beans
 * for database access and HTTP client.
 *
 * This application uses Jdbi for database operations, OkHttpClient for making HTTP requests,
 * and Gson for JSON serialization and deserialization.
 *
 * @property jdbi The Jdbi instance used for database operations.
 * @property httpClient The OkHttpClient instance used for making HTTP requests.
 * @property gson The Gson instance used for JSON serialization and deserialization.
 */
@SpringBootApplication
class NearbyApplication {


	/**
	 * Creates a Jdbi instance configured with a PostgreSQL data source.
	 * The data source is initialized with the database URL, user, and password
	 * retrieved from the environment variables.
	 *
	 * This method registers several row mappers for mapping database rows
	 * to domain objects:
	 * - UserMapper: Maps database rows to User objects.
	 * - LocationMapper: Maps database rows to Location objects.
	 * - LocationOutputMapper: Maps database rows to LocationOutput objects.
	 * - TokenMapper: Maps database rows to Token objects.
	 * - CommentMapper: Maps database rows to Comment objects.
	 *
	 * @return A configured Jdbi instance.
	 */
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
			.registerRowMapper(TokenMapper())
			.registerRowMapper(CommentMapper())


	/**
	 * Creates an OkHttpClient instance for making HTTP requests.
	 * This client can be used throughout the application to perform network operations.
	 *
	 * This method configures the OkHttpClient with default settings.
	 *
	 * @return A configured OkHttpClient instance.
	 */
	@Bean
	fun httpClient(): OkHttpClient = OkHttpClient.Builder().build()


	/**
	 * Creates a Gson instance for JSON serialization and deserialization.
	 * This instance can be used throughout the application to convert objects to JSON
	 * and vice versa.
	 *
	 * This method configures the Gson instance with default settings.
	 *
	 * @return A configured Gson instance.
	 */
	@Bean
	fun gson(): Gson = Gson()



}

/**
 * Main function to run the Nearby application.
 * It initializes the Spring Boot application and starts the embedded server.
 */
fun main() {
	runApplication<NearbyApplication>()
}