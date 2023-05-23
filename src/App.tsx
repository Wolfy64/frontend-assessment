import React, { useState } from 'react'
import './App.css'
import countries, { Country } from './countries'

type SortKeys = keyof typeof NEXT_TYPE_OF_SORT
type CountryKeys = keyof Country

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

const COLUMNS_TO_SHOW: Partial<CountryKeys>[] = [
  'country',
  'population',
  'deaths',
  'recovered',
  'lat',
  'lng',
]

function App() {
  const [countryList, setCountryList] = useState(countries)
  const [currentColumn, setCurrentColumn] = useState<CountryKeys | ''>('')
  const [sortedBy, setSortedBy] = useState<SortKeys>('none')

  const sortColumn = (
    event: React.MouseEvent<HTMLTableCellElement, MouseEvent>
  ) => {
    const id = event.currentTarget.id as CountryKeys
    const nextSort =
      id === currentColumn
        ? NEXT_TYPE_OF_SORT[sortedBy].next
        : NEXT_TYPE_OF_SORT.ascending.value

    const sortedColumn = [...countryList].sort((a, b) => {
      if (!id) return 0
      if (a[id] < b[id]) return nextSort === 'ascending' ? -1 : 1
      if (a[id] > b[id]) return nextSort === 'ascending' ? 1 : -1
      return 0
    })

    setCountryList(nextSort === 'none' ? [...countries] : sortedColumn)
    setCurrentColumn(id)
    setSortedBy(nextSort)
  }

  const columns = COLUMNS_TO_SHOW.map((col, index) => {
    const icon = {
      none: '',
      ascending: '▲',
      descending: '▼',
    }[sortedBy]
    return (
      <th
        key={`${index}::${col}`}
        id={col}
        onClick={sortColumn}
        style={{ textTransform: 'capitalize' }}
      >
        {col} {currentColumn === col ? icon : ''}
      </th>
    )
  })

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

  return (
    <table>
      <thead>
        <tr>{columns}</tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  )
}

export default App
