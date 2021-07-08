import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { NzContextMenuService, NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown';
import { WebSocketService } from '../services/web-socket.service';
import { AuthService } from '../services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { interval } from 'rxjs';

export interface Clients {
  id: string;
  name: string;
  email: string;
  dept: string;
  pid: string;
  agentName:string;
  isAgentAssigned:boolean
}
@Component({
  selector: 'app-agent-dashboard',
  templateUrl: './agent-dashboard.component.html',
  styleUrls: ['./agent-dashboard.component.scss']
})
export class AgentDashboardComponent implements OnInit, OnDestroy {
  nodes: NzTreeNodeOptions[] = [];
  selectedAgent: any ;
  selectedVisitor: any;
  index = 0;
  tabs : {name: string, id: string}[] = [];
  inputValueTab?: string ="Hello there";
  chatMessage = "";
  listOfData: Clients[] = [];
  hidden:boolean = true;
  currentAgent:any = '';
  private _subscription$: Subject<void>;
  chatData:any[] = [
  //   {
  //     message:'there is a issue',
  //     time:new Date().getTime(),
  //     user_type:'client'
  //   },
  //   {
  //     message:'hey agent here',
  //     time:new Date().getTime(),
  //     user_type:'agent'
  //   },
  //   {
  //     message:'How may i help you',
  //     time:new Date().getTime(),
  //     user_type:'agent'
  //   },
  //   {
  //     message:'fix the issue',
  //     time:new Date().getTime(),
  //     user_type:'client'
  //   },
  ];
  defaultMessageData:any[]=[
    'Hello, how may I assist you',
    'Okay',
    'Sorry, for the inconvinience cause',
    'Please tell your issue',
  ];
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
    private websocket:WebSocketService,
    private authService: AuthService,
    private changeDetector: ChangeDetectorRef) {
      this._subscription$ = new Subject();
  }

  ngOnInit(): void {
    this.currentAgent = this.authService.getCurrentAgent()

    // this.authService.getToken().subscribe(res=> {
      let names:any = []
      // if(res.success) {
        // sessionStorage.setItem('token', res.access_token);
        // Get Agents
        this.authService.getAgents().subscribe(resp=> {
          if(resp.success) {
            let agents = this.getAgents(resp.agents);
            agents.forEach((element:any, index:any) => {
              names.push({ title: element.name, key: index, icon: 'user', isLeaf: true })
            });
            const dig = (path = '0', level = 3) => {
              const list = [
                {
                  title: 'Agents',
                  key: '100',
                  expanded: true,
                  icon: 'team',
                  children: names
                }

              ];

              return list;
            };
            this.nodes = dig();
            console.log(this.nodes);
          }
          // Selected agent
          this.selectedAgent = resp.agents.find((agent:any)=>agent.email === this.currentAgent.email);
          // this.selectedAgent = resp.agents[0];

          //Client list
          // interval(6000).subscribe(() => {
            // this.authService.getClients().subscribe((response:any)=> {
            //   if(response.success) {
            //     console.log(response);

            //     if(response.clients.length > 0) {
            //       // this.selectedVisitor = response?.clients[0];
            //       // console.log(this.selectedVisitor);
            //       let jsonData:any = [];
            //       response.clients.forEach((element:any) => {
            //         jsonData.push(element)
            //       });
            //       this.listOfData = jsonData;
            //     }

                // connect auth
                let jsonData:any = [];
                this.websocket.connect(this.selectedAgent)
                .pipe(takeUntil(this._subscription$))
                .subscribe(data=> {
                  if(data.length > 0){
                    let index = jsonData.findIndex((agent:any)=>agent.id === data[0].id);
                    if(index === -1){
                      data.forEach((element:any) => {
                        jsonData.push(element)
                      });
                    }else{
                      jsonData.splice(index,1,data[0]);
                    }
                    this.listOfData = [...jsonData];
                  }
                  console.log('data',data);

                  if(data.message && typeof(data.message)==='string') {
                      this.chatData.push({
                        message:data.message,
                        time:new Date().getTime(),
                        user_type:'client',
                        id: data.id
                      });
                  }
                  // console.log(data);
                });
            //   }
            // });
          // });

        });
    //   }

    // })

  }
  // For table
  // ngAfterContentChecked() : void {
  //   this.changeDetector.detectChanges();
  // }
  closeTab({ index }: { index: number }): void {
    this.tabs.splice(index, 1);
    // this.websocket.closeConnection();
  }

  newTab(id: string, name: string, accept:any, acceptEvent:any): void {
    acceptEvent.target.innerHTML = 'Assigned';
    accept.disabled = true;

    this.authService.assignClient(this.selectedAgent.email, id).subscribe(res=> {
      if(res.success) {
        if(this.tabs.filter(e => e.id === id).length == 0) {
          this.tabs.push({name: name, id: id});
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

  getAssignedAgent(agentName:string){
    if(!agentName) return 'Not Yet Assigned';
    else if(agentName === this.currentAgent.username) return `Assigned to you`;
    else return `Assigned to ${agentName}`;
  }

  onChatSend(id: string): void {
    this.websocket.send({clientId: id, message: this.chatMessage});

    this.chatData.push({
      message:this.chatMessage,
      time:new Date().getTime(),
      user_type:'agent',
      id: id
    });

    this.chatMessage = '';
    console.log('Chat send clicked');
  }

  private addMessage(message:string,userType:string){

  }

  private getAgents(agents:any){
      let agentIndex = agents.findIndex((agent:any) => agent.email === this.currentAgent.email);
      [ agents[0], agents[agentIndex] ] = [ agents[agentIndex], agents[0] ];
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
