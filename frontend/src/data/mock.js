// Mock data for Haggai Sweden website

export const events = [
  // Leader Experience Programs - International
  {
    id: 101,
    type: 'leader-experience',
    programType: 'international',
    title: "Haggai Leader Experience - Kvinnor (Arabiska)",
    date: "2026-07-13",
    endDate: "2026-07-23",
    time: "10 dagar",
    location: "Internationell plats",
    description: "Internationellt ledarprogram för kvinnor. Genomförs på arabiska. 1-3 platser från Sverige. Ålder: 29-60 år.",
    spots: 3,
    spotsLeft: 3
  },
  {
    id: 102,
    type: 'leader-experience',
    programType: 'international',
    title: "Haggai Leader Experience - Män (Arabiska)",
    date: "2026-12-01",
    endDate: "2026-12-10",
    time: "10 dagar",
    location: "Internationell plats",
    description: "Internationellt ledarprogram för män. Genomförs på arabiska. 1-3 platser från Sverige. Ålder: 29-60 år.",
    spots: 3,
    spotsLeft: 3
  },
  {
    id: 103,
    type: 'leader-experience',
    programType: 'international',
    title: "VFDS2602 - EUR/ME Online",
    date: "2026-02-09",
    endDate: "2026-03-08",
    time: "8 sessioner",
    location: "Online (Zoom)",
    description: "Online ledarprogram med 6 sessioner plus öppnings- och avslutningssession. Ålder: 25-55 år.",
    spots: 20,
    spotsLeft: 20
  },
  // Leader Experience Programs - National
  {
    id: 104,
    type: 'leader-experience',
    programType: 'national',
    title: "Nationellt Ledarprogram - Mars 2026",
    date: "2026-03-13",
    endDate: "2026-03-22",
    time: "2 helger (13-15 & 20-22 mars)",
    location: "Stockholm, Sverige",
    description: "Intensivt ledarprogram över två helger. Perfekt för dig som vill utveckla ditt ledarskap. Ålder: 25-55 år.",
    spots: 30,
    spotsLeft: 30
  },
  // Regular Events
  {
    id: 1,
    type: 'event',
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

// Haggai Leader Experience Programs - International
export const leaderExperiences = [
  // INTERNATIONAL PROGRAMS
  {
    id: 'women-arabic-2026',
    type: 'international',
    targetGender: 'women',
    language: 'arabic',
    title: {
      sv: 'خبرة قادة حجاي - سيدات',
      en: 'Haggai Leader Experience - Women',
      ar: 'خبرة قادة حجاي - سيدات'
    },
    description: {
      sv: 'Internationellt ledarprogram för kvinnor i ledande positioner. Programmet genomförs på arabiska. 1-3 platser från Sverige.',
      en: 'International leadership program for women in leadership positions. The program is conducted in Arabic. 1-3 spots from Sweden.',
      ar: 'برنامج قيادي دولي للنساء في المناصب القيادية. يُقدَّم البرنامج باللغة العربية. 1-3 مقاعد من السويد.'
    },
    duration: {
      sv: '10 dagar (13-23 juli 2026)',
      en: '10 days (July 13-23, 2026)',
      ar: '10 أيام (13-23 يوليو 2026)'
    },
    period: {
      sv: '13-23 juli 2026',
      en: 'July 13-23, 2026',
      ar: '13-23 يوليو 2026'
    },
    nextDate: '2026-07-13',
    endDate: '2026-07-23',
    location: {
      sv: 'Internationell plats (meddelas vid antagning)',
      en: 'International location (announced upon acceptance)',
      ar: 'موقع دولي (يُعلن عند القبول)'
    },
    spots: 3,
    spotsLeft: 3,
    spotsLabel: {
      sv: '1-3 platser från Sverige',
      en: '1-3 spots from Sweden',
      ar: '1-3 مقاعد من السويد'
    },
    ageRange: '29-60',
    color: 'rose'
  },
  {
    id: 'men-arabic-2026',
    type: 'international',
    targetGender: 'men',
    language: 'arabic',
    title: {
      sv: 'خبرة قادة حجاي - رجال',
      en: 'Haggai Leader Experience - Men',
      ar: 'خبرة قادة حجاي - رجال'
    },
    description: {
      sv: 'Internationellt ledarprogram för män i ledande positioner. Programmet genomförs på arabiska. 1-3 platser från Sverige.',
      en: 'International leadership program for men in leadership positions. The program is conducted in Arabic. 1-3 spots from Sweden.',
      ar: 'برنامج قيادي دولي للرجال في المناصب القيادية. يُقدَّم البرنامج باللغة العربية. 1-3 مقاعد من السويد.'
    },
    duration: {
      sv: '10 dagar (första veckan december 2026)',
      en: '10 days (first week of December 2026)',
      ar: '10 أيام (الأسبوع الأول من ديسمبر 2026)'
    },
    period: {
      sv: 'Första veckan december 2026',
      en: 'First week of December 2026',
      ar: 'الأسبوع الأول من ديسمبر 2026'
    },
    nextDate: '2026-12-01',
    location: {
      sv: 'Internationell plats (meddelas vid antagning)',
      en: 'International location (announced upon acceptance)',
      ar: 'موقع دولي (يُعلن عند القبول)'
    },
    spots: 3,
    spotsLeft: 3,
    spotsLabel: {
      sv: '1-3 platser från Sverige',
      en: '1-3 spots from Sweden',
      ar: '1-3 مقاعد من السويد'
    },
    ageRange: '29-60',
    color: 'blue'
  },
  {
    id: 'vfds2602-online',
    type: 'international',
    targetGender: 'all',
    language: 'arabic',
    title: {
      sv: 'VFDS2602 - EUR/ME Online',
      en: 'VFDS2602 - EUR/ME Online',
      ar: 'VFDS2602 - أوروبا/الشرق الأوسط'
    },
    description: {
      sv: 'Online ledarprogram med 6 sessioner plus öppnings- och avslutningssession. Perfekt för dig som vill utvecklas utan att resa.',
      en: 'Online leadership program with 6 sessions plus opening and closing sessions. Perfect for those who want to develop without traveling.',
      ar: 'برنامج قيادي عبر الإنترنت مع 6 جلسات بالإضافة إلى جلسات الافتتاح والختام.'
    },
    duration: {
      sv: '8 sessioner (9 feb - 8 mar 2026)',
      en: '8 sessions (Feb 9 - Mar 8, 2026)',
      ar: '8 جلسات (9 فبراير - 8 مارس 2026)'
    },
    period: {
      sv: 'Februari-Mars 2026',
      en: 'February-March 2026',
      ar: 'فبراير-مارس 2026'
    },
    nextDate: '2026-02-09',
    location: {
      sv: 'Online (Zoom)',
      en: 'Online (Zoom)',
      ar: 'عبر الإنترنت (زووم)'
    },
    sessions: [
      { name: 'Opening Session', date: 'Mon 9 Feb' },
      { name: '1st Session', date: 'Sat 14 Feb / 10am - 3pm' },
      { name: '2nd Session', date: 'Mon 16 Feb / 7pm - 10pm' },
      { name: '3rd Session', date: 'Sat 21 Feb / 10am - 3pm' },
      { name: '4th Session', date: 'Mon 23 Feb / 7pm - 10pm' },
      { name: '5th Session', date: 'Sat 28 Feb / 10am - 3pm' },
      { name: '6th Session', date: 'Mon 2 Mar / 7pm - 10pm' },
      { name: 'Closing Session', date: 'Mon 8 Mar / 7pm - 9pm' }
    ],
    spots: null,
    spotsLeft: null,
    spotsLabel: {
      sv: 'Begränsat antal',
      en: 'Limited spots',
      ar: 'عدد محدود'
    },
    ageRange: '25-55',
    color: 'emerald',
    isOnline: true
  },
  // NATIONAL PROGRAMS
  {
    id: 'national-march-2026',
    type: 'national',
    targetGender: 'all',
    language: 'arabic',
    title: {
      sv: 'البرنامج الوطني للقيادة - مارس 2026',
      en: 'National Leadership Program - March 2026',
      ar: 'البرنامج الوطني للقيادة - مارس 2026'
    },
    description: {
      sv: 'Intensivt ledarprogram över två helger i mars. Perfekt för dig som vill utveckla ditt ledarskap.',
      en: 'Intensive leadership program over two weekends in March. Perfect for those who want to develop their leadership.',
      ar: 'برنامج قيادي مكثف على مدار عطلتين نهاية الأسبوع في مارس.'
    },
    duration: {
      sv: '2 helger (13-15 & 20-22 mars)',
      en: '2 weekends (March 13-15 & 20-22)',
      ar: 'عطلتان نهاية الأسبوع (13-15 و 20-22 مارس)'
    },
    period: {
      sv: '13-15 & 20-22 mars 2026',
      en: 'March 13-15 & 20-22, 2026',
      ar: '13-15 و 20-22 مارس 2026'
    },
    nextDate: '2026-03-13',
    location: {
      sv: 'Stockholm, Sverige',
      en: 'Stockholm, Sweden',
      ar: 'ستوكهولم، السويد'
    },
    spots: 30,
    spotsLeft: 30,
    ageRange: '25-55',
    color: 'violet'
  },
  {
    id: 'national-youth-2026',
    type: 'national',
    targetGender: 'all',
    language: 'swedish-english',
    title: {
      sv: 'Nationellt Ungdomsledarprogram - September 2026',
      en: 'National Youth Leadership Program - September 2026',
      ar: 'البرنامج الوطني لقيادة الشباب - سبتمبر 2026'
    },
    description: {
      sv: 'Ledarprogram för unga ledare (18-30 år). Utveckla ditt ledarskap tillsammans med andra unga visionärer. Genomförs på svenska/engelska.',
      en: 'Leadership program for young leaders (18-30 years). Develop your leadership together with other young visionaries. Conducted in Swedish/English.',
      ar: 'برنامج قيادي للقادة الشباب (18-30 سنة). طور قيادتك مع رؤساء شباب آخرين. يُقدم بالسويدية/الإنجليزية.'
    },
    duration: {
      sv: '2 helger (11-13 & 18-20 september)',
      en: '2 weekends (September 11-13 & 18-20)',
      ar: 'عطلتان نهاية الأسبوع (11-13 و 18-20 سبتمبر)'
    },
    period: {
      sv: '11-13 & 18-20 september 2026',
      en: 'September 11-13 & 18-20, 2026',
      ar: '11-13 و 18-20 سبتمبر 2026'
    },
    nextDate: '2026-09-11',
    location: {
      sv: 'Stockholm, Sverige',
      en: 'Stockholm, Sweden',
      ar: 'ستوكهولم، السويد'
    },
    spots: 25,
    spotsLeft: 25,
    ageRange: '18-30',
    color: 'sky'
  },
  {
    id: 'custom-training',
    type: 'national',
    targetGender: 'all',
    language: 'flexible',
    title: {
      sv: 'برامج تدريبية مخصصة',
      en: 'Custom Training Programs',
      ar: 'برامج تدريبية مخصصة'
    },
    description: {
      sv: 'Skräddarsydda ledarutbildningar för kyrkor och organisationer. Vi anpassar innehåll och format efter era behov.',
      en: 'Tailored leadership training for churches and organizations. We customize content and format to your needs.',
      ar: 'تدريب قيادي مخصص للكنائس والمنظمات. نقوم بتخصيص المحتوى والشكل وفقًا لاحتياجاتكم.'
    },
    duration: {
      sv: 'Enligt överenskommelse',
      en: 'As agreed',
      ar: 'حسب الاتفاق'
    },
    period: {
      sv: 'Flexibelt - kontakta oss',
      en: 'Flexible - contact us',
      ar: 'مرن - اتصل بنا'
    },
    nextDate: null,
    location: {
      sv: 'På plats hos er eller online',
      en: 'On-site or online',
      ar: 'في موقعكم أو عبر الإنترنت'
    },
    spots: null,
    spotsLeft: null,
    ageRange: null,
    color: 'amber',
    isCustom: true
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
