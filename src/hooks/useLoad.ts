import { useCallback, useEffect, useState } from 'react';
export function useLoad<T>(fn: () => Promise<T>, deps: unknown[] = []) {
  const [d, setD] = useState<T>(); const [e, setE] = useState(''); const [l, setL] = useState(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(() => { setL(true); fn().then(x => { setD(x); setE(''); }).catch(x => setE(x.message)).finally(() => setL(false)); }, deps);
  useEffect(run, [run]);
  return { d, e, l, reload: run };
}
