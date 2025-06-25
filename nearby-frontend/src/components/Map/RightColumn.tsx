import React from 'react';
import clsx from 'clsx';
import { ParkingSpaceType } from '@/types/parkingSpaceType';
import { Section } from '../Map/RightSections/Section';
import { Weather } from '../Map/RightSections/Weather';
import { Traffic } from '../Map/RightSections/Traffic';
import { Crimes } from '../Map/RightSections/Crimes';
import { Parking } from '../Map/RightSections/Parking';
import { HousingPrices } from '../Map/RightSections/Houses';

interface Crime {
    city: string;
    type: string;
    valor: number;
}

interface RightColumnProps {
    weather: any;
    trafficLevel: string;
    parkingSpaces: ParkingSpaceType[];
    crimes: Crime[];
    housingPrices: number;
    cityNames: string;
    darkMode: boolean;
}
/**
 * RightColumn component displays a comprehensive overview of location-related data including weather, traffic, crimes,
 * parking spaces, and housing prices. It organizes this information into distinct sections for clarity.
 *
 * Props:
 * - weather: Weather data for the selected location.
 * - trafficLevel: Current traffic intensity description.
 * - parkingSpaces: Array of parking space details.
 * - crimes: Array of crime statistics objects.
 * - housingPrices: Average housing prices for the specified city.
 * - cityNames: Name(s) of the city or area shown.
 * - darkMode: Boolean flag to toggle dark/light theme styles.
 *
 * Each section is styled consistently and adapts visually to dark mode. The component uses utility classes
 * and the clsx library to conditionally apply styles.
 *
 * Composed of smaller components: Section, Weather, Traffic, Crimes, Parking, HousingPrices.
 */

export const RightColumn: React.FC<RightColumnProps> = ({
                                                            weather,
                                                            trafficLevel,
                                                            parkingSpaces,
                                                            crimes,
                                                            housingPrices,
                                                            cityNames,
                                                            darkMode,
                                                        }) => (
    <div
        id={"right-column"}
        className={clsx(
            'w-1/2 pl-2 space-y-5 p-4 rounded-xl shadow-lg border',
            darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'
        )}
    >
        <Section title="Meteorologia (Desde ultimo Ano)" darkMode={darkMode}>
            <Weather weather={weather} darkMode={darkMode} />
        </Section>
        <Section title="Traffic" darkMode={darkMode}>
            <Traffic trafficLevel={trafficLevel} darkMode={darkMode} />
        </Section>
        <Section title="Crimes" darkMode={darkMode}>
            <Crimes crimes={crimes} darkMode={darkMode} />
        </Section>
        <Section title="Parking Spaces" darkMode={darkMode}>
            <Parking parkingSpaces={parkingSpaces} darkMode={darkMode} />
        </Section>
        <Section
            title={`Preço das casas(${cityNames || 'Unknown'}) in 2023, source: Habitação.Net`}
            darkMode={darkMode}
        >
            <HousingPrices housingPrices={housingPrices} darkMode={darkMode} />
        </Section>
    </div>
);