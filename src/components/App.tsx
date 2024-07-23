// App.tsx
import React, { useState, useRef, useEffect } from 'react'
import Filter from './Filter'
import DataTable from './DataTable'
import Pagination from './Pagination'
import { data, filterFields } from './data'
import { Schema } from './schema'
import { SearchParams } from './types'

// Function to extract unique values from the data for a given field
const getUniqueValues = (field: keyof Schema) => {
  const values = data
    .map((item) => item[field])
    .flat()
    .filter((value, index, self) => self.indexOf(value) === index)
  return values
}

const App: React.FC = () => {
  const [filters, setFilters] = useState<SearchParams>({})
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [rowsPerPage, setRowsPerPage] = useState<number>(5)
  const [isFocused, setIsFocused] = useState<boolean>(false)
  const [selectedOption, setSelectedOption] = useState<any>(null)
  const [filteredData, setFilteredData] = useState<Schema[]>([])
  const searchInputRef = useRef<HTMLInputElement>(null)
  const categoryOptions: {
    [key: string]: (string | boolean)[]
  } = {
    Public: ['true', 'false'],
    Active: ['true', 'false'],
    'School Level': getUniqueValues('regions'),
    'Subject Area': getUniqueValues('tags')
  }

  const handleSearchChange = (e: any) => {
    setSearchQuery(e.target.value)
  }
  const handleFilterChange = (field: keyof Schema, value: any) => {
    setFilters((prev) => {
      const updatedFilters: any = { ...prev }
      const fieldValue = updatedFilters[field]

      if (Array.isArray(fieldValue)) {
        if (fieldValue.includes(value)) {
          updatedFilters[field] = fieldValue.filter((v) => v !== value)
          if ((updatedFilters[field] as (string | boolean)[]).length === 0) {
            delete updatedFilters[field]
          }
        } else {
          updatedFilters[field] = [...fieldValue, value]
        }
      } else if (fieldValue === undefined || fieldValue === null) {
        updatedFilters[field] = [value]
      } else {
        updatedFilters[field] = [value]
      }

      return updatedFilters
    })

    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }

  const clearFilter = (key: keyof Schema) => {
    setFilters((prev) => {
      const updatedFilters = { ...prev }
      delete updatedFilters[key]
      return updatedFilters
    })
  }
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const filterEntries = Object.entries(filters)
    if (e.key === 'Backspace' && filterEntries.length) {
      if (filterEntries.length > 0) {
        const [lastFilterKey] = filterEntries[filterEntries.length - 1]
        clearFilter(lastFilterKey as keyof Schema)
        setSelectedOption(null)
        setIsFocused(true) // Show the category dropdown menu
      }
    }
    console.log('FILTERED', filterEntries)
  }
  const fetchFilteredData = async () => {
    const result = await new Promise<Schema[]>((resolve) => {
      const filtered = data
        .filter((item) => {
          return Object.keys(filters).every((key) => {
            const filterValue = filters[key]
            const itemValue = item[key as keyof Schema]

            if (filterValue === undefined || filterValue === null) {
              return true // No filter applied, show all data
            }

            if (Array.isArray(filterValue)) {
              if (Array.isArray(itemValue)) {
                return (itemValue as (string | boolean)[]).some((val) =>
                  (filterValue as (string | boolean)[]).includes(val)
                )
              }
              return (filterValue as (string | boolean)[]).includes(
                itemValue as string | boolean
              )
            }

            if (typeof filterValue === 'boolean') {
              return itemValue === filterValue
            }

            if (typeof filterValue === 'string') {
              return itemValue === filterValue
            }

            return false
          })
        })
        .filter((item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      resolve(filtered)
    })
    setFilteredData(result)
  }

  useEffect(() => {
    fetchFilteredData()
  }, [filters, searchQuery])

  const totalRows = filteredData.length
  const totalPages = Math.ceil(totalRows / rowsPerPage)
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  )

  const handleOptionClick = (option: string) => {
    setSelectedOption(option)
    setIsFocused(false)
  }
  const handleSubOptionClick = (subOption: string | boolean) => {
    if (selectedOption) {
      const value =
        subOption === 'true' ? true : subOption === 'false' ? false : subOption
      handleFilterChange(
        selectedOption.toLowerCase().replace(' ', '_') as keyof Schema,
        value
      )
    }
    setSelectedOption(null)
    setIsFocused(true) // Keep focus on the input field
  }
  const selectedFiltersString = Object.entries(filters)
    .map(
      ([key, value]) =>
        `${key}: ${Array.isArray(value) ? value.join(', ') : value}`
    )
    .join(', ')

  return (
    <div className="flex min-h-screen bg-gray-100 p-6">
      <div className="w-1/3 p-4 bg-white shadow-md rounded-lg mr-4">
        <Filter
          fields={filterFields}
          onChange={handleFilterChange}
          data={data}
          selectedFilters={filters}
        />
      </div>
      <div className="w-2/3 p-4 bg-white shadow-md rounded-lg relative">
        <div className="relative">
          <input
            ref={searchInputRef}
            type="text"
            value={selectedFiltersString}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown} // Added this line
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 100)} // Delay to allow click
            className="mb-4 p-2 border border-gray-300 rounded w-full"
            placeholder="Search..."
          />
          {isFocused && !selectedOption && (
            <div className="absolute z-10 bg-white border border-gray-300 rounded mt-1 w-full">
              {Object.keys(categoryOptions).map((option) => (
                <div
                  key={option}
                  onClick={() => handleOptionClick(option)}
                  className="cursor-pointer p-2 hover:bg-gray-100"
                >
                  {option}
                </div>
              ))}
            </div>
          )}
          {selectedOption && (
            <div className="absolute z-10 bg-white border border-gray-300 rounded mt-1 w-full transition transition-all duration-300">
              {categoryOptions[selectedOption].map(
                (subOption: string | boolean) => (
                  <div
                    key={subOption.toString()}
                    onClick={() => handleSubOptionClick(subOption.toString())}
                    className="cursor-pointer p-2 hover:bg-gray-100"
                  >
                    {subOption}
                  </div>
                )
              )}
            </div>
          )}
        </div>
        <DataTable data={paginatedData} />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          rowsPerPage={rowsPerPage}
          totalRows={totalRows}
          onPageChange={setCurrentPage}
          onRowsPerPageChange={(rows) => {
            setRowsPerPage(rows)
            setCurrentPage(1) // Reset to first page on rows per page change
          }}
        />
      </div>
    </div>
  )
}

export default App
