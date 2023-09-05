function canvasScalerExtension({ state }, { canvas }) {
  let { scale } = state;
  let width, height;

  function updateDom(state) {
    canvas.width = state.bitmap.width * state.aspectRatio[0] * state.scale;
    canvas.height = state.bitmap.height * state.aspectRatio[1] * state.scale;
  }

  return {
    attached(state) {
      scale = state.scale;
      width = state.bitmap.width;
      height = state.bitmap.height;
      updateDom(state);
    },
    syncState(state) {
      if (
        state.bitmap.width != width ||
        state.bitmap.height != height ||
        state.scale != scale
      ) {
        scale = state.scale;
        width = state.bitmap.width;
        height = state.bitmap.height;
        updateDom(state);
      }
    },
  };
}

export function canvasScaler(options = {}) {
  return (config) => canvasScalerExtension(config, options);
}
