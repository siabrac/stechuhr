import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

export const useTimeStore = create(
  persist(
    immer(
      (set, get) => ({
        entries: [],
        isRunning: false,
        startTime: null,
        projectIds: [],
        tags: [],
        startTimer: (projectIds, tags) => set((state) => { state.isRunning = true; state.projectIds = projectIds; state.tags = tags; state.startTime = Date.now(); }),
        stopTimer: () => {
          const { projectIds, tags, startTime } = get();
          if (startTime) {
            const duration = Math.floor((Date.now() - startTime) / 1000);
            set((state) => {
              state.entries.push({ projectIds, tags, start: startTime, duration });
              state.isRunning = false;
              state.startTime = null;
            });
          }
        },
        addManualEntry: (start, duration, projectIds, tags) => set((state) => {
          state.entries.push({ start, duration, projectIds, tags });
        }),
        getUniqueProjectIds: () => {
          const entries = get().entries;
          const idSet = new Set();
          entries.forEach(entry => {
            (entry.projectIds || []).forEach(id => idSet.add(id));
          });
          return Array.from(idSet);
        }
      })
    ),
    {
      name: 'stechuhr-data',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: (state) => {
        state.entries.forEach(entry => {
          if (!Array.isArray(entry.projectIds)) entry.projectIds = [];
          if (!Array.isArray(entry.tags)) entry.tags = [];
        });
      }
    }
  ));
