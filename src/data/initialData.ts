import { FamilyMember, ChoreTask } from '../types';

export const familyMembers: FamilyMember[] = [
  { id: 'nathan', name: 'Nathan', isPrimary: true },
  { id: 'anna', name: 'Anna', isPrimary: true },
  { id: 'aaron', name: 'Aaron', isPrimary: true },
  { id: 'maman', name: 'Maman', isPrimary: false },
  { id: 'papa', name: 'Papa', isPrimary: false },
];

export const choreTasks: ChoreTask[] = [
  {
    id: 'feed-dogs',
    name: 'Nourrir les chiens',
    description: 'Donner à manger aux chiens',
    icon: 'dog'
  },
  {
    id: 'clean-rabbit-cage',
    name: 'Nettoyer cage lapin',
    description: 'Nettoyer la cage du lapin',
    icon: 'rabbit'
  },
  {
    id: 'sweep-veranda',
    name: 'Nettoyer véranda',
    description: 'Balayer ou passer l\'aspirateur dans la véranda',
    icon: 'broom'
  },
  {
    id: 'brush-dogs',
    name: 'Brosser les chiens',
    description: 'Brosser les chiens',
    icon: 'brush'
  }
];