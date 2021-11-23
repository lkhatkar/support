import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgentDashboardComponent } from './agent-dashboard/agent-dashboard.component';
import { AgentLoginComponent } from './agent-dashboard/agent-login/agent-login.component';
import { AgentGuard } from './guards/agent.guard';
import { ConfigGuard } from './guards/config.guard';
import { InitializeGuard } from './guards/initialize.guard';
import { InitializeComponent } from './initialize/initialize.component';
import { SupportChatAdminComponent } from './support-chat-admin/support-chat-admin.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/agent' },
  { path: 'init', component:InitializeComponent, canActivate:[ConfigGuard]},
  { path: 'agent-login', component: AgentLoginComponent, canActivate:[InitializeGuard]},
  { path: 'agent', component: AgentDashboardComponent, canActivate:[AgentGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
