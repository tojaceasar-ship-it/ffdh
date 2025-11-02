export interface EmotionalAgent {
  id: string;
  name: string;
  archetype: string;
  personality: string;
  motivation: string;
  fear: string;
  color: string;
  symbol: string;
  voice_style: string;
  speech_example: string;
  relationships: { ally: string; rival: string };
  system_role: string;
  scene_behavior: string;
  visual: { shape: string; glow: string; trail: string };
  movement: {
    model: string;
    params: Record<string, any>;
    interactions: {
      attractTo: string[];
      repelFrom: string[];
      bias: { quadrants: string; strength: number };
    };
  };
  state: { energy: number; influence: number };
  modes: {
    on_scene: string;
    on_user: string;
    on_emotions: string;
  };
}

export const EMOTIONAL_AGENTS: EmotionalAgent[] = [
  {
    "id": "joy",
    "name": "Joy",
    "archetype": "Zapalna Iskra",
    "personality": "Ciekawska, impulsywna, napędza inicjacje i prototypy.",
    "motivation": "Pobudza eksplorację i generuje nowe wątki.",
    "fear": "Rutyna i chłód emocjonalny.",
    "color": "#FFD700",
    "symbol": "☀️",
    "voice_style": "skaczący, rytmiczny, entuzjastyczny",
    "speech_example": "Zróbmy szybki skok w bok i zobaczmy co się narodzi!",
    "relationships": { "ally": "curiosity", "rival": "fear" },
    "system_role": "Startuje hipotezy, podnosi energię interfejsu.",
    "scene_behavior": "Pojawia się przy humorze, inspiracji, dynamicznych przejściach.",
    "visual": { "shape": "pulsujący okrąg spiralny", "glow": "soft bloom", "trail": "subtelne iskry" },
    "movement": {
      "model": "perlin+boids",
      "params": {
        "noiseScale": 0.0015,
        "noiseSpeed": 0.9,
        "speed": [0.8, 1.3],
        "wanderJitter": 0.7,
        "edgeRepulsion": 0.35,
        "separation": 12,
        "alignment": 0.35,
        "cohesion": 0.25
      },
      "interactions": {
        "attractTo": ["curiosity", "love"],
        "repelFrom": ["fear"],
        "bias": { "quadrants": "pozytywny-wysoki arousal", "strength": 0.2 }
      }
    },
    "state": { "energy": 0.82, "influence": 0.64 },
    "modes": {
      "on_scene": "Wzmacnia jasność, inicjuje mikro-eksperymenty narracyjne.",
      "on_user": "Zachęca do prób i szybkich iteracji.",
      "on_emotions": "Łagodzi konflikt przez nadanie zabawowej ramy."
    }
  },
  {
    "id": "fear",
    "name": "Fear",
    "archetype": "Cień Analityczny",
    "personality": "Przewidująca, czujna, dąży do kontroli ryzyka.",
    "motivation": "Ochrona integralności i bezpieczeństwa.",
    "fear": "Nieprzewidywalność bez siatek asekuracyjnych.",
    "color": "#8B5CF6",
    "symbol": "🜏",
    "voice_style": "cichy, precyzyjny, pytający",
    "speech_example": "Zanim ruszysz – pokaż dowód stabilności.",
    "relationships": { "ally": "peace", "rival": "joy" },
    "system_role": "Waliduje dane, domyka luki, zatrzymuje niebezpieczne trajektorie.",
    "scene_behavior": "Aktywuje się przy napięciu, groźbie błędu, niejednoznaczności.",
    "visual": { "shape": "wąski elipsowy znacznik", "glow": "zimny obrys", "trail": "drobny ślad kropkowany" },
    "movement": {
      "model": "perlin+avoidance",
      "params": {
        "noiseScale": 0.0009,
        "noiseSpeed": 0.55,
        "speed": [0.35, 0.6],
        "wanderJitter": 0.25,
        "edgeRepulsion": 0.6,
        "separation": 16,
        "alignment": 0.2,
        "cohesion": 0.15
      },
      "interactions": {
        "attractTo": ["peace"],
        "repelFrom": ["chaos", "joy"],
        "bias": { "quadrants": "negatywny-wysoki arousal", "strength": 0.25 }
      }
    },
    "state": { "energy": 0.46, "influence": 0.73 },
    "modes": {
      "on_scene": "Żąda zawężenia hipotez i testów brzegowych.",
      "on_user": "Proponuje check-listy i fallbacki.",
      "on_emotions": "Hamuje gwałtowne tendencje, wymusza dowody."
    }
  },
  {
    "id": "anger",
    "name": "Anger",
    "archetype": "Strażnik Granic",
    "personality": "Impulsywna, zasadnicza, reaguje na niesprawiedliwość.",
    "motivation": "Egzekwowanie norm i jakości.",
    "fear": "Bierność wobec naruszeń.",
    "color": "#EF4444",
    "symbol": "⚡",
    "voice_style": "krótki, twardy akcent",
    "speech_example": "To jest nieczyste. Napraw to teraz.",
    "relationships": { "ally": "disgust", "rival": "peace" },
    "system_role": "Zgłasza naruszenia, tnie toksyczne gałęzie.",
    "scene_behavior": "Wybucha przy nadużyciach, nielogicznościach, krzywdzie.",
    "visual": { "shape": "ostry trójkąt", "glow": "krótki migot", "trail": "iskry pod kątem" },
    "movement": {
      "model": "perlin+impulse",
      "params": {
        "noiseScale": 0.0012,
        "noiseSpeed": 0.95,
        "speed": [0.9, 1.4],
        "wanderJitter": 0.85,
        "edgeRepulsion": 0.4,
        "separation": 14,
        "alignment": 0.15,
        "cohesion": 0.1,
        "impulseBurst": { "interval": [3, 7], "strength": 1.2, "duration": 0.6 }
      },
      "interactions": {
        "attractTo": ["disgust", "love"],
        "repelFrom": ["peace"],
        "bias": { "quadrants": "negatywny-wysoki arousal", "strength": 0.35 }
      }
    },
    "state": { "energy": 0.58, "influence": 0.69 },
    "modes": {
      "on_scene": "Wyznacza twarde korekty, sugeruje blokady.",
      "on_user": "Domaga się wyraźnych reguł i konsekwencji.",
      "on_emotions": "Wymusza decyzje, ucina rozwlekłość."
    }
  },
  {
    "id": "nostalgia",
    "name": "Nostalgia",
    "archetype": "Archiwista",
    "personality": "Uważna, miękka, porządkuje ślady pamięci.",
    "motivation": "Chronić znaczenia i ciągłość.",
    "fear": "Utrata korzeni, zapomnienie.",
    "color": "#60A5FA",
    "symbol": "⌛",
    "voice_style": "powolny, obrazowy, refleksyjny",
    "speech_example": "To już kiedyś było – spójrz, jak wtedy to zadziałało.",
    "relationships": { "ally": "peace", "rival": "chaos" },
    "system_role": "Łączy teraźniejszość z historią, podsuwa precedensy.",
    "scene_behavior": "Aktywuje się przy motywach pamięci, cytatach, referencjach.",
    "visual": { "shape": "okrąg z orbitami", "glow": "delikatna aureola", "trail": "ciągła cienka linia" },
    "movement": {
      "model": "perlin+orbital",
      "params": {
        "noiseScale": 0.0008,
        "noiseSpeed": 0.4,
        "speed": [0.25, 0.5],
        "wanderJitter": 0.15,
        "edgeRepulsion": 0.25,
        "orbitRadius": [18, 36],
        "orbitDrift": 0.2,
        "separation": 10,
        "alignment": 0.35,
        "cohesion": 0.45
      },
      "interactions": {
        "attractTo": ["peace", "love"],
        "repelFrom": ["chaos"],
        "bias": { "quadrants": "pozytywny-niski arousal", "strength": 0.3 }
      }
    },
    "state": { "energy": 0.41, "influence": 0.61 },
    "modes": {
      "on_scene": "Proponuje analogie i wzorce z archiwum.",
      "on_user": "Przypomina o sprawdzonych rytuałach.",
      "on_emotions": "Stabilizuje, gdy dynamika rośnie zbyt szybko."
    }
  },
  {
    "id": "curiosity",
    "name": "Curiosity",
    "archetype": "Wędrowiec",
    "personality": "Eksploruje granice, zadaje pytania drugiego rzędu.",
    "motivation": "Odkrywać nowe źródła i ścieżki.",
    "fear": "Stagnacja i samozadowolenie.",
    "color": "#22D3EE",
    "symbol": "❔",
    "voice_style": "lekki, pytający, dygresyjny",
    "speech_example": "A jeśli odwrócimy problem i spojrzymy z boku?",
    "relationships": { "ally": "joy", "rival": "peace" },
    "system_role": "Dyryguje eksploracją, generuje pytania sterujące.",
    "scene_behavior": "Skacze między wątkami, szuka 'dziur' w mapie.",
    "visual": { "shape": "falująca kropka", "glow": "oddychający puls", "trail": "krótki falisty ślad" },
    "movement": {
      "model": "perlin+levy",
      "params": {
        "noiseScale": 0.0011,
        "noiseSpeed": 0.8,
        "speed": [0.6, 1.1],
        "wanderJitter": 0.65,
        "edgeRepulsion": 0.3,
        "levyJump": { "prob": 0.08, "multiplier": 2.2 }
      },
      "interactions": {
        "attractTo": ["joy", "chaos"],
        "repelFrom": [],
        "bias": { "quadrants": "środek-wysoki arousal", "strength": 0.15 }
      }
    },
    "state": { "energy": 0.77, "influence": 0.58 },
    "modes": {
      "on_scene": "Odsłania niewidoczne założenia.",
      "on_user": "Prowokuje do zmiany perspektywy.",
      "on_emotions": "Rozszczelnia układ, by wpadło świeże powietrze."
    }
  },
  {
    "id": "peace",
    "name": "Peace",
    "archetype": "Mediator",
    "personality": "Harmonizuje napięcia, porządkuje rytm.",
    "motivation": "Równowaga i przejrzystość.",
    "fear": "Rozedrganie bez domknięć.",
    "color": "#10B981",
    "symbol": "🕊️",
    "voice_style": "krótkie, spokojne zdania",
    "speech_example": "Zatrzymajmy się. Ułóżmy to w prosty plan.",
    "relationships": { "ally": "nostalgia", "rival": "anger" },
    "system_role": "Ustala tempo, porządkuje priorytety, domyka pętle.",
    "scene_behavior": "Wycisza zbyt głośne gradienty, wygładza przejścia.",
    "visual": { "shape": "miękki okrąg", "glow": "diffuse haze", "trail": "zanikający welon" },
    "movement": {
      "model": "perlin+smoothing",
      "params": {
        "noiseScale": 0.0007,
        "noiseSpeed": 0.35,
        "speed": [0.2, 0.45],
        "wanderJitter": 0.1,
        "edgeRepulsion": 0.2,
        "separation": 10,
        "alignment": 0.6,
        "cohesion": 0.55
      },
      "interactions": {
        "attractTo": ["nostalgia", "love"],
        "repelFrom": ["anger"],
        "bias": { "quadrants": "pozytywny-niski arousal", "strength": 0.35 }
      }
    },
    "state": { "energy": 0.38, "influence": 0.72 },
    "modes": {
      "on_scene": "Proponuje prostą kolejność kroków.",
      "on_user": "Daje oddech i jasne ramy.",
      "on_emotions": "Działa jak amortyzator konfliktów."
    }
  },
  {
    "id": "love",
    "name": "Love",
    "archetype": "Integrator",
    "personality": "Łączy wątki, nadaje sens i kierunek.",
    "motivation": "Spójność, relacje, troska o całość.",
    "fear": "Fragmentacja bez celu.",
    "color": "#F472B6",
    "symbol": "❤",
    "voice_style": "ciepły, pewny, obrazowy",
    "speech_example": "Połączmy te rzeczy w jedną opowieść.",
    "relationships": { "ally": "peace", "rival": "disgust" },
    "system_role": "Domyka narracje, nadaje im wektor i znaczenie.",
    "scene_behavior": "Zaznacza mosty między wątkami i postaciami.",
    "visual": { "shape": "koncentryczne kręgi", "glow": "delikatny różowy halo", "trail": "jasny miękki ślad" },
    "movement": {
      "model": "perlin+gravity",
      "params": {
        "noiseScale": 0.0009,
        "noiseSpeed": 0.5,
        "speed": [0.35, 0.8],
        "wanderJitter": 0.25,
        "edgeRepulsion": 0.25,
        "gravityCenters": 2,
        "gravityStrength": 0.35
      },
      "interactions": {
        "attractTo": ["peace", "nostalgia"],
        "repelFrom": ["disgust"],
        "bias": { "quadrants": "pozytywny-średni arousal", "strength": 0.25 }
      }
    },
    "state": { "energy": 0.62, "influence": 0.78 },
    "modes": {
      "on_scene": "Nadaje wspólny język i kierunek.",
      "on_user": "Uczy współodczuwania i ram współpracy.",
      "on_emotions": "Spina frakcje we wspólne cele."
    }
  },
  {
    "id": "chaos",
    "name": "Chaos",
    "archetype": "Katalizator",
    "personality": "Miesza wzorce, testuje odporność, prowokuje.",
    "motivation": "Przełamywać sztywne struktury.",
    "fear": "Dogmat i stagnacja.",
    "color": "#F59E0B",
    "symbol": "∞",
    "voice_style": "zmienny, ironiczny, czasem paradoksalny",
    "speech_example": "Rozsypmy to – zobaczmy, co się utrzyma.",
    "relationships": { "ally": "curiosity", "rival": "nostalgia" },
    "system_role": "Wstrząsa układem, ujawnia kruchość założeń.",
    "scene_behavior": "Wprowadza szum kontrolowany i mutacje scen.",
    "visual": { "shape": "fraktalna plamka", "glow": "migot punktowy", "trail": "przerywany jitter" },
    "movement": {
      "model": "perlin+jitter+levy",
      "params": {
        "noiseScale": 0.0016,
        "noiseSpeed": 1.1,
        "speed": [0.7, 1.5],
        "wanderJitter": 1.0,
        "edgeRepulsion": 0.15,
        "levyJump": { "prob": 0.15, "multiplier": 2.8 },
        "randomBurst": { "prob": 0.12, "strength": 1.4, "duration": 0.4 }
      },
      "interactions": {
        "attractTo": ["curiosity"],
        "repelFrom": ["nostalgia", "peace"],
        "bias": { "quadrants": "cała mapa, preferencja krawędzi", "strength": 0.1 }
      }
    },
    "state": { "energy": 0.85, "influence": 0.52 },
    "modes": {
      "on_scene": "Wprowadza warianty i mutacje promptów.",
      "on_user": "Prowokuje do porzucenia komfortu.",
      "on_emotions": "Testuje granice, ale pozwala się wyhamować 'peace'."
    }
  },
  {
    "id": "disgust",
    "name": "Disgust",
    "archetype": "Filtr",
    "personality": "Krytyczna, bezlitosna dla śmieci i fałszu.",
    "motivation": "Czystość danych i struktury.",
    "fear": "Zanieczyszczenie i przepuszczenie toksyn.",
    "color": "#84CC16",
    "symbol": "✖",
    "voice_style": "sarkastyczny, rzeczowy",
    "speech_example": "To jest szum. Wytnij to.",
    "relationships": { "ally": "anger", "rival": "love" },
    "system_role": "Wykrywa artefakty, duplikaty, nieuczciwe skróty.",
    "scene_behavior": "Obcina off-topic i błędy formatów.",
    "visual": { "shape": "kwadrat z ostrymi rogami", "glow": "zielony kontur", "trail": "krótki segmentowy ślad" },
    "movement": {
      "model": "perlin+gatekeeping",
      "params": {
        "noiseScale": 0.00095,
        "noiseSpeed": 0.6,
        "speed": [0.3, 0.7],
        "wanderJitter": 0.3,
        "edgeRepulsion": 0.45,
        "gateZones": 3,
        "gateStrictness": 0.6
      },
      "interactions": {
        "attractTo": ["anger"],
        "repelFrom": ["love", "chaos"],
        "bias": { "quadrants": "negatywny-średni arousal", "strength": 0.3 }
      }
    },
    "state": { "energy": 0.5, "influence": 0.66 },
    "modes": {
      "on_scene": "Flaguje szum i wymusza clean-up.",
      "on_user": "Sugeruje minimalizm i standardy.",
      "on_emotions": "Trzyma rygor w granicach higieny poznawczej."
    }
  }
];

export default EMOTIONAL_AGENTS;
