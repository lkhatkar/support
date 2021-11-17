import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { NzContextMenuService, NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown';
import { WebSocketService } from '../services/web-socket.service';
import { AuthService } from '../services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AgentMessagesService } from '../services/agent-messages.service';

export interface Clients {
  id: string;
  name: string;
  email: string;
  dept: string;
  pid: string;
  date: Date;
  agentName: string;
  isAgentAssigned: boolean
}
@Component({
  selector: 'app-agent-dashboard',
  templateUrl: './agent-dashboard.component.html',
  styleUrls: ['./agent-dashboard.component.scss']
})
export class AgentDashboardComponent implements OnInit, OnDestroy {
  nodes: NzTreeNodeOptions[] = [];
  selectedAgent: any;
  selectedVisitor: any;
  index = 0;
  tabs: { name: string, id: string }[] = [
    {
      name: 'rishabh',
      id: '1'
    },
    {
      name: 'naman',
      id: '2'
    },
  ];
  inputValueTab?: string = "Hello there";
  chatMessage = "";
  listOfData: Clients[] = [];
  hidden: boolean = true;
  currentAgent: any = '';
  requestQueue: any[] = [];
  private _subscription$: Subject<void>;
  chatData: any[] = [];
  names: any = [];
  tempAgents: any = [];
  globalAgents: any = [];
  defaultMessageData: any[] = [];
  isVisible = false;
  // Dropdown right click
  contextMenu($event: any, menu: NzDropdownMenuComponent, nodes: any): void {
    // console.log($event);
    // let agentName = $event.explicitOriginalTarget.nodeValue;
    // // console.log(this.selectedAgent);
    // if(agentName === 'Agents') {
    this.nzContextMenuService.create($event, menu);
    // }
    // console.log($event.explicitOriginalTarget.nodeValue);
    // console.log(nodes[0].children[0].title);
  }

  closeMenu(): void {
    this.nzContextMenuService.close();
  }
  constructor(
    private nzContextMenuService: NzContextMenuService,
    private websocket: WebSocketService,
    private authService: AuthService,
    private messageService: AgentMessagesService,
    private changeDetector: ChangeDetectorRef) {
    this._subscription$ = new Subject();
  }

  ngOnInit(): void {
    this.currentAgent = this.authService.getCurrentAgent()
    this.getInitMessages(this.currentAgent.username);
    this.names = []
    // Get Agents
    this.authService.getAgents().subscribe(resp => {
      if (resp.success) {
        this.globalAgents = resp.agents;
        this.setNodes(resp.agents);
      }
      // Selected agent
      this.selectedAgent = resp.agents.find((agent: any) => agent.email === this.currentAgent.email);
      console.log('agent comp', this.selectedAgent);

      // connect auth
      let jsonData: any = [];
      this.websocket.connect(this.selectedAgent)
        .pipe(takeUntil(this._subscription$))
        .subscribe(connectionData => {
          console.log('connection data:', connectionData);
          switch (connectionData.type) {
            case 'ReloadAgents': {
              this.authService.getOnlineAgents().subscribe(res => {
                this.tempAgents = res.agents;
                this.setNodes(this.globalAgents);
              });
              break;
            }
            case 'ClientConnect': {
              let clients = connectionData.clients;
              if (clients.length > 0) {
                // this.requestQueueHandler(data);
                let index = jsonData.findIndex((client: any) => client.id === clients[0].id);
                if (index === -1) {
                  clients.forEach((client: any) => {
                    jsonData.push(client)
                  });
                } else {
                  jsonData.splice(index, 1, clients[0]);
                }
                this.listOfData = [...jsonData];
              }
              break;
            }
            case 'ClientMessage': {
              let data = connectionData;
              if (data.message && typeof (data.message) === 'string') {
                let index = this.chatData.findIndex(chat => (chat.user_type === 'clientTyping' && chat.id == data.id));
                if (index != -1) {
                  this.chatData.splice(index, 1);
                  this.chatData = [...this.chatData];
                }
                this.chatData.push({
                  message: data.message,
                  time: new Date().getTime(),
                  user_type: 'client',
                  id: data.id
                });
              }
              break;
            }
            case 'ClientTyping': {
              let data = connectionData;
              let index = this.chatData.findIndex(chat => (chat.user_type === 'clientTyping' && chat.id == data.id));
              console.log('index:', index);
              if (index != -1) {
                this.chatData.splice(index, 1);
                this.chatData = [...this.chatData];
              }
              this.chatData.push({
                user_type: 'clientTyping',
                id: data.id
              });
              break;
            }
            case 'ClientDisconnect': {

              break;
            }
            default:
              break;
          }
        });
    });
  }

  deleteTypingMessage() {

  }

  // For table
  // ngAfterContentChecked() : void {
  //   this.changeDetector.detectChanges();
  // }
  closeTab({ index }: { index: number }): void {
    this.tabs.splice(index, 1);
  }

  requestInfo: any = [];
  private requestQueueHandler(requestData: Clients[]) {
    // console.log(requestData);
    let index = this.requestInfo.findIndex((client: any) => client.name === requestData[0].name);
    if (index === -1) {
      requestData.forEach(client => {
        let timerTick = 0;
        this.requestInfo.push({
          name: client.name,
          dept: client.dept,
          duration: client.date
        })
      })
    } else {
      let newObj = this.requestInfo[index];
      newObj.duration = new Date().valueOf() - newObj.duration.valueOf();
      console.log(newObj.duration)
      this.requestInfo.splice(index, 1, newObj);
    }
    this.requestQueue = [...this.requestInfo];
  }

  private setNodes(agents: any) {
    this.names = [];
    this.getOrganizedAgents(agents).forEach((element: any, index: any) => {
      this.names.push({ title: element.name, key: index, icon: 'user', isLeaf: true })
    });
    const dig = (path = '0', level = 3) => {
      const list = [
        {
          title: 'Agents',
          key: '100',
          expanded: true,
          icon: 'team',
          children: this.names
        }

      ];

      return list;
    };
    this.nodes = dig();
  }

  check(title: any) {
    let bool = false;
    this.tempAgents.forEach((element: any) => {
      if (!bool && element.name == title) {
        bool = true;
      }
    });
    return bool;
  }

  getInitMessages(agentName: string) {
    this.messageService.getMessages(agentName)
      .subscribe(resp => {
        if (resp.success) {
          this.defaultMessageData = resp.agentMessages;
        }
      })
  }

  addInitMessage(message: any) {
    this.messageService.addMessage({ name: this.currentAgent.username, message: message.value })
      .subscribe(resp => {
        if (resp.success) {
          this.defaultMessageData.push(resp.messages);
          message.value = '';
        } else {
          console.log(resp.message);
        }
      })
  }

  deleteInitMessage(id: any) {
    this.messageService.deleteMessage(id)
      .subscribe(resp => {
        if (resp.success) {
          let index = this.defaultMessageData.findIndex(mes => mes.sno === id);
          this.defaultMessageData.splice(index, 1);
          this.defaultMessageData = [...this.defaultMessageData];
          this.chatMessage = '';
        }
      })
  }

  newTab(id: string, name: string, accept: any, acceptEvent: any): void {
    acceptEvent.target.innerHTML = 'Assigned';
    accept.disabled = true;

    this.authService.assignClient(this.selectedAgent.email, id).subscribe(res => {
      if (res.success) {
        if (this.tabs.filter(e => e.id === id).length == 0) {
          this.tabs.push({ name: name, id: id });
          // this.defaultMessageData.push(`Hello ${name}, how may I assist you ?`);
          // this.defaultMessageData.reverse();
          this.index = this.tabs.length - 1;
          console.log(res);
        }
      }
      else {
        console.log(res);
        this.hidden = false
        setTimeout(() => {
          this.hidden = true;
        }, 5000);
      }

    })
  }

  getAssignedAgent(agentName: string) {
    if (!agentName) return 'Not Yet Assigned';
    else if (agentName === this.currentAgent.username) return `Assigned to you`;
    else return `Assigned to ${agentName}`;
  }

  onChatSend(id: string): void {
    this.websocket.send({ clientId: id, message: this.chatMessage });

    this.chatData.push({
      message: this.chatMessage,
      time: new Date().getTime(),
      user_type: 'agent',
      id: id
    });

    this.chatMessage = '';
    console.log('Chat send clicked');
  }

  private addMessage(message: string, userType: string) {

  }

  private getOrganizedAgents(agents: any) {
    let agentIndex = agents.findIndex((agent: any) => agent.email === this.currentAgent.email);
    [agents[0], agents[agentIndex]] = [agents[agentIndex], agents[0]];
    return agents;
  }

  onLogout() {
    this.authService.agentLogout();
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }

  ngOnDestroy() {
    this._subscription$.next();
    this._subscription$.complete();
    this.websocket.closeConnection();
  }

}
