import { GLOBAL_STATE, dispatch } from "../state";
import { posAtCoords } from "../utils";
import { zoomAtPoint } from "../actions/zoomFit";

function pan(e) {
  const startPos = { x: e.clientX, y: e.clientY };
  const startPan = GLOBAL_STATE.chartPan;

  function move(e) {
    if (e.buttons == 0) {
      end();
    } else {
      const dx = startPos.x - e.clientX;
      const dy = startPos.y - e.clientY;

      dispatch({ chartPan: { x: startPan.x - dx, y: startPan.y - dy } });
    }
  }

  function end() {
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", end);
    window.removeEventListener("pointerleave", end);
  }

  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", end);
  window.addEventListener("pointerleave", end);
}

export function desktopPointerPanZoom(desktop) {
  desktop.addEventListener("pointerdown", (e) => {
    if (e.target == desktop || e.target.id == "symbol-canvas") {
      pan(e);
    }
  });

  desktop.addEventListener("pointermove", (e) => {
    const { x, y } = posAtCoords(e, desktop);
    if (GLOBAL_STATE.pos.x != x || GLOBAL_STATE.pos.y != y) {
      dispatch({ pos: { x, y } });
    }
  });

  desktop.addEventListener("pointerleave", (e) => {
    dispatch({ pos: { x: -1, y: -1 } });
  });

  desktop.addEventListener("wheel", (e) => {
    const bounds = desktop.getBoundingClientRect();
    let scale;

    if (Math.sign(e.deltaY) < 0) {
      scale = GLOBAL_STATE.reverseScroll
        ? GLOBAL_STATE.scale - 1
        : GLOBAL_STATE.scale + 1;
    } else {
      scale = GLOBAL_STATE.reverseScroll
        ? GLOBAL_STATE.scale + 1
        : GLOBAL_STATE.scale - 1;
    }
    zoomAtPoint(
      {
        x: e.clientX - bounds.left,
        y: e.clientY - bounds.top,
      },
      scale
    );
  });
}
