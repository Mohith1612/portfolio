export const findById = <T extends { id: string }>(items: T[], id: string): T => {
  const item = items.find((entry) => entry.id === id);

  if (!item) {
    throw new Error(`ResumeX entry not found: ${id}`);
  }

  return item;
};

export const getBullet = <T extends { id: string }>(items: T[], id: string): T =>
  findById(items, id);

