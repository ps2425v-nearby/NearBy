package pt.isel.project.nearby.controllers.models.exceptions

import pt.isel.project.nearby.controllers.models.ProblemJson
import java.net.URI


/**
 * Factory function to create ProblemJson instance for Location not found errors.
 * This function generates a ProblemJson object with a specific URI, title, detail, and instance.
 *
 * @param locID The ID of the location that was not found.
 * @return A ProblemJson object representing the location not found error.
 */
fun <T> locationNotFound(locID: T) = ProblemJson(
    URI("http://localhost:8080/errors/locationNotFound"),
    "Location not found",
    "Location with id: $locID not found.",
    "/locations/$locID"
)

/**
 * Factory function to create ProblemJson instance for Location repository errors.
 * This function generates a ProblemJson object with a specific URI, title, detail, and instance.
 *
 * @param locID The ID of the location that caused the repository error.
 * @return A ProblemJson object representing the location repository error.
 */
fun <T> locationRepositoryError(locID: T) = ProblemJson(
    URI("http://localhost:8080/errors/locationRepositoryError"),
    "Location repository error",
    "Location repository error occurred for location with id: $locID.",
    ""
)

/**
 * Factory function to create ProblemJson instance for Location has comments errors.
 * This function generates a ProblemJson object with a specific URI, title, detail, and instance.
 *
 * @param locID The ID of the location that has comments.
 * @return A ProblemJson object representing the location has comments error.
 */
fun <T> locationHasComments(locID: T) = ProblemJson(
    URI("http://localhost:8080/errors/locationHasComments"),
    "Location has comments",
    "Location with id: $locID has comments and cannot be deleted.",
    "/locations/$locID/comments"
)


