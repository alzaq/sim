import { useRef, useState } from 'react';
import { SimulationState } from 'simscript';
import logger from '../utils/logger';
import { Onboarding } from '../simulation/onboarding';
import {
  generateEntity,
  getRandomItems,
  getRandomName,
  getRandomNames,
} from '../utils/generator';
import { EVENT, Entity, TRIGGER } from '../simulation/const';

// define 50 names for the original gangsters
const ogNames = getRandomNames(50);

// define the original gangsters
const originalGangsters: Entity[] = ogNames.map(name =>
  generateEntity(name, ogNames),
);

export default function Home() {
  //
  // UI
  //
  const consoleRef = useRef<any>();
  const timeRef = useRef<any>();

  //
  // SIMULATION
  //
  const simulationRef = useRef<Onboarding>();
  const [isRunning, setIsRunning] = useState(false);

  //
  // EVENTS
  //
  const handleClear = () => {
    simulationRef.current?.logger.clear();
  };

  const handleStart = () => {
    // init
    const simulation = new Onboarding({
      frameDelay: 2500,
      logger: logger(consoleRef.current),
      originalGangsters,
    });

    // state event
    simulation.stateChanged.addEventListener(() => {
      switch (simulation.state) {
        case SimulationState.Finished:
          simulation.logger.log(`ℹ️ [INFO] Simulation is finished!`);
          setIsRunning(false);
        case SimulationState.Paused:
          simulation.logger.log(`ℹ️ [INFO] Simulation is paused!`);
          setIsRunning(false);
          break;
        case SimulationState.Running:
          simulation.logger.log(`ℹ️ [INFO] Simulation is running!`);
          setIsRunning(true);
          break;
      }
    });

    // time event
    simulation.timeNowChanged.addEventListener(() => {
      timeRef.current.textContent = `Time: ${simulation.timeNow} seconds`;
    });

    // custom event
    simulation.customEvent.addEventListener((sender, args) => {
      switch (args.event) {
        case EVENT.MESSAGE_WELCOME:
          simulation.logger.log(
            `👋 [MESG] ${args.data.from.name}: Hello @${args.data.to.name}! Welcome here!`,
          );

          simulation.trigger(TRIGGER.ENTITY_INTRODUCE, {
            entity: args.data.to,
            initiator: args.data.from,
          });
          break;

        case EVENT.MESSAGE_INTRODUCE:
          simulation.logger.log(
            `👋 [MESG] ${args.data.from.name}: Oh thanks @${args.data.to.name}! I am glad to be here with you! Let my introduce myself... My name is ${args.data.from.name} blah blah...`,
          );

          simulation.trigger(TRIGGER.FRIENDS_GREET, {
            entity: args.data.from,
            initiator: args.data.to,
          });
          break;

        case EVENT.MESSAGE_GREET:
          const [greet] = getRandomItems(['Hey', 'Hi', 'Hello', 'Servus'], 1);
          simulation.logger.log(
            `👋 [MESG] ${args.data.from.name}: ${greet} @${args.data.to.name}!`,
          );
          break;

        default:
          console.log(sender, args);
      }
    });

    // start
    simulation.start();

    // save to ref
    simulationRef.current = simulation;
  };

  const handleStop = () => {
    simulationRef.current?.stop();
  };

  const handleInitEntity = () => {
    const entity = generateEntity(getRandomName(), ogNames);

    simulationRef.current?.trigger(TRIGGER.ENTITY_INIT, {
      entity,
    });
  };

  return (
    <main>
      <h1>Simulation</h1>
      <h2>Events</h2>
      <div>
        <button onClick={handleClear}>Clear console</button>{' '}
        <button onClick={handleStart} disabled={isRunning}>
          Start simulation
        </button>{' '}
        <button onClick={handleStop} disabled={!isRunning}>
          Stop simulation
        </button>{' '}
        <button onClick={handleInitEntity} disabled={!isRunning}>
          Init new entity
        </button>
      </div>

      <h2>Console</h2>
      <span ref={timeRef}>---</span>
      <pre
        ref={consoleRef}
        style={{
          border: '1px solid black',
          background: 'lightgray',
          padding: 5,
          minHeight: 400,
        }}
      />
    </main>
  );
}
