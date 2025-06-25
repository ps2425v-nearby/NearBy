package pt.isel.project.nearby.controllers.models.exceptions

import pt.isel.project.nearby.controllers.models.ProblemJson
import java.net.URI


fun <T> locationNotFound(locID: T) = ProblemJson(
    URI("http://localhost:8080/errors/locationNotFound"),
    "Location not found",
    "Location with id: $locID not found.",
    "/locations/$locID"
)

fun <T> locationRepositoryError(locID: T) = ProblemJson(
    URI("http://localhost:8080/errors/locationRepositoryError"),
    "Location repository error",
    "Location repository error occurred for location with id: $locID.",
    ""
)

fun <T> locationHasComments(locID: T) = ProblemJson(
    URI("http://localhost:8080/errors/locationHasComments"),
    "Location has comments",
    "Location with id: $locID has comments and cannot be deleted.",
    "/locations/$locID/comments"
)