import { create } from "zustand";
import toast from "react-hot-toast";

export enum PomodoroPhase {
    Work = "Work",
    ShortBreak = "Short Break",
    LongBreak = "Long break",
}

interface PomodoroState {
    currentPhase : PomodoroPhase;
    timeLeft : number;
    isRunning : boolean;
    sessionsCompleted : number;

    workDuration : number;
    shortBreakDuration : number;
    longBreakDuration : number;
    longBreakInterval : number;


    startTimer : () => void;
    pauseTimer : () => void;
    resetTimer : () => void;
    skipTimer : () => void;
    tick : () => void;

    setDurations : (
        work : number,
        short : number,
        long : number,
        interval : number
    ) => void;
}


const DEFAULT_WORK_DURATION = 25 * 60;
const DEFAULT_SHORT_BREAK_DURATION = 5 * 60;
const DEFAULT_LONG_BREAK_DURATION = 15 * 60;
const  DEFAULT_LONG_BREAK_INTERVAL =   4;


export const usePomodoroStore = create<PomodoroState>((set, get) => ({
  currentPhase: PomodoroPhase.Work,
  timeLeft: DEFAULT_WORK_DURATION,
  isRunning: false,
  sessionsCompleted: 0,

  workDuration: DEFAULT_WORK_DURATION,
  shortBreakDuration: DEFAULT_SHORT_BREAK_DURATION,
  longBreakDuration: DEFAULT_LONG_BREAK_DURATION,
  longBreakInterval: DEFAULT_LONG_BREAK_INTERVAL,

  startTimer: () => {
    set({
      isRunning: true,
    });
    toast.success("Pomodoro started");
  },

  pauseTimer: () => {
    set({
      isRunning: false,
    });
    toast("Pomodoro paused", { icon: "⏸️" });
  },

  resetTimer: () => {
    const {
      currentPhase,
      workDuration,
      shortBreakDuration,
      longBreakDuration,
    } = get();

    let initialTime = 0;

    switch (currentPhase) {
      case PomodoroPhase.Work:
        initialTime = workDuration;
        break;
      case PomodoroPhase.ShortBreak:
        initialTime = shortBreakDuration;
        break;
      case PomodoroPhase.LongBreak:
        initialTime = longBreakDuration;
        break;
    }
    set({ isRunning: false, timeLeft: initialTime });
    toast("Pomodoro reset.", { icon: "🔄" });
  },

  tick: () => {
    const {
      timeLeft,
      currentPhase,
      sessionsCompleted,
      workDuration,
      shortBreakDuration,
      longBreakDuration,
      longBreakInterval,
    } = get();

    if (timeLeft <= 1) {
      toast.success(`${currentPhase} session ended!`, { icon: "🔔" });

      let nextPhase: PomodoroPhase;
      let nextTime: number;
      let nextSessionsCompleted = sessionsCompleted;

      if (currentPhase === PomodoroPhase.Work) {
        nextSessionsCompleted++;
        if (nextSessionsCompleted % longBreakInterval === 0) {
          nextPhase = PomodoroPhase.LongBreak;
          nextTime = longBreakDuration;
          toast.success("Starting Long Break!", { icon: "☕" });
        } else {
          nextPhase = PomodoroPhase.ShortBreak;
          nextTime = shortBreakDuration;
          toast.success("Starting Short Break!", { icon: "🧘" });
        }
      } else {
        nextPhase = PomodoroPhase.Work;
        nextTime = workDuration;
        if (currentPhase === PomodoroPhase.LongBreak) {
          nextSessionsCompleted = 0;
        }
        toast.success("Back to Work!", { icon: "✍️" });
      }

      set({
        currentPhase: nextPhase,
        timeLeft: nextTime,
        isRunning: false, 
        sessionsCompleted: nextSessionsCompleted,
      });

    } else {
      set((state) => ({ timeLeft: state.timeLeft - 1 }));
    }
  },

  skipTimer: () => {
    const {
      currentPhase,
      sessionsCompleted,
      workDuration,
      shortBreakDuration,
      longBreakDuration,
      longBreakInterval,
    } = get();

    let nextPhase: PomodoroPhase;
    let nextTime: number;
    let nextSessionsCompleted = sessionsCompleted;

    if (currentPhase === PomodoroPhase.Work) {
      nextSessionsCompleted++;
      if (nextSessionsCompleted % longBreakInterval === 0) {
        nextPhase = PomodoroPhase.LongBreak;
        nextTime = longBreakDuration;
      } else {
        nextPhase = PomodoroPhase.ShortBreak;
        nextTime = shortBreakDuration;
      }
    } else {
      nextPhase = PomodoroPhase.Work;
      nextTime = workDuration;
      if (currentPhase === PomodoroPhase.LongBreak) {
        nextSessionsCompleted = 0; 
      }
    }

    set({
      currentPhase: nextPhase,
      timeLeft: nextTime,
      isRunning: false, 
      sessionsCompleted: nextSessionsCompleted,
    });
    toast("Timer skipped to next phase.", { icon: "⏭️" });
  },

  setDurations: (work, short, long, interval) => {
    set((state) => {
      let newTimeLeft = state.timeLeft;
      if (
        state.currentPhase === PomodoroPhase.Work &&
        state.timeLeft === state.workDuration
      ) {
        newTimeLeft = work;
      } else if (
        state.currentPhase === PomodoroPhase.ShortBreak &&
        state.timeLeft === state.shortBreakDuration
      ) {
        newTimeLeft = short;
      } else if (
        state.currentPhase === PomodoroPhase.LongBreak &&
        state.timeLeft === state.longBreakDuration
      ) {
        newTimeLeft = long;
      }

      return {
        workDuration: work,
        shortBreakDuration: short,
        longBreakDuration: long,
        longBreakInterval: interval,
        timeLeft: newTimeLeft, 
      };
    });
    toast.success("Pomodoro settings updated!");
  },
}));
