import * as React from "react";
import { RouteComponentProps, Switch, Route } from "react-router";
import { AppNavBar, AppNavBarLink } from "./components/AppNavBar";
import { Home } from "./Home";
import { AppColors } from "../models/AppColors";
import { Chat } from "./Chat";

export interface PortalProps {
  RouteProps: RouteComponentProps;
}

export interface PortalState {
  colors: AppColors;
  maxWidth: string;
}

export class Portal extends React.Component<PortalProps, PortalState> {
  constructor(props: PortalProps) {
    super(props);
    this.state = {
      colors: {
        primary: "orange",
        secondary: "yellow",
        tertiary: "teal",
        textOnColor: "white",
        textDefault: "black",
        textHighlight: "purple"
      },
      maxWidth: "1400px"
    };
  }

  componentDidMount() {
    this.setState({});
  }

  render() {
    return (
      <div className={`flex flex-col flex-1 w-full h-full`}>
        <AppNavBar
          maxWidth={this.state.maxWidth}
          title={"Bernds Page"}
          key={"AppNavBar"}
          colors={this.state.colors}
        >
          <AppNavBarLink exact colors={this.state.colors} to="/">
            Home
          </AppNavBarLink>
          <AppNavBarLink colors={this.state.colors} to="/Chat/">
            Chat
          </AppNavBarLink>
        </AppNavBar>
        <div className={`flex flex-1 w-full h-full justify-center items-center bg-gray-100`}>
          <div
            className="flex justify-center items-center w-full h-full"
            style={{ maxWidth: this.state.maxWidth }}
          >
            <Switch location={this.props.RouteProps.location}>
              <Route exact path="/" render={props => <Home {...this.state} />} />
              <Route path="/Chat/" render={props => <Chat {...this.state} />} />
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}
