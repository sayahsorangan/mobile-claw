import type {TimeCommitmentOption} from '../types/time-commitment-option';

export const timeCommitmentOptions: TimeCommitmentOption[] = [
  {
    id: '5-10',
    labels: {de: '5-10 Minuten', en: '5-10 minutes', id: '5-10 menit'},
    estimateLabels: {
      de: 'Ideal fuer einen entspannten Start. Nach einer Woche hast du bereits erste klare Lernfortschritte.',
      en: 'Ideal for an easy start. After one week, you will already have your first clear learning wins.',
      id: 'Cocok untuk mulai santai. Setelah satu minggu, kamu sudah punya kemajuan belajar awal yang jelas.',
    },
  },
  {
    id: '10-20',
    labels: {de: '10-20 Minuten', en: '10-20 minutes', id: '10-20 menit'},
    estimateLabels: {
      de: 'Gute Balance fuer konstante Fortschritte. In einer Woche kannst du mehrere kleine Lernziele schaffen.',
      en: 'A good balance for steady progress. In one week, you can complete several small learning goals.',
      id: 'Pilihan seimbang untuk progres stabil. Dalam seminggu, kamu bisa menyelesaikan beberapa target belajar kecil.',
    },
  },
  {
    id: '20-30',
    labels: {de: '20-30 Minuten', en: '20-30 minutes', id: '20-30 menit'},
    estimateLabels: {
      de: 'Starker Rhythmus. Damit baust du schnell Routine auf und kommst sichtbar voran.',
      en: 'A strong rhythm. This helps you build routine quickly and move forward noticeably.',
      id: 'Ritme yang kuat. Ini membantu kamu cepat membangun rutinitas dan maju dengan terlihat jelas.',
    },
  },
  {
    id: '30-plus',
    labels: {de: '30+ Minuten', en: '30+ minutes', id: '30+ menit'},
    estimateLabels: {
      de: 'Volles Tempo. Damit erreichst du in kurzer Zeit deutlich mehr und kommst schneller in die Praxis.',
      en: 'Full pace. You will achieve much more in a short time and get into practice faster.',
      id: 'Tempo penuh. Kamu bisa mencapai lebih banyak dalam waktu singkat dan lebih cepat masuk ke praktik.',
    },
  },
];
