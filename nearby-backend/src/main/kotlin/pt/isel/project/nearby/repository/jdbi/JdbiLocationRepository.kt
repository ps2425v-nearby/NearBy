package pt.isel.project.nearby.repository.jdbi

import org.jdbi.v3.core.Handle
import pt.isel.project.nearby.controllers.models.LocationInputModel
import pt.isel.project.nearby.domain.Place
import pt.isel.project.nearby.domain.Location
import pt.isel.project.nearby.repository.LocationRepository

/**
 * JdbiLocationRepository is an implementation of the LocationRepository interface
 * that uses JDBI to interact with the database for location-related operations.
 *
 * @property handle The JDBI Handle used to execute SQL queries and updates.
 */
class JdbiLocationRepository(private val handle: Handle) : LocationRepository {

    /**
     * Saves a new location to the database.
     *
     * @param location The LocationInputModel containing the details of the location to be saved.
     * @return The ID of the newly created location, or null if the operation failed.
     */
    override fun saveLocation(location: LocationInputModel): Int? {
        return handle.createUpdate(
            """
            INSERT INTO Location (lat, lng, name, searchRadius, userId)
            VALUES (:lat, :lng, :name, :searchRadius, :userId)
            RETURNING id
            """
        )
            .bind("lat", location.lat)
            .bind("lng", location.lon)
            .bind("name", location.name)
            .bind("searchRadius", location.searchRadius)
            .bind("userId", location.userID)
            .executeAndReturnGeneratedKeys()
            .mapTo(Int::class.java)
            .firstOrNull()
    }

    /**
     * Retrieves a location by its latitude and longitude coordinates.
     *
     * @param lat The latitude of the location.
     * @param lon The longitude of the location.
     * @return The Location object if found, or null if not found.
     */
    override fun getLocationByCoords(lat: Double, lon: Double): Location? =
        handle.createQuery(
            """
            SELECT * FROM Location
            WHERE lat = :lat AND lng = :lng
            """
        )
            .bind("lat", lat)
            .bind("lng", lon)
            .mapTo(Location::class.java)
            .findOne()
            .orElse(null)


    /**
     * Retrieves a location by its ID.
     *
     * @param userId The ID of the location.
     * @return The Location object if found, or null if not found.
     */
    override fun getLocationsByUser(userId: Int): List<Location> {
        return handle.createQuery(
            """
                SELECT *
                FROM Location
                WHERE userId = :userId
                """
        )
            .bind("userId", userId)
            .mapTo(Location::class.java)
            .list()

    }

    /**
     * Deletes a location by its ID.
     *
     * @param id The ID of the location to be deleted.
     * @return The number of rows affected by the delete operation.
     */
    override fun deleteLocation(id: Int): Int {
        return handle.createUpdate(
            "DELETE FROM Location WHERE id = :locId"
        )
            .bind("locId", id)
            .execute()
    }

    /**
     * Retrieves a location by its ID.
     *
     * @param id The ID of the location to be retrieved.
     * @return The Location object if found, or null if not found.
     */
    override fun getLocation(id: Int): Location? {
        return handle.createQuery(
            """
            SELECT * FROM Location
            WHERE id = :id
            """
        )
            .bind("id", id)
            .mapTo(Location::class.java)
            .findOne()
            .orElse(null)
    }
}