import { useEffect } from 'react';

/**
 * This is a pseudo hook that is designed to navigate around the react-hooks/exhaustive-deps rules in eslint without the need to
 * disable it entirely in the rest of the application. useMount guarantees that it will only run once when mounted, and
 * only requires the rules disabling for this definition.
 *
 * Use `useMount` in every place you would normally call `useEffect` with the intention of running it once.
 */
// eslint-disable-next-line react-hooks/exhaustive-deps
export const useMount = (mount: () => void): void => useEffect(mount, []);

export default useMount;
