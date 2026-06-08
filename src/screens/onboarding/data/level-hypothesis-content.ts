import type {LanguageCode} from '../types/selectable-option';

type ExperienceId =
  | 'no-prior-knowledge'
  | 'heard-about-it'
  | 'know-basics'
  | 'practical-experience'
  | 'worked-several-times'
  | 'very-familiar'
  | 'higher-level-directly'
  | 'no-practical-experience';

type LocalizedContent = {
  body: Record<LanguageCode, string>;
  headline: Record<LanguageCode, string>;
};

const DEFAULT_EXPERIENCE_ID: ExperienceId = 'know-basics';

const LEVEL_HYPOTHESIS_CONTENT: Record<ExperienceId, LocalizedContent> = {
  'no-prior-knowledge': {
    headline: {
      de: 'Perfekt, wir starten ganz entspannt von vorne und bauen Schritt fuer Schritt ein starkes Fundament auf.',
      en: 'Perfect, we will start calmly from the beginning and build a strong foundation step by step.',
      id: 'Bagus, kita mulai dengan tenang dari awal dan membangun fondasi yang kuat langkah demi langkah.',
    },
    body: {
      de: 'Diesen Einstieg haben wir gewaehlt, weil du ohne Vorkenntnisse startest und wir dir eine klare und solide Basis geben wollen.',
      en: 'We chose this starting point because you are beginning without prior knowledge and we want to give you a clear and solid base.',
      id: 'Titik awal ini kami pilih karena kamu memulai tanpa pengetahuan awal dan kami ingin memberimu dasar yang jelas dan kuat.',
    },
  },
  'heard-about-it': {
    headline: {
      de: 'Super, wir machen aus ersten Eindruecken schnell echtes Verstaendnis.',
      en: 'Great, we will quickly turn your first impressions into real understanding.',
      id: 'Bagus, kita akan cepat mengubah kesan awalmumu menjadi pemahaman yang nyata.',
    },
    body: {
      de: 'Diesen Einstieg haben wir gewaehlt, weil du schon erste Beruehrungspunkte hattest und wir darauf gut aufbauen koennen.',
      en: 'We chose this starting point because you have had initial exposure and we can build on that.',
      id: 'Titik awal ini kami pilih karena kamu sudah punya paparan awal dan kita bisa membangun dari sana.',
    },
  },
  'know-basics': {
    headline: {
      de: 'Sehr gut, wir bauen auf deinen Grundlagen auf und fuehren dich gezielt in die Anwendung.',
      en: 'Nice, we will build on your fundamentals and guide you into application.',
      id: 'Bagus, kita akan membangun dari fondasi yang kamu punya dan membawamu ke tahap penerapan.',
    },
    body: {
      de: 'Diesen Einstieg haben wir gewaehlt, weil du die zentralen Konzepte schon kennst und jetzt den naechsten praktischen Schritt gehen kannst.',
      en: 'We chose this starting point because you already know the key concepts and can now move into practice.',
      id: 'Titik awal ini kami pilih karena kamu sudah memahami konsep utamanya dan sekarang siap masuk ke praktik.',
    },
  },
  'practical-experience': {
    headline: {
      de: 'Stark, wir entwickeln jetzt echte Routine und mehr Sicherheit.',
      en: 'Strong, we will now develop real routine and confidence.',
      id: 'Kuat, sekarang kita akan membangun rutinitas nyata dan rasa percaya diri yang lebih kuat.',
    },
    body: {
      de: 'Diesen Einstieg haben wir gewaehlt, weil du bereits erste praktische Erfahrung mitbringst und genau darauf aufbauen kannst.',
      en: 'We chose this starting point because you already have some practical experience and can build on it.',
      id: 'Titik awal ini kami pilih karena kamu sudah punya sedikit pengalaman praktik dan bisa langsung membangun dari situ.',
    },
  },
  'worked-several-times': {
    headline: {
      de: 'Sehr gut, wir machen dich noch effizienter und bringen dich auf das naechste Level.',
      en: 'Very good, we will make you more efficient and take you to the next level.',
      id: 'Sangat bagus, kita akan membuatmu lebih efisien dan membawamu ke level berikutnya.',
    },
    body: {
      de: 'Diesen Einstieg haben wir gewaehlt, weil du schon mehrfach damit gearbeitet hast und wir dein Niveau gezielt weiterentwickeln koennen.',
      en: 'We chose this starting point because you have worked with it before and we can further develop your level.',
      id: 'Titik awal ini kami pilih karena kamu sudah beberapa kali mengerjakannya dan kita bisa mengembangkan levelmu dengan lebih terarah.',
    },
  },
  'very-familiar': {
    headline: {
      de: 'Klasse, wir fordern dich heraus und entwickeln deine Faehigkeiten gezielt weiter.',
      en: 'Great, we will challenge you and further develop your skills.',
      id: 'Bagus, kita akan memberimu tantangan dan mengembangkan kemampuanmu lebih jauh.',
    },
    body: {
      de: 'Diesen Einstieg haben wir gewaehlt, weil du bereits ein starkes Verstaendnis mitbringst.',
      en: 'We chose this starting point because you already have strong understanding.',
      id: 'Titik awal ini kami pilih karena kamu sudah punya pemahaman yang kuat.',
    },
  },
  'higher-level-directly': {
    headline: {
      de: 'Perfekt, wir starten direkt auf einem fortgeschrittenen Niveau.',
      en: 'Perfect, we will start directly at an advanced level.',
      id: 'Bagus, kita akan langsung mulai dari level yang lebih advanced.',
    },
    body: {
      de: 'Diesen Einstieg haben wir gewaehlt, weil du bewusst auf einem hoeheren Niveau einsteigen moechtest.',
      en: 'We chose this starting point because you want to begin at a higher level.',
      id: 'Titik awal ini kami pilih karena kamu memang ingin memulai di level yang lebih tinggi.',
    },
  },
  'no-practical-experience': {
    headline: {
      de: 'Alles klar, wir bringen dein Wissen jetzt schnell in die praktische Anwendung.',
      en: 'Alright, we will quickly bring your knowledge into practical application.',
      id: 'Baik, kita akan cepat membawa pengetahuanmu ke penerapan yang nyata.',
    },
    body: {
      de: 'Diesen Einstieg haben wir gewaehlt, weil du schon Wissen mitbringst, es aber noch nicht praktisch angewendet hast.',
      en: 'We chose this starting point because you have knowledge but have not applied it yet.',
      id: 'Titik awal ini kami pilih karena kamu sudah punya pengetahuan, tetapi belum banyak menerapkannya.',
    },
  },
};

function isExperienceId(value: string): value is ExperienceId {
  return value in LEVEL_HYPOTHESIS_CONTENT;
}

export function getLevelHypothesisContent(language: LanguageCode, selectedExperienceId: string | null) {
  const experienceId =
    selectedExperienceId && isExperienceId(selectedExperienceId) ? selectedExperienceId : DEFAULT_EXPERIENCE_ID;

  return {
    body: LEVEL_HYPOTHESIS_CONTENT[experienceId].body[language],
    headline: LEVEL_HYPOTHESIS_CONTENT[experienceId].headline[language],
  };
}
