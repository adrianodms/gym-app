import { Injectable } from '@angular/core';
import { Routine, WorkoutLog } from '../models/gym.model';

@Injectable({
  providedIn: 'root'
})
export class GymService {
  private readonly ROUTINES_KEY = 'gym_routines';
  private readonly HISTORY_KEY = 'gym_history';

  constructor() { }

  getRoutines(): Routine[] {
    const data = localStorage.getItem(this.ROUTINES_KEY);
    return data ? JSON.parse(data) : [];
  }

  saveRoutine(routine: Routine): void {
    const routines = this.getRoutines();
    const index = routines.findIndex(r => r.id === routine.id);
    if (index >= 0) {
      routines[index] = routine;
    } else {
      routines.push(routine);
    }
    localStorage.setItem(this.ROUTINES_KEY, JSON.stringify(routines));
  }

  deleteRoutine(id: string): void {
    let routines = this.getRoutines();
    routines = routines.filter(r => r.id !== id);
    localStorage.setItem(this.ROUTINES_KEY, JSON.stringify(routines));
  }

  getRoutine(id: string): Routine | undefined {
    return this.getRoutines().find(r => r.id === id);
  }

  getHistory(): WorkoutLog[] {
    const data = localStorage.getItem(this.HISTORY_KEY);
    return data ? JSON.parse(data, (key, value) => {
        // Hydrate dates properly
        if (key === 'date') return new Date(value);
        return value;
    }) : [];
  }

  saveWorkoutLog(log: WorkoutLog): void {
    const history = this.getHistory();
    history.push(log);
    localStorage.setItem(this.HISTORY_KEY, JSON.stringify(history));
  }

  getLastLogForRoutine(routineId: string): WorkoutLog | undefined {
    const history = this.getHistory();
    // Filter by routine and sort descending by date
    return history
      .filter(h => h.routineId === routineId)
      .sort((a, b) => b.date.getTime() - a.date.getTime())[0];
  }
}
