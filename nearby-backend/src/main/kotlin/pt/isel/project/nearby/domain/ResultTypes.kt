package pt.isel.project.nearby.domain

import pt.isel.project.nearby.controllers.models.EmailResponse
import pt.isel.project.nearby.controllers.models.LocationOutputModel
import pt.isel.project.nearby.utils.Error

/**
 * Type aliases for various result types used in the application.
 * These type aliases represent the possible outcomes of operations, encapsulating either a successful result or an error.
 */
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
typealias ZoneAccessingResult = Either<Error, ZoneIdentifier>
typealias HousingSalesAccessingResult = Either<Error, Int>
typealias EmailSendingResult = Either<Error, EmailResponse>
