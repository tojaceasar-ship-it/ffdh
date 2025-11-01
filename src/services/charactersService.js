import { client } from '../lib/sanity';

export const charactersService = {
  getCharacters: async () => {
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
      
      const characters = await client.fetch(query);
      
      // Transform Sanity data to match expected format with id
      return characters.map((char, index) => ({
        id: index + 1,
        ...char,
      }));
    } catch (error) {
      console.error('Error fetching characters from Sanity:', error);
      
      // Fallback to hardcoded characters if Sanity fails
      return getHardcodedCharacters();
    }
  },
  
  getCharacterById: async (id) => {
    try {
      const query = `*[_type == "characterProfile" && _id == $id][0]`;
      const character = await client.fetch(query, { id });
      return character;
    } catch (error) {
      console.error('Error fetching character by ID from Sanity:', error);
      return null;
    }
  }
};

// Fallback hardcoded characters
function getHardcodedCharacters() {
  return [
    {
      id: 1,
      name: "ArbuZiom",
      nickname: "Król pestek",
      personality: "Lider i symbol Rewiru",
      backstory: "Założyciel Fruits From Da Hood. Dorastał między blokami, gdzie zrodziła się jego legenda. Zawsze twardy jak pestka, ale w środku ma serce z miąższu. Trzyma ekipę razem, dba o swoich.",
      traits: ["Charyzmatyczny", "Lojalny", "Zrównoważony", "Respektowany"],
      favoriteSpot: "Betonowy dziedziniec z muralem 'Golden Seed'",
      signature: "Zielono-czarna bluza oversize z medalionem-pestką",
      quote: "Każdy owoc dojrzewa w swoim tempie.",
      image: "https://example.com/ffdh/arbuziom.jpg",
      color: "primary",
      bgGradient: "from-green-500/20 to-red-500/20",
      rarity: "legendary",
      originDistrict: "Środek skrzynki z arbuza – królewska strefa Warzywniaka",
      crewRole: "Lider ekipy",
      powerLevel: 97
    },
    {
      id: 2,
      name: "Winogronix",
      nickname: "Kiść jedności",
      personality: "Filozof z osiedla",
      backstory: "Mówią, że słowa Winogronixa mają moc. Poeta bloków i głos sumienia ekipy. Łączy ludzi jak kiść – każdy inny, ale razem smakują najlepiej.",
      traits: ["Refleksyjny", "Empatyczny", "Mądry", "Twórczy"],
      favoriteSpot: "Ławka przy starym boisku, tam gdzie zaczyna się beat",
      signature: "Fioletowa bluza z mikrofonem w logo FFDH",
      quote: "Bez korzeni nie ma gałęzi.",
      image: "https://example.com/ffdh/winogronix.jpg",
      color: "secondary",
      bgGradient: "from-purple-500/20 to-blue-500/20",
      rarity: "rare",
      originDistrict: "Półka chłodnicza – sekcja winogron w siatkach po 1kg",
      crewRole: "Filozof i narrator Rewiru",
      powerLevel: 85
    },
    {
      id: 3,
      name: "Mandaryn",
      nickname: "Ziomek z segmentami",
      personality: "Wesoły i spójny",
      backstory: "Mandaryn to definicja równowagi. Każdy segment to inny klimat, ale razem tworzą harmonię. Dzieli się dobrem jak kawałkami siebie.",
      traits: ["Towarzyski", "Optymistyczny", "Zrównoważony", "Empatyczny"],
      favoriteSpot: "Park Rewir z foodtruckami i głośnikami Bluetooth",
      signature: "Pomarańczowa kurtka typu bomber",
      quote: "Każdy segment ma swój vibe.",
      image: "https://example.com/ffdh/mandaryn.jpg",
      color: "warning",
      bgGradient: "from-orange-500/20 to-amber-500/20",
      rarity: "uncommon",
      originDistrict: "Środkowa skrzynka przy ladzie – sekcja cytrusów obok pomarańczy",
      crewRole: "Mediator i dobry duch ekipy",
      powerLevel: 73
    },
    {
      id: 4,
      name: "TruskawkAż",
      nickname: "Słodka z trzepaka",
      personality: "Zadziorna romantyczka",
      backstory: "TruskawkAż wychowała się na trzepaku i w rytmie letnich hitów. Czerwona jak emocje i szczera jak dzieciństwo w bloku.",
      traits: ["Energetyczna", "Szczera", "Zadziorna", "Ciepła"],
      favoriteSpot: "Trzepak pod blokiem 12A",
      signature: "Czerwony crop top i różowe okulary retro",
      quote: "Życie to nie bajka, ale można się w nim zakochać.",
      image: "https://example.com/ffdh/truskawkaz.jpg",
      color: "error",
      bgGradient: "from-pink-500/20 to-red-500/20",
      rarity: "rare",
      originDistrict: "Chłodnia – skrzynka z truskawkami na górnej półce",
      crewRole: "Influencerka i serce Rewiru",
      powerLevel: 82
    },
    {
      id: 5,
      name: "Bananek Biceps",
      nickname: "Kaloryfer z plantacji",
      personality: "Wesoły siłacz",
      backstory: "Zawsze w ruchu, zawsze w uśmiechu. Bananek to serce drużyny — złoty chłopak, który zaraża energią i czasem trochę przesadza z proteinami.",
      traits: ["Silny", "Wesoły", "Lojalny", "Zmotywowany"],
      favoriteSpot: "Plenerowa siłownia pod Rewirem",
      signature: "Żółty tank-top z graffiti 'Stay Ripe'",
      quote: "Nie bój się zgiąć, dopóki nie pękniesz.",
      image: "https://example.com/ffdh/bananekbiceps.jpg",
      color: "warning",
      bgGradient: "from-yellow-500/20 to-orange-500/20",
      rarity: "common",
      originDistrict: "Stelaż przy wejściu – banany zwisające w kiściach",
      crewRole: "Strażnik energii ekipy",
      powerLevel: 78
    },
    {
      id: 6,
      name: "Malina Queen",
      nickname: "Królowa bloków",
      personality: "Stylowa i niezależna",
      backstory: "Malina Queen to uosobienie mocy i stylu. Łączy kobiecą energię z miejskim pazurem. Wie, że korona nie spada, jeśli trzymasz głowę wysoko.",
      traits: ["Odważna", "Stylowa", "Liderka", "Inspirująca"],
      favoriteSpot: "Dach Rewir Tower z widokiem na panoramę miasta",
      signature: "Różowa kurtka i korona z malinowych kolców",
      quote: "Nie potrzebuję sceny, żeby błyszczeć.",
      image: "https://example.com/ffdh/malinaqueen.jpg",
      color: "error",
      bgGradient: "from-pink-500/20 to-purple-500/20",
      rarity: "epic",
      originDistrict: "Najwyższa półka chłodni – sekcja premium malin w kubeczkach",
      crewRole: "Symbol stylu i kobiecej siły",
      powerLevel: 89
    },
    {
      id: 7,
      name: "Pomelo Pablo",
      nickname: "Boss z południa",
      personality: "Chłodny i strategiczny",
      backstory: "Zawsze elegancki, zawsze dwa kroki przed innymi. Pomelo Pablo to mózg operacyjny Rewiru – prowadzi interesy z klasą i spokojem.",
      traits: ["Strategiczny", "Lojalny", "Zrównoważony", "Cichy przywódca"],
      favoriteSpot: "Kawiarnia 'Seed Office' na rogu 9. ulicy",
      signature: "Beżowy płaszcz i okulary przeciwsłoneczne nocą",
      quote: "Zrób mniej, powiedz mniej, osiągnij więcej.",
      image: "https://example.com/ffdh/pomelopablo.jpg",
      color: "accent",
      bgGradient: "from-orange-500/20 to-green-500/20",
      rarity: "epic",
      originDistrict: "Dolna skrzynia w rogu sklepu – dział z egzotyką",
      crewRole: "Strateg i finansista Rewiru",
      powerLevel: 91
    },
    {
      id: 8,
      name: "KiWi-Fi",
      nickname: "Dziwak z laptopem",
      personality: "Neonowy geek",
      backstory: "Zawsze podłączony, nawet jak śpi. Kiwi-Fi to mózg cyberrewolucji FFDH – widzi kod tam, gdzie inni widzą chaos.",
      traits: ["Tech-savvy", "Kreatywny", "Introwertyczny", "Zaskakujący"],
      favoriteSpot: "Podziemna serwerownia przy tunelu G",
      signature: "Czarna bluza z neonowym napisem 'ADHD Wear That Slaps'",
      quote: "Wszystko jest połączone. Nawet to, czego nie widzisz.",
      image: "https://example.com/ffdh/kiwifi.jpg",
      color: "info",
      bgGradient: "from-lime-500/20 to-cyan-500/20",
      rarity: "rare",
      originDistrict: "Półka przy kasie z owocami z Nowej Zelandii",
      crewRole: "Tech-mistrz i haker empatii",
      powerLevel: 87
    },
    {
      id: 9,
      name: "Cytrynson",
      nickname: "Kwaśny, ale wiemy",
      personality: "Intensywny i nieprzewidywalny",
      backstory: "ADHD, sarkazm i błysk w oku. Cytrynson to chodząca energia i chaos w jednym. Mówią, że jak się pojawi – nic już nie jest takie samo.",
      traits: ["Ekspresyjny", "Intuicyjny", "Kreatywny", "Szczery"],
      favoriteSpot: "Nocne skrzyżowanie przy neonie 'Focus Mode'",
      signature: "Żółta bluza z napisem 'Overthinking Dept.'",
      quote: "Nie jestem problemem – jestem wersją beta.",
      image: "https://example.com/ffdh/cytrynson.jpg",
      color: "warning",
      bgGradient: "from-yellow-500/20 to-lime-500/20",
      rarity: "uncommon",
      originDistrict: "Regał z cytrusami przy wejściu – sekcja 'kwaśne jak życie'",
      crewRole: "Artysta chaosu i błyskawiczny analityk",
      powerLevel: 80
    }
  ];
}