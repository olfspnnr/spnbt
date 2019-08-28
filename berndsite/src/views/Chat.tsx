import * as React from "react";

export interface ChatProps {}

export interface ChatState {
  clicks: number;
}

export class Chat extends React.Component<ChatProps, ChatState> {
  constructor(props: ChatProps) {
    super(props);
    this.state = {
      clicks: 660
    };
  }

  componentDidMount() {
    // const ws = new WebSocket("ws://127.0.0.1:8080");
    // ws.addEventListener("open", ev => {
    //   ws.send("Test");
    // });
    // ws.addEventListener("message", ev => {
    //   console.log(ev.data);
    // });
  }

  handleOnClick = () => {
    this.setState(cs => {
      const newValue = cs.clicks + 1;
      return {
        clicks: newValue === 666 ? 667 : newValue
      };
    });
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
      </div>
    );
  }
}
