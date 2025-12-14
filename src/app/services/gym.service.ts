import { Injectable, signal } from '@angular/core';
import { Routine, WorkoutLog } from '../models/gym.model';

@Injectable({
  providedIn: 'root'
})
export class GymService {
  private readonly ROUTINES_KEY = 'gym_routines';
  private readonly HISTORY_KEY = 'gym_history';

  // Signals for state
  readonly routines = signal<Routine[]>(this.loadRoutines());
  readonly history = signal<WorkoutLog[]>(this.loadHistory());

  constructor() { }

  private loadRoutines(): Routine[] {
    const data = localStorage.getItem(this.ROUTINES_KEY);
    return data ? JSON.parse(data) : [];
  }

  private loadHistory(): WorkoutLog[] {
    const data = localStorage.getItem(this.HISTORY_KEY);
    return data ? JSON.parse(data, (key, value) => {
        if (key === 'date') return new Date(value);
        return value;
    }) : [];
  }

  saveRoutine(routine: Routine): void {
    this.routines.update((current: Routine[]) => {
      const index = current.findIndex((r: Routine) => r.id === routine.id);
      let updated: Routine[];
      if (index >= 0) {
        updated = [...current];
        updated[index] = routine;
      } else {
        updated = [...current, routine];
      }
      localStorage.setItem(this.ROUTINES_KEY, JSON.stringify(updated));
      return updated;
    });
  }

  deleteRoutine(id: string): void {
    this.routines.update((current: Routine[]) => {
      const updated = current.filter((r: Routine) => r.id !== id);
      localStorage.setItem(this.ROUTINES_KEY, JSON.stringify(updated));
      return updated;
    });
  }

  getRoutine(id: string): Routine | undefined {
    return this.routines().find((r: Routine) => r.id === id);
  }

  saveWorkoutLog(log: WorkoutLog): void {
    this.history.update((current: WorkoutLog[]) => {
        const updated = [...current, log];
        localStorage.setItem(this.HISTORY_KEY, JSON.stringify(updated));
        return updated;
    });
  }

  getLastLogForRoutine(routineId: string): WorkoutLog | undefined {
    // Computed could be used here if this was a property, but as a method it accesses the current signal value
    return this.history()
      .filter((h: WorkoutLog) => h.routineId === routineId)
      .sort((a: WorkoutLog, b: WorkoutLog) => b.date.getTime() - a.date.getTime())[0];
  }
}
