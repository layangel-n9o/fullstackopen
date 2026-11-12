const CountryList = ({ countries, onShow }) => {
  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  }

  return (
    <div>
      {countries.map((country) => (
        <p key={country.cca3}>
          {country.name.common}{' '}
          <button onClick={() => onShow(country)}>show</button>
        </p>
      ))}
    </div>
  )
}

export default CountryList
