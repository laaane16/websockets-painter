import { create } from 'zustand/react';

export interface CanvasSchema {
  canvas: HTMLCanvasElement | null;
  undoList: string[];
  redoList: string[];
  session?: string;
  socket?: WebSocket;
  setCanvas: (el: HTMLCanvasElement) => void;
  pushToUndo: (url: string) => void;
  pushToRedo: (url: string) => void;
  undo: () => void;
  redo: () => void;
  username: string;
  setUsername: (str: string) => void;
  setSession: (session: string) => void;
  setSocket: (socket: WebSocket) => void;
}

export const useStore = create<CanvasSchema>((set) => ({
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
        const ctx = state.canvas?.getContext('2d');
        const prevState = state.undoList.pop() as string;
        state.redoList.push(state.canvas?.toDataURL() || '');

        const img = new Image();
        img.src = prevState;
        img.onload = () => {
          ctx?.clearRect(0, 0, state.canvas?.width || 0, state.canvas?.height || 0);
          ctx?.drawImage(img, 0, 0, state.canvas?.width || 0, state.canvas?.height || 0);
        };
      } else {
        console.log('Невозможно пролистать на предыдущую страницу');
      }
      return state;
    }),
  redo: () =>
    set((state) => {
      if (state.redoList.length > 0) {
        const ctx = state.canvas?.getContext('2d');
        const nextState = state.redoList.pop() as string;
        state.undoList.push(state.canvas?.toDataURL() || '');

        const img = new Image();
        img.src = nextState;
        img.onload = () => {
          ctx?.clearRect(0, 0, state.canvas?.width || 0, state.canvas?.height || 0);
          ctx?.drawImage(img, 0, 0, state.canvas?.width || 0, state.canvas?.height || 0);
        };
      } else {
        console.log('Невозможно пролистать на предыдущую страницу');
      }
      return state;
    }),
}));
