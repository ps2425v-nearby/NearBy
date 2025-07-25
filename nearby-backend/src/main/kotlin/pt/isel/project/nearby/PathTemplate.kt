package pt.isel.project.nearby

/**
 * PathTemplate is an object that contains constants representing various API endpoint paths.
 * These paths are used to define the structure of the API endpoints for different resources
 * such as locations, comments, user authentication, and more.
 */
object PathTemplate {
    const val SAVE = "/locations"
    const val GET_ZONE_MARKER = "/all-places"

    const val DELETE = "/locations/{locationId}"
    const val SAVED_NAME_LOCATIONS = "/locations/saved"
    const val LOCATIONS_LAT_LON = "/locations"
    const val LOCATION_BY_ID = "/locations/{locationId}"

    const val COMMENTS_BY_PLACE_ID = "/place/{placeId}"
    const val COMMENTS_SEARCH = "/search"
    const val COMMENTS_BY_USER_ID = "/user/{userId}"
    const val COMMENT_BY_ID = "/{commentId}"

    const val EMAIL = "/email"

    const val HOUSING_PRICES = "/housing/prices"

    const val LOGIN = "/session"
    const val LOGOUT = "/logout"
    const val AUTH_COOKIE = "/authCookie"

    const val USER_ID = "/{id}"
    const val CREATE_USER = "/users"

    const val ZONE_IDENTIFIER = "/zones"

    const val MAP_AMENITIES = "/map/amenities"


}
