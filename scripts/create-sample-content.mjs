#!/usr/bin/env node

/**
 * FFDH CMS Content Creation Script
 *
 * This script creates sample content for the FFDH Sanity CMS.
 * Run this from the Sanity Studio or use the API with proper permissions.
 */

export const sampleManifest = {
  _id: 'manifest-singleton',
  _type: 'manifest',
  title: 'FFDH Manifest',
  content: [
    {
      _type: 'block',
      children: [
        {
          _type: 'span',
          text: 'Fruits From Da Hood (FFDH) is more than just a streetwear brand. We are a movement that celebrates authentic urban culture, emotional intelligence, and creative expression through fashion and technology.',
        },
      ],
    },
    {
      _type: 'block',
      children: [
        {
          _type: 'span',
          text: 'Founded in 2025, we combine traditional streetwear aesthetics with cutting-edge AI technology. Our signature Rewir system analyzes emotions and generates unique artistic scenes that tell the stories of urban life.',
        },
      ],
    },
    {
      _type: 'block',
      children: [
        {
          _type: 'span',
          marks: ['strong'],
          text: 'Our Mission:',
        },
      ],
    },
    {
      _type: 'block',
      children: [
        {
          _type: 'span',
          text: 'To bridge the gap between technology and human emotion, creating fashion that not only looks good but tells meaningful stories.',
        },
      ],
    },
    {
      _type: 'block',
      children: [
        {
          _type: 'span',
          marks: ['strong'],
          text: 'Our Values:',
        },
      ],
    },
    {
      _type: 'block',
      children: [
        {
          _type: 'span',
          marks: ['strong'],
          text: 'Authenticity, Innovation, Community, Emotional Intelligence',
        },
      ],
    },
  ],
}

export const sampleScenes = [
  {
    _type: 'scene',
    title: 'Urban Serenity',
    slug: { _type: 'slug', current: 'urban-serenity' },
    description: 'A peaceful moment in the bustling city',
    emotion_tags: ['peace', 'nostalgia'],
    content: [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'Finding peace amidst urban chaos - the quiet moments that define city life.',
          },
        ],
      },
    ],
    featured: true,
    publishedAt: new Date().toISOString(),
  },
  {
    _type: 'scene',
    title: 'Street Dreams',
    slug: { _type: 'slug', current: 'street-dreams' },
    description: 'Chasing aspirations on city streets',
    emotion_tags: ['joy', 'curiosity'],
    content: [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'The vibrant energy of urban ambition - dreams taking shape on concrete canvases.',
          },
        ],
      },
    ],
    featured: true,
    publishedAt: new Date().toISOString(),
  },
  {
    _type: 'scene',
    title: 'Night Reflections',
    slug: { _type: 'slug', current: 'night-reflections' },
    description: 'Contemplating life under city lights',
    emotion_tags: ['peace', 'nostalgia'],
    content: [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'Finding meaning in the urban night - reflections under neon glow.',
          },
        ],
      },
    ],
    featured: false,
    publishedAt: new Date().toISOString(),
  },
  {
    _type: 'scene',
    title: 'Dawn Awakening',
    slug: { _type: 'slug', current: 'dawn-awakening' },
    description: 'New beginnings in the waking city',
    emotion_tags: ['joy', 'hope'],
    content: [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'The city awakening - fresh possibilities born with each sunrise.',
          },
        ],
      },
    ],
    featured: false,
    publishedAt: new Date().toISOString(),
  },
]

export const sampleProducts = [
  {
    _type: 'product',
    name: 'Banana Man Tee',
    slug: { _type: 'slug', current: 'banana-man-tee' },
    description: 'Classic streetwear tee featuring our signature banana character design. Made from premium cotton with a comfortable fit.',
    price_eur: 29.99,
    image_url: '/assets/images/banana-man-tee.jpg',
    is_limited: true,
    stock: 50,
    printful_variant_id: 'banana-man-tee-variant-1',
    tags: ['streetwear', 'classic', 'limited', 'cotton'],
    status: 'active',
  },
  {
    _type: 'product',
    name: 'Urban Fruit Hoodie',
    slug: { _type: 'slug', current: 'urban-fruit-hoodie' },
    description: 'Premium hoodie with urban fruit motifs and emotional AI patterns. Features kangaroo pocket and adjustable drawstring.',
    price_eur: 79.99,
    image_url: '/assets/images/urban-fruit-hoodie.jpg',
    is_limited: false,
    stock: 100,
    printful_variant_id: 'urban-fruit-hoodie-variant-1',
    tags: ['streetwear', 'premium', 'emotional', 'hoodie'],
    status: 'active',
  },
  {
    _type: 'product',
    name: 'Rewir Scene Cap',
    slug: { _type: 'slug', current: 'rewir-scene-cap' },
    description: 'Adjustable cap featuring AI-generated emotional scene designs. Structured crown with curved visor.',
    price_eur: 34.99,
    image_url: '/assets/images/rewir-scene-cap.jpg',
    is_limited: true,
    stock: 25,
    printful_variant_id: 'rewir-scene-cap-variant-1',
    tags: ['accessories', 'ai-generated', 'limited', 'cap'],
    status: 'active',
  },
  {
    _type: 'product',
    name: 'Emotional Layers Tank',
    slug: { _type: 'slug', current: 'emotional-layers-tank' },
    description: 'Layered tank top with emotional gradient designs. Perfect for layering or standalone wear.',
    price_eur: 24.99,
    image_url: '/assets/images/emotional-layers-tank.jpg',
    is_limited: false,
    stock: 75,
    printful_variant_id: 'emotional-layers-tank-variant-1',
    tags: ['streetwear', 'layering', 'emotional', 'tank'],
    status: 'active',
  },
]

export const samplePosts = [
  {
    _type: 'post',
    title: 'Introducing Rewir: AI Emotional Scene Generation',
    slug: { _type: 'slug', current: 'introducing-rewir-ai-emotional-scenes' },
    author: { _type: 'reference', _ref: 'author-placeholder' },
    mainImage: {
      _type: 'image',
      asset: { _type: 'reference', _ref: 'image-placeholder-1' },
      alt: 'Rewir AI interface showing emotional scene generation',
    },
    categories: [
      { _type: 'reference', _ref: 'category-ai' },
      { _type: 'reference', _ref: 'category-innovation' },
    ],
    publishedAt: new Date().toISOString(),
    body: [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'Today we launch Rewir, our revolutionary AI system that generates emotional scenes based on user feelings and urban experiences.',
          },
        ],
      },
    ],
  },
]

// Export all sample data
export const sampleData = {
  manifest: sampleManifest,
  scenes: sampleScenes,
  products: sampleProducts,
  posts: samplePosts,
}

console.log('📋 FFDH Sample Content Data Exported')
console.log('Use this data to populate Sanity CMS through the Studio interface')
console.log('Or run with proper API permissions for automated population')

export default sampleData
