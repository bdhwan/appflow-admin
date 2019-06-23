import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'new-app', loadChildren: './pages/new-app/new-app.module#NewAppPageModule' },
  { path: 'new-app/:apps_idx', loadChildren: './pages/new-app/new-app.module#NewAppPageModule' },
  { path: 'app-list', loadChildren: './pages/app-list/app-list.module#AppListPageModule' },
  { path: 'build-list', loadChildren: './pages/build-list/build-list.module#BuildListPageModule' },
  { path: 'main', loadChildren: './pages/main/main.module#MainPageModule' },
  { path: 'main/:apps_idx', loadChildren: './pages/main/main.module#MainPageModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
