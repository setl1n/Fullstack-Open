import axios from 'axios'

const baseURL = 'https://studies.cs.helsinki.fi/restcountries/'
const localhostURL = `http://localhost:3001/countries`

const getCountryList = async () => {
    try {
        let response = await axios.get(localhostURL);
        let countriesData = response.data;
        const countryNames = countriesData.map(country => [country.name.common,country.name.official]);
        return countryNames;
    } catch (error) {
        console.log("error fetching countries from api: ", error);
        return [];
    }
}

const getCountryInfo = async (countryName) => {
    try {
        let response = await axios.get(`${baseURL}/api/name/${countryName}`);
        return response.data;
    } catch (error) {
        console.log("error fetching country info from api: ", error);
        return "could not get country data";
    }
}

export default { getCountryList, getCountryInfo }