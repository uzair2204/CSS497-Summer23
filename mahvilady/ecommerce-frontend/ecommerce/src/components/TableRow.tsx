import styled from "styled-components";
import { border, BorderProps, color, ColorProps, FlexProps, FlexboxProps, LayoutProps, space, SpaceProps, TypographyProps, style } from "styled-system";
import { shadowOptions } from "interfaces";

interface TableRowProps extends SpaceProps,
  ColorProps,
  FlexProps,
  LayoutProps,
  FlexboxProps,
  BorderProps, TypographyProps {
  boxShadow?: shadowOptions;
}


const overflow = style({
  // Define the CSS property for the overflow utility
  prop: "overflow",
});
export const TableWrapperAuto = styled.table<TableRowProps>`
width: auto;
border-collapse: collapse;
`;

export const TableWrapper = styled.table<TableRowProps>`
width: 100%;
border-collapse: collapse;
`;

export const TableRows = styled.tr<TableRowProps>`
display: flex;
flex-wrap: wrap;
align-items: center;
border-radius: 10px;
box-shadow: ${({ theme, boxShadow }) => theme.shadows[boxShadow || "small"]};

& > * {
  flex: 1 1 0;
}

.pre {
  white-space: pre;
}
${space}
${color}
${border}
`;

export const TableHeaderCell = styled.th<TableRowProps>`
  padding: 8px;
  text-align: left;
`;

export const TableCell = styled.td<TableRowProps>`
  padding: 8px;
  text-align: left;
  /* Add the following styles for scrollable column text */
  white-space: nowrap; /* Prevent line breaks */
  /*overflow-x: auto;*/ /* Enable horizontal scrolling when content overflows */
  ${overflow}
  ${space}
${color}
${border}
`;

const TableRow = styled.div<TableRowProps>`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  border-radius: 10px;
  box-shadow: ${({ theme, boxShadow }) => theme.shadows[boxShadow || "small"]};

  & > * {
    flex: 1 1 0;
  }

  .pre {
    white-space: pre;
  }

  ${space}
  ${color}
  ${border}
`;

TableRow.defaultProps = { bg: "body.paper" };

export default TableRow;

