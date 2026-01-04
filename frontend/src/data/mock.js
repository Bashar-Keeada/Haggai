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

// Haggai Leader Experience Programs - International
export const leaderExperiences = [
  {
    id: 'women-arabic',
    type: 'international',
    targetGender: 'women',
    language: 'arabic',
    title: {
      sv: 'Haggai Leader Experience - Kvinnor',
      en: 'Haggai Leader Experience - Women',
      ar: 'تجربة هجاي للقيادة - النساء'
    },
    description: {
      sv: 'Internationellt ledarprogram för kvinnor i ledande positioner. Programmet genomförs på arabiska i en inspirerande miljö med deltagare från hela världen.',
      en: 'International leadership program for women in leadership positions. The program is conducted in Arabic in an inspiring environment with participants from around the world.',
      ar: 'برنامج قيادي دولي للنساء في المناصب القيادية. يُقدَّم البرنامج باللغة العربية في بيئة ملهمة مع مشاركات من جميع أنحاء العالم.'
    },
    duration: {
      sv: '10 dagar',
      en: '10 days',
      ar: '10 أيام'
    },
    period: {
      sv: 'Slutet av juni varje år',
      en: 'End of June every year',
      ar: 'نهاية يونيو كل عام'
    },
    nextDate: '2025-06-20',
    location: {
      sv: 'Internationell plats (meddelas vid antagning)',
      en: 'International location (announced upon acceptance)',
      ar: 'موقع دولي (يُعلن عند القبول)'
    },
    spots: 30,
    spotsLeft: 15,
    ageRange: null,
    color: 'rose'
  },
  {
    id: 'men-arabic',
    type: 'international',
    targetGender: 'men',
    language: 'arabic',
    title: {
      sv: 'Haggai Leader Experience - Män',
      en: 'Haggai Leader Experience - Men',
      ar: 'تجربة هجاي للقيادة - الرجال'
    },
    description: {
      sv: 'Internationellt ledarprogram för män i ledande positioner. Programmet genomförs på arabiska och samlar ledare från hela arabvärlden.',
      en: 'International leadership program for men in leadership positions. The program is conducted in Arabic and gathers leaders from the entire Arab world.',
      ar: 'برنامج قيادي دولي للرجال في المناصب القيادية. يُقدَّم البرنامج باللغة العربية ويجمع قادة من جميع أنحاء العالم العربي.'
    },
    duration: {
      sv: '10 dagar',
      en: '10 days',
      ar: '10 أيام'
    },
    period: {
      sv: 'Slutet av november varje år',
      en: 'End of November every year',
      ar: 'نهاية نوفمبر كل عام'
    },
    nextDate: '2025-11-21',
    location: {
      sv: 'Internationell plats (meddelas vid antagning)',
      en: 'International location (announced upon acceptance)',
      ar: 'موقع دولي (يُعلن عند القبول)'
    },
    spots: 30,
    spotsLeft: 12,
    ageRange: '29-60',
    color: 'blue'
  },
  {
    id: 'online-english',
    type: 'international',
    targetGender: 'all',
    language: 'english',
    title: {
      sv: 'Haggai Leader Experience - Online',
      en: 'Haggai Leader Experience - Online',
      ar: 'تجربة هجاي للقيادة - عبر الإنترنت'
    },
    description: {
      sv: 'Flexibelt online-program på engelska för ledare mellan 30-55 år. Perfekt för dig som vill utvecklas utan att resa.',
      en: 'Flexible online program in English for leaders aged 30-55. Perfect for those who want to develop without traveling.',
      ar: 'برنامج مرن عبر الإنترنت باللغة الإنجليزية للقادة الذين تتراوح أعمارهم بين 30-55 عامًا. مثالي لمن يريد التطور دون السفر.'
    },
    duration: {
      sv: '2 sessioner/vecka i 2 månader',
      en: '2 sessions weekly / 2 months',
      ar: 'جلستان أسبوعياً / شهران'
    },
    period: {
      sv: 'Maj varje år',
      en: 'May every year',
      ar: 'مايو كل عام'
    },
    nextDate: '2026-05-10',
    location: {
      sv: 'Online (Zoom)',
      en: 'Online (Zoom)',
      ar: 'عبر الإنترنت (زووم)'
    },
    spots: 50,
    spotsLeft: 28,
    ageRange: '30-55',
    color: 'emerald'
  },
  {
    id: 'tot',
    type: 'national',
    targetGender: 'all',
    language: 'swedish',
    title: {
      sv: 'TOT - Training of Trainers',
      en: 'TOT - Training of Trainers',
      ar: 'تدريب المدربين (TOT)'
    },
    description: {
      sv: 'Utbildning för dig som vill bli certifierad Haggai-utbildare. Lär dig att leda och facilitera Haggai-program i Sverige.',
      en: 'Training for those who want to become certified Haggai trainers. Learn to lead and facilitate Haggai programs in Sweden.',
      ar: 'تدريب لمن يريد أن يصبح مدربًا معتمدًا في هجاي. تعلم قيادة وتيسير برامج هجاي في السويد.'
    },
    duration: {
      sv: '21 timmar',
      en: '21 hours',
      ar: '21 ساعة'
    },
    period: {
      sv: 'Årligen (se datum)',
      en: 'Annually (see dates)',
      ar: 'سنويًا (انظر التواريخ)'
    },
    nextDate: '2025-09-05',
    location: {
      sv: 'Stockholm, Sverige',
      en: 'Stockholm, Sweden',
      ar: 'ستوكهولم، السويد'
    },
    spots: 20,
    spotsLeft: 8,
    ageRange: null,
    color: 'violet'
  },
  {
    id: 'national-seminar',
    type: 'national',
    targetGender: 'all',
    language: 'swedish',
    title: {
      sv: 'National Seminar',
      en: 'National Seminar',
      ar: 'الندوة الوطنية'
    },
    description: {
      sv: 'Årligt nationellt seminarium för alla Haggai-alumni och intresserade ledare. Nätverka, lär och väx tillsammans.',
      en: 'Annual national seminar for all Haggai alumni and interested leaders. Network, learn and grow together.',
      ar: 'ندوة وطنية سنوية لجميع خريجي هجاي والقادة المهتمين. تواصل وتعلم وانمُ معًا.'
    },
    duration: {
      sv: '21 timmar (3 dagar)',
      en: '21 hours (3 days)',
      ar: '21 ساعة (3 أيام)'
    },
    period: {
      sv: 'Årligen (se datum)',
      en: 'Annually (see dates)',
      ar: 'سنويًا (انظر التواريخ)'
    },
    nextDate: '2025-10-17',
    location: {
      sv: 'Stockholm, Sverige',
      en: 'Stockholm, Sweden',
      ar: 'ستوكهولم، السويد'
    },
    spots: 100,
    spotsLeft: 45,
    ageRange: null,
    color: 'amber'
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
    quote: "Haggai Leader Experience förändrade mitt sätt att se på tjänst och ledarskap. Jag rekommenderar det varmt till alla kyrkoledare."
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
