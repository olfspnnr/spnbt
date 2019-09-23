import * as React from "react";
import { NavLink } from "react-router-dom";
import { GeneralComponent } from "../../models/GeneralComponent";
import { AppColors } from "../../models/AppColors";

export const AppNavBar: React.FC<{
  colors: AppColors;
  title: string;
}> = props => {
  return (
    <div
      className={`flex flex-grow-0 w-full h-10 px-2 justify-center items-center bg-${props.colors.primary}-500 shadow z-10`}
    >
      <div className="flex justify-center items-center h-full w-full container">
        <div
          className={`flex flex-1 h-full w-full items-center items-center justify-center text-${props.colors.textOnColor} font-light text-md bg-${props.colors.primary}-900`}
        >
          {props.title}
        </div>
        <div className="w-4 h-full" />
        <div
          className={`flex flex-1 h-full w-full items-center content-start`}
          style={{
            flex: 8
          }}
        >
          {props.children}
        </div>
      </div>
    </div>
  );
};

interface AppNavBarLinkProps extends GeneralComponent {
  to: string;
  colors: AppColors;
  exact?: boolean;
}

export const AppNavBarLink: React.FC<AppNavBarLinkProps> = props => {
  const transitionStyle: React.CSSProperties = { transition: "all 200ms" };
  return (
    <div
      className={`flex h-full justify-center items-center text-${props.colors.primary}-300 ${props.className}`}
      style={transitionStyle}
    >
      <NavLink
        exact={props.exact !== undefined ? props.exact : false}
        activeClassName={`bg-${props.colors.primary}-700 text-${props.colors.textOnColor}`}
        className={`flex justify-center items-center h-full w-full text-sm hover:text-${props.colors.textOnColor} px-6 hover:underline`}
        style={{ ...transitionStyle, ...props.style }}
        to={props.to}
      >
        {props.children}
      </NavLink>
    </div>
  );
};
