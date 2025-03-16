"use client"

import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, {
    message: "Item name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  price: z.string().refine(
    (val) => {
      const num = Number.parseFloat(val)
      return !isNaN(num) && num > 0
    },
    {
      message: "Price must be a valid number greater than 0",
    },
  ),
  image: z.any().optional(),
})

type MenuItem = z.infer<typeof formSchema> & {
  id: string
  price: string
}

type MenuItemFormProps = {
  onSave: (item: any) => void
  onCancel: () => void
  initialData?: Partial<MenuItem> | null
}

export default function MenuItemForm({ onSave, onCancel, initialData }: MenuItemFormProps) {
  const isEditing = !!initialData

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: initialData?.id || undefined,
      name: initialData?.name || "",
      description: initialData?.description || "",
      price: initialData?.price || "",
      image: initialData?.image || undefined,
    },
  })

  // This effect ensures the form is populated when initialData changes
  useEffect(() => {
    if (initialData) {
      form.reset({
        id: initialData.id,
        name: initialData.name,
        description: initialData.description,
        price: initialData.price,
        image: initialData.image,
      })
    }
  }, [form, initialData])

  function onSubmit(values: z.infer<typeof formSchema>) {
    onSave({
      ...values,
      price: Number.parseFloat(values.price),
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Item Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter item name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe this menu item" className="min-h-[80px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price ($)</FormLabel>
              <FormControl>
                <Input placeholder="0.00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

      

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Item Image {isEditing ? "(Leave unchanged to keep current image)" : "(Optional)"}</FormLabel>
              <FormControl>
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="file"
                    id="itemImage"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        field.onChange(file)
                      }
                    }}
                  />
                  <label htmlFor="itemImage" className="cursor-pointer w-full h-full">
                    {field.value ? (
                      <div className="flex flex-col items-center">
                        <img
                          src={field.value instanceof File ? URL.createObjectURL(field.value) : "/placeholder.svg"}
                          alt="Item preview"
                          className="w-full max-h-[150px] object-contain mb-2"
                        />
                        <p className="text-sm text-muted-foreground">Click to change image</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm font-medium">Click to upload item image</p>
                      </div>
                    )}
                  </label>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">{isEditing ? "Update Item" : "Add Item"}</Button>
        </div>
      </form>
    </Form>
  )
}

