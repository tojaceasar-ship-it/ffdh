import {CalendarIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const dropType = defineType({
  name: 'drop',
  title: 'Drop',
  type: 'document',
  icon: CalendarIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'text',
    }),
    defineField({
      name: 'image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'startDate',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'endDate',
      type: 'datetime',
    }),
    defineField({
      name: 'isLimited',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'limit',
      type: 'number',
    }),
    defineField({
      name: 'products',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'product' }] }],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image',
    },
  },
})

