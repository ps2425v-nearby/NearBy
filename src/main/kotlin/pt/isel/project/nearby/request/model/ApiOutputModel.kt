  package pt.isel.project.nearby.request.model

import pt.isel.project.nearby.domain.Place
import pt.isel.project.nearby.domain.TrafficInfo
import pt.isel.project.nearby.request.crime.CrimeEntry

  data class ApiPlacesModel(
    val elements: List<Place>
)

data class ApiTrafficModel(
    val elements: List<TrafficInfo>
)

  data class ApiCrimeModel(
      val Dados: Map<String, List<CrimeEntry>>
  )
