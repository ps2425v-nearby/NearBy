package pt.isel.project.nearby.services

import kotlinx.coroutines.*
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


@Service
class LocationService(
    private val transactionManager: TransactionManager,
    private val openStreetRequester: OpenStreetRequester,
    private val openWeatherRequester: OpenMeteoRequester,
    private val crimesRequester: CrimesRequester,
    private val zoneRequester: ZoneRequester
) {

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

    private fun String?.isParking(): Boolean {
        return this == "parking" || this == "motorcycle_parking" || this == "parking_entrance"
    }

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