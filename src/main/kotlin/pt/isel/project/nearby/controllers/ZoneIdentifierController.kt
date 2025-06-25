package pt.isel.project.nearby.controllers

import pt.isel.project.nearby.domain.ZoneIdentifier
import pt.isel.project.nearby.services.ZoneService


import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import pt.isel.project.nearby.PathTemplate


@RestController
class ZoneIdentifierController(private val zoneService: ZoneService) {
    @GetMapping(PathTemplate.ZONE_IDENTIFIER)
    fun zoneIdentifier(@RequestParam lat: Double, @RequestParam lon: Double): ResponseEntity<ZoneIdentifier> {
        val zoneInfo = zoneService.fetchZone(lat, lon)
        return ResponseEntity.ok(zoneInfo)
    }
}