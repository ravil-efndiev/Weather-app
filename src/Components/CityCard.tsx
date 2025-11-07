import { useGlobalData, type WeatherData } from '@/globalData';

interface Props {
  cityName: string;
  weather: WeatherData;
} 

function CityCard({ cityName, weather }: Props) {
  const { globalData } = useGlobalData();
  
  return (
    <div>
      <h2>{cityName}</h2>
      <p>Temperature: {weather.temperature}°{globalData.temperatureUnit}</p>
      <p>Humidity: {weather.humidity}%</p>
      <p>Wind Speed: {weather.windSpeed} m/s</p>
    </div>
  )
}

export default CityCard;
