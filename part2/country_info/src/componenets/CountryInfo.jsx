import { useState, useEffect } from 'react'
import restcountryapi from '../services/restcountryapi';
import weatherapi from '../services/weatherapi';

const WeatherInfo = (({ countryName, lat, lng}) => {
    const [weatherInfo, setWeatherInfo] = useState(null);
    
    useEffect(() => {
        let getWeatherInfo = (async (lat, lng) => {
            let weatherInfoFromAPI = await weatherapi.getWeatherInfo(lat, lng);
            console.log("weather info from api: ", weatherInfoFromAPI);
            setWeatherInfo(weatherInfoFromAPI);
        })
        getWeatherInfo(lat, lng);
    }, []);

    if (!weatherInfo) {
        return <></>;
    }

    return <>
    <h2>
        Weather in {countryName}
    </h2>
    <div>temperature {weatherInfo.current.temp} Celcius</div>
    <img src={`https://openweathermap.org/img/wn/${weatherInfo.current.weather[0].icon}@2x.png`}></img>
    <div>wind {weatherInfo.current.wind_speed} </div>
    </>
})

const SpecificCountryInfo = (({ countryName }) => {
    const [countryInfo, setCountryInfo] = useState(null);

    useEffect(() => {
        let fetchCountryInfo = (async (countryName) => {
            let countryInfoFromAPI = await restcountryapi.getCountryInfo(countryName);
            console.log("country info from api: ", countryInfoFromAPI);
            setCountryInfo(countryInfoFromAPI);
        })

        fetchCountryInfo(countryName);
    }, []);
    if (!countryInfo) {
        return <>Loading...</>;
    }

    return <>
        <h1>{countryInfo.name.common}</h1>
        <div>capital {countryInfo.capital[0]}</div>
        <div>area {countryInfo.area}</div>
        <h2>languages:</h2>
        <ul>{Object.values(countryInfo.languages).map((language, index) => <li key={index}>{language}</li>)}</ul>
        <img src={countryInfo.flags.png} alt="Picture of Flag"></img>
        < WeatherInfo countryName={countryInfo.name.common}lat={countryInfo.latlng[0]} lng={countryInfo.latlng[1]}/>
    </>;
})

const CountriesList = (({ countriesToShow, showSpecificCountry}) => {
    let countriesList = countriesToShow.map((country, index) => {
        return <div key={index}>{country[1]} ({country[0]})
            <button onClick={() => showSpecificCountry(country)}>show</button>
        </div>;
    });
    return countriesList;
})

const CountryInfo = (({ countriesToShow, showSpecificCountry }) => {
    if (countriesToShow.length === 1) {
        console.log(countriesToShow);
        return <SpecificCountryInfo countryName={countriesToShow[0][0]} />;
    } else if (countriesToShow.length <= 10) {
        return <CountriesList countriesToShow={countriesToShow} showSpecificCountry={showSpecificCountry}/>;
    } else {
        return <>
            Too many matches, specify another filter
        </>
    }
})

export default CountryInfo