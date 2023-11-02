const logger = (element: HTMLElement): Console => {
  const lines: any[] = [];

  const render = () => {
    element.textContent = lines.join('\n');
  };

  return {
    clear: () => {
      lines.length = 0;
      render();
    },
    log: (...args: any[]) => {
      lines.push([`[${new Date().toLocaleTimeString()}]`, args].join(' '));
      render();
    },
  } as Console;
};

export default logger;
