// Mock data for Haggai Sweden website

export const events = [
  {
    id: 1,
    title: "Ledarskapsutbildning - Grundkurs",
    date: "2025-09-15",
    time: "09:00 - 16:00",
    location: "Skärholmen Centrum, Stockholm",
    description: "En intensiv dag med fokus på kristet ledarskap och personlig utveckling.",
    spots: 25,
    spotsLeft: 12
  },
  {
    id: 2,
    title: "Visionärt Ledarskap Workshop",
    date: "2025-09-28",
    time: "10:00 - 15:00",
    location: "Skärholmen Centrum, Stockholm",
    description: "Utveckla din vision som ledare och lär dig att inspirera andra.",
    spots: 20,
    spotsLeft: 8
  },
  {
    id: 3,
    title: "Haggai Höstkonferens 2025",
    date: "2025-10-12",
    time: "09:00 - 18:00",
    location: "Skärholmen Centrum, Stockholm",
    description: "Årlig konferens med internationella talare och nätverksmöjligheter.",
    spots: 100,
    spotsLeft: 45
  },
  {
    id: 4,
    title: "Mentorskap & Coaching",
    date: "2025-10-25",
    time: "13:00 - 17:00",
    location: "Skärholmen Centrum, Stockholm",
    description: "Lär dig effektiva metoder för mentorskap inom kyrkan.",
    spots: 15,
    spotsLeft: 6
  }
];

export const programs = [
  {
    id: 1,
    title: "Grundläggande Ledarskap",
    duration: "3 månader",
    description: "En grundkurs i kristet ledarskap baserad på bibliska principer. Kursen ger dig verktyg för att växa som ledare och tjäna din församling.",
    topics: ["Självledarskap", "Kommunikation", "Teambuilding", "Vision & Strategi"]
  },
  {
    id: 2,
    title: "Avancerat Ledarskap",
    duration: "6 månader",
    description: "Fördjupad utbildning för erfarna ledare som vill ta nästa steg. Fokus på strategiskt tänkande och organisationsutveckling.",
    topics: ["Strategisk planering", "Konflikthantering", "Förändringsledning", "Kulturbyggande"]
  },
  {
    id: 3,
    title: "Mentorprogram",
    duration: "12 månader",
    description: "Ett personligt mentorprogram där du matchas med en erfaren ledare för regelbunden handledning och stöd.",
    topics: ["Personlig utveckling", "Karriärvägledning", "Andlig tillväxt", "Nätverksbyggande"]
  }
];

export const boardMembers = [
  {
    id: 1,
    name: "Pastor Erik Lindström",
    role: "Ordförande",
    bio: "Erik har över 20 års erfarenhet som pastor och ledare inom svenska kyrkor."
  },
  {
    id: 2,
    name: "Maria Johansson",
    role: "Vice ordförande",
    bio: "Maria arbetar med ledarutveckling och har en bakgrund inom organisationspsykologi."
  },
  {
    id: 3,
    name: "David Andersson",
    role: "Kassör",
    bio: "David har lång erfarenhet av ekonomi och administration inom ideella organisationer."
  },
  {
    id: 4,
    name: "Sara Bergström",
    role: "Sekreterare",
    bio: "Sara är engagerad i ungdomsarbete och kommunikation."
  }
];

export const testimonials = [
  {
    id: 1,
    name: "Pastor Johan Nilsson",
    church: "Livets Ord, Uppsala",
    quote: "Haggais ledarskapsutbildning förändrade mitt sätt att se på tjänst och ledarskap. Jag rekommenderar det varmt till alla kyrkoledare."
  },
  {
    id: 2,
    name: "Anna Svensson",
    church: "Pingstkyrkan, Göteborg",
    quote: "Genom Haggai fick jag verktyg och inspiration att utveckla mitt ledarskap på ett djupare plan."
  },
  {
    id: 3,
    name: "Michael Eriksson",
    church: "Vineyard, Malmö",
    quote: "Nätverket och gemenskapen inom Haggai har varit ovärderligt för min tjänst."
  }
];

export const contactInfo = {
  address: "Skärholmen Centrum, Stockholm",
  phone: "0707825082",
  email: "info@haggai.se",
  socialMedia: {
    facebook: "https://facebook.com/haggaisweden",
    instagram: "https://instagram.com/haggaisweden"
  }
};

export const memberTypes = [
  {
    id: "individual",
    title: "Individ",
    description: "För enskilda personer med vision och ledarförmåga",
    price: "500 kr/år"
  },
  {
    id: "church",
    title: "Kyrka/Församling",
    description: "För kyrkor och församlingar som vill stödja ledarutveckling",
    price: "2000 kr/år"
  },
  {
    id: "organization",
    title: "Organisation",
    description: "För kristna organisationer och nätverk",
    price: "3000 kr/år"
  }
];
