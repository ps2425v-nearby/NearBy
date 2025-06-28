package pt.isel.project.nearby.services

import kotlinx.coroutines.*
import org.slf4j.Logger
import org.springframework.stereotype.Service
import pt.isel.project.nearby.controllers.models.AmenitiesRequest
import pt.isel.project.nearby.controllers.models.AmenitiesResponse
import pt.isel.project.nearby.controllers.models.LocationInputModel
import pt.isel.project.nearby.controllers.models.LocationOutputModel
import pt.isel.project.nearby.controllers.models.MapCenter
import pt.isel.project.nearby.controllers.models.SimpleLocationOutputModel
import pt.isel.project.nearby.controllers.models.exceptions.ApiRequestException
import pt.isel.project.nearby.controllers.models.exceptions.ApiResponseException
import pt.isel.project.nearby.domain.*
import pt.isel.project.nearby.repository.TransactionManager
import pt.isel.project.nearby.request.openstreet.OpenStreetRequester
import pt.isel.project.nearby.request.crime.CrimesRequester
import pt.isel.project.nearby.request.openmeteo.OpenMeteoRequester
import pt.isel.project.nearby.request.openmeteo.SeasonalWeatherValues
import pt.isel.project.nearby.request.zone.ZoneRequester
import pt.isel.project.nearby.utils.Error
import pt.isel.project.nearby.utils.AMENITIES_TIMEOUT_MS
import pt.isel.project.nearby.utils.BBOX_TIMEOUT_MS
import pt.isel.project.nearby.utils.calculateTraffic


/**
 * LocationService is a service class that provides methods to fetch, save, and manage location data.
 * It interacts with various requesters to gather information about places, traffic, weather, and crimes
 * based on geographical coordinates (latitude and longitude).
 *
 * This service handles asynchronous fetching of location data and manages database transactions
 * for saving and retrieving location information.
 *
 * @property transactionManager The TransactionManager used to handle database transactions.
 * @property openStreetRequester The requester for OpenStreetMap data.
 * @property openWeatherRequester The requester for OpenWeather data.
 * @property crimesRequester The requester for crime data.
 * @property zoneRequester The requester for zone information.
 */
@Service
class LocationService(
    private val transactionManager: TransactionManager,
    private val openStreetRequester: OpenStreetRequester,
    private val openWeatherRequester: OpenMeteoRequester,
    private val crimesRequester: CrimesRequester,
    private val zoneRequester: ZoneRequester
) {

    /**
     * Fetches all relevant location data asynchronously based on latitude, longitude, and search radius.
     * It gathers information about places, traffic levels, wind conditions, and crime statistics.
     *
     * This method uses coroutines to perform multiple API requests concurrently,
     * allowing for efficient data retrieval within a specified timeout.
     *
     * @param lat The latitude of the location to fetch data for.
     * @param long The longitude of the location to fetch data for.
     * @param searchRadius The radius in meters to search for relevant data.
     * @return A LocationDataRequestResult containing the fetched location data or an error.
     */
    fun fetchAllAsync(lat: Double, long: Double, searchRadius: Double): LocationDataRequestResult {
        return runBlocking {
            val jobPlaces = this.async<List<Place>> {
                withTimeout(10000) {
                    openStreetRequester.fetchPlacesAsync(lat, long, searchRadius)
                }
            }
            val jobTraffic = this.async<String> {
                withTimeout(10000) {
                    val traffic =  openStreetRequester.fetchTrafficAsync(lat, long, searchRadius)
                    calculateTraffic(traffic)
                }
            }
            val jobWind = this.async< List<SeasonalWeatherValues>> {
                withTimeout(10000) {
                    openWeatherRequester.fetchWindAsync(lat, long)
                }
            }

            val crimesJob = this.async<List<CrimesInfo>> {
                withTimeout(10000) {
                    val zones = zoneRequester.fetchZoneAsync(lat, long)
                    crimesRequester.fetchCrimesAsync(zones.toSet())
                }
            }
            try {
                val resultPlaces = jobPlaces.await()
                val resultTraffic = jobTraffic.await()
                val resultWind = jobWind.await()
                val resultCrimes = crimesJob.await()
                val parkingSpaces = resultPlaces.filter { place ->
                    val amenity = place.tags?.get("amenity")
                    amenity.isParking()
                }

                success(
                    LocationOutputModel(
                        id = null,
                        lat = lat,
                        lon = long,
                        searchRadius = searchRadius,
                        name = null,
                        places = resultPlaces,
                        trafficLevel = resultTraffic,
                        wind = resultWind,
                        crimes = resultCrimes,
                        parkingSpaces = parkingSpaces
                    )
                )
            } catch (e: Exception) {
                when (e) {
                    is TimeoutCancellationException, is CancellationException -> failure(Error.ApiTimeoutResponse)
                    is ApiRequestException -> failure(Error.ApiRequestError)
                    is ApiResponseException -> failure(Error.ApiResponseError)
                    else -> failure(Error.InternalServerError)
                }
            }
        }

    }

    /**
     * Checks if the given amenity type is related to parking.
     *
     * @receiver The amenity type as a String.
     * @return True if the amenity type is related to parking, false otherwise.
     */
    private fun String?.isParking(): Boolean {
        return this == "parking" || this == "motorcycle_parking" || this == "parking_entrance"
    }

    /**
     * Saves a new location to the database.
     *
     * This method checks if a location with the same coordinates already exists.
     * If it does, it returns an error; otherwise, it saves the new location.
     *
     * This method executes a transaction to ensure atomicity and consistency
     * when saving the location data.
     *
     * @param location The LocationInputModel containing the details of the location to be saved.
     * @return A LocationCreationResult indicating success or failure of the save operation.
     */
    fun saveLocation(location: LocationInputModel): LocationCreationResult =
        transactionManager.executeTransaction {
            try {
                val existingLocation = it.locationRepository.getLocationByCoords(location.lat, location.lon)
                if (existingLocation != null) {
                    return@executeTransaction failure(Error.LocationAlreadyExists)
                }
                val result = it.locationRepository.saveLocation(location)
                if (result == null) failure(Error.LocationRepositoryError)
                else success(result)

            } catch (e: Exception) {
                e.printStackTrace()
                return@executeTransaction failure(Error.InternalServerError)
            }

        }

    /**
     * Retrieves a location by its latitude and longitude.
     *
     * This method executes a transaction to fetch the location data from the database.
     * If the location is not found, it returns an error; otherwise, it returns the location details.
     *
     * @param lat The latitude of the location to retrieve.
     * @param lon The longitude of the location to retrieve.
     * @return A SimpleLocationOutputModel containing the location details or an error.
     */
    fun getLocationsByLatLon(lat: Double, lon: Double): Either<Error, SimpleLocationOutputModel> =
        transactionManager.executeTransaction {
            try {
                val location = it.locationRepository.getLocationByCoords(lat, lon)
                if (location == null) {
                    failure(Error.LocationNotFound)
                } else {
                    success(
                        SimpleLocationOutputModel(
                            id = location.id,
                            lat = location.lat,
                            lon = location.lon,
                            searchRadius = location.searchRadius,
                            name = location.name
                        )
                    )
                }
            } catch (e: Exception) {
                e.printStackTrace()
                failure(Error.InternalServerError)
            }
        }

    /**
     * Retrieves a location by its ID.
     *
     * This method executes a transaction to fetch the location data from the database.
     * If the location is not found, it returns an error; otherwise, it returns the location details.
     *
     * @param id The ID of the location to retrieve.
     * @return A SimpleLocationOutputModel containing the location details or an error.
     */
    fun getLocationById(id: Int): Either<Error, SimpleLocationOutputModel> {
        return transactionManager.executeTransaction {
            try {
                val location = it.locationRepository.getLocation(id)
                if (location == null) {
                    failure(Error.LocationNotFound)
                } else {
                    success(
                        SimpleLocationOutputModel(
                            id = location.id,
                            lat = location.lat,
                            lon = location.lon,
                            searchRadius = location.searchRadius,
                            name = location.name
                        )
                    )
                }
            } catch (e: Exception) {
                e.printStackTrace()
                failure(Error.InternalServerError)
            }
        }
    }

    /**
     * Retrieves all locations associated with a specific user.
     *
     * This method executes a transaction to fetch the locations from the database
     * based on the user ID. If no locations are found, it returns an empty list.
     *
     * @param userId The ID of the user whose locations are to be retrieved.
     * @return A LocationsAccessingResult containing the list of locations or an error.
     */
    fun getLocationsByUser(userId: Int): LocationsAccessingResult =
        transactionManager.executeTransaction {

            try {
                val locations = it.locationRepository.getLocationsByUser(userId)
                success(locations)

            } catch (e: Exception) {
                e.printStackTrace()
                return@executeTransaction failure(Error.InternalServerError)
            }

        }

    /**
     * Deletes a location by its ID.
     *
     * This method executes a transaction to delete the location from the database.
     * If the location has associated comments, it returns an error; otherwise, it deletes the location.
     *
     * @param id The ID of the location to be deleted.
     * @return A LocationRemovingResult indicating success or failure of the delete operation.
     */
    fun deleteLocation(id: Int): LocationRemovingResult =
        transactionManager.executeTransaction {

            try {
                val result = it.locationRepository.deleteLocation(id)
                val checkIfThereIsComment = it.commentsRepository.getCommentsByPlaceId(id)
                if (checkIfThereIsComment.isNotEmpty()) {
                    return@executeTransaction failure(Error.LocationHasComments)
                }
                if (result <= 0) failure(Error.LocationNotFound)
                else success(true)

            } catch (e: Exception) {
                e.printStackTrace()
                return@executeTransaction failure(Error.InternalServerError)
            }

        }

    /**
     * Fetches amenities based on the provided request parameters.
     *
     * This method retrieves a bounding box for the specified parish, municipality, and district,
     * then fetches amenities within that bounding box. If no amenities are found, it returns an empty list.
     *
     * It handles exceptions and timeouts gracefully, returning appropriate error responses.
     *
     * @param request The AmenitiesRequest containing the parameters for fetching amenities.
     * @return An Either containing an Error or an AmenitiesResponse with the fetched amenities.
     */
    fun fetchAmenities(request: AmenitiesRequest): Either<Error, AmenitiesResponse?> = runBlocking {
        try {
            val bbox = withTimeout(BBOX_TIMEOUT_MS) {
                openStreetRequester.fetchBoundingBoxSync(
                    request.parish,
                    request.municipality,
                    request.district
                )
            } ?: return@runBlocking failure(Error.LocationNotFound)

            val placesFound = withTimeout(AMENITIES_TIMEOUT_MS) {
                openStreetRequester.fetchAmenitiesByBoundingBoxSync(bbox, request.points)
            }

            success(placesFound.takeIf { it.amenities.isNotEmpty() } ?: AmenitiesResponse(
                center = MapCenter(lat = 0.0, lon = 0.0),
                amenities = emptyList()
            ))
        } catch (e: Exception) {
            when (e) {
                is TimeoutCancellationException -> failure(Error.ApiTimeoutResponse)
                is ApiRequestException -> failure(Error.ApiRequestError)
                is ApiResponseException -> failure(Error.ApiResponseError)
                else -> failure(Error.InternalServerError)
            }
        }
    }
}