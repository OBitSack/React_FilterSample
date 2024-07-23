// DataTable.tsx
import React from 'react'
import { Schema } from '../schema'
import { tagsColor } from '../data'

interface DataTableProps {
  data: Schema[]
}

const DataTable: React.FC<DataTableProps> = ({ data }) => {
  return (
    <table className="min-w-full bg-white border border-gray-300 rounded-lg">
      <thead>
        <tr>
          <th className="py-3 px-4 border-b border-gray-300 text-left">Name</th>
          <th className="py-3 px-4 border-b border-gray-300 text-left">
            Regions
          </th>
          <th className="py-3 px-4 border-b border-gray-300 text-left">Tags</th>
          <th className="py-3 px-4 border-b border-gray-300 text-left">
            Active
          </th>
          <th className="py-3 px-4 border-b border-gray-300 text-left">
            Public
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.name}>
            <td className="py-3 px-4 border-b border-gray-300">{item.name}</td>
            <td className="py-3 px-4 border-b border-gray-300">
              {item.regions.join(', ')}
            </td>
            <td className="py-3 px-4 border-b border-gray-300">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className={`inline-block px-2 py-1 text-xs font-semibold rounded-full mr-2 ${tagsColor[tag].badge}`}
                >
                  {tag}
                </span>
              ))}
            </td>
            <td className="py-3 px-4 border-b border-gray-300">
              {item.active ? '✔️' : '❌'}
            </td>
            <td className="py-3 px-4 border-b border-gray-300">
              {item.public ? '✔️' : '❌'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default DataTable
