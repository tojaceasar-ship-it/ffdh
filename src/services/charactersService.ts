import { client } from '../lib/sanity';

interface Character {
  id: number;
  _id?: string;
  name: string;
  nickname?: string;
  personality?: string;
  backstory?: string;
  traits?: string[];
  favoriteSpot?: string;
  signature?: string;
  quote?: string;
  image?: string;
  color?: string;
  bgGradient?: string;
  rarity?: string;
  originDistrict?: string;
  crewRole?: string;
  powerLevel?: number;
}

export const charactersService = {
  getCharacters: async (): Promise<Character[]> => {
    try {
      // Fetch characters from Sanity CMS
      const query = `
        *[_type == "characterProfile" && status == "active"] {
          _id,
          name,
          nickname,
          personality,
          backstory,
          traits,
          favoriteSpot,
          signature,
          quote,
          image,
          color,
          bgGradient,
          rarity,
          originDistrict,
          crewRole,
          powerLevel
        } | order(powerLevel desc)
      `;

      const characters: any[] = await client.fetch(query);

      // Transform Sanity data to match expected format with id
      return characters.map((char: any, index: number): Character => ({
        id: index + 1,
        name: char.name || 'Unknown Character',
        nickname: char.nickname,
        personality: char.personality,
        backstory: char.backstory,
        traits: char.traits,
        favoriteSpot: char.favoriteSpot,
        signature: char.signature,
        quote: char.quote,
        image: char.image,
        color: char.color,
        bgGradient: char.bgGradient,
        rarity: char.rarity,
        originDistrict: char.originDistrict,
        crewRole: char.crewRole,
        powerLevel: char.powerLevel,
      }));
    } catch (error) {
      console.error('Error fetching characters from Sanity:', error);

      // Fallback to hardcoded characters if Sanity fails
      return getHardcodedCharacters();
    }
  },

  getCharacterById: async (id: string): Promise<Character | null> => {
    try {
      const query = `*[_type == "characterProfile" && _id == $id][0]`;
      const character: any = await client.fetch(query, { id });
      return character;
    } catch (error) {
      console.error('Error fetching character by ID from Sanity:', error);
      return null;
    }
  }
};

// Fallback hardcoded characters
function getHardcodedCharacters(): Character[] {
  return [
    {
      id: 1,
      name: "ArbuZiom",
      nickname: "King of Seeds",
      personality: "The crew leader and anchor of the Rewir",
      backstory: "Founder of Fruits From Da Hood. Raised between concrete courtyards, ArbuZiom carries the block’s heartbeat. Tough exterior, soft center—he keeps the family aligned.",
      traits: ["Charismatic", "Loyal", "Balanced", "Respected"],
      favoriteSpot: "The courtyard under the Golden Seed mural",
      signature: "Green-and-black oversize hoodie with a seed medallion",
      quote: "Every fruit ripens on its own schedule.",
      image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314",
      color: "primary",
      bgGradient: "from-green-500/20 to-red-500/20",
      rarity: "legendary",
      originDistrict: "Central crate stack — premium watermelon district",
      crewRole: "Crew leader",
      powerLevel: 97
    },
    {
      id: 2,
      name: "Winogronix",
      nickname: "Cluster of Unity",
      personality: "Neighbourhood philosopher",
      backstory: "Winogronix speaks and the block listens. A poet with an empathetic lens, he gathers stories like grapes in a cluster—unique alone, unstoppable together.",
      traits: ["Reflective", "Empathetic", "Wise", "Creative"],
      favoriteSpot: "Weathered bench next to the old basketball court",
      signature: "Deep purple hoodie embroidered with a vintage microphone",
      quote: "Without roots there are no branches.",
      image: "https://images.unsplash.com/photo-1528825871115-3581a5387919",
      color: "secondary",
      bgGradient: "from-purple-500/20 to-blue-500/20",
      rarity: "rare",
      originDistrict: "Chilled shelf section – grape nets stacked in rows",
      crewRole: "Narrator of the Rewir",
      powerLevel: 85
    },
    {
      id: 3,
      name: "Mandaryn",
      nickname: "Segmented Friend",
      personality: "Joyful and composed",
      backstory: "Mandaryn is balance embodied. Each segment holds a different mood yet together they create harmony. He shares kindness like sections of a peel.",
      traits: ["Sociable", "Optimistic", "Grounded", "Empathetic"],
      favoriteSpot: "Rewir park – food trucks looping lo-fi beats",
      signature: "Burnt orange bomber jacket",
      quote: "Every slice has its own rhythm.",
      image: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc",
      color: "warning",
      bgGradient: "from-orange-500/20 to-amber-500/20",
      rarity: "uncommon",
      originDistrict: "Mid-level crate beside the citrus display",
      crewRole: "Mediator and morale boost",
      powerLevel: 73
    },
    {
      id: 4,
      name: "TruskawkAż",
      nickname: "Sweet from the Swing",
      personality: "Bold romantic",
      backstory: "Raised on summer anthems and metal swings, TruskawkAż glows scarlet with emotion. She keeps love real—raw, imperfect, unforgettable.",
      traits: ["Energetic", "Honest", "Fiery", "Warm"],
      favoriteSpot: "Old swing set behind building 12A",
      signature: "Crimson crop top and retro rose-tinted shades",
      quote: "Life isn’t a fairy tale, but you can still fall for it.",
      image: "https://images.unsplash.com/photo-1497280604295-87bfe6d8fdfc",
      color: "error",
      bgGradient: "from-pink-500/20 to-red-500/20",
      rarity: "rare",
      originDistrict: "Chilled berry shelf – top-tier strawberry crates",
      crewRole: "Influencer and heart of the Rewir",
      powerLevel: 82
    },
    {
      id: 5,
      name: "Bananek Biceps",
      nickname: "Plantation Abs",
      personality: "Cheerful powerhouse",
      backstory: "Always on the move, always smiling. Bananek is the team’s golden energy source—maybe a little obsessed with protein shakes, but all heart.",
      traits: ["Strong", "Upbeat", "Loyal", "Driven"],
      favoriteSpot: "Outdoor gym beneath the Rewir overpass",
      signature: "Neon yellow tank with a ‘Stay Ripe’ tag",
      quote: "Bend, don’t break.",
      image: "https://images.unsplash.com/photo-1506802912914-0e1efc3d7065",
      color: "warning",
      bgGradient: "from-yellow-500/20 to-orange-500/20",
      rarity: "common",
      originDistrict: "Hanging racks by the entrance — cascading banana clusters",
      crewRole: "Guardian of the crew’s stamina",
      powerLevel: 78
    },
    {
      id: 6,
      name: "Malina Queen",
      nickname: "Queen of Blocks",
      personality: "Stylish and independent",
      backstory: "Malina Queen fuses fierce fem energy with razor-sharp city instincts. She knows the crown stays put when you hold your head high.",
      traits: ["Bold", "Stylish", "Leader", "Inspiring"],
      favoriteSpot: "Rooftop of Rewir Tower overlooking the skyline",
      signature: "Pink cropped jacket and a raspberry spike crown",
      quote: "I don’t need a stage to shine.",
      image: "https://images.unsplash.com/photo-1517164850305-99a3e65bb47d",
      color: "error",
      bgGradient: "from-pink-500/20 to-purple-500/20",
      rarity: "epic",
      originDistrict: "Top shelf of the chilled aisle – premium berry section",
      crewRole: "Style icon and symbol of feminine power",
      powerLevel: 89
    },
    {
      id: 7,
      name: "Pomelo Pablo",
      nickname: "Southern Boss",
      personality: "Cool strategist",
      backstory: "Always composed, always two moves ahead. Pomelo Pablo handles business with precision and understated confidence.",
      traits: ["Strategic", "Loyal", "Measured", "Quiet leader"],
      favoriteSpot: "Seed Office Café on 9th Street",
      signature: "Camel trench coat and midnight sunglasses",
      quote: "Do less, say less, deliver more.",
      image: "https://images.unsplash.com/photo-1506086679521-a3d2f45e08df",
      color: "accent",
      bgGradient: "from-orange-500/20 to-green-500/20",
      rarity: "epic",
      originDistrict: "Lower crate in the exotic produce wing",
      crewRole: "Strategist and financier",
      powerLevel: 91
    },
    {
      id: 8,
      name: "KiWi-Fi",
      nickname: "Laptop Loner",
      personality: "Neon technologist",
      backstory: "Plugged in even while sleeping. KiWi-Fi powers FFDH’s cyber layer—seeing patterns where others see static.",
      traits: ["Tech-savvy", "Inventive", "Introverted", "Unpredictable"],
      favoriteSpot: "Underground server hub near Tunnel G",
      signature: "Black hoodie with a glowing ‘Stay Ripe’ circuit graphic",
      quote: "Everything syncs—even what you can’t see.",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475",
      color: "info",
      bgGradient: "from-lime-500/20 to-cyan-500/20",
      rarity: "rare",
      originDistrict: "Checkout shelf stacked with New Zealand imports",
      crewRole: "Tech architect and empathy hacker",
      powerLevel: 87
    },
    {
      id: 9,
      name: "Cytrynson",
      nickname: "Sour but Aware",
      personality: "Intense and unpredictable",
      backstory: "ADHD energy, razor wit, quick intuition. When Cytrynson slides in, expect the equilibrium to shift—fast.",
      traits: ["Expressive", "Intuitive", "Creative", "Candid"],
      favoriteSpot: "Neon-lit intersection under the ‘Focus Mode’ sign",
      signature: "Matte yellow hoodie stamped ‘Overthinking Dept.’",
      quote: "I’m not a bug—I’m beta.",
      image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d",
      color: "warning",
      bgGradient: "from-yellow-500/20 to-lime-500/20",
      rarity: "uncommon",
      originDistrict: "Entrance citrus rack—‘Sour like life’ section",
      crewRole: "Chaos artist and rapid-fire analyst",
      powerLevel: 80
    }
  ];
}