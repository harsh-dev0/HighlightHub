import { JSX, lazy } from "react";
export function lazyWithDelay<T extends JSX.IntrinsicAttributes>(
  factory: () => Promise<{ default: React.ComponentType<T> }>,
  delay: number = 1000
) {
  return lazy(() =>
    Promise.all([
      factory(),
      new Promise((resolve) => setTimeout(resolve, delay)),
    ]).then(([module]) => module)
  );
}
