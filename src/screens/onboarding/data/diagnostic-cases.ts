import type {DiagnosticCase} from '../types/diagnostic-case';

export const diagnosticCases: DiagnosticCase[] = [
  {
    id: 'guest-room-complaint',
    situation: 'A guest comes to reception and complains: "My room is dirty."',
    question: 'Which two steps make the most sense now to resolve the situation professionally?',
    correctOptionIds: ['show-empathy', 'offer-solution'],
    options: [
      {id: 'note-complaint', label: 'Acknowledge the complaint and write it down'},
      {id: 'show-empathy', label: 'Listen to the guest and show understanding'},
      {
        id: 'offer-solution',
        label: 'Apologize and immediately offer a solution such as cleaning or a room change',
      },
      {
        id: 'inform-housekeeping',
        label: 'Inform housekeeping and request a fast correction of the issue',
      },
      {
        id: 'analyze-process',
        label: 'Analyze the root cause and review the hotel cleaning process',
      },
      {
        id: 'build-qm-system',
        label: 'Design a new quality-management system to prevent similar cases',
      },
    ],
  },
];
