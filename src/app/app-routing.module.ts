import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgentDashboardComponent } from './agent-dashboard/agent-dashboard.component';
import { AgentLoginComponent } from './agent-dashboard/agent-login/agent-login.component';
import { AgentGuard } from './guards/agent.guard';
import { InitializeComponent } from './initialize/initialize.component';
import { SupportChatAdminComponent } from './support-chat-admin/support-chat-admin.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/agent' },
  // { path: 'admin', component: SupportChatAdminComponent },
  { path: 'agent', component: AgentDashboardComponent, canActivate:[AgentGuard]},
  { path: 'agent-login', component: AgentLoginComponent},
  { path: 'init', component:InitializeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
