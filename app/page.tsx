import { Metadata } from 'next'
import { charactersService } from '@/services/charactersService'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/homepage/HeroSection'
import CharacterSpotlight from '@/components/homepage/CharacterSpotlight'
import CommunityShowcase from '@/components/homepage/CommunityShowcase'
import LookbookPreview from '@/components/homepage/LookbookPreview'
import InteractiveQuiz from '@/components/homepage/InteractiveQuiz'
import SocialProofMetrics from '@/components/homepage/SocialProofMetrics'

export const metadata: Metadata = {
  title: 'Fruits From Da Hood | Premium Streetwear',
  description: 'Discover premium streetwear inspired by urban culture. Shop unique designs and join the Fruits From Da Hood movement.',
  openGraph: {
    title: 'Fruits From Da Hood | Premium Streetwear',
    description: 'Discover premium streetwear inspired by urban culture. Shop unique designs and join the Fruits From Da Hood movement.',
    images: ['/assets/images/og-image.jpg'],
  },
}

async function getCharacters() {
  try {
    const characters = await charactersService.getCharacters()
    return characters
  } catch (error) {
    console.error('Error fetching characters:', error)
    return []
  }
}

// Enable ISR with 60 second revalidation
export const revalidate = 60;

export default async function HomePage() {
  const characters = await getCharacters()

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <HeroSection />
      <CharacterSpotlight characters={characters} />
      <CommunityShowcase />
      <LookbookPreview />
      <InteractiveQuiz />
      <SocialProofMetrics />
    </div>
  )
}
