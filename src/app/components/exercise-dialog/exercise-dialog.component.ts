import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Exercise } from '../../models/gym.model';

export interface ExerciseDialogData {
  title: string;
  exercise?: Exercise;
}

@Component({
  selector: 'app-exercise-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './exercise-dialog.component.html',
  styleUrl: './exercise-dialog.component.scss'
})
export class ExerciseDialogComponent {
  exercise: Exercise;

  constructor(
    public dialogRef: MatDialogRef<ExerciseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ExerciseDialogData
  ) {
    this.exercise = data.exercise 
      ? { ...data.exercise }
      : { name: '', sets: 3, reps: 10, suggestedRestTime: 60 };
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.exercise.name) {
      this.dialogRef.close(this.exercise);
    }
  }
}
