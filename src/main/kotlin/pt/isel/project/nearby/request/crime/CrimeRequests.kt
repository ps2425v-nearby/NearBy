package pt.isel.project.nearby.request.crime

import pt.isel.project.nearby.domain.CrimesInfo

interface CrimeRequests {
    suspend fun fetchCrimesAsync(cityNames: Collection<String>): List<CrimesInfo>
}