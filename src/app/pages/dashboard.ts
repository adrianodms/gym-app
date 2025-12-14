import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { GymService } from '../services/gym.service';
import { Routine } from '../models/gym.model';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  private readonly gymService = inject(GymService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  // Directly expose the signal from the service
  readonly routines = this.gymService.routines;

  createRoutine() {
    this.router.navigate(['/editor/new']);
  }

  editRoutine(id: string, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.router.navigate(['/editor', id]);
  }

  deleteRoutine(id: string, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    console.log('Delete routine called for ID:', id);
    
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Excluir Treino',
        message: 'Tem certeza que deseja excluir este treino?',
        confirmText: 'Excluir',
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        console.log('User confirmed deletion');
        this.gymService.deleteRoutine(id);
      }
    });
  }

  startWorkout(id: string) {
    this.router.navigate(['/workout', id]);
  }
}
