package pt.isel.project.nearby.repository.jdbi

import org.jdbi.v3.core.Handle
import pt.isel.project.nearby.controllers.models.LocationInputModel
import pt.isel.project.nearby.domain.Place
import pt.isel.project.nearby.domain.Location
import pt.isel.project.nearby.repository.LocationRepository

class JdbiLocationRepository(private val handle: Handle) : LocationRepository {
    override suspend fun fetchAllPlaces(lat: Double, long: Double, searchRadius: Double): List<Place> {
        TODO("Not yet implemented")
    }

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

    override fun getLocationByCoords(id: Int): Location? =
        handle.createQuery(
            """
            SELECT * FROM Location
            WHERE id = :id
            """
        )
            .bind("id", id)
            .mapTo(Location::class.java)
            .findOne()
            .orElse(null)

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

    override fun deleteLocation(id: Int): Int {
        return handle.createUpdate(
            "DELETE FROM Location WHERE id = :locId"
        )
            .bind("locId", id)
            .execute()
    }

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