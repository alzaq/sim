const logger = (element: HTMLElement): Console => {
  const lines: any[] = element.textContent
    ? element.textContent.split('\n')
    : [];

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
