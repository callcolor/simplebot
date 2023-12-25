export type Thunk = () => Promise<unknown>;

interface ThunkWithState {
  thunk: Thunk;
  promise: Promise<unknown> | null;
  running: boolean;
  fulfilled: boolean;
}

const createThunkWithState = (t: Thunk): ThunkWithState => ({
  fulfilled: false,
  promise: null,
  running: false,
  thunk: t,
});

const runThunkWithState = async (t: ThunkWithState) => {
  t.promise = t.thunk();
  t.running = true;
  await t.promise;
  t.fulfilled = true;
};

const thunkConcurrencyLimited = async (thunks: Thunk[], concurrentLimit: number): Promise<void> => {
  const thunksWithState = thunks.map(createThunkWithState);
  let running: ThunkWithState[] = [];
  while (thunksWithState.length > 0) {
    running = running.filter((r) => r.fulfilled === false);
    while (running.length < concurrentLimit && thunksWithState.length > 0) {
      const next = thunksWithState.splice(0, 1)[0];
      runThunkWithState(next);
      running.push(next);
    }
    await Promise.race(running.map((r) => r.promise));
  }
  await Promise.all(running.map((r) => r.promise));
};

export default thunkConcurrencyLimited;
