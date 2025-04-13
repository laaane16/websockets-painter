import { create } from 'zustand/react';
import { Tool } from '../tools/Tool';

export interface ToolSchema {
  tool: Tool | null;
  setTool: (newTool: Tool) => void;
  setStrokeWidth: (width: number) => unknown;
  setStrokeColor: (color: string) => void;
  setFill: (color: string) => void;
}

export const useToolStore = create<ToolSchema>((set) => ({
  tool: null,
  setTool: (newTool: Tool) => set({ tool: newTool }),
  setStrokeWidth: (width: number) =>
    set((state) => {
      state.tool?.setStrokeWidth(width);

      return state;
    }),
  setStrokeColor: (color: string) =>
    set((state) => {
      state.tool?.setStrokeColor(color);

      return state;
    }),

  setFill: (color: string) =>
    set((state) => {
      state.tool?.setFillColor(color);

      return state;
    }),
}));
