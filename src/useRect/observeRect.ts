export type PartialRect = Partial<DOMRect>;

type RectProps = {
  rect: DOMRect | undefined;
  hasRectChanged: boolean;
  callbacks: Function[];
};

export const domRectProps: Array<keyof DOMRect> = [
  'bottom',
  'height',
  'left',
  'right',
  'top',
  'width',
];

function rectChanged(
  a: DOMRect = {} as DOMRect,
  b: DOMRect = {} as DOMRect
): boolean {
  return domRectProps.some(prop => a[prop] !== b[prop]);
}

const observedNodes = new Map<Element, RectProps>();

let rafId: number;

function run(): void {
  const changedStates: RectProps[] = [];

  observedNodes.forEach((state, node) => {
    const newRect = node.getBoundingClientRect();
    if (rectChanged(newRect, state.rect)) {
      state.rect = newRect;
      changedStates.push(state);
    }
  });

  changedStates.forEach(state => {
    state.callbacks.forEach(cb => cb(state.rect));
  });

  rafId = window.requestAnimationFrame(run);
}

export function observeRect(
  node: Element,
  callback: (rect: DOMRect) => void
): {
  observe: () => void;
  unobserve: () => void;
} {
  return {
    observe() {
      const wasEmpty = observedNodes.size === 0;

      if (observedNodes.has(node)) {
        observedNodes.get(node)?.callbacks.push(callback);
      } else {
        observedNodes.set(node, {
          rect: undefined,
          hasRectChanged: false,
          callbacks: [callback],
        });
      }

      if (wasEmpty) {
        run();
      }
    },

    unobserve() {
      const state = observedNodes.get(node);

      if (state != null && state !== undefined) {
        const index = state.callbacks.indexOf(callback);

        if (index >= 0) {
          state.callbacks.splice(index, 1);
        }

        if (!state.callbacks.length) {
          observedNodes.delete(node);
        }

        if (!observedNodes.size) {
          cancelAnimationFrame(rafId);
        }
      }
    },
  };
}
