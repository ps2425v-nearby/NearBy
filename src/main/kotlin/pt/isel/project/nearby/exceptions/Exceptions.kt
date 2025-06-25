package pt.isel.project.nearby.exceptions

class FetchZoneException(message: String, cause: Throwable? = null) : RuntimeException(message, cause)
class FetchWindException(message: String, cause: Throwable? = null) : RuntimeException(message, cause)
class FetchTrafficException(message: String, cause: Throwable? = null) : RuntimeException(message, cause)
class SavePlacesException(message: String, cause: Throwable? = null) : RuntimeException(message, cause)
class NoPlacesFoundException(message: String, cause: Throwable? = null) : RuntimeException(message, cause)
class NoParkingSpacesFoundException(message: String, cause: Throwable? = null) : RuntimeException(message, cause)