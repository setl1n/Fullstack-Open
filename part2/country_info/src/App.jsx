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

    let queryResults = countries.filter(countryName => countryName.includes(newSearchQuery));
    console.log("countries that match with new query: ", queryResults);
    setCountriesToShow(queryResults);
  })

  return (
    <div>
      <form>
        find countries
        <input value={searchQuery} onChange={handleQueryChange} />
      </form>
      <div>
        {(() => {
          if (countriesToShow.length > 10) {
            return <div>Too many matches, specify another filter</div>
          } else {
            return countriesToShow.map((country, index) => <div key={index}>{country}</div>);
          }
        })()}
      </div>
    </div>
  )
}

export default App