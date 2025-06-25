package pt.isel.project.nearby.domain

import pt.isel.project.nearby.controllers.models.LocationOutputModel
import pt.isel.project.nearby.utils.Error

typealias TokenCreationResult = Either<Error, Token>
typealias TokenRemoveResult = Either<Error, Boolean>
typealias TokenAccessingResult = Either<Error, Boolean>
typealias UserCreationResult = Either<Error, Boolean>
typealias UserAccessingResult = Either<Error, User>
typealias UserAccessingByTokenResult = Either<Error, Int>
typealias LocationsAccessingResult = Either<Error, List<Location>>
typealias LocationCreationResult = Either<Error, Int>
typealias LocationRemovingResult = Either<Error, Boolean>
typealias LocationDataRequestResult = Either<Error, LocationOutputModel>
