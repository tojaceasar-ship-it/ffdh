import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'k6imgoqu',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2025-11-01',
  token: process.env.SANITY_AUTH_TOKEN,
})

const manifestContent = {
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
  images: [
    {
      _type: 'image',
      _key: 'hero-image-1',
      asset: {
        _type: 'reference',
        _ref: 'image-Tb9Ew8CXIwaY6R1kjMvI0uY-2000x3000-jpg',
      },
      alt: 'FFDH streetwear collection showcase',
    },
  ],
}

const scenes = [
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
            text: 'Finding peace amidst urban chaos',
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
            text: 'The vibrant energy of urban ambition',
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
            text: 'Finding meaning in the urban night',
          },
        ],
      },
    ],
    publishedAt: new Date().toISOString(),
  },
]

const products = [
  {
    _type: 'product',
    name: 'Banana Man Tee',
    slug: { _type: 'slug', current: 'banana-man-tee' },
    description: 'Classic streetwear tee featuring our signature banana character design',
    price_eur: 29.99,
    image_url: '/assets/images/banana-man-tee.jpg',
    is_limited: true,
    stock: 50,
    printful_variant_id: 'banana-man-tee-variant-1',
    tags: ['streetwear', 'classic', 'limited'],
    status: 'active',
  },
  {
    _type: 'product',
    name: 'Urban Fruit Hoodie',
    slug: { _type: 'slug', current: 'urban-fruit-hoodie' },
    description: 'Premium hoodie with urban fruit motifs and emotional AI patterns',
    price_eur: 79.99,
    image_url: '/assets/images/urban-fruit-hoodie.jpg',
    is_limited: false,
    stock: 100,
    printful_variant_id: 'urban-fruit-hoodie-variant-1',
    tags: ['streetwear', 'premium', 'emotional'],
    status: 'active',
  },
  {
    _type: 'product',
    name: 'Rewir Scene Cap',
    slug: { _type: 'slug', current: 'rewir-scene-cap' },
    description: 'Adjustable cap featuring AI-generated emotional scene designs',
    price_eur: 34.99,
    image_url: '/assets/images/rewir-scene-cap.jpg',
    is_limited: true,
    stock: 25,
    printful_variant_id: 'rewir-scene-cap-variant-1',
    tags: ['accessories', 'ai-generated', 'limited'],
    status: 'active',
  },
]

async function populateCMS() {
  try {
    console.log('🚀 Starting CMS population...')

    // Create manifest
    console.log('📝 Creating manifest...')
    const manifestResult = await client.createOrReplace(manifestContent)
    console.log('✅ Manifest created:', manifestResult._id)

    // Create scenes
    console.log('🎭 Creating scenes...')
    for (const scene of scenes) {
      const sceneResult = await client.create(scene)
      console.log('✅ Scene created:', scene.title, sceneResult._id)
    }

    // Create products
    console.log('🛍️ Creating products...')
    for (const product of products) {
      const productResult = await client.create(product)
      console.log('✅ Product created:', product.name, productResult._id)
    }

    console.log('🎉 CMS population complete!')
    console.log('📊 Summary:')
    console.log('  - 1 Manifest document')
    console.log('  - 3 Scene documents')
    console.log('  - 3 Product documents')
    console.log('  - Total: 7 new documents')

  } catch (error) {
    console.error('❌ Error populating CMS:', error)
    process.exit(1)
  }
}

// Run the population
populateCMS()
