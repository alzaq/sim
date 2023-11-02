export type Entity = {
  name: string;
  friends: Entity[];
};

export type CustomEventArgs = {
  event: string;
  data: any;
};

export const TRIGGER = {
  ENTITY_INIT: 'entity-init',
  ENTITY_INTRODUCE: 'entity-introduce',
  FRIENDS_GREET: 'friends-greet',
};

export const EVENT = {
  MESSAGE_WELCOME: 'message-welcome',
  MESSAGE_REACTION: 'message-reaction',
  MESSAGE_INTRODUCE: 'message-introduce',
  MESSAGE_GREET: 'message-greet',
};
