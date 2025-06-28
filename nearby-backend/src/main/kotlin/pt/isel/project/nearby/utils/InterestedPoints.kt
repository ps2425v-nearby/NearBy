package pt.isel.project.nearby.utils

/**
 * This file contains a map of interested points of interest (POIs) in Portuguese,
 * along with their corresponding OpenStreetMap (OSM) tags.
 * The keys are the names of the POIs in Portuguese,
 * and the values are the OSM tags used to query these POIs.
 * The map can be used to filter and retrieve specific types of locations
 * from OpenStreetMap data.
 */
val interestedPointsMap: Map<String, String> = mapOf(
    "Escolas" to "amenity=school",
    "Universidades" to "amenity=university",
    "Hospitais" to "amenity=hospital",
    "Clínicas de Saúde" to "amenity=clinic",
    "Transportes Públicos" to "highway=bus_stop",
    "Estações de Comboio / Metro" to "railway=station",
    "Supermercados" to "shop=supermarket",
    "Hipermercados" to "shop=hypermarket",
    "Mercados Locais" to "amenity=marketplace",
    "Farmácias" to "amenity=pharmacy",
    "Parques e Jardins" to "leisure=park",
    "Praias" to "natural=beach",
    "Ginásios / Centros Desportivos" to "leisure=sports_centre",
    "Restaurantes" to "amenity=restaurant",
    "Cafés e Pastelarias" to "amenity=cafe",
    "Centros Comerciais" to "shop=mall",
    "Zonas Comerciais" to "landuse=retail",
    "Bancos / ATMs" to "amenity=bank",
    "Correios" to "amenity=post_office",
    "Polícia / GNR" to "amenity=police",
    "Bombeiros" to "amenity=fire_station",
    "Bibliotecas" to "amenity=library",
    "Igrejas / Locais de culto" to "amenity=place_of_worship",
    "Ciclovias / Percursos pedonais" to "highway=cycleway",
    "Creches / Infantários" to "amenity=kindergarten",
    "Lojas de Conveniência" to "shop=convenience",
    "Zonas com Baixo Ruído" to "",
    "Zonas com Estacionamento Fácil" to "",
    "Zonas com Boa Iluminação Pública" to ""
)
