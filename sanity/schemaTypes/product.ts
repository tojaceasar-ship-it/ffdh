import {TagIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const productType = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'name' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'text',
    }),
    defineField({
      name: 'priceEUR',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'imageUrl',
      type: 'url',
      title: 'Image URL',
    }),
    defineField({
      name: 'image',
      type: 'image',
      options: { hotspot: true },
      title: 'Image (Sanity)',
    }),
    defineField({
      name: 'isLimited',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'stock',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'printfulVariantId',
      type: 'string',
      title: 'Printful Variant ID',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [], // Free-form tags, no predefined list
      },
    } as any),
    defineField({
      name: 'status',
      type: 'string',
      options: {
        list: [
          { title: 'Active', value: 'active' },
          { title: 'Draft', value: 'draft' },
          { title: 'Archived', value: 'archived' },
        ],
      },
      initialValue: 'active',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image',
      price: 'priceEUR',
    },
    prepare({ title, media, price }) {
      return {
        title,
        media,
        subtitle: price ? `€${price}` : 'No price',
      }
    },
  },
})

