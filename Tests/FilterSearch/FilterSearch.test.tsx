import {processData} from '../../src/components/FilterSearch/FilterReducer';
import {DataEntry, Distrito} from '../../src/types/FilterTypes';

describe('processData', () => {
    const sampleData: DataEntry[] = [
        {
            populacaoresidentefreguesia_id: 1,
            Distrito_DT: '01',
            Concelho_CC: '0101',
            Freguesia_FR: '010101',
            Designacao_CC: 'Lisboa',
            Designacao_FR: 'Santo António',
            Populacao: 1000,
            Rural: 'N',
            Litoral: 'S',
        },
        {
            populacaoresidentefreguesia_id: 2,
            Distrito_DT: '01',
            Concelho_CC: '0102',
            Freguesia_FR: '010201',
            Designacao_CC: 'Lisboa Norte',
            Designacao_FR: 'Lumiar',
            Populacao: 2000,
            Rural: 'N',
            Litoral: 'S',
        },
        {
            populacaoresidentefreguesia_id: 3,
            Distrito_DT: '02',
            Concelho_CC: '0201',
            Freguesia_FR: '020101',
            Designacao_CC: 'Porto',
            Designacao_FR: 'Cedofeita',
            Populacao: 1500,
            Rural: 'N',
            Litoral: 'N',
        },
        {
            populacaoresidentefreguesia_id: 4,
            Distrito_DT: '01',
            Concelho_CC: '0101',
            Freguesia_FR: '010102',
            Designacao_CC: 'Lisboa',
            Designacao_FR: 'Coração de Jesus',
            Populacao: 1200,
            Rural: 'N',
            Litoral: 'S',
        },
    ];

    const distritosMap: Distrito[] = [
        {id: '01', nome: 'Lisboa'},
        {id: '02', nome: 'Porto'},
    ];

    it('should process and return structured district, municipality and parish maps', () => {
        const result = processData(sampleData, distritosMap);

        expect(result.districts).toEqual([
            {id: '01', nome: 'Lisboa'},
            {id: '02', nome: 'Porto'},
        ]);

        expect(result.municipalityMap.get('01')).toEqual([
            {id: '0101', nome: 'Lisboa', distritoId: '01'},
            {id: '0102', nome: 'Lisboa Norte', distritoId: '01'},
        ]);
        expect(result.municipalityMap.get('02')).toEqual([
            {id: '0201', nome: 'Porto', distritoId: '02'},
        ]);

        expect(result.parishMap.get('0101')).toEqual([
            {id: '010101', nome: 'Santo António', concelhoId: '0101'},
            {id: '010102', nome: 'Coração de Jesus', concelhoId: '0101'},
        ]);
        expect(result.parishMap.get('0102')).toEqual([
            {id: '010201', nome: 'Lumiar', concelhoId: '0102'},
        ]);
        expect(result.parishMap.get('0201')).toEqual([
            {id: '020101', nome: 'Cedofeita', concelhoId: '0201'},
        ]);
    });

    it('should use ID as name if distrito nome is missing in map', () => {
        const incompleteMap: Distrito[] = [];
        const result = processData(sampleData, incompleteMap);

        expect(result.districts).toEqual([
            {id: '01', nome: '01'},
            {id: '02', nome: '02'},
        ]);
    });

    it('should not duplicate municipalities or parishes', () => {
        const duplicateData: DataEntry[] = [
            {
                populacaoresidentefreguesia_id: 5,
                Distrito_DT: '03',
                Concelho_CC: '0301',
                Freguesia_FR: '030101',
                Designacao_CC: 'Faro',
                Designacao_FR: 'Sé',
                Populacao: 800,
                Rural: 'S',
                Litoral: 'S',
            },
            {
                populacaoresidentefreguesia_id: 6,
                Distrito_DT: '03',
                Concelho_CC: '0301',
                Freguesia_FR: '030101',
                Designacao_CC: 'Faro',
                Designacao_FR: 'Sé',
                Populacao: 800,
                Rural: 'S',
                Litoral: 'S',
            },
        ];

        const distritosMap: Distrito[] = [{id: '03', nome: 'Faro'}];

        const result = processData(duplicateData, distritosMap);

        expect(result.municipalityMap.get('03')).toHaveLength(1);
        expect(result.parishMap.get('0301')).toHaveLength(1);
    });

    it('returns empty structures if input data is empty', () => {
        const result = processData([], []);
        expect(result.districts).toEqual([]);
        expect(result.municipalityMap.size).toBe(0);
        expect(result.parishMap.size).toBe(0);
    });
});