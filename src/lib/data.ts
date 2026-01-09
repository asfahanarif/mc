
import type { Testimonial, ForumPost, Article, Dua, Hadith, TeamMember, EventPost, PlaceholderImage } from "./types";
import { countries } from "./countries";

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/quran", label: "Qur’an" },
  { href: "/resources", label: "Resources" },
  { href: "/forum", label: "Forum" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export const testimonials: Testimonial[] = [
    {
        id: "1",
        name: "Aisha B.",
        location: "Toronto, Canada",
        comment: "Muslimahs Club has been a true blessing. The community is so supportive, and the resources have helped me grow so much in my deen. I finally feel like I have a place where I belong.",
        avatar: "https://picsum.photos/seed/1/40/40"
    },
    {
        id: "2",
        name: "Fatima Z.",
        location: "London, UK",
        comment: "I love the Qur'an sessions and the variety of events. It's amazing to connect with sisters from all over the world who share the same values. Highly recommend!",
        avatar: "https://picsum.photos/seed/2/40/40"
    },
    {
        id: "3",
        name: "Zainab A.",
        location: "Lagos, Nigeria",
        comment: "The Q&A forum is my favorite feature. Getting well-thought-out answers to my questions has been invaluable. The sense of sisterhood here is incredible.",
        avatar: "https://picsum.photos/seed/3/40/40"
    },
    {
        id: "4",
        name: "Sumayyah K.",
        location: "Kuala Lumpur, Malaysia",
        comment: "As a new Muslim, this platform has been my go-to for authentic knowledge. The articles are easy to understand and the community has been so welcoming.",
        avatar: "https://picsum.photos/seed/4/40/40"
    }
];

export const forumPosts: ForumPost[] = [
    {
        id: 'q1',
        author: 'Amina',
        question: 'What is the best way to start learning Arabic to understand the Quran?',
        answer: 'Starting with the Arabic alphabet and basic grammar is a great first step. We recommend finding a structured course, like the ones in our resources section, and practicing daily. Consistency is key!',
        isAnswered: true
    },
    {
        id: 'q2',
        author: 'Layla',
        question: 'How can I balance my work/studies with my daily prayers and Islamic learning?',
        answer: 'Balancing responsibilities can be challenging. Creating a schedule and prioritizing your prayers is essential. Try dedicating even 15-20 minutes daily for Islamic learning. Small, consistent efforts make a big difference. May Allah make it easy for you.',
        isAnswered: true
    },
    {
        id: 'q3',
        author: 'Noor',
        question: 'I struggle with staying motivated to pray all my sunnah prayers. Any advice?',
        answer: null,
        isAnswered: false
    }
];


export const articles: Article[] = [
    { id: 'article-1', title: 'The Pillars of Islam and Their Meanings', source: 'islamqa.info', category: 'Aqeedah', content: 'A foundational explanation of the five pillars of Islam: Shahadah, Salah, Zakat, Sawm, and Hajj, and their significance in the life of a Muslim.', url: 'https://islamqa.info/en/search?q=The+Pillars+of+Islam' },
    { id: 'article-2', title: 'Fiqh of Menstruation: A Guide for Women', source: 'islamqa.info', category: 'Fiqh', content: 'Detailed rulings on prayer, fasting, and reading the Quran during menstruation, providing clarity on common questions and misconceptions.', url: 'https://islamqa.info/en/search?q=Fiqh+of+Menstruation' },
    { id: 'article-3', title: 'The Importance of Good Character (Akhlaq)', source: 'islamqa.info', category: 'Character', content: 'Exploring the emphasis on good manners and noble character in Islam, with examples from the life of the Prophet Muhammad (PBUH).', url: 'https://islamqa.info/en/search?q=Importance+of+Good+Character+(Akhlaq)' },
    { id: 'article-4', title: 'Raising Children in an Islamic Household', source: 'islamqa.info', category: 'Family', content: 'Practical advice and Islamic principles for nurturing children, instilling faith, and creating a loving and supportive family environment.', url: 'https://islamqa.info/en/search?q=Raising+Children+in+an+Islamic+Household' },
    { id: 'article-5', title: 'Understanding Tawheed (The Oneness of Allah)', source: 'islamqa.info', category: 'Aqeedah', content: 'A comprehensive overview of the core concept of Tawheed, its categories (Rububiyyah, Uluhiyyah, Asma wa Sifat), and its role in Islam.', url: 'https://islamqa.info/en/search?q=Understanding+Tawheed' },
    { id: 'article-6', title: 'Riba (Interest) and Islamic Finance', source: 'islamqa.info', category: 'Finance', content: 'An explanation of what constitutes Riba, its prohibition in the Quran and Sunnah, and the principles of halal transactions and Islamic banking.', url: 'https://islamqa.info/en/search?q=Riba+(Interest)+and+Islamic+Finance' },
    { id: 'article-7', title: 'The Story of Prophet Yusuf (Joseph)', source: 'islamqa.info', category: 'History', content: 'A narration of the beautiful story of Prophet Yusuf (alayhis salaam) from the Quran, highlighting lessons of patience, trust in Allah, and forgiveness.', url: 'https://islamqa.info/en/search?q=The+Story+of+Prophet+Yusuf' },
    { id: 'article-8', title: 'Dealing with Anxiety and Stress Islamically', source: 'islamqa.info', category: 'Character', content: 'Guidance from the Quran and Sunnah on how to find peace and manage stress through prayer, dhikr, and putting one\'s trust in Allah.', url: 'https://islamqa.info/en/search?q=Dealing+with+Anxiety+and+Stress+Islamically' },
    { id: 'article-9', title: 'The Virtues and Rulings of Jumu\'ah Prayer', source: 'islamqa.info', category: 'Fiqh', content: 'Discussing the significance of Friday prayer, the etiquette of attending the khutbah, and the special rewards associated with this blessed day.', url: 'https://islamqa.info/en/search?q=The+Virtues+and+Rulings+of+Jumu\'ah+Prayer' },
    { id: 'article-10', title: 'The Role of Women in Islam', source: 'islamqa.info', category: 'Family', content: 'Addressing common misconceptions and clarifying the esteemed position and rights of women in Islam as mothers, wives, daughters, and members of society.', url: 'https://islamqa.info/en/search?q=The+Role+of+Women+in+Islam' },
    { id: 'article-11', title: 'How to Perform Wudu (Ablution) Correctly', source: 'islamqa.info', category: 'Fiqh', content: 'A step-by-step guide to performing wudu according to the Sunnah, including the obligatory and recommended actions.', url: 'https://islamqa.info/en/search?q=How+to+Perform+Wudu' },
    { id: 'article-12', title: 'The Prohibition of Bid\'ah (Religious Innovation)', source: 'islamqa.info', category: 'Aqeedah', content: 'Explaining the meaning of bid\'ah in the context of worship and why it is considered a deviation from the path of the Sunnah.', url: 'https://islamqa.info/en/search?q=Prohibition+of+Bid\'ah' },
    { id: 'article-13', title: 'The Life of Aisha bint Abi Bakr', source: 'islamqa.info', category: 'History', content: 'A biographical look at the life of the Mother of the Believers, Aisha (radiyallahu anha), her knowledge, and her contribution to Islam.', url: 'https://islamqa.info/en/search?q=The+Life+of+Aisha+bint+Abi+Bakr' },
    { id: 'article-14', title: 'Marriage in Islam: Rights and Responsibilities', source: 'islamqa.info', category: 'Family', content: 'An overview of the rights and responsibilities of both the husband and wife in an Islamic marriage, based on the Quran and Sunnah.', url: 'https://islamqa.info/en/search?q=Marriage+in+Islam:+Rights+and+Responsibilities' },
    { id: 'article-15', title: 'The Concept of Qadr (Divine Decree)', source: 'islamqa.info', category: 'Aqeedah', content: 'Understanding the sixth pillar of faith, believing in divine decree and predestination, and how it relates to free will.', url: 'https://islamqa.info/en/search?q=Concept+of+Qadr+(Divine+Decree)' },
    { id: 'article-16', title: 'Giving Dawah: Methods and Etiquette', source: 'islamqa.info', category: 'Dawah', content: 'Guidance on how to effectively and wisely invite others to Islam, following the example of the prophets.', url: 'https://islamqa.info/en/search?q=Giving+Dawah:+Methods+and+Etiquette' },
    { id: 'article-17', title: 'The Signs of the Day of Judgment', source: 'islamqa.info', category: 'Aqeedah', content: 'A summary of the minor and major signs of the Last Day as mentioned in the Quran and authentic hadith.', url: 'https://islamqa.info/en/search?q=Signs+of+the+Day+of+Judgment' },
    { id: 'article-18', title: 'Rulings on Zakat al-Fitr', source: 'islamqa.info', category: 'Fiqh', content: 'Explaining the obligation of Zakat al-Fitr at the end of Ramadan, its amount, and who is eligible to receive it.', url: 'https://islamqa.info/en/search?q=Rulings+on+Zakat+al-Fitr' },
    { id: 'article-19', title: 'The Dangers of Gheebah (Backbiting)', source: 'islamqa.info', category: 'Character', content: 'Highlighting the severity of backbiting and slander in Islam and the importance of guarding one\'s tongue.', url: 'https://islamqa.info/en/search?q=Dangers+of+Gheebah+(Backbiting)' },
    { id: 'article-20', title: 'The Battle of Badr: Lessons and Morals', source: 'islamqa.info', category: 'History', content: 'Recounting the events of the first major battle in Islam and the key lessons in faith, strategy, and trust in Allah.', url: 'https://islamqa.info/en/search?q=The+Battle+of+Badr' },
    { id: 'article-21', title: 'What is Shirk and What are its Types?', source: 'islamqa.info', category: 'Aqeedah', content: 'A detailed explanation of shirk (polytheism), the greatest sin in Islam, and its different forms, both major and minor.', url: 'https://islamqa.info/en/search?q=What+is+Shirk+and+its+Types' },
    { id: 'article-22', title: 'Islamic Inheritance Laws', source: 'islamqa.info', category: 'Finance', content: 'An introduction to the principles of Islamic inheritance, explaining how an estate is distributed according to the shares prescribed in the Quran.', url: 'https://islamqa.info/en/search?q=Islamic+Inheritance+Laws' },
    { id: 'article-23', title: 'The Importance of Seeking Knowledge', source: 'islamqa.info', category: 'Character', content: 'Discussing the high status of seeking Islamic knowledge and its virtues as mentioned in the Quran and Sunnah.', url: 'https://islamqa.info/en/search?q=Importance+of+Seeking+Knowledge' },
    { id: 'article-24', title: 'The Etiquette of Making Dua (Supplication)', source: 'islamqa.info', category: 'Fiqh', content: 'Guidance on the best times, places, and manners of making dua to increase the likelihood of its acceptance by Allah.', url: 'https://islamqa.info/en/search?q=Etiquette+of+Making+Dua' },
    { id: 'article-25', title: 'The Seerah: Makkan Period', source: 'islamqa.info', category: 'History', content: 'A summary of the first 13 years of the Prophet Muhammad\'s (PBUH) mission in Makkah, from the first revelation to the Hijra.', url: 'https://islamqa.info/en/search?q=The+Seerah:+Makkan+Period' },
    { id: 'article-26', title: 'Understanding the Quran: Tafsir and Tadabbur', source: 'islamqa.info', category: 'Quran', content: 'The difference between tafsir (exegesis) and tadabbur (reflection) and how both are essential for a deeper connection with the Quran.', url: 'https://islamqa.info/en/search?q=Understanding+the+Quran' },
    { id: 'article-27', title: 'Dealing with Non-Muslim Family Members', source: 'islamqa.info', category: 'Dawah', content: 'Advice for Muslims on maintaining good relationships with non-Muslim relatives while upholding Islamic principles.', url: 'https://islamqa.info/en/search?q=Dealing+with+Non-Muslim+Family' },
    { id: 'article-28', title: 'Rulings on Eid Prayer and Celebration', source: 'islamqa.info', category: 'Fiqh', content: 'The Sunnahs of Eid al-Fitr and Eid al-Adha, how to perform the Eid prayer, and the Islamic perspective on celebrating these festivals.', url: 'https://islamqa.info/en/search?q=Rulings+on+Eid+Prayer' },
    { id: 'article-29', title: 'The Story of Prophet Musa (Moses) and Fir\'awn', source: 'islamqa.info', category: 'History', content: 'The Quranic account of Prophet Musa\'s struggle against the tyranny of Pharaoh, a story of faith and divine victory.', url: 'https://islamqa.info/en/search?q=Story+of+Prophet+Musa+and+Firawn' },
    { id: 'article-30', title: 'The Importance of Hijab', source: 'islamqa.info', category: 'Family', content: 'Explaining the wisdom behind the prescription of Hijab for Muslim women, its conditions, and its spiritual benefits.', url: 'https://islamqa.info/en/search?q=The+Importance+of+Hijab' },
    { id: 'article-31', title: 'The Miracles of the Quran', source: 'islamqa.info', category: 'Quran', content: 'Exploring the linguistic, scientific, and legislative miracles of the Quran that serve as proof of its divine origin.', url: 'https://islamqa.info/en/search?q=Miracles+of+the+Quran' },
    { id: 'article-32', title: 'Islamic Rulings on Photography and Pictures', source: 'islamqa.info', category: 'Fiqh', content: 'A discussion of the different scholarly opinions on the permissibility of making and keeping images and photographs.', url: 'https://islamqa.info/en/search?q=Rulings+on+Photography' },
    { id: 'article-33', title: 'The Life of Khadijah bint Khuwaylid', source: 'islamqa.info', category: 'History', content: 'Celebrating the life of the first wife of the Prophet (PBUH), her unwavering support, and her exalted status in Islam.', url: 'https://islamqa.info/en/search?q=Life+of+Khadijah+bint+Khuwaylid' },
    { id: 'article-34', title: 'How to Attain Khushoo\' in Prayer', source: 'islamqa.info', category: 'Character', content: 'Practical tips to improve focus, concentration, and humility in Salah, leading to a more meaningful connection with Allah.', url: 'https://islamqa.info/en/search?q=How+to+Attain+Khushoo+in+Prayer' },
    { id: 'article-35', title: 'Belief in the Angels', source: 'islamqa.info', category: 'Aqeedah', content: 'An essential part of faith is to believe in the angels. This article discusses their nature, roles, and names mentioned in the texts.', url: 'https://islamqa.info/en/search?q=Belief+in+the+Angels' },
    { id: 'article-36', title: 'Rulings on Buying and Selling Gold and Silver', source: 'islamqa.info', category: 'Finance', content: 'Explaining the conditions of hand-to-hand exchange required when trading currencies like gold and silver to avoid Riba.', url: 'https://islamqa.info/en/search?q=Rulings+on+Buying+and+Selling+Gold' },
    { id: 'article-37', title: 'The Conquest of Makkah', source: 'islamqa.info', category: 'History', content: 'The story of the peaceful conquest of Makkah by the Prophet Muhammad (PBUH) and the lessons in mercy and forgiveness.', url: 'https://islamqa.info/en/search?q=Conquest+of+Makkah' },
    { id: 'article-38', title: 'The Islamic View on Dreams', source: 'islamqa.info', category: 'Fiqh', content: 'The different types of dreams in Islam, the etiquette of sharing them, and the difference between true dreams and whispers from Shaytan.', url: 'https://islamqa.info/en/search?q=Islamic+View+on+Dreams' },
    { id: 'article-39', 'title': 'Maintaining Ties of Kinship', 'source': 'islamqa.info', 'category': 'Family', 'content': 'The great importance placed on upholding family ties (silat al-rahim) in Islam and the warnings against severing them.', url: 'https://islamqa.info/en/search?q=Maintaining+Ties+of+Kinship' },
    { id: 'article-40', 'title': 'The Punishment and Bliss of the Grave', 'source': 'islamqa.info', 'category': 'Aqeedah', 'content': 'Evidence from the Quran and Sunnah for the reality of the questioning in the grave and the subsequent bliss or punishment.', url: 'https://islamqa.info/en/search?q=Punishment+and+Bliss+of+the+Grave' },
    { id: 'article-41', 'title': 'The Story of Prophet Ibrahim (Abraham)', 'source': 'islamqa.info', 'category': 'History', 'content': 'Exploring the life of the great prophet and friend of Allah, Ibrahim (alayhis salaam), his search for truth, and his unwavering submission.', url: 'https://islamqa.info/en/search?q=Story+of+Prophet+Ibrahim' },
    { id: 'article-42', 'title': 'Halal and Haram Food: A Guideline', 'source': 'islamqa.info', 'category': 'Fiqh', 'content': 'General principles for determining what is permissible (halal) and impermissible (haram) to eat and drink in Islam.', url: 'https://islamqa.info/en/search?q=Halal+and+Haram+Food' },
    { id: 'article-43', 'title': 'The Virtue of Patience (Sabr)', 'source': 'islamqa.info', 'category': 'Character', 'content': 'Discussing the different types of patience, its immense reward, and how it is a characteristic of the believers.', url: 'https://islamqa.info/en/search?q=The+Virtue+of+Patience+(Sabr)' },
    { id: 'article-44', 'title': 'Polygyny in Islam: Wisdom and Rulings', 'source': 'islamqa.info', 'category': 'Family', 'content': 'An explanation of the concept of polygyny in Islam, the condition of justice, and the wisdom behind its permissibility.', url: 'https://islamqa.info/en/search?q=Polygyny+in+Islam' },
    { id: 'article-45', 'title': 'Rulings Pertaining to the Newborn Child', 'source': 'islamqa.info', 'category': 'Fiqh', 'content': 'A summary of the Sunnahs related to a newborn, including the adhan, tahneek, aqeeqah, and naming the child.', url: 'https://islamqa.info/en/search?q=Rulings+Pertaining+to+the+Newborn+Child' },
    { id: 'article-46', 'title': 'The Seerah: Medinan Period', 'source': 'islamqa.info', 'category': 'History', 'content': 'An overview of the final 10 years of the Prophet\'s (PBUH) life in Medinah, the establishment of the Muslim state, and major events.', url: 'https://islamqa.info/en/search?q=The+Seerah:+Medinan+Period' },
    { id: 'article-47', 'title': 'The Evil Eye and its Cure', 'source': 'islamqa.info', 'category': 'Aqeedah', 'content': 'Understanding the reality of the evil eye (al-ayn), how to protect oneself from it, and the Islamic methods of treatment (ruqyah).', url: 'https://islamqa.info/en/search?q=The+Evil+Eye+and+its+Cure' },
    { id: 'article-48', 'title': 'The Importance of Being a Good Neighbor', 'source': 'islamqa.info', 'category': 'Character', 'content': 'Exploring the great emphasis Islam places on honoring and being kind to one\'s neighbors, regardless of their faith.', url: 'https://islamqa.info/en/search?q=Importance+of+Being+a+Good+Neighbor' },
    { id: 'article-49', 'title': 'Islamic Guidelines on Dress and Adornment', 'source': 'islamqa.info', 'category': 'Fiqh', 'content': 'Discussing the principles of Islamic dress for both men and women, covering modesty, permissible adornments, and prohibitions.', url: 'https://islamqa.info/en/search?q=Islamic+Guidelines+on+Dress' },
    { id: 'article-50', 'title': 'The Story of the People of the Cave (Ashab al-Kahf)', 'source': 'islamqa.info', 'category': 'History', 'content': 'The Quranic narrative of the young men who fled for the sake of their faith and were protected by Allah in a cave for hundreds of years.', url: 'https://islamqa.info/en/search?q=People+of+the+Cave+(Ashab+al-Kahf)' }
];


export const duas: Dua[] = [
    // Morning Duas
    {
        "id": "m1", "category": "Morning", "title": "Ayat al-Kursi",
        "arabic": "ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ ۚ لَا تَأْخُذُهُۥ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُۥ مَا فِى ٱلسَّمَٰوَٰتِ وَمَا فِى ٱلْأَرْضِ ۗ مَن ذَا ٱلَّذِى يَشْفَعُ عِندَهُۥٓ إِلَّا بِإِذْنِهِۦ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَىْءٍ مِّنْ عِلْمِهِۦٓ إِلَّا بِمَا شَآءَ ۚ وَسِعَ كُرْسِيُّهُ ٱلسَّمَٰوَٰتِ وَٱلْأَرْضَ ۖ وَلَا يَـُٔودُهُۥ حِفْظُhُمَا ۚ وَهُوَ ٱلْعَلِىُّ ٱلْعَظِيمُ",
        "transliteration": "Allahu la ilaha illa Huwa, Al-Hayyul-Qayyum. La ta'khudhuhu sinatun wa la nawm. Lahu ma fis-samawati wa ma fil-ardh. Man dhal-ladhi yashfa'u 'indahu illa bi-idhnihi. Ya'lamu ma bayna aydihim wa ma khalfahum. Wa la yuhituna bi shay'in min 'ilmihi illa bima sha'a. Wasi'a kursiyyuhus-samawati wal-ardha. Wa la ya'uduhu hifdhuhuma. Wa Huwal-'Aliyyul-'Adheem.",
        "translation": "Allah! There is no god but He - the Living, The Self-subsisting, Eternal. No slumber can seize Him Nor sleep. His are all things In the heavens and on earth...",
        "reference": "Al-Baqarah 2:255. Recite once in the morning. Whoever says this when he awakens will be protected from the jinn until he retires for the night. - Al-Hakim 1/562"
    },
    {
        "id": "m2", "category": "Morning", "title": "Master of Seeking Forgiveness",
        "arabic": "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ",
        "transliteration": "Allahumma anta Rabbi la ilaha illa anta, Khalaqtani wa ana 'abduka, wa ana 'ala 'ahdika wa wa'dika mastata'tu, A'udhu bika min sharri ma sana'tu, abu'u Laka bini'matika 'alayya, wa abu'u bidhanbi faghfirli fainnahu la yaghfiru-dh-dhunuba illa anta.",
        "translation": "O Allah, You are my Lord... I take refuge in You from the evil of which I have committed. I acknowledge Your favor upon me and I acknowledge my sin, so forgive me, for verily none can forgive sins except You.",
        "reference": "Recite once in the morning. Whoever recites this...will be among the people of Paradise. - Sahih al-Bukhari 8/6306"
    },
    {
        "id": "m3", "category": "Morning", "title": "Seeking Protection",
        "arabic": "بِسْمِ اللهِ الَّذِي لاَ يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الأَرْضِ وَلاَ فِي السَّمَاءِ وَهُوَ السَّمِيعُ العَلِيمُ",
        "transliteration": "Bismillahil-ladhi la yadurru ma'asmihi shay'un fil-ardi wa la fis-sama'i wa Huwas-Sami'ul-'Alim.",
        "translation": "In the Name of Allah, with Whose Name nothing on the earth or in the heaven can cause harm, and He is the All-Hearing, the All-Knowing.",
        "reference": "Recite three times in the morning. - Abu Dawud, At-Tirmidhi"
    },
    {
        "id": "m4", "category": "Morning", "title": "Praise and Sovereignty",
        "arabic": "أَصْبَحْنَا وَأَصْبَحَ المُلْكُ للهِ وَالحَمْدُ للهِ، لاَ إِلَهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ المُلْكُ وَلَهُ الحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ. رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذَا اليَوْمِ وَخَيْرَ مَا بَعْدَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذَا اليَوْمِ وَشَرِّ مَا بَعْدَهُ، رَبِّ أَعُوذُ بِكَ مِنَ الكَسَلِ وَسُوءِ الكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي القَبْرِ",
        "transliteration": "Asbahna wa asbahal-mulku lillahi walhamdu lillah, la ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamdu wa huwa 'ala kulli shay'in qadir. Rabbi as'aluka khayra ma fi hadhal-yawmi wa khayra ma ba'dahu, wa a'udhu bika min sharri ma fi hadhal-yawmi wa sharri ma ba'dahu, Rabbi a'udhu bika minal-kasali wa su'il-kibar, Rabbi a'udhu bika min 'adhabin fin-nari wa 'adhabin fil-qabr.",
        "translation": "We have reached the morning and at this very time unto Allah belongs all sovereignty, and all praise is for Allah...",
        "reference": "Recite once in the morning. - Sahih Muslim 4/2088"
    },
    {
        "id": "m5", "category": "Morning", "title": "Affirmation of Faith",
        "arabic": "أَصْبَحْنَا عَلَى فِطْرَةِ الْإِسْلَامِ، وَعَلَى كَلِمَةِ الْإِخْلَاصِ، وَعَلَى دِينِ نَبِيِّنَا مُحَمَّدٍ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ، وَعَلَى مِلَّةِ أَبِينَا إِبْرَاهِيمَ، حَنِيفًا مُسْلِمًا وَمَا كَانَ مِنَ الْمُشْرِكِينَ",
        "transliteration": "Asbahna 'ala fitratil-Islam, wa 'ala kalimatil-ikhlas, wa 'ala dini nabiyyina Muhammadin sallallahu 'alayhi wa sallam, wa 'ala millati abina Ibrahim, hanifan musliman wa ma kana minal-mushrikin.",
        "translation": "We have entered a new day upon the natural religion of Islam, the word of sincere devotion, the religion of our Prophet Muhammad (peace and blessings be upon him), and the faith of our father Ibrahim. He was upright (in worshiping Allah) and a Muslim. He was not of those who worship others besides Allah.",
        "reference": "Recite once in the morning. - Musnad Ahmad 3/406-407, 5/123"
    },
    {
        "id": "m6", "category": "Morning", "title": "Seeking Wellbeing",
        "arabic": "اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَهَ إِلَّا أَنْتَ. اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ، وَالْفَقْرِ، وَأَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، لَا إِلَهَ إِلَّا أَنْتَ",
        "transliteration": "Allahumma 'afini fi badani, Allahumma 'afini fi sam'i, Allahumma 'afini fi basari, la ilaha illa Anta. Allahumma inni a'udhu bika minal-kufri, wal-faqri, wa a'udhu bika min 'adhabil-qabr, la ilaha illa Anta.",
        "translation": "O Allah, make me healthy in my body. O Allah, preserve for me my hearing. O Allah, preserve for me my sight. There is none worthy of worship but You...",
        "reference": "Recite three times in the morning. - Abu Dawud 4/324"
    },
    {
        "id": "m7", "category": "Morning", "title": "For Gratitude",
        "arabic": "اللَّهُمَّ مَا أَصْبَحَ بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ فَمِنْكَ وَحْدَكَ لَا شَرِيكَ لَكَ، فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ",
        "transliteration": "Allahumma ma asbaha bi min ni'matin aw bi'ahadin min khalqika faminka wahdaka la sharika lak, falakal-hamdu walakash-shukr.",
        "translation": "O Allah, whatever blessing has been received by me or anyone of Your creation is from You alone, You have no partner. For You is all praise and unto You all thanks.",
        "reference": "Whoever recites this in the morning has completed his obligation to thank Allah for that day. - Abu Dawud 4/318"
    },
    {
        "id": "m8", "category": "Morning", "title": "The Three Quls (Morning)",
        "arabic": "قُلْ هُوَ اللَّهُ أَحَدٌ... قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ... قُلْ أَعُوذُ بِرَبِّ النَّاسِ...",
        "transliteration": "Qul huwa Allahu ahad... Qul a'udhu birabbi-l-falaq... Qul a'udhu birabbi-n-nas...",
        "translation": "Say, He is Allah, the One... Say, I seek refuge in the Lord of daybreak... Say, I seek refuge in the Lord of mankind...",
        "reference": "Recite Surahs Al-Ikhlas, Al-Falaq, and An-Nas three times each in the morning. It will suffice you in all respects. - Abu Dawud, At-Tirmidhi"
    },
    {
        "id": "m9", "category": "Morning", "title": "Praise to Allah",
        "arabic": "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ أَصْلِحْ لِي شَأْنِي كُلَّهُ وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ",
        "transliteration": "Ya Hayyu ya Qayyum, birahmatika astaghith, aslih li sha'ni kullahu, wa la takilni ila nafsi tarfata 'ayn.",
        "translation": "O Ever-Living, O Self-Subsisting and Supporter of all, by Your mercy I seek assistance, rectify for me all of my affairs and do not leave me to myself, even for the blink of an eye.",
        "reference": "Recite once in the morning. - Al-Hakim, An-Nasa'i"
    },
    {
        "id": "m10", "category": "Morning", "title": "For Sufficient Provision",
        "arabic": "حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ",
        "transliteration": "HasbiyAllahu la ilaha illa Huwa, 'alayhi tawakkaltu wa Huwa Rabbul-'Arshil-'Adheem.",
        "translation": "Allah is sufficient for me. There is none worthy of worship but Him. I have placed my trust in Him, He is Lord of the Majestic Throne.",
        "reference": "Recite seven times in the morning. Allah will grant whoever recites this whatever he desires from this world or the next. - Abu Dawud"
    },

    // Evening Duas
    {
        "id": "e1", "category": "Evening", "title": "Ayat al-Kursi (Evening)",
        "arabic": "ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ ۚ...",
        "transliteration": "Allahu la ilaha illa Huwa, Al-Hayyul-Qayyum...",
        "translation": "Allah! There is no god but He - the Living, The Self-subsisting, Eternal...",
        "reference": "Al-Baqarah 2:255. Recite once in the evening. Whoever says this when he retires for the night, a guardian from Allah will be with him and satan will not be able to approach him until he awakens. - Al-Hakim 1/562"
    },
    {
        "id": "e2", "category": "Evening", "title": "The Three Quls (Evening)",
        "arabic": "قُلْ هُوَ اللَّهُ أَحَدٌ... قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ... قُلْ أَعُوذُ بِرَبِّ النَّاسِ...",
        "transliteration": "Qul huwa Allahu ahad... Qul a'udhu birabbi-l-falaq... Qul a'udhu birabbi-n-nas...",
        "translation": "Say, He is Allah, the One... Say, I seek refuge in the Lord of daybreak... Say, I seek refuge in the Lord of mankind...",
        "reference": "Recite Surahs Al-Ikhlas, Al-Falaq, and An-Nas three times each in the evening. It will suffice you in all respects. - Abu Dawud, At-Tirmidhi"
    },
    {
        "id": "e3", "category": "Evening", "title": "A Dua for Evening",
        "arabic": "أَمْسَيْنَا وَأَمْسَى المُلْكُ للهِ وَالحَمْدُ للهِ، لاَ إِلَهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ المُلْكُ وَلَهُ الحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ. رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذِهِ اللَّيْلَةِ وَخَيْرَ مَا بَعْدَهَا، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذِهِ اللَّيْلَةِ وَشَرِّ مَا بَعْدَهَا...",
        "transliteration": "Amsayna wa amsal-mulku lillahi walhamdu lillah, la ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamdu wa huwa 'ala kulli shay'in qadir...",
        "translation": "We have reached the evening and at this very time unto Allah belongs all sovereignty, and all praise is for Allah...",
        "reference": "Recite once in the evening. - Sahih Muslim 4/2088"
    },
    {
        "id": "e4", "category": "Evening", "title": "Protection from Evil",
        "arabic": "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
        "transliteration": "A'udhu bikalimatillahit-tammati min sharri ma khalaq.",
        "translation": "I seek refuge in the perfect words of Allah from the evil of that which He has created.",
        "reference": "Recite three times in the evening. - Ahmad, An-Nasa'i, At-Tirmidhi"
    },
    {
        "id": "e5", "category": "Evening", "title": "Master of Seeking Forgiveness (Evening)",
        "arabic": "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ...",
        "transliteration": "Allahumma anta Rabbi la ilaha illa anta...",
        "translation": "O Allah, You are my Lord, none has the right to be worshipped except You...",
        "reference": "Whoever recites this with conviction in the evening and dies during that night will be among the people of Paradise. - Sahih al-Bukhari 8/6306"
    },
    {
        "id": "e6", "category": "Evening", "title": "Seeking Wellbeing (Evening)",
        "arabic": "اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَهَ إِلَّا أَنْتَ...",
        "transliteration": "Allahumma 'afini fi badani, Allahumma 'afini fi sam'i...",
        "translation": "O Allah, make me healthy in my body. O Allah, preserve for me my hearing...",
        "reference": "Recite three times in the evening. - Abu Dawud 4/324"
    },
    {
        "id": "e7", "category": "Evening", "title": "Protection with Allah's Name (Evening)",
        "arabic": "بِسْمِ اللهِ الَّذِي لاَ يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الأَرْضِ وَلاَ فِي السَّمَاءِ وَهُوَ السَّمِيعُ العَلِيمُ",
        "transliteration": "Bismillahil-ladhi la yadurru ma'asmihi shay'un fil-ardi wa la fis-sama'i wa Huwas-Sami'ul-'Alim.",
        "translation": "In the Name of Allah, with Whose Name nothing on the earth or in the heaven can cause harm, and He is the All-Hearing, the All-Knowing.",
        "reference": "Recite three times in the evening. - Abu Dawud, At-Tirmidhi"
    },
    {
        "id": "e8", "category": "Evening", "title": "For Sufficient Provision (Evening)",
        "arabic": "حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ",
        "transliteration": "HasbiyAllahu la ilaha illa Huwa, 'alayhi tawakkaltu wa Huwa Rabbul-'Arshil-'Adheem.",
        "translation": "Allah is sufficient for me. There is none worthy of worship but Him. I have placed my trust in Him, He is Lord of the Majestic Throne.",
        "reference": "Recite seven times in the evening. Allah will grant whoever recites this whatever he desires from this world or the next. - Abu Dawud"
    },
    {
        "id": "e9", "category": "Evening", "title": "Praise to Allah (Evening)",
        "arabic": "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ أَصْلِحْ لِي شَأْنِي كُلَّهُ وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ",
        "transliteration": "Ya Hayyu ya Qayyum, birahmatika astaghith, aslih li sha'ni kullahu, wa la takilni ila nafsi tarfata 'ayn.",
        "translation": "O Ever-Living, O Self-Subsisting and Supporter of all, by Your mercy I seek assistance, rectify for me all of my affairs and do not leave me to myself, even for the blink of an eye.",
        "reference": "Recite once in the evening. - Al-Hakim, An-Nasa'i"
    },
    {
        "id": "e10", "category": "Evening", "title": "Evening on the Fitrah",
        "arabic": "أَمْسَيْنَا عَلَى فِطْرَةِ الْإِسْلَامِ...",
        "transliteration": "Amsayna 'ala fitratil-Islam...",
        "translation": "We end this day upon the natural religion of Islam...",
        "reference": "Recite once in the evening. - Musnad Ahmad 3/406-407, 5/123"
    },
    
    // General Duas
    {
        "id": "g1", "category": "General", "title": "For seeking guidance (Istikharah)",
        "arabic": "اللَّهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ، وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ، وَأَسْأَلُكَ مِنْ فَضْلِكَ الْعَظِيمِ...",
        "transliteration": "Allahumma inni astakhiruka bi'ilmika, wa astaqdiruka biqudratika, wa as'aluka min fadlikal-'adhim...",
        "translation": "O Allah, I seek Your guidance [in making a choice] by virtue of Your knowledge, and I seek ability by virtue of Your power...",
        "reference": "Sahih al-Bukhari 1166"
    },
    {
        "id": "g2", "category": "General", "title": "Before eating",
        "arabic": "بِسْمِ اللَّهِ",
        "transliteration": "Bismillah.",
        "translation": "In the Name of Allah.",
        "reference": "If you forget, say 'Bismillahi awwalahu wa akhirahu' (In the Name of Allah at the beginning and at the end). - Abu Dawud, At-Tirmidhi"
    },
    {
        "id": "g3", "category": "General", "title": "For Protection from Anxiety",
        "arabic": "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ",
        "transliteration": "Allahumma inni a'udhu bika minal-hammi wal-hazan, wal-'ajzi wal-kasal, wal-bukhli wal-jubn, wa dala'id-dayni wa ghalabatir-rijal.",
        "translation": "O Allah, I take refuge in You from anxiety and sorrow, weakness and laziness, miserliness and cowardice, the burden of debts and from being overpowered by men.",
        "reference": "Sahih al-Bukhari"
    },
    {
        "id": "g4", "category": "General", "title": "When wearing a new garment",
        "arabic": "اللَّهُمَّ لَكَ الْحَمْدُ أَنْتَ كَسَوْتَنِيهِ، أَسْأَلُكَ مِنْ خَيْرِهِ وَخَيْرِ مَا صُنِعَ لَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّهِ وَشَرِّ مَا صُنِعَ لَهُ",
        "transliteration": "Allahumma lakal-hamdu 'Anta kasawtanihi, 'as'aluka min khayrihi wa khayri ma suni'a lahu, wa 'a'udhu bika min sharrihi wa sharri ma suni'a lahu.",
        "translation": "O Allah, praise is to You. You have clothed me. I ask You for its goodness and the goodness of what it has been made for, and I seek Your protection from the evil of it and the evil of what it has been made for.",
        "reference": "Abu Dawud and At-Tirmidhi."
    },
    {
        "id": "g5", "category": "General", "title": "When entering the toilet",
        "arabic": "[بِسْمِ اللهِ] اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ",
        "transliteration": "[Bismil-lah] Allahumma inni a'udhu bika minal-khubuthi wal-khaba'ith.",
        "translation": "[In the name of Allah]. O Allah, I take refuge in you from all evil and evil-doers.",
        "reference": "Al-Bukhari and Muslim."
    },
    {
        "id": "g6", "category": "General", "title": "After leaving the toilet",
        "arabic": "غُفْرَانَكَ",
        "transliteration": "Ghufranak.",
        "translation": "I seek your forgiveness.",
        "reference": "Abu Dawud, Ibn Majah, and At-Tirmidhi."
    },
    {
        "id": "g7", "category": "General", "title": "When visiting the sick",
        "arabic": "لَا بَأْسَ طَهُورٌ إِنْ شَاءَ اللَّهُ",
        "transliteration": "La ba'sa tahurun in sha' Allah.",
        "translation": "Do not worry, it will be a purification (for you), God willing.",
        "reference": "Al-Bukhari."
    },
    {
        "id": "g8", "category": "General", "title": "For seeking knowledge",
        "arabic": "اللَّهُمَّ انْفَعْنِي بِمَا عَلَّمْتَنِي، وَعَلِّمْنِي مَا يَنْفَعُنِي، وَزِدْنِي عِلْمًا",
        "transliteration": "Allahumma-nfa'ni bima 'allamtani, wa 'allimni ma yanfa'uni, wa zidni 'ilma.",
        "translation": "O Allah, benefit me with what You have taught me, teach me that which will benefit me, and increase me in knowledge.",
        "reference": "At-Tirmidhi, Ibn Majah."
    },
    {
        "id": "g9", "category": "General", "title": "Dua for parents",
        "arabic": "رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا",
        "transliteration": "Rabbi-rhamhuma kama rabbayani saghira.",
        "translation": "My Lord, have mercy upon them as they brought me up [when I was] small.",
        "reference": "Qur'an 17:24"
    },
    {
        "id": "g10", "category": "General", "title": "For beneficial knowledge, goodly provision, and accepted deeds",
        "arabic": "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا",
        "transliteration": "Allahumma inni as'aluka 'ilman nafi'an, wa rizqan tayyiban, wa 'amalan mutaqabbalan.",
        "translation": "O Allah, I ask You for knowledge that is of benefit, a good provision, and deeds that will be accepted.",
        "reference": "Ibn Majah"
    }
];

export const hadithBooks = [
  "Bukhari", "Muslim", "Abu Dawood", "Tirmidhi", "Nasai", "Ibn Majah", "Muwatta Malik"
];

export const sampleHadith: Hadith = {
  book: 'Bukhari',
  number: 1,
  topic: 'Revelation',
  text: 'Actions are but by intention and every man shall have but that which he intended...',
};

export const teamMembers: TeamMember[] = [
    { id: 'tm1', name: 'Dr. Fatima Ahmed', role: 'Founder & Director', avatar: 'https://picsum.photos/seed/t1/100/100' },
    { id: 'tm2', name: 'Aisha Khan', role: 'Head of Education', avatar: 'https://picsum.photos/seed/t2/100/100' },
    { id: 'tm3', name: 'Zainab Yusuf', role: 'Community Manager', avatar: 'https://picsum.photos/seed/t3/100/100' },
    { id: 'tm4', name: 'Hafsa Ali', role: 'Events Coordinator', avatar: 'https://picsum.photos/seed/t4/100/100' },
];

export const events: EventPost[] = [
    { id: 'ev1', title: 'Weekly Qur\'an Tafsir Circle', type: 'Online', date: 'Every Saturday', description: 'Join us for a deep dive into the meanings of the Qur\'an.', image: 'https://picsum.photos/seed/ev1/600/400' },
    { id: 'ev2', title: 'Sisters\' Annual Conference', type: 'Onsite', date: '2024-12-15', description: 'Our flagship annual event with renowned speakers, workshops, and sisterhood.', image: 'https://picsum.photos/seed/ev2/600/400' },
    { id: 'ev3', title: 'Fiqh of Menstruation Workshop', type: 'Online', date: '2024-11-20', description: 'An essential workshop covering the Islamic rulings related to menstruation.', image: 'https://picsum.photos/seed/ev3/600/400' },
];

import placeholderData from './placeholder-images.json';
export const placeholderImages: PlaceholderImage[] = placeholderData.placeholderImages;
