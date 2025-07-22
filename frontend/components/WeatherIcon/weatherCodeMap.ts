import { IconDefinition, faCloud, faCloudBolt, faCloudRain, faCloudShowersHeavy, faCloudSun, faCloudSunRain, faSmog, faSnowflake, faSun } from '@fortawesome/free-solid-svg-icons';

export const weatherCodeMap: Record<number, { icon: IconDefinition }> = {
    0: {
        icon: faSun,
    },
    1: {
        icon: faSun,
    },
    2: {
        icon: faCloudSun,
    },
    3: {
        icon: faCloud,
    },
    45: {
        icon: faSmog,
    },
    48: {
        icon: faSmog,
    },
    51: {
        icon: faCloudSunRain,
    },
    53: {
        icon: faCloudSunRain,
    },
    55: {
        icon: faCloudRain,
    },
    56: {
        icon: faCloudRain,
    },
    57: {
        icon: faCloudRain,
    },
    61: {
        icon: faCloudSunRain,
    },
    63: {
        icon: faCloudRain,
    },
    65: {
        icon: faCloudShowersHeavy,
    },
    66: {
        icon: faCloudRain,
    },
    67: {
        icon: faCloudRain,
    },
    71: {
        icon: faSnowflake,
    },
    73: {
        icon: faSnowflake,
    },
    75: {
        icon: faSnowflake,
    },
    77: {
        icon: faSnowflake,
    },
    80: {
        icon: faCloudRain,
    },
    81: {
        icon: faCloudRain,
    },
    82: {
        icon: faCloudRain,
    },
    85: {
        icon: faCloudRain,
    },
    86: {
        icon: faSnowflake,
    },
    95: {
        icon: faCloudBolt,
    },
    96: {
        icon: faCloudBolt,
    },
    99: {
        icon: faCloudBolt,
    },
};
