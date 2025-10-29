import React, {useState, useEffect, useRef} from 'react';
import { Search, Droplets, Wind, MapPin, Thermometer, Eye } from 'lucide-react';

function App() {
  const inputRef = useRef();
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleWeatherData = async (city) => {
    if (!city || city.trim() === "") {
      setError("Please enter a city name");
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_API_KEY}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('City not found');
      }
      
      const data = await response.json();
      
      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        feelsLike: Math.floor(data.main.feels_like),
        location: data.name,
        country: data.sys.country,
        condition: data.weather[0].main,
        description: data.weather[0].description,
        pressure: data.main.pressure,
        visibility: data.visibility / 1000, // Convert to km
        icon: data.weather[0].icon
      });
    } catch (error) {
      setError('City not found. Please try again.');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleWeatherData(inputRef.current.value);
    }
  };

  useEffect(() => {
    handleWeatherData("London");
  }, []);

  const getWeatherGradient = (condition) => {
    const conditions = {
      'Clear': 'from-blue-400 to-cyan-500',
      'Clouds': 'from-gray-400 to-blue-300',
      'Rain': 'from-gray-600 to-blue-700',
      'Snow': 'from-blue-200 to-cyan-300',
      'Thunderstorm': 'from-purple-600 to-blue-800',
      'Drizzle': 'from-gray-500 to-blue-600',
      'Mist': 'from-gray-300 to-blue-400',
      'default': 'from-blue-400 to-purple-500'
    };
    return conditions[condition] || conditions.default;
  };

  return (
    <div className={`min-h-screen transition-all duration-500 bg-gradient-to-br ${weatherData ? getWeatherGradient(weatherData.condition) : 'from-blue-400 to-purple-500'} flex items-center justify-center p-4`}>
      <div className="bg-white/20 backdrop-blur-lg rounded-3xl shadow-2xl p-8 max-w-md w-full mx-auto border border-white/30">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white drop-shadow-lg">Weather Forecast</h1>
          <p className="text-white/80 mt-2">Get real-time weather information</p>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex-1 relative">
            <input 
              ref={inputRef}
              type="text" 
              placeholder="Search for a city..." 
              onKeyPress={handleKeyPress}
              className="w-full pl-12 pr-4 py-4 bg-white/90 backdrop-blur-sm rounded-2xl border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent text-gray-800 placeholder-gray-500 transition-all duration-300"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
          <button 
            onClick={() => handleWeatherData(inputRef.current.value)}
            disabled={loading}
            className="bg-white/30 hover:bg-white/40 backdrop-blur-sm text-white p-4 rounded-2xl border border-white/30 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Search className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-white p-4 rounded-2xl mb-6 text-center">
            {error}
          </div>
        )}

        {/* Weather Display */}
        {weatherData && !loading && (
          <div className="space-y-6">
            {/* Location */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-white/90 mb-1">
                <MapPin className="w-5 h-5" />
                <h2 className="text-xl font-semibold">{weatherData.location}, {weatherData.country}</h2>
              </div>
              <p className="text-white/70 capitalize">{weatherData.description}</p>
            </div>

            {/* Temperature */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-4">
                {weatherData.icon && (
                  <img 
                    src={`https://openweathermap.org/img/wn/${weatherData.icon}@4x.png`} 
                    alt={weatherData.condition}
                    className="w-24 h-24 -ml-4"
                  />
                )}
                <div>
                  <div className="text-6xl font-bold text-white drop-shadow-lg">{weatherData.temperature}°</div>
                  <div className="flex items-center justify-center gap-1 text-white/80 mt-1">
                    <Thermometer className="w-4 h-4" />
                    <span>Feels like {weatherData.feelsLike}°</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Weather Stats */}
            <div className="grid grid-cols-2 gap-4">
              {/* Humidity */}
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
                <div className="flex items-center gap-2 text-white/80 mb-2">
                  <Droplets className="w-5 h-5" />
                  <span className="font-medium">Humidity</span>
                </div>
                <div className="text-2xl font-bold text-white">{weatherData.humidity}%</div>
              </div>

              {/* Wind Speed */}
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
                <div className="flex items-center gap-2 text-white/80 mb-2">
                  <Wind className="w-5 h-5" />
                  <span className="font-medium">Wind</span>
                </div>
                <div className="text-2xl font-bold text-white">{weatherData.windSpeed} m/s</div>
              </div>

              {/* Pressure */}
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
                <div className="flex items-center gap-2 text-white/80 mb-2">
                  <Eye className="w-5 h-5" />
                  <span className="font-medium">Pressure</span>
                </div>
                <div className="text-2xl font-bold text-white">{weatherData.pressure} hPa</div>
              </div>

              {/* Visibility */}
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
                <div className="flex items-center gap-2 text-white/80 mb-2">
                  <Eye className="w-5 h-5" />
                  <span className="font-medium">Visibility</span>
                </div>
                <div className="text-2xl font-bold text-white">{weatherData.visibility} km</div>
              </div>
            </div>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && (
          <div className="space-y-6 animate-pulse">
            <div className="h-6 bg-white/30 rounded-2xl w-3/4 mx-auto"></div>
            <div className="h-20 bg-white/30 rounded-2xl"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-20 bg-white/30 rounded-2xl"></div>
              <div className="h-20 bg-white/30 rounded-2xl"></div>
              <div className="h-20 bg-white/30 rounded-2xl"></div>
              <div className="h-20 bg-white/30 rounded-2xl"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;