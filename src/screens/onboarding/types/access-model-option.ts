export type AccessModelOptionId = 'free' | 'premium';

export type AccessModelOption = {
  description: string;
  features: string[];
  id: AccessModelOptionId;
  title: string;
};
