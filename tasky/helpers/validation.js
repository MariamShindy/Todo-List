import { z } from 'zod'

export const taskSchema = z.object({
  title: z.string().min(1),  // Must have a title
  description: z.string().optional(),
  dueDate: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Invalid date format"
  }),
  priority: z.enum(['1', '2', '3']),
})
