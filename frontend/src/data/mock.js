// Mock data for Haggai Sweden website
// Note: Workshops can be managed from admin panel - this is fallback/initial data

export const events = [
  // Haggai Workshops - International
  {
    id: 101,
    type: 'leader-experience',
    programType: 'international',
    targetGroup: 'women',
    title: {
      sv: "Workshop – Internationell",
      en: "Workshop – International",
      ar: "ورشة عمل - دولية"
    },
    date: "2026-07-13",
    endDate: "2026-07-26",
    time: {
      sv: "13-26 juli 2026",
      en: "July 13-26, 2026",
      ar: "13-26 يوليو 2026"
    },
    location: {
      sv: "Internationell plats",
      en: "International Location",
      ar: "موقع دولي"
    },
    description: {
      sv: "Internationell workshop. Ålder: 23-55 år. 2 platser från Sverige.",
      en: "International workshop. Age: 23-55 years. 2 spots from Sweden.",
      ar: "ورشة عمل دولية. العمر: 23-55 سنة. مقعدان من السويد."
    },
    spots: 2,
    spotsLeft: 2,
    price: 500,
    currency: 'USD'
  },
  {
    id: 102,
    type: 'leader-experience',
    programType: 'international',
    targetGroup: 'men',
    title: {
      sv: "Workshop – Internationell",
      en: "Workshop – International",
      ar: "ورشة عمل - دولية"
    },
    date: "2026-11-30",
    endDate: "2026-12-11",
    time: {
      sv: "30 nov - 11 dec 2026",
      en: "Nov 30 - Dec 11, 2026",
      ar: "30 نوفمبر - 11 ديسمبر 2026"
    },
    location: {
      sv: "Internationell plats",
      en: "International Location",
      ar: "موقع دولي"
    },
    description: {
      sv: "Internationell workshop. Ålder: 23-55 år. 2 platser från Sverige.",
      en: "International workshop. Age: 23-55 years. 2 spots from Sweden.",
      ar: "ورشة عمل دولية. العمر: 23-55 سنة. مقعدان من السويد."
    },
    spots: 2,
    spotsLeft: 2,
    price: 500,
    currency: 'USD'
  },
  {
    id: 103,
    type: 'leader-experience',
    programType: 'international',
    targetGroup: 'all',
    title: {
      sv: "Workshop – Online engelskspråkig",
      en: "Workshop – Online English-speaking",
      ar: "ورشة عمل - أونلاين باللغة الإنجليزية"
    },
    date: "2026-02-05",
    endDate: "2026-02-07",
    time: {
      sv: "5-7 februari 2026",
      en: "February 5-7, 2026",
      ar: "5-7 فبراير 2026"
    },
    location: "Online",
    description: {
      sv: "Online workshop på engelska. Ålder: 29-60 år.",
      en: "Online workshop in English. Age: 29-60 years.",
      ar: "ورشة عمل أونلاين باللغة الإنجليزية. العمر: 29-60 سنة."
    },
    spots: 20,
    spotsLeft: 20,
    price: 500,
    currency: 'SEK',
    isOnline: true
  },
  {
    id: 104,
    type: 'leader-experience',
    programType: 'national',
    targetGroup: 'all',
    title: {
      sv: "Workshop – Nationell mars 2026",
      en: "Workshop – National March 2026",
      ar: "ورشة عمل - وطنية مارس 2026"
    },
    date: "2026-03-13",
    endDate: "2026-03-22",
    time: {
      sv: "Mars 2026",
      en: "March 2026",
      ar: "مارس 2026"
    },
    location: {
      sv: "Stockholm, Sverige",
      en: "Stockholm, Sweden",
      ar: "ستوكهولم، السويد"
    },
    description: {
      sv: "Nationell workshop. Ingen åldersgräns.",
      en: "National workshop. No age limit.",
      ar: "ورشة عمل وطنية. لا يوجد حد للعمر."
    },
    spots: 30,
    spotsLeft: 30,
    price: 500,
    currency: 'SEK'
  },
  // Regular Events
  {
    id: 1,
    type: 'event',
    title: "Ledarskapsworkshop - Grundkurs",
    date: "2025-09-15",
    time: "09:00 - 16:00",
    location: "Skärholmen Centrum, Stockholm",
    description: "En intensiv dag med fokus på kristet ledarskap och personlig utveckling.",
    spots: 25,
    spotsLeft: 12
  },
  {
    id: 2,
    type: 'event',
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
    type: 'event',
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
    type: 'event',
    title: "Mentorskap & Coaching",
    date: "2025-10-25",
    time: "13:00 - 17:00",
    location: "Skärholmen Centrum, Stockholm",
    description: "Lär dig effektiva metoder för mentorskap inom kyrkan.",
    spots: 15,
    spotsLeft: 6
  }
];

// Haggai Workshops (formerly Leader Experience Programs)
export const leaderExperiences = [
  // INTERNATIONAL WORKSHOPS
  {
    id: 'women-international-2026',
    type: 'international',
    targetGender: 'women',
    language: 'mixed',
    title: {
      sv: 'Workshop – Kvinnor internationell',
      en: 'Workshop – Women International',
      ar: 'ورشة عمل – نساء دولية'
    },
    description: {
      sv: 'Internationell workshop för kvinnor i ledande positioner. 2 platser från Sverige.',
      en: 'International workshop for women in leadership positions. 2 spots from Sweden.',
      ar: 'ورشة عمل دولية للنساء في المناصب القيادية. مقعدان من السويد.'
    },
    duration: {
      sv: '13-26 juli 2026',
      en: 'July 13-26, 2026',
      ar: '13-26 يوليو 2026'
    },
    period: {
      sv: '13-26 juli 2026',
      en: 'July 13-26, 2026',
      ar: '13-26 يوليو 2026'
    },
    nextDate: '2026-07-13',
    endDate: '2026-07-26',
    location: {
      sv: 'Internationell plats (meddelas vid antagning)',
      en: 'International location (announced upon acceptance)',
      ar: 'موقع دولي (يُعلن عند القبول)'
    },
    spots: 2,
    spotsLeft: 2,
    spotsLabel: {
      sv: '2 platser från Sverige',
      en: '2 spots from Sweden',
      ar: 'مقعدان من السويد'
    },
    ageRange: '23-55',
    price: 500,
    currency: 'USD',
    color: 'rose'
  },
  {
    id: 'men-international-2026',
    type: 'international',
    targetGender: 'men',
    language: 'mixed',
    title: {
      sv: 'Workshop – Män internationell',
      en: 'Workshop – Men International',
      ar: 'ورشة عمل – رجال دولية'
    },
    description: {
      sv: 'Internationell workshop för män i ledande positioner. 2 platser från Sverige.',
      en: 'International workshop for men in leadership positions. 2 spots from Sweden.',
      ar: 'ورشة عمل دولية للرجال في المناصب القيادية. مقعدان من السويد.'
    },
    duration: {
      sv: '30 nov - 11 dec 2026',
      en: 'Nov 30 - Dec 11, 2026',
      ar: '30 نوفمبر - 11 ديسمبر 2026'
    },
    period: {
      sv: '30 nov - 11 dec 2026',
      en: 'Nov 30 - Dec 11, 2026',
      ar: '30 نوفمبر - 11 ديسمبر 2026'
    },
    nextDate: '2026-11-30',
    endDate: '2026-12-11',
    location: {
      sv: 'Internationell plats (meddelas vid antagning)',
      en: 'International location (announced upon acceptance)',
      ar: 'موقع دولي (يُعلن عند القبول)'
    },
    spots: 2,
    spotsLeft: 2,
    spotsLabel: {
      sv: '2 platser från Sverige',
      en: '2 spots from Sweden',
      ar: 'مقعدان من السويد'
    },
    ageRange: '23-55',
    price: 500,
    currency: 'USD',
    color: 'blue'
  },
  {
    id: 'online-english-2026',
    type: 'international',
    targetGender: 'all',
    language: 'english',
    title: {
      sv: 'Workshop – Online engelskspråkig internationell',
      en: 'Workshop – Online English International',
      ar: 'ورشة عمل – عبر الإنترنت بالإنجليزية دولية'
    },
    description: {
      sv: 'Online workshop på engelska. Perfekt för dig som vill utvecklas utan att resa.',
      en: 'Online workshop in English. Perfect for those who want to develop without traveling.',
      ar: 'ورشة عمل عبر الإنترنت بالإنجليزية. مثالية لمن يريد التطور دون السفر.'
    },
    duration: {
      sv: '5-7 februari 2026',
      en: 'February 5-7, 2026',
      ar: '5-7 فبراير 2026'
    },
    period: {
      sv: '5-7 februari 2026',
      en: 'February 5-7, 2026',
      ar: '5-7 فبراير 2026'
    },
    nextDate: '2026-02-05',
    endDate: '2026-02-07',
    location: {
      sv: 'Online',
      en: 'Online',
      ar: 'عبر الإنترنت'
    },
    spots: null,
    spotsLeft: null,
    spotsLabel: {
      sv: 'Begränsat antal',
      en: 'Limited spots',
      ar: 'عدد محدود'
    },
    ageRange: '29-60',
    price: 500,
    currency: 'SEK',
    color: 'emerald',
    isOnline: true
  },
  // NATIONAL WORKSHOPS
  {
    id: 'national-march-2026',
    type: 'national',
    targetGender: 'all',
    language: 'swedish',
    title: {
      sv: 'Workshop – Nationell mars 2026',
      en: 'Workshop – National March 2026',
      ar: 'ورشة عمل – وطنية مارس 2026'
    },
    description: {
      sv: 'Nationell workshop. Ingen åldersgräns. Perfekt för dig som vill utveckla ditt ledarskap.',
      en: 'National workshop. No age limit. Perfect for those who want to develop their leadership.',
      ar: 'ورشة عمل وطنية. لا يوجد حد للعمر. مثالية لمن يريد تطوير قيادته.'
    },
    duration: {
      sv: 'Mars 2026',
      en: 'March 2026',
      ar: 'مارس 2026'
    },
    period: {
      sv: 'Mars 2026',
      en: 'March 2026',
      ar: 'مارس 2026'
    },
    nextDate: '2026-03-13',
    location: {
      sv: 'Stockholm, Sverige',
      en: 'Stockholm, Sweden',
      ar: 'ستوكهولم، السويد'
    },
    spots: 30,
    spotsLeft: 30,
    ageRange: null,
    ageLabel: {
      sv: 'Ingen åldersgräns',
      en: 'No age limit',
      ar: 'لا يوجد حد للعمر'
    },
    price: 500,
    currency: 'SEK',
    color: 'violet'
  },
  // ToT (Training of Trainers) - FDS
  {
    id: 'tot-fds-2026',
    type: 'tot',
    targetGender: 'all',
    language: 'flexible',
    title: {
      sv: 'ToT – Training of Trainers (FDS)',
      en: 'ToT – Training of Trainers (FDS)',
      ar: 'تدريب المدربين (FDS)'
    },
    description: {
      sv: 'FDS-utbildning (Training of Trainers). För dig som vill bli certifierad Haggai-tränare och leda workshops.',
      en: 'FDS training (Training of Trainers). For those who want to become certified Haggai trainers and lead workshops.',
      ar: 'تدريب FDS (تدريب المدربين). لمن يريد أن يصبح مدرب حجاي معتمد ويقود ورش العمل.'
    },
    duration: {
      sv: 'Enligt överenskommelse',
      en: 'As agreed',
      ar: 'حسب الاتفاق'
    },
    period: {
      sv: 'Kontakta oss för datum',
      en: 'Contact us for dates',
      ar: 'اتصل بنا للتواريخ'
    },
    nextDate: null,
    location: {
      sv: 'På plats eller online',
      en: 'On-site or online',
      ar: 'في الموقع أو عبر الإنترنت'
    },
    spots: null,
    spotsLeft: null,
    ageRange: null,
    price: null,
    currency: 'SEK',
    color: 'amber',
    isToT: true
  }
];

// Target groups
export const targetGroups = [
  {
    id: 'church-leaders',
    icon: 'Church',
    title: {
      sv: 'Kyrkoledare',
      en: 'Church Leaders',
      ar: 'قادة الكنائس'
    },
    description: {
      sv: 'Pastorer, präster, diakoner och andra i ledande roller inom kyrkan.',
      en: 'Pastors, priests, deacons and others in leadership roles within the church.',
      ar: 'القساوسة والكهنة والشمامسة وغيرهم في الأدوار القيادية داخل الكنيسة.'
    }
  },
  {
    id: 'young-leaders',
    icon: 'Sparkles',
    title: {
      sv: 'Unga Ledare',
      en: 'Young Leaders',
      ar: 'القادة الشباب'
    },
    description: {
      sv: 'Unga med vision och kallelse att göra skillnad i samhället.',
      en: 'Young people with vision and calling to make a difference in society.',
      ar: 'الشباب ذوو الرؤية والدعوة لإحداث فرق في المجتمع.'
    }
  },
  {
    id: 'entrepreneurs',
    icon: 'Briefcase',
    title: {
      sv: 'Entreprenörer',
      en: 'Entrepreneurs',
      ar: 'رواد الأعمال'
    },
    description: {
      sv: 'Företagare och affärsledare som vill integrera tro och arbete.',
      en: 'Business owners and leaders who want to integrate faith and work.',
      ar: 'أصحاب الأعمال والقادة الذين يريدون دمج الإيمان والعمل.'
    }
  },
  {
    id: 'diplomats',
    icon: 'Globe',
    title: {
      sv: 'Diplomater & Samhällsledare',
      en: 'Diplomats & Civic Leaders',
      ar: 'الدبلوماسيون وقادة المجتمع'
    },
    description: {
      sv: 'Ledare inom politik, diplomati och samhällsservice.',
      en: 'Leaders in politics, diplomacy and public service.',
      ar: 'القادة في السياسة والدبلوماسية والخدمة العامة.'
    }
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
    quote: "Haggai Workshop förändrade mitt sätt att se på tjänst och ledarskap. Jag rekommenderar det varmt till alla kyrkoledare."
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
