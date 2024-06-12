import axios from 'axios'

const baseURL = 'https://studies.cs.helsinki.fi/restcountries/'

const getAll = async () => {
    //const request = axios.get(`${baseURL}/api/all`)
    try {
        let response = await axios.get(`http://localhost:3001/countries`)
        let countriesData = response.data;
        const countryNames = countriesData.flatMap(country => [country.name.common, country.name.official]);
        return countryNames;
    } catch (error) {
        console.log("error fetching countries from api: ", error);
        return [];
    }
}

export default { getAll }