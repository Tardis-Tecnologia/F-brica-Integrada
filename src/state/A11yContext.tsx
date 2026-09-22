import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

const KEY = "fi-a11y";

export type A11yPrefs = {
  contrast: boolean;
  large: boolean;
  speakAlerts: boolean;
};

const defaults: A11yPrefs = {
  contrast: false,
  large: false,
  speakAlerts: true,
};

function readPrefs(): A11yPrefs {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaults;
    return { ...defaults, ...JSON.parse(raw) };
  } catch {
    return defaults;
  }
}

type A11yCtx = A11yPrefs & {
  open: boolean;
  setOpen: (v: boolean) => void;
  setContrast: (v: boolean) => void;
  setLarge: (v: boolean) => void;
  setSpeakAlerts: (v: boolean) => void;
};

const Ctx = createContext<A11yCtx | null>(null);

export function A11yProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<A11yPrefs>(readPrefs);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(prefs));
    document.documentElement.classList.toggle("a11y-contrast", prefs.contrast);
    document.documentElement.classList.toggle("a11y-large", prefs.large);
  }, [prefs]);

  const value = useMemo<A11yCtx>(
    () => ({
      ...prefs,
      open,
      setOpen,
      setContrast: (contrast) => setPrefs((p) => ({ ...p, contrast })),
      setLarge: (large) => setPrefs((p) => ({ ...p, large })),
      setSpeakAlerts: (speakAlerts) => setPrefs((p) => ({ ...p, speakAlerts })),
    }),
    [prefs, open],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useA11y() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useA11y outside provider");
  return v;
}
