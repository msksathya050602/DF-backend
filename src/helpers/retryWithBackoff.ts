import logger from "./logger";

export function retryWithBackoff<T>(fn: () => Promise<T>, maxRetries = 5, initialDelay = 1000): Promise<T> {
  return new Promise((resolve, reject) => {
    let retries = 0;

    const attempt = () => {
      fn()
        .then(resolve)
        .catch((err) => {
          logger.error(`Error: ${err.message}`);
          if (retries < maxRetries) {
            logger.error(`Error: ${err.message}, Retrying in ${initialDelay * Math.pow(2, retries)}ms...`);
            const delay = initialDelay * Math.pow(2, retries);
            retries++;
            setTimeout(attempt, delay);
          } else {
            reject(err);
          }
        });
    };

    attempt();
  });
}
