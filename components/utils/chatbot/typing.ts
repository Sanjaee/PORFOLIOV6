// Typing animation utility

export async function displayText(
    text: string,
    setResponse: (updater: (prev: string) => string) => void,
    chunkSize = 5
  ): Promise<void> {
    for (let i = 0; i < text.length; i += chunkSize) {
      const chunk = text.slice(i, i + chunkSize);
      setResponse((prevResponse) => prevResponse + chunk);
  
      if (i + chunkSize < text.length) {
        await new Promise((resolve) => {
          requestAnimationFrame(resolve);
        });
      }
    }
  }
  
  