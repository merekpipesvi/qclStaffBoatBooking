import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useGetQCLWeatherQuery } from '@/services/weatherApiSlice';
import { weatherCodeMap } from './weatherCodeMap';

export const WeatherIcon = ({
    dateString,
    className,
}:
{
    dateString: string;
    className?: string;
}) => {
    const { data } = useGetQCLWeatherQuery();
    return (
        <FontAwesomeIcon icon={weatherCodeMap[data?.[dateString] ?? 1].icon} size="2xl" className={className} />
    );
};
