package pt.isel.project.nearby.utils

import pt.isel.project.nearby.domain.TrafficInfo

fun calculateTraffic(lista: List<TrafficInfo>): String {

    if (lista.isEmpty()) return "Sem dados de tráfego"

    // Conta o número de ocorrências por tipo de highway
    val count = lista.mapNotNull { it.tags["highway"] }
        .groupingBy { it }
        .eachCount()

    val totalScore = count.entries.sumOf { (tipo, count) ->
        val weight = when (tipo) {
            "residential", "service" -> 1
            "tertiary", "unclassified" -> 2
            "secondary", "primary" -> 3
            "trunk", "motorway" -> 4
            else -> 0
        }
        weight * count
    }

    return when {
        totalScore <= 5 -> "Área não muito movimentada"
        totalScore <= 10 -> "Área geralmente movimentada"
        totalScore <= 20 -> "Área muito movimentada"
        else -> "Área extremamente movimentada"
    }
}
