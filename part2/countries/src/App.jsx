import { useState, useEffect } from 'react'
import axios from 'axios'
import CountryList from './components/CountryList'
import CountryDetails from './components/CountryDetails'

const App = () => {
  const [search, setSearch] = useState('')
  const [countries, setCountries] = useState([])
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then((response) => setCountries(response.data))
  }, [])

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
    setSelected(null)
  }

  const matches = search
    ? countries.filter((country) =>
        country.name.common.toLowerCase().includes(search.toLowerCase())
      )
    : []

  let content = null
  if (selected) {
    content = <CountryDetails country={selected} />
  } else if (matches.length === 1) {
    content = <CountryDetails country={matches[0]} />
  } else if (matches.length > 0) {
    content = <CountryList countries={matches} onShow={setSelected} />
  }

  return (
    <div>
      <div>
        find countries{' '}
        <input value={search} onChange={handleSearchChange} />
      </div>
      {content}
    </div>
  )
}

export default App
