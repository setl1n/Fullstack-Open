import { useState, useEffect } from 'react'
import countryInfoServices from './services/restcountryapi'

const App = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [countriesToShow, setCountriesToShow] = useState([])
  const [countries, setCountries] = useState([])

  useEffect(() => {
    console.log("getting list of countries from local json server");

    let fetchCountryList = async () => {
      let countryList = await countryInfoServices.getCountryList();
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
    
    if (queryResults.length === 1) {
      setCountriesToShow(["only 1 found!"]);
    } else if (queryResults.length <= 10) {
      setCountriesToShow(queryResults);
    } else {
      setCountriesToShow(["Too many matches, specify another filter"]);
    }
  })

  return (
    <div>
      <form>
        find countries
        <input value={searchQuery} onChange={handleQueryChange} />
      </form>
      <div>
        {(() => countriesToShow.map((country, index) => <div key={index}>{country}</div>))()}
      </div>
    </div>
  )
}

export default App