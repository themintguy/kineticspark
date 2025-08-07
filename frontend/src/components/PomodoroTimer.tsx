'use client'
import { usePomodoroStore } from "@/stores/pomodoroStore"
import { Cog, Pause, Play, RotateCcw, SkipForward } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import Notes from "./Notes";

export default function PomodoroTimer() {
   const {
     currentPhase,
     timeLeft,
     isRunning,
     sessionsCompleted,
     workDuration,
     shortBreakDuration,
     longBreakDuration,
     longBreakInterval,
     startTimer,
     pauseTimer,
     resetTimer,
     skipTimer,
     tick,
     setDurations,
   } = usePomodoroStore();


   const timerRef = useRef<NodeJS.Timeout | null>(null);

   useEffect(()=> {
    if(isRunning){
      timerRef.current = setInterval(()=>{
        tick();
      },1000);
    } else{
      if(timerRef.current){
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if(timerRef.current){
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
   },[isRunning , tick]);

   const formatTime = (seconds : number) => {
    const minutes = Math.floor(seconds/60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2,'0')} : ${remainingSeconds.toString().padStart(2,'0')} `;
   }


   const [isSettingsOpen , setIsSettingsOpen] = useState<boolean>(false);
   const [tempWorkDuration , setTempWorkDuration] = useState<number>(workDuration/60);
   const [tempShortBreakDuration , setTempShortBreakDuration] = useState<number>(shortBreakDuration/60);
   const [tempLongBreakDuration , setTempLongBreakDuration] = useState<number>(longBreakDuration / 60);
   const [tempLongBreakInterval , setTempLongBreakinterval] = useState<number>(longBreakInterval);

   const handleSaveSettings = () => {
     if(tempWorkDuration <= 0 || tempShortBreakDuration <= 0 || tempShortBreakDuration <= 0 || tempLongBreakInterval <= 0){
      toast.error("Only +ve");
      return;
     }
     setDurations (
      tempWorkDuration * 60,
      tempLongBreakDuration * 60,
      tempLongBreakDuration * 60,
      tempLongBreakInterval
     );
     setIsSettingsOpen(false);
   };

  return (
    <>
      <div className="flex flex-col items-center justify-center rounded-lg shadow-md p-8 min-h-[400px]">
        <div className="bg-white dark:bg-slate-800">
          <div className="flex ">
            <div className="mb-4 text-center">
              <span className="text-4xl font-bold text-emerald-600 dark:text-blue-600">
                {currentPhase}
              </span>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Session : {sessionsCompleted} / {longBreakInterval}
              </p>
            </div>

            <button
              className="text-gray-600 dark:text-gray-400 flex items-center mt-4 text-sm"
              onClick={() => setIsSettingsOpen(true)}
            >
              <Cog className="h-9 w-9 mt-[-40px] ml-7" />
            </button>
          </div>

          <div className="text-4xl font-mono font-bold text-gray-900 dark:text-white mb-8">
            {formatTime(timeLeft)}
          </div>

          <div className="flex justify-center items-center space-x-4 mb-6">
            <button
              onClick={isRunning ? pauseTimer : startTimer}
              className={`p-3 rounded-full text-white shadow-lg transition-all duration-200 ${
                isRunning
                  ? "bg-yellow-500 hover:bg-yellow-600"
                  : "bg-green-600 hover:bg-green-700"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isRunning ? (
                <Pause className="h-7 w-7" />
              ) : (
                <Play className="h-7 w-7" />
              )}
            </button>
            <button
              onClick={resetTimer}
              className="p-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RotateCcw className="h-7 w-7" />
            </button>
            <button
              onClick={skipTimer}
              className="p-3 rounded-full bg-gray-600 hover:bg-gray-700 text-white shadow-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <SkipForward className="h-7 w-7" />
            </button>
          </div>
          <Notes />

          {isSettingsOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
                <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center">
                  Timer Settings
                </h3>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="workDuration"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Work Duration (minutes)
                    </label>
                    <input
                      id="workDuration"
                      type="number"
                      value={tempWorkDuration}
                      onChange={(e) =>
                        setTempWorkDuration(Number(e.target.value))
                      }
                      min="1"
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="shortBreakDuration"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Short Break (minutes)
                    </label>
                    <input
                      id="shortBreakDuration"
                      type="number"
                      value={tempShortBreakDuration}
                      onChange={(e) =>
                        setTempShortBreakDuration(Number(e.target.value))
                      }
                      min="1"
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="longBreakDuration"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Long Break (minutes)
                    </label>
                    <input
                      id="longBreakDuration"
                      type="number"
                      value={tempLongBreakDuration}
                      onChange={(e) =>
                        setTempLongBreakDuration(Number(e.target.value))
                      }
                      min="1"
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="longBreakInterval"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Long Break Interval (work sessions)
                    </label>
                    <input
                      id="longBreakInterval"
                      type="number"
                      value={tempLongBreakInterval}
                      onChange={(e) =>
                        setTempLongBreakinterval(Number(e.target.value))
                      }
                      min="1"
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setIsSettingsOpen(false)}
                    className="px-5 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveSettings}
                    className="px-5 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white transition-colors duration-200"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
