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
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)

  type FilterSchema = {
    [K in keyof Schema]?: Schema[K] extends (infer U)[] ? U[] : Schema[K]
  }

  const handleFilterChange = (field: keyof Schema, value: any) => {
    setFilters((prev) => {
      const updatedFilters: FilterSchema = { ...prev }
      if (Array.isArray(updatedFilters[field])) {
        const currentField = updatedFilters[field] as any[]
        const newValue = currentField?.includes(value)
          ? currentField.filter((v) => v !== value)
          : [...(currentField || []), value]
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
    .filter((item: any) => {
      return Object.keys(filters).every((key) => {
        const filterKey = key as keyof Schema
        const filterValue = filters[filterKey]

        console.log(
          'Filtering item:',
          item,
          'with filter:',
          filterKey,
          filterValue
        )

        if (filterValue === undefined || filterValue === null) {
          return true // No filter applied, show all data
        }
        if (Array.isArray(filterValue)) {
          if (Array.isArray(item[filterKey])) {
            return filterValue.some((val) =>
              (item[filterKey] as (string | boolean | number)[]).includes(val)
            )
          }
          return (filterValue as (string | boolean | number)[]).includes(
            item[filterKey] as string | boolean | number
          )
        }
        if (typeof filterValue === 'boolean') {
          return item[filterKey] === filterValue
        }
        if (Array.isArray(item[filterKey])) {
          return (item[filterKey] as string[]).includes(filterValue as string)
        }
        return item[filterKey] === filterValue
      })
    })
    .filter((item: any) =>
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
        <div className="flex items-center justify-between">
          <div>
            {filteredData.length} of {data.length} row(s) filtered
          </div>
          <div className="w-1/2">
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
      </div>
    </div>
  )
}

export default App
