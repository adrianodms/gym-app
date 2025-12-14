import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { GymService } from '../services/gym.service';
import { Exercise, Routine } from '../models/gym.model';
import { v4 as uuidv4 } from 'uuid';
import { ExerciseDialogComponent } from '../components/exercise-dialog/exercise-dialog.component';

@Component({
  selector: 'app-routine-editor',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterModule, 
    MatButtonModule, 
    MatInputModule, 
    MatFormFieldModule,
    MatCardModule, 
    MatDialogModule,
    MatIconModule
  ],
  templateUrl: './routine-editor.html',
  styleUrl: './routine-editor.scss'
})
export class RoutineEditorComponent implements OnInit {
  routine: Routine = { id: '', name: '', exercises: [] };
  isNew = true;

  constructor(
    private gymService: GymService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      const existing = this.gymService.getRoutine(id);
      if (existing) {
        this.routine = JSON.parse(JSON.stringify(existing)); // Deep copy
        this.isNew = false;
      }
    } else {
      this.routine.id = uuidv4();
    }
  }

  saveRoutine() {
    if (!this.routine.name) return;
    this.gymService.saveRoutine(this.routine);
    this.router.navigate(['/']);
  }

  cancel() {
    this.router.navigate(['/']);
  }

  openNewExerciseDialog() {
    const dialogRef = this.dialog.open(ExerciseDialogComponent, {
      width: '500px',
      data: {
        title: 'Adicionar Exercício'
      }
    });

    dialogRef.afterClosed().subscribe((result: Exercise) => {
      if (result) {
        this.routine.exercises.push(result);
      }
    });
  }

  deleteExercise(index: number) {
    this.routine.exercises.splice(index, 1);
  }
}
