import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard';
import { RoutineEditorComponent } from './pages/routine-editor';
import { WorkoutRunnerComponent } from './pages/workout-runner';

export const routes: Routes = [
    { path: '', component: DashboardComponent },
    { path: 'editor/:id', component: RoutineEditorComponent },
    { path: 'workout/:id', component: WorkoutRunnerComponent },
    { path: '**', redirectTo: '' }
];
