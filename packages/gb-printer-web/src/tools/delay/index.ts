export const delay = async (duration: number): Promise<void> => (
  new Promise((resolve) => {
    self.setTimeout(resolve, duration);
  })
);
