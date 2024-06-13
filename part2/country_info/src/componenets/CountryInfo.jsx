import { useState, useEffect } from 'react'
import restcountryapi from '../services/restcountryapi';

const SpecificCountryInfo = (({ countryName }) => {
    const [countryInfo, setCountryInfo] = useState(null);

    useEffect(() => {
        let fetchCountryInfo = (async (countryName) => {
            let countryInfoFromAPI = await restcountryapi.getCountryInfo(countryName);
            console.log("country info froun api: ", countryInfoFromAPI);
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
    </>;
})

const CountriesList = (({ countriesToShow, showSpecificCountry}) => {
    let countriesList = countriesToShow.map((country, index) => {
        return <div key={index}>{country}
            <button onClick={() => showSpecificCountry(country)}>show</button>
        </div>;
    });
    return countriesList;
})

const CountryInfo = (({ countriesToShow, showSpecificCountry }) => {
    if (countriesToShow.length === 1) {
        return <SpecificCountryInfo countryName={countriesToShow[0]} />;
    } else if (countriesToShow.length <= 10) {
        return <CountriesList countriesToShow={countriesToShow} showSpecificCountry={showSpecificCountry}/>;
    } else {
        return <>
            Too many matches, specify another filter
        </>
    }
})

export default CountryInfo