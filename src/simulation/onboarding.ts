import {
  Simulation,
  Entity as SimulationEntity,
  Uniform,
  Event,
} from 'simscript';

import { CustomEventArgs, EVENT, Entity, TRIGGER } from './const';
import { getRandomItems } from '../utils/generator';

export class Onboarding extends Simulation {
  logger: Console = console;

  originalGangsters: Entity[] = [];

  readonly customEvent = new Event<Onboarding, CustomEventArgs>();
  onCustomEvent(args: CustomEventArgs) {
    this.customEvent.raise(this, args);
  }

  // initialize Simulation
  constructor({ logger, originalGangsters, ...options }: any) {
    super(options);

    this.logger = logger;
    this.originalGangsters = originalGangsters;
  }

  onStarting() {
    super.onStarting();

    this.generateEntities(Customer, new Uniform(18 - 6, 18 + 6));

    this.logger.log(
      `ℹ️ [INFO] Starting simulation! There are ${this.originalGangsters.length} OGs!`,
    );
  }

  trigger(type: string, data: any) {
    switch (type) {
      case TRIGGER.ENTITY_INIT:
        {
          const { entity } = data as { entity: Entity };

          const friendsNames = entity.friends.map(friend => friend.name);

          this.logger.log(
            `🚀 [TRIG] ${entity.name} joined! OGs ${friendsNames.join(
              ', ',
            )} know ${entity.name}!`,
          );

          this.activate(new WelcomeMessage(entity));
        }
        break;

      case TRIGGER.ENTITY_INTRODUCE:
        {
          const { entity, initiator } = data as {
            entity: Entity;
            initiator: Entity;
          };

          this.logger.log(
            `🚀 [TRIG] ${initiator.name} wrote welcome message to ${entity.name}! So it's triggering reaction!`,
          );

          this.activate(new IntroduceMessage(entity, initiator));
        }
        break;

      case TRIGGER.FRIENDS_GREET:
        {
          const { entity, initiator } = data as {
            entity: Entity;
            initiator: Entity;
          };

          this.logger.log(
            `🚀 [TRIG] ${entity.name} wrote introduce message and his friends will greet him!`,
          );

          entity.friends.forEach(friend => {
            if (friend.name !== initiator.name) {
              this.activate(new GreetMessage(friend, entity));
            }
          });
        }
        break;
    }
  }
}

// define the Customer entity used by the Barbershop simulation
class Customer extends SimulationEntity<Onboarding> {
  service = new Uniform(15 - 3, 15 + 3);
  async script() {
    const shop = this.simulation;
    await this.delay(this.service.sample()); // get a haircut
  }
}

// WelcomeMessage
class WelcomeMessage extends SimulationEntity<Onboarding> {
  entity: Entity;

  delayBeforeMessage = new Uniform(5, 10);

  constructor(entity: Entity) {
    super();
    this.entity = entity;
  }

  async script() {
    const [friend] = getRandomItems(this.entity.friends, 1) as Entity[];

    this.simulation.logger.log(
      `🗓️ [EVNT] Somebody needs to react about joining ${this.entity.name}! We randomly select: ${friend.name}`,
    );

    await this.delay(this.delayBeforeMessage.sample());

    this.simulation.onCustomEvent({
      event: EVENT.MESSAGE_WELCOME,
      data: {
        from: friend,
        to: this.entity,
      },
    });
  }
}

// ReactionMessage
class IntroduceMessage extends SimulationEntity<Onboarding> {
  entity: Entity;
  initiator: Entity;

  delayBeforeMessage = new Uniform(5, 10);

  constructor(entity: Entity, initiator: Entity) {
    super();
    this.entity = entity;
    this.initiator = initiator;
  }

  async script() {
    this.simulation.logger.log(
      `🗓️ [EVNT] Now ${this.entity.name} has to react to ${this.initiator.name} and introduce self to him!`,
    );

    await this.delay(this.delayBeforeMessage.sample());

    this.simulation.onCustomEvent({
      event: EVENT.MESSAGE_INTRODUCE,
      data: {
        from: this.entity,
        to: this.initiator,
      },
    });
  }
}

// ReactionMessage
class GreetMessage extends SimulationEntity<Onboarding> {
  entity: Entity;
  target: Entity;

  delayBeforeMessage = new Uniform(5, 10);

  constructor(entity: Entity, target: Entity) {
    super();
    this.entity = entity;
    this.target = target;
  }

  async script() {
    this.simulation.logger.log(
      `🗓️ [EVNT] ${this.entity.name} will greet his friend ${this.target.name}!`,
    );

    await this.delay(this.delayBeforeMessage.sample());

    this.simulation.onCustomEvent({
      event: EVENT.MESSAGE_GREET,
      data: {
        from: this.entity,
        to: this.target,
      },
    });
  }
}
