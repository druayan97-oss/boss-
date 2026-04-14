import { createContext, useContext, useEffect, useReducer, type Dispatch, type ReactNode } from 'react';
import { reducer, type Action as AppAction } from '@/app/reducer';
import { loadState, saveState } from '@/app/storage';
import type { AppState } from '@/types/domain';

type AppStateContextValue = {
  state: AppState;
  dispatch: Dispatch<AppAction>;
};

const AppStateContext = createContext<AppStateContextValue | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  return <AppStateContext.Provider value={{ state, dispatch }}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppStateContext);

  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }

  return context;
}

