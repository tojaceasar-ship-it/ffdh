import {ImageIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const sceneType = defineType({
  name: 'scene',
  title: 'Emotional Scene',
  type: 'document',
  icon: ImageIcon,
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
      name: 'narrative',
      type: 'text',
      rows: 5,
    }),
    defineField({
      name: 'image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'emotionTags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: ['joy', 'sadness', 'anger', 'peace', 'nostalgia', 'love', 'fear', 'hope'],
      },
    }),
    defineField({
      name: 'dominantEmotion',
      type: 'string',
      options: {
        list: ['joy', 'sadness', 'anger', 'peace', 'nostalgia'],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'source',
      type: 'string',
      options: {
        list: ['supabase', 'sanity', 'auto', 'generated'],
      },
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image',
      emotion: 'dominantEmotion',
    },
    prepare({ title, media, emotion }) {
      return {
        title,
        media,
        subtitle: emotion ? `Emotion: ${emotion}` : 'No emotion',
      }
    },
  },
})

