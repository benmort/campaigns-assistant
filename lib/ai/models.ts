// Define your models here.

export interface Model {
  id: string;
  apiIdentifier: string;
}

export const models: Array<Model> = [
  {
    id: 'gpt-4o-blocks',
    apiIdentifier: 'gpt-4o'
  },
  {
    id: 'gpt-4o',
    apiIdentifier: 'gpt-4o'
  },
  {
    id: 'gpt-4o-mini',
    apiIdentifier: 'gpt-4o-mini'
  },
];

export const DEFAULT_MODEL_NAME: string = 'gpt-4o-blocks';
