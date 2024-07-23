// schema.ts
import { z } from 'zod'

const stringToBoolean = z
  .string()
  .toLowerCase()
  .transform((val: string) => {
    try {
      return JSON.parse(val)
    } catch (e) {
      console.log(e)
      return false
    }
  })
  .pipe(z.boolean())

export const schema = z.object({
  name: z.string().optional(),
  public: z.union([z.boolean(), z.boolean().array()]).optional(),
  active: z.union([z.boolean(), z.boolean().array()]).optional(),
  regions: z
    .union([z.enum(['HS', 'MS', 'ES']), z.enum(['HS', 'MS', 'ES']).array()])
    .optional(),
  tags: z
    .union([
      z.enum(['math', 'science', 'literature', 'history']),
      z.enum(['math', 'science', 'literature', 'history']).array()
    ])
    .optional()
})

export type Schema = z.infer<typeof schema>
