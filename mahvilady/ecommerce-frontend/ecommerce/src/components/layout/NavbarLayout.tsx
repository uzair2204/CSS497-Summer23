import { FC, ReactNode } from "react";
import AppLayout from "./AppLayout";
import Container from "@component/Container";
import Navbar from "@component/navbar/Navbar";

// ======================================================
type Props = { children: ReactNode , title:string};
// ======================================================

const NavbarLayout: FC<Props> = ({ children,title="Mehvi lady" }) => {
  return (
    <AppLayout navbar={<Navbar />} title={title}>
      <Container my="2rem">{children}</Container>
    </AppLayout>
  );
};

export default NavbarLayout;
