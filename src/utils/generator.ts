import { uniqueNamesGenerator, names, Config } from 'unique-names-generator';
import { Entity } from '../simulation/const';

export const getRandomName = (): string => {
  const config: Config = {
    dictionaries: [names],
  };

  return uniqueNamesGenerator(config);
};

export const getRandomNames = (count: number): string[] => {
  const names: string[] = [];
  while (names.length < count) {
    const newName = getRandomName();
    if (!names.includes(newName)) {
      names.push(newName);
    }
  }
  return names;
};

export const getRandomItems = (items: any[] = [], count: number = 1): any[] => {
  const result: any[] = [];
  while (result.length < count && result.length < items.length) {
    const newItem = items[Math.floor(Math.random() * items.length)];
    if (!result.includes(newItem)) {
      result.push(newItem);
    }
  }
  return result;
};

export const generateEntity = (name: string, allNames: string[]): Entity => {
  return {
    name: name,
    friends: getRandomItems(
      allNames.filter(n => n !== name),
      5,
    ).map(name => ({ name, friends: [] })), // TODO friends of friends
  };
};
