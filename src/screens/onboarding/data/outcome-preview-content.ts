import type {OutcomePreviewCard} from '../types/outcome-preview';
import type {LanguageCode} from '../types/selectable-option';

type OutcomeTimeCommitmentId = '5-10' | '10-20' | '20-30' | '30-plus';
type OutcomeExperienceId =
  | 'no-prior-knowledge'
  | 'heard-about-it'
  | 'know-basics'
  | 'practical-experience'
  | 'worked-several-times'
  | 'very-familiar'
  | 'higher-level-directly'
  | 'no-practical-experience';
type OutcomeGoalMotivationId =
  | 'earn-money'
  | 'improve-professionally'
  | 'learn-something-new'
  | 'apply-in-practice'
  | 'become-more-confident'
  | 'specific-goal-project'
  | 'interest-fun';

type LocalizedText = Record<LanguageCode, string>;

type OutcomePreviewSelection = {
  currentLanguage: LanguageCode;
  selectedExperienceId: string | null;
  selectedGoalMotivationIds: string[];
  selectedTimeCommitmentId: string | null;
};

const DEFAULT_TIME_COMMITMENT_ID: OutcomeTimeCommitmentId = '10-20';
const DEFAULT_EXPERIENCE_ID: OutcomeExperienceId = 'know-basics';
const DEFAULT_GOAL_MOTIVATION_ID: OutcomeGoalMotivationId = 'learn-something-new';

const PERIOD_TITLES: Record<OutcomePreviewCard['id'], LocalizedText> = {
  week: {
    de: 'In 1 Woche',
    en: 'In 1 week',
    id: 'Dalam 1 minggu',
  },
  month: {
    de: 'In 1 Monat',
    en: 'In 1 month',
    id: 'Dalam 1 bulan',
  },
  quarter: {
    de: 'In 3 Monaten',
    en: 'In 3 months',
    id: 'Dalam 3 bulan',
  },
};

const WEEK_ONE_OUTCOMES: Record<OutcomeTimeCommitmentId, LocalizedText> = {
  '5-10': {
    de: 'Klasse! Du verstehst die wichtigsten Grundlagen und kannst erste einfache Schritte selbststaendig gehen.',
    en: 'Great! You understand the key basics and can take your first simple steps independently.',
    id: 'Bagus! Kamu memahami dasar-dasar utamanya dan bisa mulai mengambil langkah sederhana secara mandiri.',
  },
  '10-20': {
    de: 'Gut! Du hast die Grundlagen verstanden und kannst erste Aufgaben eigenstaendig loesen.',
    en: 'Nice! You have understood the basics and can solve first tasks on your own.',
    id: 'Mantap! Kamu sudah memahami dasarnya dan bisa menyelesaikan tugas-tugas awal sendiri.',
  },
  '20-30': {
    de: 'Stark! Du kommst schnell rein und setzt erste Konzepte direkt in der Praxis um.',
    en: 'Strong! You get started quickly and apply first concepts in practice.',
    id: 'Kuat! Kamu masuk ke topik ini dengan cepat dan mulai menerapkan konsep awal secara praktik.',
  },
  '30-plus': {
    de: 'WOW! Du baust in kurzer Zeit ein solides Fundament auf und arbeitest bereits aktiv mit dem Thema.',
    en: 'WOW! You build a solid foundation in a short time and already start working actively with the topic.',
    id: 'WOW! Dalam waktu singkat kamu membangun fondasi yang solid dan sudah mulai aktif bekerja dengan topik ini.',
  },
};

const MONTH_ONE_OUTCOMES: Record<OutcomeTimeCommitmentId, Record<OutcomeExperienceId, LocalizedText>> = {
  '5-10': {
    'no-prior-knowledge': {
      de: 'Du verstehst die Grundlagen und loest einfache Aufgaben eigenstaendig.',
      en: 'You understand the basics and can solve simple tasks independently.',
      id: 'Kamu memahami dasarnya dan bisa menyelesaikan tugas sederhana secara mandiri.',
    },
    'heard-about-it': {
      de: 'Du festigst dein Wissen und setzt erste Anwendungsfaelle sicher um.',
      en: 'You consolidate your knowledge and can apply first use cases confidently.',
      id: 'Kamu memperkuat pengetahuanmu dan mulai menerapkan use case awal dengan lebih percaya diri.',
    },
    'know-basics': {
      de: 'Du arbeitest sicher mit Schluesselbegriffen und einfachen Anwendungen.',
      en: 'You work confidently with key terms and simple applications.',
      id: 'Kamu bekerja lebih percaya diri dengan istilah penting dan penerapan sederhana.',
    },
    'practical-experience': {
      de: 'Du wirst strukturierter und entwickelst spuerbar mehr Routine.',
      en: 'You become more structured and routine-driven.',
      id: 'Kamu menjadi lebih terstruktur dan mulai punya ritme yang lebih konsisten.',
    },
    'worked-several-times': {
      de: 'Du stabilisierst dein Wissen und gewinnst deutlich mehr Sicherheit.',
      en: 'You stabilize your knowledge and gain confidence.',
      id: 'Kamu menstabilkan pengetahuanmu dan menjadi lebih mantap.',
    },
    'very-familiar': {
      de: 'Du verfeinerst dein Wissen und arbeitest praeziser.',
      en: 'You refine your knowledge and work more precisely.',
      id: 'Kamu mempertajam pemahamanmu dan bekerja lebih presisi.',
    },
    'higher-level-directly': {
      de: 'Du steigst in komplexere Themen ein und entwickelst dich gezielt weiter.',
      en: 'You move into more complex topics and continue developing.',
      id: 'Kamu masuk ke topik yang lebih kompleks dan berkembang dengan lebih terarah.',
    },
    'no-practical-experience': {
      de: 'Du bringst dein Wissen erstmals sichtbar in echte Anwendung.',
      en: 'You start applying your knowledge in real scenarios.',
      id: 'Kamu mulai menerapkan pengetahuanmu dalam situasi nyata.',
    },
  },
  '10-20': {
    'no-prior-knowledge': {
      de: 'Du arbeitest bereits eigenstaendig an einfachen Anwendungen.',
      en: 'You already work independently on simple applications.',
      id: 'Kamu sudah bisa bekerja mandiri pada penerapan yang sederhana.',
    },
    'heard-about-it': {
      de: 'Du setzt Wissen aktiv ein und gewinnst spuerbar an Sicherheit.',
      en: 'You actively apply knowledge and gain confidence.',
      id: 'Kamu mulai menerapkan pengetahuan secara aktif dan makin percaya diri.',
    },
    'know-basics': {
      de: 'Du setzt Konzepte um und verstehst Zusammenhaenge klarer.',
      en: 'You apply concepts and understand relationships.',
      id: 'Kamu menerapkan konsep dan memahami hubungan antar hal dengan lebih jelas.',
    },
    'practical-experience': {
      de: 'Du arbeitest sicher und effizient an typischen Aufgaben.',
      en: 'You work confidently and efficiently on typical tasks.',
      id: 'Kamu bekerja lebih mantap dan efisien pada tugas-tugas umum.',
    },
    'worked-several-times': {
      de: 'Du verbesserst Tempo und Qualitaet deutlich.',
      en: 'You significantly improve speed and quality.',
      id: 'Kecepatan dan kualitas kerjamu meningkat secara nyata.',
    },
    'very-familiar': {
      de: 'Du arbeitest auf einem stabilen, fortgeschrittenen Niveau.',
      en: 'You operate at a stable, advanced level.',
      id: 'Kamu bekerja di level lanjut yang stabil.',
    },
    'higher-level-directly': {
      de: 'Du entwickelst zunehmend komplexere Loesungen.',
      en: 'You develop more complex solutions.',
      id: 'Kamu mulai mengembangkan solusi yang lebih kompleks.',
    },
    'no-practical-experience': {
      de: 'Du bringst dein Wissen regelmaessig in die Praxis.',
      en: 'You regularly apply your knowledge in practice.',
      id: 'Kamu mulai menerapkan pengetahuanmu secara rutin dalam praktik.',
    },
  },
  '20-30': {
    'no-prior-knowledge': {
      de: 'Du nutzt wichtige Methoden bereits sicher.',
      en: 'You confidently use key methods.',
      id: 'Kamu sudah menggunakan metode-metode utama dengan percaya diri.',
    },
    'heard-about-it': {
      de: 'Du entwickelst schnell praktische Faehigkeiten.',
      en: 'You quickly develop practical skills.',
      id: 'Kamu cepat membangun kemampuan praktik.',
    },
    'know-basics': {
      de: 'Du verstehst Zusammenhaenge und setzt sie wirksam ein.',
      en: 'You understand relationships and apply them effectively.',
      id: 'Kamu memahami keterkaitan antar konsep dan menerapkannya dengan efektif.',
    },
    'practical-experience': {
      de: 'Du arbeitest eigenstaendig und loest Aufgaben sicher.',
      en: 'You work independently and solve tasks confidently.',
      id: 'Kamu bekerja mandiri dan menyelesaikan tugas dengan lebih yakin.',
    },
    'worked-several-times': {
      de: 'Du erreichst ein hohes Mass an Sicherheit und Effizienz.',
      en: 'You reach a high level of confidence and efficiency.',
      id: 'Kamu mencapai tingkat kepercayaan diri dan efisiensi yang tinggi.',
    },
    'very-familiar': {
      de: 'Du entwickelst eigene Loesungen und optimierst Prozesse.',
      en: 'You develop your own solutions and optimize processes.',
      id: 'Kamu mulai membangun solusi sendiri dan mengoptimalkan proses.',
    },
    'higher-level-directly': {
      de: 'Du arbeitest auf einem anspruchsvollen Niveau.',
      en: 'You work at a demanding level.',
      id: 'Kamu bekerja pada level yang lebih menantang.',
    },
    'no-practical-experience': {
      de: 'Du baust schnell praktische Routine auf.',
      en: 'You quickly build practical routine.',
      id: 'Kamu cepat membangun rutinitas praktik yang kuat.',
    },
  },
  '30-plus': {
    'no-prior-knowledge': {
      de: 'Du erreichst ein solides und sicheres Kompetenzniveau.',
      en: 'You reach a solid and confident competency level.',
      id: 'Kamu mencapai tingkat kompetensi yang solid dan percaya diri.',
    },
    'heard-about-it': {
      de: 'Du arbeitest eigenstaendig und praxisnah mit dem Thema.',
      en: 'You work independently and practically.',
      id: 'Kamu bekerja secara mandiri dan praktis dengan topik ini.',
    },
    'know-basics': {
      de: 'Du entwickelst tiefes Verstaendnis und setzt es aktiv ein.',
      en: 'You develop deep understanding and apply it actively.',
      id: 'Kamu membangun pemahaman yang mendalam dan menggunakannya secara aktif.',
    },
    'practical-experience': {
      de: 'Du arbeitest effizient und eigenstaendig.',
      en: 'You work efficiently and independently.',
      id: 'Kamu bekerja efisien dan mandiri.',
    },
    'worked-several-times': {
      de: 'Du erreichst ein fortgeschrittenes Niveau.',
      en: 'You reach an advanced level.',
      id: 'Kamu mencapai level yang lebih advanced.',
    },
    'very-familiar': {
      de: 'Du arbeitest sicher auf hohem Niveau.',
      en: 'You work confidently at a high level.',
      id: 'Kamu bekerja dengan mantap di level yang tinggi.',
    },
    'higher-level-directly': {
      de: 'Du bewegst dich in einem Expertinnen- und Expertenbereich.',
      en: 'You operate in an expert-level domain.',
      id: 'Kamu mulai beroperasi di area tingkat expert.',
    },
    'no-practical-experience': {
      de: 'Du ueberfuehrst Wissen schnell in sichere Praxis.',
      en: 'You quickly turn knowledge into confident practice.',
      id: 'Kamu dengan cepat mengubah pengetahuan menjadi praktik yang mantap.',
    },
  },
};

const MONTH_THREE_OUTCOMES: Record<OutcomeGoalMotivationId, Record<OutcomeExperienceId, LocalizedText>> = {
  'earn-money': {
    'no-prior-knowledge': {
      de: 'Mit deinem Lernrhythmus kannst du in 3 Monaten erste Einnahmen erzielen.',
      en: 'With your learning pace, you can generate first income within 3 months.',
      id: 'Dengan ritme belajarmu, kamu bisa mulai menghasilkan pemasukan pertama dalam 3 bulan.',
    },
    'heard-about-it': {
      de: 'Du baust erste Einnahmequellen auf.',
      en: 'You build your first income streams.',
      id: 'Kamu mulai membangun sumber pemasukan pertamamu.',
    },
    'know-basics': {
      de: 'Du nutzt dein Wissen, um Geld zu verdienen.',
      en: 'You use your knowledge to earn money.',
      id: 'Kamu mulai memakai pengetahuanmu untuk menghasilkan uang.',
    },
    'practical-experience': {
      de: 'Du erzielst erste regelmaessige Einnahmen.',
      en: 'You start generating income regularly.',
      id: 'Kamu mulai menghasilkan pemasukan secara lebih rutin.',
    },
    'worked-several-times': {
      de: 'Du entwickelst stabile Einnahmequellen.',
      en: 'You develop stable income streams.',
      id: 'Kamu membangun aliran pemasukan yang lebih stabil.',
    },
    'very-familiar': {
      de: 'Du baust eine verlaessliche Einkommensquelle auf.',
      en: 'You build a reliable income source.',
      id: 'Kamu membangun sumber penghasilan yang lebih andal.',
    },
    'higher-level-directly': {
      de: 'Du skalierst dein Einkommen strategisch.',
      en: 'You scale your income strategically.',
      id: 'Kamu mulai menskalakan penghasilanmu secara strategis.',
    },
    'no-practical-experience': {
      de: 'Du verwandelst Wissen in erste Einnahmen.',
      en: 'You convert knowledge into first earnings.',
      id: 'Kamu mengubah pengetahuan menjadi hasil finansial pertamamu.',
    },
  },
  'improve-professionally': {
    'no-prior-knowledge': {
      de: 'Du baust Faehigkeiten auf, die neue berufliche Chancen eroeffnen.',
      en: 'You build skills that open new opportunities.',
      id: 'Kamu membangun skill yang membuka peluang profesional baru.',
    },
    'heard-about-it': {
      de: 'Du entwickelst dich sichtbar weiter.',
      en: 'You visibly improve.',
      id: 'Perkembangan profesionalmu mulai terlihat jelas.',
    },
    'know-basics': {
      de: 'Du setzt dein Wissen im Beruf wirksam ein.',
      en: 'You apply knowledge at work.',
      id: 'Kamu mulai menerapkan pengetahuanmu secara nyata di pekerjaan.',
    },
    'practical-experience': {
      de: 'Du arbeitest sicherer und entwickelst dich spuerbar weiter.',
      en: 'You work confidently and grow.',
      id: 'Kamu bekerja lebih percaya diri dan berkembang lebih cepat.',
    },
    'worked-several-times': {
      de: 'Du verbesserst deine Position im beruflichen Alltag.',
      en: 'You improve your position at work.',
      id: 'Kamu memperkuat posisimu di tempat kerja.',
    },
    'very-familiar': {
      de: 'Du staerkst deine Rolle deutlich.',
      en: 'You strengthen your role significantly.',
      id: 'Kamu memperkuat peranmu secara signifikan.',
    },
    'higher-level-directly': {
      de: 'Du qualifizierst dich fuer den naechsten Karriereschritt.',
      en: 'You qualify for the next career step.',
      id: 'Kamu semakin siap untuk langkah karier berikutnya.',
    },
    'no-practical-experience': {
      de: 'Du bringst dein Wissen aktiv in den Job ein.',
      en: 'You actively bring knowledge into your job.',
      id: 'Kamu mulai membawa pengetahuan ini secara aktif ke pekerjaanmu.',
    },
  },
  'learn-something-new': {
    'no-prior-knowledge': {
      de: 'Du entwickelst ein solides Verstaendnis fuer das Thema.',
      en: 'You develop a solid understanding.',
      id: 'Kamu membangun pemahaman yang solid terhadap topik ini.',
    },
    'heard-about-it': {
      de: 'Du baust strukturiertes Wissen auf.',
      en: 'You build structured knowledge.',
      id: 'Kamu membangun pengetahuan yang lebih terstruktur.',
    },
    'know-basics': {
      de: 'Du verstehst Zusammenhaenge deutlich besser.',
      en: 'You understand relationships.',
      id: 'Kamu memahami keterkaitan konsep dengan lebih baik.',
    },
    'practical-experience': {
      de: 'Du arbeitest eigenstaendig und sicherer.',
      en: 'You work independently.',
      id: 'Kamu mulai bekerja lebih mandiri.',
    },
    'worked-several-times': {
      de: 'Du vertiefst dein Wissen deutlich.',
      en: 'You deepen your knowledge.',
      id: 'Kamu memperdalam pengetahuanmu secara nyata.',
    },
    'very-familiar': {
      de: 'Du erreichst ein tiefes Verstaendnis.',
      en: 'You reach deep understanding.',
      id: 'Kamu mencapai pemahaman yang lebih mendalam.',
    },
    'higher-level-directly': {
      de: 'Du arbeitest auf sehr hohem Niveau.',
      en: 'You operate at a very high level.',
      id: 'Kamu mulai bekerja pada level yang sangat tinggi.',
    },
    'no-practical-experience': {
      de: 'Du verbindest Wissen gezielt mit Anwendung.',
      en: 'You connect knowledge with application.',
      id: 'Kamu menghubungkan pengetahuan dengan penerapan nyata.',
    },
  },
  'apply-in-practice': {
    'no-prior-knowledge': {
      de: 'Du schliesst erste Aufgaben eigenstaendig ab.',
      en: 'You complete first tasks.',
      id: 'Kamu menyelesaikan tugas-tugas pertamamu secara nyata.',
    },
    'heard-about-it': {
      de: 'Du arbeitest praktisch und greifbar mit dem Thema.',
      en: 'You work practically.',
      id: 'Kamu mulai bekerja secara praktis dengan topik ini.',
    },
    'know-basics': {
      de: 'Du setzt Wissen wirksam in die Praxis um.',
      en: 'You apply knowledge effectively.',
      id: 'Kamu menerapkan pengetahuanmu secara efektif dalam praktik.',
    },
    'practical-experience': {
      de: 'Du arbeitest sicher und routiniert.',
      en: 'You work confidently.',
      id: 'Kamu bekerja lebih yakin dan konsisten.',
    },
    'worked-several-times': {
      de: 'Du arbeitest effizient und praezise.',
      en: 'You work efficiently.',
      id: 'Kamu bekerja semakin efisien.',
    },
    'very-familiar': {
      de: 'Du optimierst deine Arbeit spuerbar.',
      en: 'You optimize your work.',
      id: 'Kamu mulai mengoptimalkan cara kerjamu dengan nyata.',
    },
    'higher-level-directly': {
      de: 'Du arbeitest auf einem anspruchsvollen hohen Niveau.',
      en: 'You work at a high level.',
      id: 'Kamu bekerja pada level praktik yang tinggi.',
    },
    'no-practical-experience': {
      de: 'Du baust starke praktische Faehigkeiten auf.',
      en: 'You build strong practical skills.',
      id: 'Kamu membangun kemampuan praktik yang kuat.',
    },
  },
  'become-more-confident': {
    'no-prior-knowledge': {
      de: 'Du gewinnst spuerbar an Sicherheit.',
      en: 'You gain confidence.',
      id: 'Kamu mulai merasa lebih percaya diri.',
    },
    'heard-about-it': {
      de: 'Du wirst deutlich sicherer im Umgang damit.',
      en: 'You become significantly more confident.',
      id: 'Kamu menjadi jauh lebih percaya diri dalam menggunakannya.',
    },
    'know-basics': {
      de: 'Du arbeitest konstanter und stabiler.',
      en: 'You work steadily.',
      id: 'Kamu bekerja lebih stabil dan konsisten.',
    },
    'practical-experience': {
      de: 'Du baust starke Routine auf.',
      en: 'You build routine.',
      id: 'Kamu membangun rutinitas yang kuat.',
    },
    'worked-several-times': {
      de: 'Du wirst sehr sicher in dem, was du tust.',
      en: 'You become very confident.',
      id: 'Kamu menjadi sangat mantap dalam apa yang kamu lakukan.',
    },
    'very-familiar': {
      de: 'Du arbeitest deutlich praeziser.',
      en: 'You work precisely.',
      id: 'Kamu bekerja dengan lebih presisi.',
    },
    'higher-level-directly': {
      de: 'Du erreichst ein Maximum an Sicherheit.',
      en: 'You reach maximum confidence.',
      id: 'Kamu mencapai tingkat percaya diri yang sangat tinggi.',
    },
    'no-practical-experience': {
      de: 'Du entwickelst praktische Sicherheit.',
      en: 'You develop practical confidence.',
      id: 'Kamu membangun rasa percaya diri yang nyata dalam praktik.',
    },
  },
  'specific-goal-project': {
    'no-prior-knowledge': {
      de: 'Du erreichst dein erstes konkretes Ergebnis.',
      en: 'You achieve your first result.',
      id: 'Kamu mencapai hasil konkret pertamamu.',
    },
    'heard-about-it': {
      de: 'Du setzt erste Schritte gezielt um.',
      en: 'You take first steps.',
      id: 'Kamu mengambil langkah pertama yang terarah.',
    },
    'know-basics': {
      de: 'Du arbeitest strukturiert auf dein Ziel hin.',
      en: 'You work in a structured way.',
      id: 'Kamu bekerja lebih terstruktur menuju tujuanmu.',
    },
    'practical-experience': {
      de: 'Du entwickelst dein Projekt spuerbar weiter.',
      en: 'You develop your project further.',
      id: 'Kamu mengembangkan proyekmu dengan kemajuan yang terlihat.',
    },
    'worked-several-times': {
      de: 'Du setzt dein Projekt sicher und sauber um.',
      en: 'You execute your project confidently.',
      id: 'Kamu mengeksekusi proyekmu dengan lebih mantap.',
    },
    'very-familiar': {
      de: 'Du erreichst dein Ziel effizient.',
      en: 'You reach your goal efficiently.',
      id: 'Kamu mencapai tujuanmu dengan lebih efisien.',
    },
    'higher-level-directly': {
      de: 'Du erreichst dein Ziel auf hohem Niveau.',
      en: 'You reach your goal at a high level.',
      id: 'Kamu mencapai tujuanmu pada level yang tinggi.',
    },
    'no-practical-experience': {
      de: 'Du wendest Wissen direkt auf dein Projekt an.',
      en: 'You apply knowledge directly to your project.',
      id: 'Kamu langsung menerapkan pengetahuan ini pada proyekmu.',
    },
  },
  'interest-fun': {
    'no-prior-knowledge': {
      de: 'Du erkundest das Thema mit Freude und Orientierung.',
      en: 'You explore the topic.',
      id: 'Kamu mengeksplorasi topik ini dengan rasa ingin tahu yang nyata.',
    },
    'heard-about-it': {
      de: 'Du baust ein klares Verstaendnis auf.',
      en: 'You build understanding.',
      id: 'Kamu membangun pemahaman yang lebih jelas.',
    },
    'know-basics': {
      de: 'Du beschaeftigst dich aktiv und mit mehr Tiefe damit.',
      en: 'You actively engage.',
      id: 'Kamu terlibat lebih aktif dan lebih dalam dengan topik ini.',
    },
    'practical-experience': {
      de: 'Du arbeitest eigenstaendig und mit Spass.',
      en: 'You work independently.',
      id: 'Kamu mulai bekerja secara mandiri sambil tetap menikmatinya.',
    },
    'worked-several-times': {
      de: 'Du vertiefst dein Interesse deutlich.',
      en: 'You deepen your interest.',
      id: 'Ketertarikanmu makin dalam dan terarah.',
    },
    'very-familiar': {
      de: 'Du entwickelst eigene Herangehensweisen.',
      en: 'You develop your own approaches.',
      id: 'Kamu mulai mengembangkan pendekatanmu sendiri.',
    },
    'higher-level-directly': {
      de: 'Du arbeitest kreativ und mit grosser Tiefe.',
      en: 'You work creatively and deeply.',
      id: 'Kamu bekerja dengan kreatif dan semakin mendalam.',
    },
    'no-practical-experience': {
      de: 'Du verbindest Wissen mit echter Anwendung.',
      en: 'You connect knowledge with application.',
      id: 'Kamu mulai menghubungkan pengetahuan dengan penerapan nyata.',
    },
  },
};

function isTimeCommitmentId(value: string): value is OutcomeTimeCommitmentId {
  return value in WEEK_ONE_OUTCOMES;
}

function isExperienceId(value: string): value is OutcomeExperienceId {
  return value in MONTH_ONE_OUTCOMES[DEFAULT_TIME_COMMITMENT_ID];
}

function isGoalMotivationId(value: string): value is OutcomeGoalMotivationId {
  return value in MONTH_THREE_OUTCOMES;
}

function resolveTimeCommitmentId(value: string | null): OutcomeTimeCommitmentId {
  return value && isTimeCommitmentId(value) ? value : DEFAULT_TIME_COMMITMENT_ID;
}

function resolveExperienceId(value: string | null): OutcomeExperienceId {
  return value && isExperienceId(value) ? value : DEFAULT_EXPERIENCE_ID;
}

function resolveGoalMotivationId(values: string[]): OutcomeGoalMotivationId {
  const primaryValue = values[0];

  return primaryValue && isGoalMotivationId(primaryValue) ? primaryValue : DEFAULT_GOAL_MOTIVATION_ID;
}

export function getOutcomePreviewCards({
  currentLanguage,
  selectedExperienceId,
  selectedGoalMotivationIds,
  selectedTimeCommitmentId,
}: OutcomePreviewSelection): OutcomePreviewCard[] {
  const timeCommitmentId = resolveTimeCommitmentId(selectedTimeCommitmentId);
  const experienceId = resolveExperienceId(selectedExperienceId);
  const goalMotivationId = resolveGoalMotivationId(selectedGoalMotivationIds);

  return [
    {
      id: 'week',
      title: PERIOD_TITLES.week[currentLanguage],
      body: WEEK_ONE_OUTCOMES[timeCommitmentId][currentLanguage],
    },
    {
      id: 'month',
      title: PERIOD_TITLES.month[currentLanguage],
      body: MONTH_ONE_OUTCOMES[timeCommitmentId][experienceId][currentLanguage],
    },
    {
      id: 'quarter',
      title: PERIOD_TITLES.quarter[currentLanguage],
      body: MONTH_THREE_OUTCOMES[goalMotivationId][experienceId][currentLanguage],
    },
  ];
}
