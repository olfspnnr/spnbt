import * as React from "react";

export interface ChatProps {}

export interface ChatState {}

export class Chat extends React.Component<ChatProps, ChatState> {
  constructor(props: ChatProps) {
    super(props);
    this.state = {};
  }
  render() {
    return <div>Chat</div>;
  }
}
