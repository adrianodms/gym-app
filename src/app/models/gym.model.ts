export interface Exercise {
  name: string;
  sets: number; // Target sets
  reps: number; // Target reps (optional hint)
  targetWeight?: number; // Optional initial weight
  suggestedRestTime?: number; // In seconds
}

export interface Routine {
  id: string;
  name: string;
  exercises: Exercise[];
}

export interface SetLog {
  weight: number;
  reps: number;
  completed: boolean;
}

export interface WorkoutLog {
  id: string; // Unique ID for the log
  routineId: string;
  date: Date;
  // Map exercise name to list of sets performed
  exercises: { [exerciseName: string]: SetLog[] }; 
  duration?: number; // Total time in seconds
}
