import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Quran from '@/models/Quran';

// Simple seed endpoint to insert demo Quran data
// Call with: POST /api/quran/seed
// Note: Intended for development/demo environments.

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const demoSurahs = [
      {
        surahNumber: 1,
        surahName: 'Al-Fatiha',
        surahNameArabic: 'ٱلْفَاتِحَة',
        surahNameEnglish: 'The Opening',
        ayahs: [
          {
            ayahNumber: 1,
            arabicText: 'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ',
            englishTranslation: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
            banglaTranslation: 'পরম করুণাময়, অতি দয়ালু আল্লাহ্‌র নামে শুরু করছি।',
            audioUrl: '',
          },
          {
            ayahNumber: 2,
            arabicText: 'الْحَمْدُ لِلّٰهِ رَبِّ الْعَالَمِينَ',
            englishTranslation: 'All praise is due to Allah, Lord of the worlds—',
            banglaTranslation: 'সমস্ত প্রশংসা আল্লাহ্‌র জন্য, যিনি সকল জগতের প্রতিপালক।',
            audioUrl: '',
          },
          {
            ayahNumber: 3,
            arabicText: 'الرَّحْمٰنِ الرَّحِيمِ',
            englishTranslation: 'The Entirely Merciful, the Especially Merciful,',
            banglaTranslation: 'পরম করুণাময়, অতি দয়ালু—',
            audioUrl: '',
          },
          {
            ayahNumber: 4,
            arabicText: 'مَالِكِ يَوْمِ الدِّينِ',
            englishTranslation: 'Sovereign of the Day of Recompense.',
            banglaTranslation: 'বিচার দিনের অধিপতি।',
            audioUrl: '',
          },
          {
            ayahNumber: 5,
            arabicText: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
            englishTranslation: 'It is You we worship and You we ask for help.',
            banglaTranslation: 'আমরা একমাত্র তোমারই ইবাদত করি এবং তোমারই নিকট সাহায্য চাই।',
            audioUrl: '',
          },
          {
            ayahNumber: 6,
            arabicText: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
            englishTranslation: 'Guide us to the straight path—',
            banglaTranslation: 'আমাদেরকে সরল পথ দেখাও—',
            audioUrl: '',
          },
          {
            ayahNumber: 7,
            arabicText: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
            englishTranslation: 'The path of those upon whom You have bestowed favor, not of those who have earned Your anger nor of those who go astray.',
            banglaTranslation: 'তাদের পথ যাদের প্রতি তুমি অনুগ্রহ করেছ, যাদের প্রতি রোষান্বিত হওনি এবং যারা পথভ্রষ্ট নয়।',
            audioUrl: '',
          },
        ],
        totalAyahs: 7,
        revelationPlace: 'makkah' as const,
      },
      {
        surahNumber: 112,
        surahName: 'Al-Ikhlas',
        surahNameArabic: 'ٱلْإِخْلَاص',
        surahNameEnglish: 'Sincerity',
        ayahs: [
          {
            ayahNumber: 1,
            arabicText: 'قُلْ هُوَ اللّٰهُ أَحَدٌ',
            englishTranslation: 'Say, He is Allah, One,',
            banglaTranslation: 'বলুন, তিনি আল্লাহ, এক।',
            audioUrl: '',
          },
          {
            ayahNumber: 2,
            arabicText: 'اللّٰهُ الصَّمَدُ',
            englishTranslation: 'Allah, the Eternal Refuge.',
            banglaTranslation: 'আল্লাহ্ অবলম্বনহীন, সকলের অবলম্বন।',
            audioUrl: '',
          },
        ],
        totalAyahs: 4,
        revelationPlace: 'makkah' as const,
      },
    ];

    const results = [] as any[];
    for (const s of demoSurahs) {
      const upserted = await Quran.findOneAndUpdate(
        { surahNumber: s.surahNumber },
        s,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      results.push(upserted);
    }

    return NextResponse.json({ message: 'Quran demo data seeded', count: results.length, surahs: results });
  } catch (error) {
    console.error('Seed Quran error:', error);
    return NextResponse.json({ error: 'Failed to seed Quran demo data' }, { status: 500 });
  }
}


