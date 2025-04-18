import { create } from 'zustand/react';

export interface CanvasSchema {
  canvas: HTMLCanvasElement | null;
  undoList: string[];
  redoList: string[];
  session?: string;
  socket?: WebSocket;
  username: string;

  setCanvas: (el: HTMLCanvasElement) => void;
  pushToUndo: (url: string) => void;
  pushToRedo: (url: string) => void;
  undo: () => void;
  redo: () => void;
  setUsername: (str: string) => void;
  setSession: (session: string) => void;
  setSocket: (socket: WebSocket) => void;
}

export const useCanvasStore = create<CanvasSchema>((set) => ({
  canvas: null,
  undoList: [],
  redoList: [],
  username: '',

  setUsername: (str: string) => set({ username: str }),
  setCanvas: (el) => set({ canvas: el }),
  setSocket: (socket) => set({ socket }),
  setSession: (session) => set({ session }),

  pushToUndo: (some) =>
    set((state) => {
      state.undoList.push(some);
      return state;
    }),
  pushToRedo: (some) =>
    set((state) => {
      state.redoList.push(some);
      return state;
    }),
  undo: () =>
    set((state) => {
      if (state.undoList.length > 0) {
        const prevState = state.undoList.pop() as string;
        state.redoList.push(state.canvas?.toDataURL() || '');

        state.socket?.send(
          JSON.stringify({
            id: state.session,
            method: 'draw',
            figure: {
              tool: 'undo',
              img: prevState,
            },
          }),
        );
      } else {
        console.log('Невозможно пролистать на предыдущую страницу');
      }
      return state;
    }),
  redo: () =>
    set((state) => {
      if (state.redoList.length > 0) {
        const nextState = state.redoList.pop() as string;
        state.undoList.push(state.canvas?.toDataURL() || '');

        state.socket?.send(
          JSON.stringify({
            id: state.session,
            method: 'draw',
            figure: {
              tool: 'undo',
              img: nextState,
            },
          }),
        );
      } else {
        console.log('Невозможно пролистать на следуюшую страницу');
      }
      return state;
    }),
}));
