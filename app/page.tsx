import { Metadata } from 'next'
import { charactersService } from '../src/services/charactersService'
import Navbar from '../src/components/Navbar'
import HeroSection from '../src/components/homepage/HeroSection'
import CharacterSpotlight from '../src/components/homepage/CharacterSpotlight'
import CommunityShowcase from '../src/components/homepage/CommunityShowcase'
import LookbookPreview from '../src/components/homepage/LookbookPreview'
import InteractiveQuiz from '../src/components/homepage/InteractiveQuiz'
import SocialProofMetrics from '../src/components/homepage/SocialProofMetrics'

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
