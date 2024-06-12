import axios from 'axios'

const baseURL = 'https://studies.cs.helsinki.fi/restcountries/'
const localhostURL = `http://localhost:3001/countries`

const getCountryList = async () => {
    //const request = axios.get(`${baseURL}/api/all`)
    try {
        let response = await axios.get(localhostURL);
        let countriesData = response.data;
        const countryNames = countriesData.flatMap(country => [country.name.common, country.name.official]);
        return countryNames;
    } catch (error) {
        console.log("error fetching countries from api: ", error);
        return [];
    }
}

export default { getCountryList }