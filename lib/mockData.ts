// Mock data for when database is not available
export const mockUser = {
  id: 'mock-user-id',
  name: 'Demo User',
  email: 'demo@islamichub.com',
  role: 'user',
  avatar: '',
};

export const mockAdmin = {
  id: 'mock-admin-id',
  name: 'Admin User',
  email: 'admin@islamichub.com',
  role: 'admin',
  avatar: '',
};

export const mockVideos = [
  {
    _id: '507f1f77bcf86cd799439011',
    title: 'Understanding the Five Pillars of Islam',
    description: 'A comprehensive lecture explaining the fundamental principles of Islam and their importance in a Muslim\'s life. This video covers Shahada (faith), Salah (prayer), Zakat (charity), Sawm (fasting), and Hajj (pilgrimage) in detail. Learn about the spiritual significance and practical implementation of each pillar in daily life.',
    videoUrl: 'https://www.youtube.com/watch?v=5k8xH3l6RWs',
    thumbnail: 'https://img.youtube.com/vi/5k8xH3l6RWs/maxresdefault.jpg',
    category: 'lecture',
    duration: 3600,
    views: 1250,
    likes: 89,
    dislikes: 3,
    bookmarks: 15,
    author: {
      ...mockAdmin,
      subscribers: 12500,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
    },
    comments: [],
    createdAt: new Date().toISOString(),
    tags: ['islam', 'five pillars', 'shahada', 'salah', 'zakat', 'sawm', 'hajj', 'faith', 'prayer']
  },
  {
    _id: '507f1f77bcf86cd799439012',
    title: 'Beautiful Nasheed - Allahu Akbar',
    description: 'A soulful nasheed praising Allah and expressing gratitude for His blessings. This beautiful recitation brings peace to the heart and reminds us of Allah\'s greatness and mercy.',
    videoUrl: 'https://www.youtube.com/watch?v=QH2-TGUlwu4',
    thumbnail: 'https://img.youtube.com/vi/QH2-TGUlwu4/maxresdefault.jpg',
    category: 'nasheed',
    duration: 240,
    views: 856,
    likes: 45,
    dislikes: 1,
    bookmarks: 8,
    author: {
      ...mockAdmin,
      subscribers: 12500,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
    },
    comments: [],
    createdAt: new Date().toISOString(),
    tags: ['nasheed', 'allahu akbar', 'praise', 'islamic music', 'spiritual', 'peace']
  },
  {
    _id: '507f1f77bcf86cd799439013',
    title: 'Dawah: Spreading the Message of Islam',
    description: 'Learn about the importance of dawah and how to effectively share the beautiful message of Islam with wisdom, patience, and kindness.',
    videoUrl: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
    thumbnail: 'https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg',
    category: 'dawah',
    duration: 1800,
    views: 2100,
    likes: 156,
    dislikes: 5,
    bookmarks: 12,
    author: {
      ...mockAdmin,
      subscribers: 12500,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
    },
    comments: [],
    createdAt: new Date().toISOString(),
    tags: ['dawah', 'islam', 'spreading message', 'wisdom', 'patience', 'kindness']
  },
  {
    _id: '507f1f77bcf86cd799439014',
    title: 'The Importance of Prayer in Islam',
    description: 'A detailed explanation of the significance of Salah (prayer) in a Muslim\'s daily life and its spiritual benefits.',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    category: 'lecture',
    duration: 2700,
    views: 3200,
    likes: 234,
    dislikes: 8,
    bookmarks: 20,
    author: {
      ...mockAdmin,
      subscribers: 12500,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
    },
    comments: [],
    createdAt: new Date().toISOString(),
    tags: ['salah', 'prayer', 'islam', 'spiritual', 'daily life', 'worship']
  },
  {
    _id: '507f1f77bcf86cd799439015',
    title: 'Peaceful Nasheed - SubhanAllah',
    description: 'A calming nasheed that brings peace to the heart and mind, perfect for relaxation and reflection.',
    videoUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
    thumbnail: 'https://img.youtube.com/vi/ScMzIvxBSi4/maxresdefault.jpg',
    category: 'nasheed',
    duration: 180,
    views: 1450,
    likes: 98,
    dislikes: 2,
    bookmarks: 6,
    author: {
      ...mockAdmin,
      subscribers: 12500,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
    },
    comments: [],
    createdAt: new Date().toISOString(),
    tags: ['nasheed', 'subhanallah', 'peaceful', 'relaxation', 'reflection', 'spiritual']
  },
  {
    _id: '507f1f77bcf86cd799439016',
    title: 'Understanding the Quran',
    description: 'An introduction to the Holy Quran and its importance in Islamic life, covering its revelation, structure, and guidance.',
    videoUrl: 'https://www.youtube.com/watch?v=YQHsXMglC9A',
    thumbnail: 'https://img.youtube.com/vi/YQHsXMglC9A/maxresdefault.jpg',
    category: 'lecture',
    duration: 2400,
    views: 2800,
    likes: 187,
    dislikes: 6,
    bookmarks: 18,
    author: {
      ...mockAdmin,
      subscribers: 12500,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
    },
    comments: [],
    createdAt: new Date().toISOString(),
    tags: ['quran', 'holy book', 'revelation', 'guidance', 'islam', 'study']
  },
];

export const mockNews = [
  {
    _id: '68d7a23ed3911a8c6971834e',
    title: 'New Islamic Center Opens in Downtown',
    content: `A new Islamic center has opened in the heart of downtown, providing a place for the Muslim community to gather, pray, and learn.

The center features modern facilities including a spacious prayer hall, educational classrooms, and a community center. The opening ceremony was attended by local community leaders and religious scholars.

"This center represents a significant milestone for our community," said Imam Ahmed Hassan, the center's spiritual leader. "We are committed to serving not just Muslims, but the entire community through interfaith dialogue and community service programs."

The center will offer:
- Daily prayers and Friday congregational prayers
- Islamic education classes for children and adults
- Community events and interfaith gatherings
- Social services and support programs
- Library with Islamic literature and resources

The construction of the center was funded through community donations and took two years to complete. The building incorporates sustainable design elements and is fully accessible to people with disabilities.

Local residents have welcomed the new center, with many expressing excitement about the positive impact it will have on the neighborhood. The center is expected to serve over 500 families in the area.

Regular programs will begin next week, with special events planned for the upcoming Islamic holidays.`,
    excerpt: 'A new Islamic center opens downtown with modern facilities for the Muslim community.',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=400&fit=crop',
    category: 'islamic',
    author: mockAdmin,
    published: true,
    featured: true,
    views: 2100,
    tags: ['islamic center', 'community', 'downtown', 'mosque', 'religion'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '507f1f77bcf86cd799439012',
    title: 'Global Muslim Population Reaches 2 Billion',
    content: `According to recent demographic studies, the global Muslim population has reached approximately 2 billion people, representing about 25% of the world's total population.

The study, conducted by the Pew Research Center, shows significant growth in Muslim populations across various regions, with the highest concentrations in Asia and Africa.

Key findings include:
- Indonesia remains the country with the largest Muslim population
- Significant growth in European and North American Muslim communities
- Increasing diversity within Muslim communities worldwide
- Growing influence of Muslim voices in global discourse

The research also highlights the importance of understanding Muslim communities' contributions to global culture, science, and society.`,
    excerpt: 'Recent demographic studies show the global Muslim population has reached 2 billion people worldwide.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop',
    category: 'world',
    author: mockAdmin,
    published: true,
    featured: false,
    views: 1850,
    tags: ['demographics', 'population', 'global', 'statistics'],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    _id: '507f1f77bcf86cd799439013',
    title: 'New Islamic Education App Launches',
    content: `A groundbreaking new mobile application has been launched to make Islamic education more accessible to Muslims worldwide.

The app, called "Learn Islam," features:
- Interactive Quran learning with audio recitations
- Hadith collections with search functionality
- Islamic history lessons
- Prayer time notifications
- Qibla direction finder
- Community features for discussion and learning

Developed by a team of Islamic scholars and technology experts, the app aims to bridge the gap between traditional Islamic learning and modern technology.

"We wanted to create something that would make Islamic knowledge accessible to everyone, regardless of their location or schedule," said Dr. Fatima Al-Zahra, the app's lead developer.

The app is available in multiple languages and has already been downloaded over 100,000 times in its first month of release.`,
    excerpt: 'A new mobile app makes Islamic education more accessible with interactive learning features.',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop',
    category: 'technology',
    author: mockAdmin,
    published: true,
    featured: true,
    views: 3200,
    tags: ['technology', 'education', 'mobile app', 'islamic learning'],
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

export const mockProducts = [
  {
    _id: '1',
    name: 'Holy Quran - Arabic with English Translation',
    description: 'A beautiful hardcover edition of the Holy Quran with clear Arabic text and comprehensive English translation.',
    price: 29.99,
    originalPrice: 39.99,
    images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'],
    category: 'books',
    stock: 50,
    sku: 'QURAN-001',
    features: ['Arabic text', 'English translation', 'Hardcover', 'High quality paper'],
    tags: ['quran', 'holy book', 'translation', 'arabic'],
    featured: true,
    active: true,
    createdAt: new Date().toISOString(),
  },
];

export const mockSurahs = [
  {
    _id: '1',
    surahNumber: 1,
    surahName: 'Al-Fatiha',
    surahNameArabic: 'الفاتحة',
    surahNameEnglish: 'The Opening',
    totalAyahs: 7,
    revelationPlace: 'makkah',
    ayahs: [
      {
        ayahNumber: 1,
        arabicText: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
        englishTranslation: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
        banglaTranslation: 'পরম করুণাময়, অসীম দয়ালু আল্লাহর নামে।',
        audioUrl: '',
      },
      {
        ayahNumber: 2,
        arabicText: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
        englishTranslation: '[All] praise is [due] to Allah, Lord of the worlds.',
        banglaTranslation: 'সকল প্রশংসা আল্লাহর জন্য, যিনি বিশ্বজগতের প্রতিপালক।',
        audioUrl: '',
      },
      {
        ayahNumber: 3,
        arabicText: 'الرَّحْمَٰنِ الرَّحِيمِ',
        englishTranslation: 'The Entirely Merciful, the Especially Merciful.',
        banglaTranslation: 'যিনি পরম করুণাময়, অসীম দয়ালু।',
        audioUrl: '',
      },
      {
        ayahNumber: 4,
        arabicText: 'مَالِكِ يَوْمِ الدِّينِ',
        englishTranslation: 'Sovereign of the Day of Recompense.',
        banglaTranslation: 'যিনি বিচার দিবসের মালিক।',
        audioUrl: '',
      },
      {
        ayahNumber: 5,
        arabicText: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
        englishTranslation: 'It is You we worship and You we ask for help.',
        banglaTranslation: 'আমরা একমাত্র তোমারই ইবাদত করি এবং একমাত্র তোমারই নিকট সাহায্য প্রার্থনা করি।',
        audioUrl: '',
      },
      {
        ayahNumber: 6,
        arabicText: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
        englishTranslation: 'Guide us to the straight path.',
        banglaTranslation: 'আমাদেরকে সরল পথ দেখাও।',
        audioUrl: '',
      },
      {
        ayahNumber: 7,
        arabicText: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
        englishTranslation: 'The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.',
        banglaTranslation: 'তাদের পথ, যাদের প্রতি তুমি অনুগ্রহ করেছ, যাদের প্রতি তুমি রাগান্বিত নও এবং যারা পথভ্রষ্ট নয়।',
        audioUrl: '',
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    _id: '2',
    surahNumber: 2,
    surahName: 'Al-Baqarah',
    surahNameArabic: 'البقرة',
    surahNameEnglish: 'The Cow',
    totalAyahs: 286,
    revelationPlace: 'madinah',
    ayahs: [
      {
        ayahNumber: 1,
        arabicText: 'الم',
        englishTranslation: 'Alif, Lam, Meem.',
        banglaTranslation: 'আলিফ, লাম, মীম।',
        audioUrl: '',
      },
      {
        ayahNumber: 2,
        arabicText: 'ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ',
        englishTranslation: 'This is the Book about which there is no doubt, a guidance for those conscious of Allah.',
        banglaTranslation: 'এটি সেই কিতাব যাতে কোন সন্দেহ নেই, মুত্তাকীদের জন্য পথনির্দেশ।',
        audioUrl: '',
      },
      {
        ayahNumber: 3,
        arabicText: 'الَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ وَيُقِيمُونَ الصَّلَاةَ وَمِمَّا رَزَقْنَاهُمْ يُنفِقُونَ',
        englishTranslation: 'Who believe in the unseen, establish prayer, and spend out of what We have provided for them.',
        banglaTranslation: 'যারা অদৃশ্যে বিশ্বাস করে, সালাত কায়েম করে এবং আমি তাদেরকে যে রিজিক দিয়েছি তা থেকে ব্যয় করে।',
        audioUrl: '',
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    _id: '3',
    surahNumber: 3,
    surahName: 'Al-Imran',
    surahNameArabic: 'آل عمران',
    surahNameEnglish: 'Family of Imran',
    totalAyahs: 200,
    revelationPlace: 'madinah',
    ayahs: [
      {
        ayahNumber: 1,
        arabicText: 'الم',
        englishTranslation: 'Alif, Lam, Meem.',
        banglaTranslation: 'আলিফ, লাম, মীম।',
        audioUrl: '',
      },
      {
        ayahNumber: 2,
        arabicText: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ',
        englishTranslation: 'Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence.',
        banglaTranslation: 'আল্লাহ, তিনি ছাড়া কোন ইলাহ নেই, তিনি চিরঞ্জীব, সব কিছুর ধারক।',
        audioUrl: '',
      },
    ],
    createdAt: new Date().toISOString(),
  },
];

export const mockHadiths = [
  {
    _id: '1',
    collectionName: 'bukhari',
    hadithNumber: '1',
    arabicText: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى',
    englishTranslation: 'Actions are according to intentions, and every person will have what they intended.',
    banglaTranslation: 'নিশ্চয়ই সকল কাজের ফলাফল নির্ভর করে নিয়তের উপর, এবং প্রত্যেক ব্যক্তিই তার নিয়ত অনুযায়ী ফল পাবে।',
    narrator: 'Umar ibn al-Khattab',
    chapter: 'How Revelation Started',
    book: 'Sahih al-Bukhari',
    volume: '1',
    page: '1',
    tags: ['intention', 'actions', 'niyyah'],
    createdAt: new Date().toISOString(),
  },
];
