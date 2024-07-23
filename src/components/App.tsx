import React, { useState } from 'react'
import Filter from './Filter'
import DataTable from './DataTable'
import Pagination from './Pagination'
import { data, filterFields } from './data'
import { Schema } from './schema'
import { SearchParams } from './types'

const App: React.FC = () => {
  const [filters, setFilters] = useState<SearchParams>({})
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [rowsPerPage, setRowsPerPage] = useState<number>(5)

  const handleFilterChange = (field: keyof Schema, value: any) => {
    setFilters((prev) => {
      const updatedFilters = { ...prev }
      if (Array.isArray(updatedFilters[field])) {
        const newValue = updatedFilters[field]?.includes(value)
          ? updatedFilters[field].filter((v: any) => v !== value)
          : [...(updatedFilters[field] || []), value]
        updatedFilters[field] = newValue.length ? newValue : undefined
      } else {
        updatedFilters[field] = value
      }
      console.log('Updated Filters:', updatedFilters)
      return updatedFilters
    })
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const filteredData = data
    .filter((item) => {
      return Object.keys(filters).every((key) => {
        const filterValue = filters[key]
        console.log('Filtering item:', item, 'with filter:', key, filterValue)
        if (filterValue === undefined || filterValue === null) {
          return true // No filter applied, show all data
        }
        if (Array.isArray(filterValue)) {
          if (Array.isArray(item[key as keyof Schema])) {
            return filterValue.some((val) =>
              (item[key as keyof Schema] as string[]).includes(val as string)
            )
          }
          return filterValue.includes(item[key as keyof Schema])
        }
        if (typeof filterValue === 'boolean') {
          return item[key as keyof Schema] === filterValue
        }
        if (Array.isArray(item[key as keyof Schema])) {
          return (item[key as keyof Schema] as string[]).includes(
            filterValue as string
          )
        }
        return item[key as keyof Schema] === filterValue
      })
    })
    .filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

  const totalRows = filteredData.length
  const totalPages = Math.ceil(totalRows / rowsPerPage)
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  )

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
      <div className="w-2/3 p-4 bg-white shadow-md rounded-lg">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          className="mb-4 p-2 border border-gray-300 rounded w-full"
          placeholder="Search..."
        />
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
