import Weather from './Weather'

const CountryDetails = ({ country }) => {
  const languages = Object.values(country.languages || {})

  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>capital {country.capital?.[0]}</p>
      <p>area {country.area}</p>

      <h3>languages:</h3>
      <ul>
        {languages.map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>

      <img
        src={country.flags.png}
        alt={country.flags.alt || `Flag of ${country.name.common}`}
        width="160"
      />

      {country.capital?.[0] && <Weather capital={country.capital[0]} />}
    </div>
  )
}

export default CountryDetails
