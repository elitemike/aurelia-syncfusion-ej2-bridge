import { ChatUIModel, MessageModel, UserModel } from '@syncfusion/ej2/interactive-chat';

export class ChatUIDemo {
  private chatUIModel: ChatUIModel = null;

  attached() {
    let currentUserModel: UserModel = {
      id: "user1",
      user: "Albert"
    };

    let michaleUserModel: UserModel = {
      id: "user2",
      user: "Michale Suyama"
    };

    let chatMessages: MessageModel[] = [
      {
        author: currentUserModel,
        text: "Hi Michale, are we on track for the deadline?"
      },
      {
        author: michaleUserModel,
        text: "Yes, the design phase is complete."
      },
      {
        author: currentUserModel,
        text: "I’ll review it and send feedback by today."
      }
    ];

    this.chatUIModel = {
      messages: chatMessages,
      user: currentUserModel,
      showFooter: false,
      messageToolbarSettings: {
        items: []
      }
    }
  }


}
