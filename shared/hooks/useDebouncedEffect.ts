import { useEffect } from "react";

/**
 * Executes a debounced effect after a specified delay, with specified dependencies.
 *
 * @param {() => void} effect - The effect function to be executed.
 * @param {any[]} deps - The dependencies array, similar to useEffect's dependencies.
 * @param {number} delay - The delay (in milliseconds) before the effect is executed.
 * @returns {void}
 *
 * @example
 * // Example usage within a functional component
 * const MyComponent = () => {
 *   const [count, setCount] = useState(0);
 *
 *   useDebouncedEffect(() => {
 *     console.log("Effect executed!");
 *     // Perform some side effect based on count value
 *   }, [count], 500);
 *
 *   return (
 *     <div>
 *       <button onClick={() => setCount(count + 1)}>Increment</button>
 *       <p>Count: {count}</p>
 *     </div>
 *   );
 * };
 */
export const useDebouncedEffect = (
  effect: () => void,
  deps: any[],
  delay: number,
): void => {
  useEffect(() => {
    const handler = setTimeout(() => {
      effect();
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [...deps, delay]);
};
