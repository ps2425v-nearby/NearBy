/**
 * Represents a crime statistic entry for a specific city.
 */
export type CrimeType = {
    city: string;   // Name of the city
    type: string;   // Type/category of the crime
    valor: number;  // Numeric value representing crime data (e.g., count or rate)
};
