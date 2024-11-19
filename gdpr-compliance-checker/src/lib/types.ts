export interface GDPRRequirement {
  id: string;
  name: string;
  description: string;
  matchingCategories: string[];
  required: boolean;
}

export const GDPR_REQUIREMENTS: GDPRRequirement[] = [
  {
    id: 'identity',
    name: 'Organization Identity',
    description: 'Identity and contact details of the organization, representative, and DPO',
    matchingCategories: ['Other.Privacy contact information'],
    required: true
  },
  {
    id: 'purpose',
    name: 'Processing Purpose',
    description: 'Purpose and legal basis for processing personal data',
    matchingCategories: [
      'First Party Collection/Use.Purpose',
      'First Party Collection/Use.Legal basis'
    ],
    required: true
  },
  // ... add other requirements
]; 