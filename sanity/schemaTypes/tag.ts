import {TagIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const tagType = defineType({
  name: 'tag',
  title: 'Emotion Tag',
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
      name: 'emoji',
      type: 'string',
      validation: (Rule) => Rule.required().max(2),
    }),
    defineField({
      name: 'color',
      type: 'string',
      description: 'Hex color code',
    }),
    defineField({
      name: 'label',
      type: 'string',
    }),
    defineField({
      name: 'description',
      type: 'text',
    }),
  ],
  preview: {
    select: {
      name: 'name',
      emoji: 'emoji',
    },
    prepare({ name, emoji }) {
      return {
        title: `${emoji} ${name}`,
      }
    },
  },
})

