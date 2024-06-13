import { useState, useEffect } from 'react'
import restcountryapi from './services/restcountryapi'
import CountryInfo from './componenets/CountryInfo'

const App = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [countriesToShow, setCountriesToShow] = useState([])
  const [countries, setCountries] = useState([])

  useEffect(() => {
    console.log("getting list of countries from local json server");

    let fetchCountryList = async () => {
      let countryList = await restcountryapi.getCountryList();
      console.log("processed country list from local json server:", countryList);
      setCountries(countryList);
    }
    fetchCountryList();
  }, [])


  const handleQueryChange = ((event) => {
    let newSearchQuery = event.target.value;
    setSearchQuery(newSearchQuery);

    // clean up code please
    let queryResults = countries.filter(country => country.find(name => name.toLowerCase().includes(newSearchQuery.toLowerCase())))
      .map(foundCountry => foundCountry[0]);
    console.log("countries that match with new query: ", queryResults);
    setCountriesToShow(queryResults);
  })


  return (
    <div>
      <form>
        find countries
        <input value={searchQuery} onChange={handleQueryChange} />
      </form>
      <CountryInfo countriesToShow={countriesToShow} />
    </div>
  )
}

export default App