import { ButtonHTMLAttributes, FC } from "react";
import { SpaceProps } from "styled-system";
import { colorOptions } from "../../interfaces";
import StyledIcon from "./styles";

export interface IconProps {
  defaultPath?: boolean;
  size?: string;
  children: string;
  transform?: string;
  color?: colorOptions;
  variant?: "small" | "medium" | "large";
  defaultcolor?: "currentColor" | "auto";
}

type ComponentProps = IconProps & SpaceProps & ButtonHTMLAttributes<IconProps>;

const Icon: FC<ComponentProps> = ({ children, defaultPath=true, ...props }) => {
  const src = defaultPath 
    ? `/assets/images/icons/${children}.svg`
    : `/assets/images/${children}`;
   
  return (

    <StyledIcon
      src={src}
      fallback={() => <span>{children?.trim()}</span>}
      {...props}
    />
  );
};

Icon.defaultProps = { variant: "medium", defaultcolor: "currentColor" };

export default Icon;
