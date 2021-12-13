import { ChangeDetectorRef, Component, OnDestroy, OnInit, Output } from '@angular/core';
import { NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { NzContextMenuService, NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown';
import { WebSocketService } from '../services/web-socket.service';
import { AuthService } from '../services/auth.service';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AgentMessagesService } from '../services/agent-messages.service';
import { Department, RecipientMessage } from '../interface/interface';

export interface Clients {
  id: string;
  name: string;
  email: string;
  dept: string;
  pid: string;
  date: Date;
  agentName: string;
  isAgentAssigned: boolean;
}
@Component({
  selector: 'app-agent-dashboard',
  templateUrl: './agent-dashboard.component.html',
  styleUrls: ['./agent-dashboard.component.scss']
})
export class AgentDashboardComponent implements OnInit, OnDestroy {
  private _subscription$: Subject<void>;
  tabs: { name: string, id: string }[] = [];
  nodes: NzTreeNodeOptions[] = [];
  departments:Department[]=[];
  selectedDepartment:string='';
  selectedAgent: any;
  selectedVisitor: any;
  index = 0;
  inputValueTab?: string = "Hello there";
  chatMessage = "";
  listOfData: Clients[] = [];
  hidden: boolean = true;
  currentAgent: any = '';
  requestQueue: any[] = [];
  chatData: any[] = [];
  names: any = [];
  tempAgents: any = [];
  globalAgents: any = [];
  defaultMessageData: any[] = [];
  initRecipientMessages: RecipientMessage[] = [];
  isVisible = false;
  isDeptVisible = false;
  typingTimer:any;

  // Dropdown menu on right click........
  contextMenu($event: any, menu: NzDropdownMenuComponent, department_id: any): void {
    this.nzContextMenuService.create($event, menu);
    this.selectedDepartment = department_id;
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
    let calls = [];
    calls.push(this.authService.getDepartments());
    calls.push(this.authService.getAgents());
    calls.push(this.authService.getRecipientMessages(this.currentAgent.email));
    forkJoin([...calls]).subscribe(resp => {
      const departmentResp = resp[0];
      const agentResp = resp[1];
      const recipientResp = resp[2];

      if (departmentResp.success && agentResp.success) {
        this.globalAgents = agentResp.agents;
        this.departments = departmentResp.departments;
        this.initRecipientMessages = recipientResp.messages;
        console.log(this.initRecipientMessages);

        this.setNodes(this.departments, this.globalAgents);
      }
      // Selected agent
      this.selectedAgent = agentResp.agents.find((agent: any) => agent.email === this.currentAgent.email);
      console.log('agent comp', this.selectedAgent);

      // connect auth
      let jsonData: any = [];
      this.websocket.connect(this.selectedAgent)
        .pipe(takeUntil(this._subscription$))
        .subscribe(connectionData => {
          console.log('connection data:', connectionData);
          switch (connectionData.type) {
            case 'ReloadAgents': {
              this.reloadAgents();
              break;
            }
            case 'ClientConnect': {
              let clients = connectionData.clients;
              console.log(clients);
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

  reloadAgents(){
    this.authService.getOnlineAgents().subscribe(res => {
      this.tempAgents = res.agents;
      this.setNodes(this.departments,this.globalAgents);
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

  private setNodes(departments:Department[], agents: any) {
    let treeList: any = [];
    departments.forEach((department, index)=> {
        treeList.push({
        title: department.name,
        key: department.sno,
        expanded: true,
        icon: 'team',
        children: this.getDepartmentAgents(department.sno, agents)
      });
    })
    const dig = (path = '0', level = 3) => {
      return treeList;
    };
    this.nodes = dig();
  }

  getDepartmentAgents(sno:any, agents: any){
    agents = agents.filter((item: any)=> item.department_id == sno);
    this.names = [];
    agents.forEach((element: any, index: any) => {
      this.names.push({ title: element.name, key: index, icon: 'user', isLeaf: true })
    });
    return this.names;
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
    if(!message) return;

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

  newTab(id: string, name: string, email:string, accept: any, acceptEvent: any): void {
    acceptEvent.target.innerHTML = 'Assigned';
    accept.disabled = true;
    this.authService.assignClient(this.selectedAgent.email, id).subscribe(res => {
      if (res.success) {
        if (this.tabs.filter(e => e.id === id).length == 0) {
          this.tabs.push({ name: name, id: id });
          this.getClientMessages(email, id);
          console.log("chat data: ",this.chatData);

          this.index = this.tabs.length - 1;
        }
      }
      else {
        this.hidden = false
        setTimeout(() => {
          this.hidden = true;
        }, 5000);
      }
    })
  }

  getClientMessages(clientEmail:string, clientId:string){
    this.initRecipientMessages.filter(recipient=>recipient.from == clientEmail || recipient.to == clientEmail)
    .forEach((recipient:RecipientMessage)=>{
      if(recipient.from == clientEmail){
        this.chatData.push({
          message: recipient.message_body,
          time: recipient.create_date,
          user_type: 'client',
          id: clientId
        })
      }else{
        this.chatData.push({
          message: recipient.message_body,
          time: recipient.create_date,
          user_type: 'agent',
          id: clientId
        })
      }
    })

  }

  getAssignedAgent(agentName: string) {
    if (!agentName) return 'Not Yet Assigned';
    else if (agentName === this.currentAgent.username) return `Assigned to you`;
    else return `Assigned to ${agentName}`;
  }

  getClientDepartment(clientDept:String){
    return this.departments.find(dept=>dept.sno == clientDept)?.name;
  }

  onAgentTyping(clientId:any):void{
    this.websocket.send({ clientId: clientId, isAgentTyping: true });
  }

  typingTimerCheck(){
    this.typingTimer = setTimeout(() => {

    }, 10000);
  }

  clearTimer(){

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

  showDeptModal(): void {
    this.isDeptVisible = true;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }

  handleDeptCancel(): void {
    this.isDeptVisible = false;
  }

  DeptSubmit(department:string): void {
    if(!department) return;
    this.authService.addDepartments(department)
    .subscribe(res=>{
      if(res.success){
        this.isDeptVisible = false;
        this.departments.push(res.department);
        this.reloadAgents();
      }
    })
  }

  toggleAgentModal(agent:boolean){
    this.isVisible = false;
    this.globalAgents.push(agent);
    this.reloadAgents();
  }

  ngOnDestroy() {
    this._subscription$.next();
    this._subscription$.complete();
    this.websocket.closeConnection();
  }

}
