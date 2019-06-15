import * as React from "react";

export interface ChatProps {}

export interface ChatState {}

export class Chat extends React.Component<ChatProps, ChatState> {
  constructor(props: ChatProps) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const ws = new WebSocket("ws://127.0.0.1:8080");
    ws.addEventListener("open", ev => {
      ws.send("Test");
    });
    ws.addEventListener("message", ev => {
      console.log(ev.data);
    });
  }

  render() {
    return <div>Chat</div>;
  }
}
