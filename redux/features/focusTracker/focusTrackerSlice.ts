import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  date: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
}

interface FocusTrackerState {
  currentSession: number;
  totalFocusTime: number;
  dailyFocusTime: number;
  dailySessions: number;
  weeklyFocusTime: number[];
  weeklySessions: number[];
  monthlyFocusTime: number[];
  monthlySessions: number[];
  continuousSessionStreak: number;
  longestContinuousSessionStreak: number;
  badges: string[];
  lastSessionDate: string | null;
  tasks: Task[];
}

const initialState: FocusTrackerState = {
  currentSession: 0,
  totalFocusTime: 0,
  dailyFocusTime: 0,
  dailySessions: 0,
  weeklyFocusTime: [0, 0, 0, 0, 0, 0, 0],
  weeklySessions: [0, 0, 0, 0, 0, 0, 0],
  monthlyFocusTime: Array(30).fill(0),
  monthlySessions: Array(30).fill(0),
  continuousSessionStreak: 0,
  longestContinuousSessionStreak: 0,
  badges: [],
  lastSessionDate: null,
  tasks: [],
};

const focusTrackerSlice = createSlice({
  name: 'focusTracker',
  initialState,
  reducers: {
    incrementSession: (state, action: PayloadAction<number>) => {
      const focusTime = action.payload;
      const today = new Date();
      const dayOfWeek = today.getDay();
      const dayOfMonth = today.getDate() - 1;
      const todayString = today.toDateString();

      state.currentSession += 1;
      state.totalFocusTime += focusTime;
      state.dailyFocusTime += focusTime;
      state.dailySessions += 1;
      state.weeklyFocusTime[dayOfWeek] += focusTime;
      state.weeklySessions[dayOfWeek] += 1;
      state.monthlyFocusTime[dayOfMonth] += focusTime;
      state.monthlySessions[dayOfMonth] += 1;

      // Update continuous session streak
      state.continuousSessionStreak += 1;
      state.longestContinuousSessionStreak = Math.max(state.longestContinuousSessionStreak, state.continuousSessionStreak);

      state.lastSessionDate = todayString;

      if (state.currentSession === 1) {
        state.badges.push('First Focus');
      }
    },
    resetContinuousSessionStreak: (state) => {
      state.continuousSessionStreak = 0;
    },
    addBadge: (state, action: PayloadAction<string>) => {
      if (!state.badges.includes(action.payload)) {
        state.badges.push(action.payload);
      }
    },
    resetDailyStats: (state) => {
      state.dailyFocusTime = 0;
      state.dailySessions = 0;
      state.continuousSessionStreak = 0;
    },
    resetWeeklyStats: (state) => {
      state.weeklyFocusTime = [0, 0, 0, 0, 0, 0, 0];
      state.weeklySessions = [0, 0, 0, 0, 0, 0, 0];
    },
    resetMonthlyStats: (state) => {
      state.monthlyFocusTime = Array(30).fill(0);
      state.monthlySessions = Array(30).fill(0);
    },
    addTask: (state, action: PayloadAction<{ text: string; priority: string; dueDate?: string }>) => {
      const newTask: Task = {
        id: Date.now().toString(),
        text: action.payload.text,
        completed: false,
        date: new Date().toISOString(),
        priority: action.payload.priority as 'low' | 'medium' | 'high',
        dueDate: action.payload.dueDate,
      };
      state.tasks.push(newTask);
    },
    toggleTaskCompletion: (state, action: PayloadAction<{ id: string }>) => {
      const task = state.tasks.find(t => t.id === action.payload.id);
      if (task) {
        task.completed = !task.completed;
      }
    },
    clearCompletedTasks: (state) => {
      state.tasks = state.tasks.filter(task => !task.completed);
    },
    updateTaskDueDate: (state, action: PayloadAction<{ id: string; dueDate?: string }>) => {
      const task = state.tasks.find(t => t.id === action.payload.id);
      if (task) {
        task.dueDate = action.payload.dueDate;
      }
    },
    updateTaskPriority: (state, action: PayloadAction<{ id: string; priority: string }>) => {
      const task = state.tasks.find(t => t.id === action.payload.id);
      if (task) {
        task.priority = action.payload.priority as 'low' | 'medium' | 'high';
      }
    },
  },
});

export const {
  incrementSession,
  resetContinuousSessionStreak,
  addBadge,
  resetDailyStats,
  resetWeeklyStats,
  resetMonthlyStats,
  addTask,
  toggleTaskCompletion,
  clearCompletedTasks,
  updateTaskDueDate,
  updateTaskPriority,
} = focusTrackerSlice.actions;
export default focusTrackerSlice.reducer;

