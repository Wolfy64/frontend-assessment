import React, { useState } from 'react'
import './App.css'
import countries, { Country } from './countries'

type CountryStringKeys<T> = {
  [K in keyof T]: T[K] extends string ? K : never
}[keyof T]

type CountryNumberKeys<T> = {
  [K in keyof T]: T[K] extends number ? K : never
}[keyof T]

const NEXT_TYPE_OF_SORT = {
  none: {
    value: 'none',
    next: 'ascending',
  },
  ascending: {
    value: 'ascending',
    next: 'descending',
  },
  descending: {
    value: 'descending',
    next: 'none',
  },
} as const


function App() {
  const [countryList, setCountryList] = useState(countries)
  const [currentColumn, setCurrentColumn] = useState('')
  const [sortedBy, setSortedBy] = useState<'none' | 'ascending' | 'descending'>(
    'none'
  )

  const sortColumn = (
    event: React.MouseEvent<HTMLTableCellElement, MouseEvent>
  ) => {
    const { id } = event.target as HTMLTableCellElement
    const nextSort =
      id === currentColumn
        ? NEXT_TYPE_OF_SORT[sortedBy].next
        : NEXT_TYPE_OF_SORT.ascending.value

    switch (nextSort) {
      case 'ascending':
        const sortedAsc = [...countryList].sort((a, b) => {
          return typeof a[id as CountryStringKeys<Country>] === 'string'
            ? a[id as CountryStringKeys<Country>].localeCompare(
                b[id as CountryStringKeys<Country>]
              )
            : a[id as CountryNumberKeys<Country>] -
                b[id as CountryNumberKeys<Country>]
        })
        setCountryList(sortedAsc)
        break

      case 'descending':
        const sortedDes = [...countryList].sort((a, b) => {
          return typeof a[id as CountryStringKeys<Country>] === 'string'
            ? b[id as CountryStringKeys<Country>].localeCompare(
                a[id as CountryStringKeys<Country>]
              )
            : b[id as CountryNumberKeys<Country>] -
                a[id as CountryNumberKeys<Country>]
        })
        setCountryList(sortedDes)
        break
      case 'none':
        setCountryList([...countries])
        break
    }

    setCurrentColumn(id)
    setSortedBy(nextSort)
  }

  const rows = countryList.map(
    ({ country, population, deaths, recovered, lat, lng }, index) => {
      return (
        <tr key={`${index}::${country}`}>
          <td>{country}</td>
          <td>{population}</td>
          <td>{deaths}</td>
          <td>{recovered}</td>
          <td>{lat}</td>
          <td>{lng}</td>
        </tr>
      )
    }
  )

  const icon = {
    none: '',
    ascending: '▲',
    descending: '▼',
  }[sortedBy]

  return (
    <table>
      <thead>
        <tr>
          <th id="country" onClick={sortColumn}>
            Country {currentColumn === 'country' ? icon : ''}
          </th>
          <th id="population" onClick={sortColumn}>
            Population {currentColumn === 'population' ? icon : ''}
          </th>
          <th id="deaths" onClick={sortColumn}>
            Deaths {currentColumn === 'deaths' ? icon : ''}
          </th>
          <th id="recovered" onClick={sortColumn}>
            Recovered {currentColumn === 'recovered' ? icon : ''}
          </th>
          <th id="lat" onClick={sortColumn}>
            Lat. {currentColumn === 'lat' ? icon : ''}
          </th>
          <th id="lng" onClick={sortColumn}>
            Lng. {currentColumn === 'lng' ? icon : ''}
          </th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  )
}

export default App
