import React from "react";
import "./output.css";

export interface AppProps {}

export interface AppState {
  isLoading: boolean;
  loadingMessage: string;
  num: number;
}

export class App extends React.Component<AppProps, AppState> {
  initialLoadingMessage: string;
  constructor(props: AppProps) {
    super(props);
    this.initialLoadingMessage = "Loading";
    this.state = {
      isLoading: true,
      loadingMessage: this.initialLoadingMessage,
      num: this.initialLoadingMessage.length
    };
  }

  componentDidMount() {
    let interval = setInterval(() => {
      console.log("test");

      this.setState({
        loadingMessage: "Loading".padEnd(this.state.num, "."),
        num:
          this.state.num === this.initialLoadingMessage.length + 3
            ? this.initialLoadingMessage.length
            : this.state.num + 1
      });
    }, 450);
    this.setState(
      {
        isLoading: false
      },
      () => {
        clearInterval(interval);
      }
    );
  }

  render() {
    return (
      <div className="flex flex-1 flex-col w-full h-full">
        {this.state.isLoading ? (
          <div className="flex w-full h-full justify-center items-center bg-blue-100 text-3xl">
            {this.state.loadingMessage}
          </div>
        ) : (
          <div>Test</div>
        )}
      </div>
    );
  }
}

export default App;
