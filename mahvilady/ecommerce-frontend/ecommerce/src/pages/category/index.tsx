import { FC, Fragment, useEffect, useState } from "react";
import categoryApi from "@utils/real_api/category-api";
import Icon from "@component/icon/Icon";
import FlexBox from "@component/FlexBox";
import Pagination from "@component/pagination";
import DashboardPageHeader from "@component/layout/DashboardPageHeader";
import { PageMeta } from "interfaces";
import  Category  from "@models/category.model";
import AdminDashboardLayout from "@component/layout/admin-dashboard";
import { TableWrapper, TableRows, TableHeaderCell, TableCell } from "@component/TableRow";
import { IconButton } from "@component/buttons";
import Link from "next/link";
import showAlert from "@utils/show-alert"; // Import the custom showAlert function

import { theme } from "@utils/theme";
import styled from "styled-components";
import Box from "@component/Box";
import Image from "@component/Image";
import { useUserRoleValidation } from "@component/RBAC";
import { UserRole } from "@models/user.model";

const UploadImageBox = styled(Box)({
  width: 70,
  height: 70,
  display: "flex",
  overflow: "hidden",
  borderRadius: "8px",
  position: "relative",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: theme.colors.gray[100],
});

const Services = () => {
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<PageMeta>(null);
  const [nav, setNavigation] = useState<Category[]>([]);
  useUserRoleValidation([UserRole.ADMIN]);

  const getNavs = async () => {
    const { data, meta } = await categoryApi.getByPaging(page - 1, 10);
    setNavigation(data);
    setMeta(meta);
  };

  useEffect(() => {
    getNavs();
  }, [page]);

  const togleActiveStatus = (id: any, toggle: boolean) => {
    try {
      categoryApi.toggleActive(id);
      if (toggle) {
        showAlert(`marked in-active for nav ${id}`, "success");
      } else {
        showAlert(`marked active for nav ${id}`, "success");
      }
    } catch {
      showAlert(`error occured for service ${id}`, "error");
    }


  }

  return (
    <Fragment>
      <DashboardPageHeader title="Catogries" iconName="category" />
      <TableWrapper>
        {/* Table Header */}
        <thead>
          <TableRows key={0} padding="0px 18px" mb="-0.125rem" boxShadow="none" bg="none">
            <TableHeaderCell my="0px" mx="6px" flex="2 2 220px !important">
              Icon
            </TableHeaderCell>
            <TableHeaderCell my="0px" mx="6px">
              Name
            </TableHeaderCell>
            <TableHeaderCell color="text.muted" my="0px" mx="6px" textAlign="left">
              Slug
            </TableHeaderCell>
            <TableHeaderCell color="text.muted" my="0px" mx="6px" textAlign="left">

              Sub Categories
            </TableHeaderCell>
            <TableHeaderCell color="text.muted" my="0px" mx="6px" textAlign="left">

              Featured
            </TableHeaderCell>
            <TableHeaderCell color="text.muted" my="0px" mx="6px" textAlign="left">

              Main Nav
            </TableHeaderCell>
            <TableHeaderCell color="text.muted" my="0px" mx="6px" className="pre" textAlign="center" >  Option</TableHeaderCell>
          </TableRows>
        </thead>
        {/* Table Body */}
        <tbody>
          {nav.map((item, id) => (
            <ServiceRow item={item} key={id} id={id} onToggle={togleActiveStatus} />
          ))}
        </tbody>
      </TableWrapper>
      <FlexBox justifyContent="center" mt="2.5rem">
        <Pagination pageCount={meta?.totalPages || 1} onChange={(data) => setPage(data + 1)} />
      </FlexBox>
    </Fragment>
  );
};

Services.layout = AdminDashboardLayout;

export default Services;

interface ServiceRowProps {
  item: Category;
  id: any;
  onToggle: (id: any, toggle: boolean) => void;
}


const ServiceRow: FC<ServiceRowProps> = ({ item, onToggle }) => {
  const [isMain, setMain] = useState(item.mainCategory);
  return (
    <TableRows key={item.id} my="1rem" padding="6px 18px" bg="white">
      <TableCell alignItems="center" m="6px" flex="2 2 220px !important">
        <UploadImageBox key={item.id} mr=".2rem">
          <Image src={`/assets/images/${item.icon}`} width="90%" />
        </UploadImageBox>
      </TableCell>
      <TableCell overflow={"auto"} alignItems="center" m="6px" flex="2 2 220px !important">
        {item.name}
      </TableCell>
      <TableCell overflow={"auto"} m="6px" textAlign="left" fontWeight="400">
        {item.slug}
      </TableCell>
      <TableCell overflow={"auto"} alignItems="center" m="6px" flex="2 2 220px !important">
        {item.children.map((child)=>`${child.name} `)}
      </TableCell>
      <TableCell m="6px" textAlign="left" fontWeight="400">
        {item.featured ? "featured" : "un-featured"}
      </TableCell>
      <TableCell m="6px" textAlign="left" fontWeight="400">
        {isMain ? "Main" : "Child"}
      </TableCell>
      <TableCell color="text.muted" my="0px" mx="6px" overflowX="visible" className="pre" textAlign="center">

        <Link href={`/category/${item.id}`} passHref>

          <IconButton size="small">
            <Icon variant="small" defaultcolor="currentColor">
              edit
            </Icon>
          </IconButton>

        </Link>

        <IconButton size="small" onClick={() => {
          try{
            onToggle(item.id, !isMain)
            setMain(!isMain)
          }catch{

          }
     
          
        }}>
          <Icon variant="small" defaultcolor="currentColor">
            {isMain ? "close" : "check"}
          </Icon>
        </IconButton>
      </TableCell>
    </TableRows>
  )
}


