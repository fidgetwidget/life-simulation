export const getCountsReducer = (acc: Record<number, number>, cur: number) => {
  if (acc[cur] == null) {
    acc[cur] = 0;
  }
  acc[cur] += 1;
  return acc;
};
