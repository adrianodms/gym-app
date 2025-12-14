import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { GymService } from '../services/gym.service';
import { Routine, WorkoutLog, SetLog } from '../models/gym.model';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-workout-runner',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterModule, 
    MatButtonModule, 
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './workout-runner.html',
  styleUrl: './workout-runner.scss'
})
export class WorkoutRunnerComponent implements OnInit, OnDestroy {
  routine: Routine | undefined;
  workoutLog: WorkoutLog | undefined;
  
  // Execution State
  currentExerciseIndex = 0;
  activeExerciseSets: SetLog[] = [];
  
  // Timer State
  isResting = false;
  restTime = 0;
  initialRestTime = 60;
  timerInterval: any;

  constructor(
    private gymService: GymService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.routine = this.gymService.getRoutine(id);
      if (!this.routine) {
        this.router.navigate(['/']);
        return;
      }
      this.startWorkout();
    }
  }

  ngOnDestroy(): void {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }

  startWorkout() {
    if (!this.routine) return;
    
    this.workoutLog = {
      id: uuidv4(),
      routineId: this.routine.id,
      date: new Date(),
      exercises: {}
    };

    this.initializeExercise(0);
  }

  initializeExercise(index: number) {
    if (!this.routine) return;
    
    this.currentExerciseIndex = index;
    const exercise = this.routine.exercises[index];
    
    // Check if we have history for this exercise
    const lastLog = this.gymService.getLastLogForRoutine(this.routine.id);
    const lastExerciseSets = lastLog?.exercises[exercise.name];

    this.activeExerciseSets = [];
    for (let i = 0; i < exercise.sets; i++) {
      this.activeExerciseSets.push({
        weight: lastExerciseSets ? lastExerciseSets[i]?.weight : (exercise.targetWeight || 0),
        reps: lastExerciseSets ? lastExerciseSets[i]?.reps : (exercise.reps || 0),
        completed: false
      });
    }

    // Initialize rest timer suggestion
    this.initialRestTime = exercise.suggestedRestTime || 60;
    this.restTime = this.initialRestTime;
  }

  toggleSetCompletion(setIndex: number) {
    const set = this.activeExerciseSets[setIndex];
    set.completed = !set.completed;
    
    if (set.completed) {
      // Start rest timer if not last set
      if (setIndex < this.activeExerciseSets.length - 1) {
         this.startRestTimer();
      }
    }
  }

  startRestTimer() {
    this.isResting = true;
    this.restTime = this.initialRestTime;
    
    if (this.timerInterval) clearInterval(this.timerInterval);
    
    this.timerInterval = setInterval(() => {
      this.restTime--;
      this.cdr.detectChanges(); // Force change detection
      if (this.restTime <= 0) {
        this.stopRestTimer();
      }
    }, 1000);
  }

  stopRestTimer() {
    this.isResting = false;
    clearInterval(this.timerInterval);
    this.restTime = this.initialRestTime;
  }

  addRestTime() {
    this.restTime += 10;
  }
  
  skipRest() {
      this.stopRestTimer();
  }

  prevExercise() {
    if (this.currentExerciseIndex > 0) {
      this.saveCurrentExerciseData();
      this.initializeExercise(this.currentExerciseIndex - 1);
    }
  }

  nextExercise() {
    if (!this.routine) return;
    this.saveCurrentExerciseData();
    
    if (this.currentExerciseIndex < this.routine.exercises.length - 1) {
      this.initializeExercise(this.currentExerciseIndex + 1);
    } else {
      this.finishWorkout();
    }
  }

  saveCurrentExerciseData() {
    if (!this.routine || !this.workoutLog) return;
    const exerciseName = this.routine.exercises[this.currentExerciseIndex].name;
    this.workoutLog.exercises[exerciseName] = [...this.activeExerciseSets];
  }

  finishWorkout() {
    if (this.workoutLog) {
       this.saveCurrentExerciseData(); // Save last exercise
       this.gymService.saveWorkoutLog(this.workoutLog);
    }
    this.router.navigate(['/']);
  }
}
