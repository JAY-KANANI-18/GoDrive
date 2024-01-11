import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { ROUTES } from "../sidebar/sidebar.component";

import { Router } from "@angular/router";
import { PostsService } from "src/app/services/login.service";
import { SocketService } from "src/app/services/soketio.service";
import { ChatService } from "src/app/services/chat.service";

@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.scss"],
})
export class ChatComponent  {
  @ViewChild('messageHistory') messageHistory!: ElementRef;

  chatToggle:any = false
  messages: string[] = [];
  user:any



  constructor(

    private socketService:SocketService,
    private loginService:PostsService,
    private chatService:ChatService,


  ) {
  }

  //{{ currentTime | date:'h:mm a' }}
  ngOnInit(): void {
    this.user =  localStorage.getItem('UserObj')
    this.user = JSON.parse(this.user)

    console.log(this.user);



    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    this.socketService.msg_on().subscribe({
      next:(msg:any)=>{
        console.log(msg,"msg");
        console.log(this.chatService.chatObj);
        this.chatService.chatObj.push(msg);
        console.log(this.chatService.chatObj);
        console.log(this.messages.length)
        this.scrollMessageHistoryToBottom();


      }
    })
  }

  openChat(){
    this.chatToggle = !this.chatToggle
    console.log('click');
  }

  sendMessage() {
    const inputElement: HTMLInputElement | null = document.querySelector('#message');
    if (inputElement) {
      const messageText = inputElement.value.trim();
      if (messageText && this.loginService.userData) {
        this.socketService.msg_emit({msg:messageText , id:this.loginService.userData , time:new Date(),name:this.user.name})
        inputElement.value = '';


      }
    }
  }


  private scrollMessageHistoryToBottom() {
    setTimeout(() => {
      const messageHistoryDiv: HTMLDivElement = this.messageHistory.nativeElement;
      messageHistoryDiv.scrollTop = messageHistoryDiv.scrollHeight;
    }, 0);
  }

}
