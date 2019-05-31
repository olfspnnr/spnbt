import * as React from "react";

export interface HomeProps {}

export interface HomeState {}

export class Home extends React.Component<HomeProps, HomeState> {
  constructor(props: HomeProps) {
    super(props);
    this.state = {};
  }
  render() {
    return <div>Home</div>;
  }
}
