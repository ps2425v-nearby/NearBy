package pt.isel.project.nearby.request.crime

import pt.isel.project.nearby.domain.CrimesInfo

/**
 * CrimeRequests is an interface that defines a method to fetch crime information
 * for a collection of city names asynchronously.
 *
 * This interface is intended to be implemented by classes that handle the retrieval
 * of crime data.
 */
interface CrimeRequests {
    suspend fun fetchCrimesAsync(cityNames: Collection<String>): List<CrimesInfo>
}