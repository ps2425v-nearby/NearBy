/**
 * Mapping of Points of Interest (POI) categories to their corresponding OpenStreetMap tags.
 *
 * Each key is a human-readable category name (in Portuguese),
 * and the value is the corresponding OSM tag used for filtering or querying map data.
 *
 * Some entries have empty strings, indicating categories without a specific OSM tag.
 */
export const interestedPointsMap: { [key: string]: string } = {
    'Escolas': 'amenity=school',
    'Universidades': 'amenity=university',
    'Hospitais': 'amenity=hospital',
    'Clínicas de Saúde': 'amenity=clinic',
    'Transportes Públicos': 'highway=bus_stop',
    'Estações de Comboio / Metro': 'railway=station',
    'Supermercados': 'shop=supermarket',
    'Hipermercados': 'shop=hypermarket',
    'Mercados Locais': 'amenity=marketplace',
    'Farmácias': 'amenity=pharmacy',
    'Parques e Jardins': 'leisure=park',
    'Praias': 'natural=beach',
    'Ginásios / Centros Desportivos': 'leisure=sports_centre',
    'Restaurantes': 'amenity=restaurant',
    'Cafés e Pastelarias': 'amenity=cafe',
    'Centros Comerciais': 'shop=mall',
    'Zonas Comerciais': 'landuse=retail',
    'Bancos / ATMs': 'amenity=bank',
    'Correios': 'amenity=post_office',
    'Polícia / GNR': 'amenity=police',
    'Bombeiros': 'amenity=fire_station',
    'Bibliotecas': 'amenity=library',
    'Igrejas / Locais de culto': 'amenity=place_of_worship',
    'Ciclovias / Percursos pedonais': 'highway=cycleway',
    'Creches / Infantários': 'amenity=kindergarten',
    'Lojas de Conveniência': 'shop=convenience',
    'Zonas com Baixo Ruído': '',
    'Zonas com Estacionamento Fácil': '',
    'Zonas com Boa Iluminação Pública': '',
};
