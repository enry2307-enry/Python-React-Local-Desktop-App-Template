type PythonMethod = (...args: any[]) => Promise<any>;

class PythonAPI {
  private bridgePromise: Promise<void> | null = null;

  private waitForBridge(): Promise<void> {
    if (window.pywebview?.api) {
      return Promise.resolve();
    }

    if (this.bridgePromise) {
      return this.bridgePromise;
    }

    this.bridgePromise = new Promise<void>((resolve, reject) => {
      let timeout: number;

      const cleanup = () => {
        window.clearTimeout(timeout);
        window.removeEventListener("pywebviewready", onReady);
      };

      const onReady = () => {
        if (!window.pywebview?.api) {
          return;
        }

        cleanup();
        resolve();
      };

      window.addEventListener("pywebviewready", onReady);

      timeout = window.setTimeout(() => {
        cleanup();
        reject(new Error("Python bridge initialization timed out"));
      }, 5000);

      // Check again after registering the listener.
      onReady();
    }).catch((error) => {
      // Allow future calls to retry initialization.
      this.bridgePromise = null;
      throw error;
    });

    return this.bridgePromise;
  }

  async call<T = unknown>(
    method: string,
    ...args: any[]
  ): Promise<T> {
    await this.waitForBridge();

    const pythonMethod = window.pywebview?.api[method] as
      | PythonMethod
      | undefined;

    if (typeof pythonMethod !== "function") {
      throw new Error(`Python method '${method}' does not exist`);
    }

    return (await pythonMethod(...args)) as T;
  }
}

export const api = new PythonAPI();