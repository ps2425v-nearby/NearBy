type PeriodWindData = {
    temperature: number;
    windSpeed: number;
};

export type SeasonWindData = {
    season: string;
    morning: PeriodWindData;
    afternoon: PeriodWindData;
    night: PeriodWindData;
};

export type WindResponse = SeasonWindData[];