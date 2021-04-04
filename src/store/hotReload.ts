import { Store } from "vuex";

function loadModules() {
  const context = require.context("@/store/modules", false, /([a-z_]+)\.js$/i);

  const modules = context
    .keys()
    .map((key) => {
      const match = key.match(/([a-z_]+)\.js$/i);
      return { key, name: (match || ["not found"])[1] };
    })
    .reduce(
      (modules, { key, name }) => ({
        ...modules,
        [name]: context(key).default,
      }),
      {}
    );

  return { context, modules };
}

export function activeHotReload<S>(store: Store<S>): void {
  const { context } = loadModules();

  if (module.hot) {
    // Hot reload whenever any module changes.
    module.hot.accept(context.id, () => {
      const { modules } = loadModules();

      store.hotUpdate({
        modules,
      });
    });
  }
}
