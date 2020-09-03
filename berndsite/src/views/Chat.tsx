import * as React from "react";
import { fchmod } from "fs";

export interface ChatProps {}

export interface ChatState {
  clicks: number;
  message: string | null;
  websocket: WebSocket | null;
}

export class Chat extends React.Component<ChatProps, ChatState> {
  constructor(props: ChatProps) {
    super(props);
    this.state = {
      clicks: 660,
      message: null,
      websocket: null,
    };
  }

  componentDidMount() {
    const ws = new WebSocket(`ws://${window.location.hostname}:8080`);
    ws.addEventListener("open", (ev) => {
      console.log("test");
      this.setState((cs) => ({ ...cs, websocket: ws }));
    });
    ws.addEventListener("message", (ev) => {
      console.log(ev.data);
    });
  }

  handleOnClick = () => {
    this.setState((cs) => {
      const newValue = cs.clicks + 1;
      return {
        clicks: newValue === 666 ? 667 : newValue,
      };
    });
  };

  handleMessageSend = () => {
    if (this.state.websocket)
      this.setState((cs) => {
        if (cs.websocket) {
          const message = JSON.stringify({ type: "sendMessage", payLoad: cs.message + "" });
          console.log(message);
          cs.websocket.send(message);
        }
        return { ...cs, message: null };
      });
  };

  handleMessage = (ev: React.ChangeEvent<HTMLInputElement>) => {
    if (ev && ev.target) {
      const val = ev.target.value;
      this.setState({ message: val });
    }
  };

  render() {
    return (
      <div className={"flex flex-col w-full h-full justify-center items-center"}>
        <span>Chat</span>
        <span
          className="cursor-pointer text-5xl text-gray-700 select-none"
          onClick={() => this.handleOnClick()}
        >
          {this.state.clicks}
        </span>
        <input type="text" value={this.state.message || ""} onChange={this.handleMessage} />
        <button onClick={this.handleMessageSend}>send</button>
      </div>
    );
  }
}
