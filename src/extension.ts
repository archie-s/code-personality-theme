import * as vscode from "vscode";

type Mode = "calm" | "focus" | "panic";

export function activate(context: vscode.ExtensionContext) {
  const state = new PersonalityState();
  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument((e) => {
      if (!getEnabled()) {
        return;
      }
      state.onEdit();
    })
  );

  context.subscriptions.push(
    vscode.languages.onDidChangeDiagnostics(async () => {
      if (!getEnabled()) {
        return;
      }
      state.onDiagnosticsChanged();
      
      const mode = state.computeMode();
      const isPanicRecovery = state.isPanicRecovery(mode);
      if (isPanicRecovery) {
        await applyMode(mode, state, true);
      }
    })
  );


  const interval = setInterval(async () => {
    if (!getEnabled()) {
      return;
    }
    const mode = state.computeMode();
    const isPanicRecovery = state.isPanicRecovery(mode);
    await applyMode(mode, state, isPanicRecovery);
  }, 1000);

  context.subscriptions.push({ dispose: () => clearInterval(interval) });


  (async () => {
    if (!getEnabled()) {
      return;
    }
    const mode = state.computeMode();
    await applyMode(mode, state, true);
  })();
}

export function deactivate() {}

class PersonalityState {
  private lastEditAt = Date.now();
  private editTimestamps: number[] = []; 
  private lastAppliedAt = 0;
  private lastMode: Mode | null = null;

  onEdit() {
    const now = Date.now();
    this.lastEditAt = now;
    this.editTimestamps.push(now);

  
    const cutoff = now - 10_000;
    this.editTimestamps = this.editTimestamps.filter((t) => t >= cutoff);
  }

  onDiagnosticsChanged() {
  }

  computeMode(): Mode {
    const cfg = getConfig();
    const now = Date.now();

    const totalDiagnostics = countAllDiagnostics();

    if (totalDiagnostics >= cfg.panicErrorThreshold) {
      return "panic";
    }

    const editsInWindow = this.editTimestamps.length;
    if (editsInWindow >= cfg.focusTypingBurstThreshold) {
      return "focus";
    }

    const idleMs = now - this.lastEditAt;
    if (idleMs >= cfg.idleSecondsForCalm * 1000) {
      return "calm";
    }

    return "focus";
  }

  isPanicRecovery(newMode: Mode): boolean {
    return this.lastMode === "panic" && newMode !== "panic";
  }

  canApply(mode: Mode, force = false): boolean {
    if (force) {
      return true;
    }

    const cfg = getConfig();
    const now = Date.now();

    if (this.lastMode === mode) {
      return false;
    }
    if (this.lastMode === "panic" && mode === "calm") {
      return true;
    }
    const cooldownMs = cfg.cooldownSeconds * 1000;
    if (now - this.lastAppliedAt < cooldownMs) {
      return false;
    }

    return true;
  }

  markApplied(mode: Mode) {
    this.lastAppliedAt = Date.now();
    this.lastMode = mode;
  }
}

function getEnabled(): boolean {
  return vscode.workspace
    .getConfiguration("codePersonalityThemes")
    .get<boolean>("enabled", true);
}

function getConfig() {
  const c = vscode.workspace.getConfiguration("codePersonalityThemes");
  return {
    calmTheme: c.get<string>("calmTheme", "Personality: Calm"),
    focusTheme: c.get<string>("focusTheme", "Personality: Focus"),
    panicTheme: c.get<string>("panicTheme", "Personality: Panic"),
    panicErrorThreshold: c.get<number>("panicErrorThreshold", 5),
    focusTypingBurstThreshold: c.get<number>(
      "focusTypingBurstThreshold",
      12
    ),
    idleSecondsForCalm: c.get<number>("idleSecondsForCalm", 20),
    cooldownSeconds: c.get<number>("cooldownSeconds", 15),
  };
}

function countAllDiagnostics(): number {
  let total = 0;
  for (const uri of vscode.workspace.textDocuments.map((d) => d.uri)) {
    total += vscode.languages.getDiagnostics(uri).length;
  }

  for (const [_, diags] of vscode.languages.getDiagnostics()) {
    total += diags.length;
  }
  return total;
}

async function applyMode(mode: Mode, state: PersonalityState, force = false) {
  if (!state.canApply(mode, force)) {
    return;
  }

  const cfg = getConfig();
  const theme =
    mode === "calm"
      ? cfg.calmTheme
      : mode === "panic"
      ? cfg.panicTheme
      : cfg.focusTheme;

  const workbench = vscode.workspace.getConfiguration("workbench");
  const currentTheme = workbench.get<string>("colorTheme");

  if (currentTheme !== theme) {
    await workbench.update("colorTheme", theme, vscode.ConfigurationTarget.Global);
  }

  state.markApplied(mode);
}
