import React, { useState, useEffect } from 'react'
import { DataTableFilterField, Option } from '../types'
import { Schema } from '../schema'
import { SearchParams } from '../types'

interface FilterProps {
  fields: DataTableFilterField<Schema>[]
  onChange: (field: keyof Schema, value: any) => void
  data: Schema[]
  selectedFilters: SearchParams
}

const Filter: React.FC<FilterProps> = ({
  fields,
  onChange,
  data,
  selectedFilters
}) => {
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >(
    fields.reduce(
      (acc, field) => ({ ...acc, [field.value as string]: true }),
      {}
    )
  )
  const [optionCounts, setOptionCounts] = useState<
    Record<string, Record<string, number>>
  >({})

  useEffect(() => {
    const newOptionCounts = fields.reduce(
      (acc, field) => {
        const counts =
          field.options?.reduce(
            (optionAcc, option) => {
              const optionValue = String(option.value) // Convert to string to ensure keys are consistent

              // Check if the field is an array field
              if (Array.isArray(data[0][field.value])) {
                optionAcc[optionValue] = data.filter(
                  (item) =>
                    Array.isArray(item[field.value as keyof Schema]) &&
                    (item[field.value as keyof Schema] as string[]).includes(
                      option.value as string
                    )
                ).length
              } else {
                optionAcc[optionValue] = data.filter(
                  (item) => item[field.value as keyof Schema] === option.value
                ).length
              }
              return optionAcc
            },
            {} as Record<string, number>
          ) || {}
        acc[field.value as string] = counts
        return acc
      },
      {} as Record<string, Record<string, number>>
    )
    setOptionCounts(newOptionCounts)
  }, [fields, data])

  const handleChange = (field: keyof Schema, value: any) => {
    onChange(field, value)
  }

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category]
    }))
  }

  const clearSelection = (field: keyof Schema) => {
    onChange(field, undefined)
  }
  return (
    <div>
      {fields.map((field) => (
        <div key={field.value as string} className="mb-4">
          <div
            className="cursor-pointer text-lg font-semibold text-gray-700 mb-2 flex justify-between items-center"
            onClick={() => toggleCategory(field.value as string)}
          >
            {field.label}
            <span className="text-gray-500">
              {expandedCategories[field.value as string] ? '-' : '+'}
            </span>
          </div>
          <div
            className={`pl-4 overflow-hidden transition-max-height duration-300 ease-in-out ${
              expandedCategories[field.value as string]
                ? 'max-h-screen'
                : 'max-h-0'
            }`}
          >
            {expandedCategories[field.value as string] &&
              field.options?.map((option) => (
                <label
                  key={option.value as string}
                  className="flex items-center mb-2"
                >
                  <input
                    type="checkbox"
                    onChange={(e) => handleChange(field.value, option.value)}
                    className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                  />
                  <span className="ml-2 text-gray-600">
                    {option.label} (
                    {optionCounts[field.value as string]?.[
                      String(option.value)
                    ] ?? 0}
                    )
                  </span>
                  {field.component && (
                    <span className="ml-2">{field.component(option)}</span>
                  )}
                </label>
              ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default Filter
