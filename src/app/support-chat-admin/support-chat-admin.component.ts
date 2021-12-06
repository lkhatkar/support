import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ClipboardModule } from '@angular/cdk/clipboard'


@Component({
  selector: 'app-support-chat-admin',
  templateUrl: './support-chat-admin.component.html',
  styleUrls: ['./support-chat-admin.component.scss']
})
export class SupportChatAdminComponent implements OnInit {
  embeddedLink: string = '';

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.embeddedLink = `<script defer src='${window.location.host}/client/wssclient.js' type='text/javascript'></script>`;
  }
  onLogout(): void {
    console.log('Inside logout');
    this.authService.agentLogout();
  }
  copyMessage(inputElement: any) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
  }


}
