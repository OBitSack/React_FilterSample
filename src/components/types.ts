// types.ts
export interface SearchParams {
  [key: string]: string | string[] | boolean | boolean[] | undefined
}

export interface Option {
  label: string
  value: string | boolean
}

export interface DataTableFilterField<TData> {
  label: string
  value: keyof TData
  component?: (props: Option) => JSX.Element | null
  options?: Option[]
}
