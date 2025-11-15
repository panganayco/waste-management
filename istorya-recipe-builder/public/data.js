// Data for constellation points and their ingredient mapping
const CONSTELLATION_POINTS = [
  {
    id: "migration",
    label: "Migration or displacement",
    desc: "Moving, feeling in between places, never fully from here or there.",
    ingredientId: "fish_sauce"
  },
  {
    id: "language",
    label: "Language lost or reclaimed",
    desc: "Pushed parents to speak English, or learning Tagalog or a regional language later.",
    ingredientId: "coconut"
  },
  {
    id: "academic_pressure",
    label: "Academic pressure or 'failure'",
    desc: "That test, grade, or class that changed everything, or feels like it did.",
    ingredientId: "vinegar"
  },
  {
    id: "birth_order",
    label: "Eldest, middle, youngest, or only child labor",
    desc: "Invisible work, expectations, or feeling stuck in a family role.",
    ingredientId: "rice"
  },
  {
    id: "mixed_identity",
    label: "Mixed identity navigation",
    desc: "Filipino and something else, or feeling like you are always in between.",
    ingredientId: "calamansi"
  },
  {
    id: "body_burnout",
    label: "Body rebellion or burnout",
    desc: "Hypertension, exhaustion, shutdown, or your body saying no.",
    ingredientId: "sili"
  },
  {
    id: "disconnection",
    label: "Cultural disconnection / 'Not enough'",
    desc: "Not feeling Filipino enough. Not feeling American enough. Unsure where you fit.",
    ingredientId: "salt"
  }
];

const INGREDIENTS = {
  rice: {
    id: "rice",
    emoji: "🌾",
    name: "Rice",
    meaning: "pressure + expectation"
  },
  vinegar: {
    id: "vinegar",
    emoji: "🔥",
    name: "Vinegar",
    meaning: "clarity + disruption"
  },
  fish_sauce: {
    id: "fish_sauce",
    emoji: "🌊",
    name: "Fish Sauce",
    meaning: "depth + isolation"
  },
  coconut: {
    id: "coconut",
    emoji: "🥥",
    name: "Coconut",
    meaning: "adaptation + code-switch"
  },
  calamansi: {
    id: "calamansi",
    emoji: "🍋",
    name: "Calamansi",
    meaning: "both/and identity"
  },
  sili: {
    id: "sili",
    emoji: "🌶️",
    name: "Sili",
    meaning: "awakening + anger"
  },
  salt: {
    id: "salt",
    emoji: "🧂",
    name: "Salt",
    meaning: "essential truth + community"
  }
};

const METHODS = [
  {
    id: "simmered",
    emoji: "🍲",
    label: "Simmered",
    desc: "slow integration"
  },
  {
    id: "charred",
    emoji: "🔥",
    label: "Charred",
    desc: "intense transformation"
  },
  {
    id: "raw",
    emoji: "🌊",
    label: "Raw/Kinilaw",
    desc: "wound + acid truth"
  },
  {
    id: "fermented",
    emoji: "🫙",
    label: "Fermented",
    desc: "time + pressure"
  },
  {
    id: "sliced",
    emoji: "🔪",
    label: "Sliced",
    desc: "boundaries/separation"
  },
  {
    id: "stirred",
    emoji: "🥄",
    label: "Stirred/Halo-halo",
    desc: "mixed identity"
  }
];

const VESSELS = [
  {
    id: "palayok",
    emoji: "🏺",
    label: "Palayok",
    desc: "ancestral, slow, communal"
  },
  {
    id: "kawali",
    emoji: "🍳",
    label: "Kawali",
    desc: "high heat, fast, alone"
  },
  {
    id: "kaldero",
    emoji: "🥘",
    label: "Kaldero",
    desc: "family-sized capacity"
  },
  {
    id: "bilao",
    emoji: "🍽️",
    label: "Bilao",
    desc: "visible, shared, witnessed"
  }
];

const SAWSAWAN = [
  {
    id: "matubig",
    emoji: "🌊",
    label: "Matubig (flowing)",
    desc: "letting process flow, adjusting as I go"
  },
  {
    id: "durog",
    emoji: "🔨",
    label: "Durog (grinding)",
    desc: "breaking down to rebuild from essence"
  },
  {
    id: "pinreserba",
    emoji: "🫙",
    label: "Pinreserba (fermenting)",
    desc: "trusting time to transform"
  },
  {
    id: "sariwa",
    emoji: "🌿",
    label: "Sariwa (fresh)",
    desc: "working with what's present now"
  },
  {
    id: "mamantika",
    emoji: "🔥",
    label: "Mamantika (protective)",
    desc: "creating safety first"
  },
  {
    id: "may_kapares",
    emoji: "🤝",
    label: "May Kapares (paired)",
    desc: "seeking specific support"
  },
  {
    id: "pinaghalo",
    emoji: "🌀",
    label: "Pinaghalo (mixed)",
    desc: "blending multiple approaches"
  }
];
