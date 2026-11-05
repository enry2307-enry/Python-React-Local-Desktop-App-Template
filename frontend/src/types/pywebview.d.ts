type PythonMethod = (...args: unknown[]) => Promise<any>;

declare global {
  interface Window {
    pywebview: {
      api: Record<string, PythonMethod>;
    };
  }
}

export {};  