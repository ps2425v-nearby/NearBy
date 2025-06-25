/**
 * Represents wind and temperature data for a specific period of the day.
 */
type PeriodWindData = {
    temperature: number;  // Temperature in degrees (unit depends on implementation)
    windSpeed: number;    // Wind speed (unit depends on implementation)
};

/**
 * Represents wind and temperature data for different periods of a season.
 */
export type SeasonWindData = {
    season: string;           // Season name (e.g., "Spring", "Summer")
    morning: PeriodWindData;  // Data for the morning period
    afternoon: PeriodWindData;// Data for the afternoon period
    night: PeriodWindData;    // Data for the night period
};

/**
 * Represents wind data for multiple seasons.
 */
export type WindResponse = SeasonWindData[];
