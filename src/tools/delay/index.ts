export const delay = async (duration: number) => (
  new Promise((resolve) => {
    window.setTimeout(resolve, duration);
  })
);
