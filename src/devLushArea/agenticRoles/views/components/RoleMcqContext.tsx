import React, { createContext, useContext } from 'react';

export interface RoleMcqContextValue {
  isMcqOpen: boolean;
  totalQuestions: number;
  openMcq: () => void;
  closeMcq: () => void;
  mcqSectionRef?: React.RefObject<HTMLElement | null>;
}

const RoleMcqContext = createContext<RoleMcqContextValue | null>(null);

export const RoleMcqProvider = RoleMcqContext.Provider;

export function useRoleMcqContext(): RoleMcqContextValue | null {
  return useContext(RoleMcqContext);
}
