export const RSVP_STORAGE_KEY = 'shahar-liza-rsvp-v1';
export const RSVP_FORM_VERSION = 1;
export const MAX_PARTY_SIZE = 4;

export const PARTY_SIZE_OPTIONS = Object.freeze([1, 2, 3, 4]);

export const DIETARY_OPTIONS = Object.freeze([
  {
    id: 'vegetarian',
    label: 'VEGETARIAN',
    description: 'No meat or fish',
  },
  {
    id: 'vegan',
    label: 'VEGAN',
    description: 'No animal products',
  },
  {
    id: 'glutenFree',
    label: 'GLUTEN-FREE',
    description: 'Celiac or preference',
  },
  {
    id: 'allergies',
    label: 'ALLERGIES',
    description: 'We will ask for details',
  },
]);
