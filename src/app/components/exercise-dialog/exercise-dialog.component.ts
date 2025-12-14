import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
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
  styleUrl: './exercise-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExerciseDialogComponent {
  readonly dialogRef = inject(MatDialogRef<ExerciseDialogComponent>);
  readonly data = inject<ExerciseDialogData>(MAT_DIALOG_DATA);

  // Initialize state from injected data
  readonly exercise: Exercise = this.data.exercise 
      ? { ...this.data.exercise }
      : { name: '', sets: 3, reps: 10, suggestedRestTime: 60 };

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.exercise.name) {
      this.dialogRef.close(this.exercise);
    }
  }
}
