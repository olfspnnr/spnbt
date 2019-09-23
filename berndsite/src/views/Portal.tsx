import * as React from "react";
import { RouteComponentProps, Switch, Route } from "react-router";
import { AppNavBar, AppNavBarLink } from "./components/AppNavBar";
import { Home } from "./Home";
import { AppColors } from "../models/AppColors";
import { Chat } from "./Chat";
import { Table } from "./Table";

export interface PortalProps {
  RouteProps: RouteComponentProps;
}

export interface PortalState {
  colors: AppColors;
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
      }
    };
  }

  componentDidMount() {
    this.setState({});
  }

  render() {
    return (
      <div className={`flex flex-col flex-1 w-full h-full`}>
        <AppNavBar title={"Bernds Page"} key={"AppNavBar"} colors={this.state.colors}>
          <AppNavBarLink exact colors={this.state.colors} to="/">
            Home
          </AppNavBarLink>
          <AppNavBarLink colors={this.state.colors} to="/Chat/">
            Chat
          </AppNavBarLink>
          <AppNavBarLink colors={this.state.colors} to="/Table/">
            Table
          </AppNavBarLink>
        </AppNavBar>
        <div className={`flex flex-1 w-full h-full justify-center items-center bg-gray-100`}>
          <div
            className="flex justify-center items-center w-full h-full container"
            // style={{ maxWidth: this.state.maxWidth }}
          >
            <Switch location={this.props.RouteProps.location}>
              <Route exact path="/" render={props => <Home {...this.state} />} />
              <Route path="/Chat/" render={props => <Chat {...this.state} />} />
              <Route
                path="/Table/"
                render={props => (
                  <div className="flex flex-1 justify-center items-center w-full h-full">
                    <Table {...this.state} />
                  </div>
                )}
              />
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}
