import { FC, Fragment, useEffect, useState } from "react";
import serviceApi from "@utils/real_api/service-api";
import Icon from "@component/icon/Icon";
import FlexBox from "@component/FlexBox";
import Pagination from "@component/pagination";
import DashboardPageHeader from "@component/layout/DashboardPageHeader";
import { PageMeta } from "interfaces";
import Service from "@models/service.model";
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
  const [services, setServices] = useState<Service[]>([]);
  useUserRoleValidation([UserRole.ADMIN]);
  const getServices = async () => {
    const { data, meta } = await serviceApi.getByPaging(page - 1);
    setServices(data);
    setMeta(meta);
  };

  useEffect(() => {
    getServices();
  }, [page]);

  const togleActiveStatus = (id: any, toggle: boolean) => {
    try {
      serviceApi.toggleActive(id);
      if (toggle) {
        showAlert(`marked in-active for service ${id}`, "success");
      } else {
        showAlert(`marked active for service ${id}`, "success");
      }
    } catch {
      showAlert(`error occured for service ${id}`, "error");
    }


  }

  return (
    <Fragment>
      <DashboardPageHeader title="Services" iconName="delivery-box" />
      <TableWrapper>
        {/* Table Header */}
        <thead>
          <TableRows padding="0px 18px" mb="-0.125rem" boxShadow="none" bg="none">
            <TableHeaderCell my="0px" mx="6px" flex="2 2 220px !important">
              Icon
            </TableHeaderCell>
            <TableHeaderCell my="0px" mx="6px" flex="2 2 220px !important">
              Title
            </TableHeaderCell>
            <TableHeaderCell color="text.muted" my="0px" mx="6px" textAlign="left">
              Description
            </TableHeaderCell>

            <TableHeaderCell color="text.muted" my="0px" mx="6px" textAlign="left">

              Active
            </TableHeaderCell>
            <TableHeaderCell color="text.muted" my="0px" mx="2px" textAlign="left">

              Display Order
            </TableHeaderCell>
            <TableHeaderCell color="text.muted" my="0px" mx="6px" className="pre" textAlign="center" >  Option</TableHeaderCell>
          </TableRows>
        </thead>
        {/* Table Body */}
        <tbody>
          {services.map((item, id) => (
            <ServiceRow item={item} id={id} onToggle={togleActiveStatus} />
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
  item: Service;
  id: any;
  onToggle: (id: any, toggle: boolean) => void;
}


const ServiceRow: FC<ServiceRowProps> = ({ item, id, onToggle }) => {
  const [isActive, setIsActive] = useState(item.active);
  return (
    <TableRows key={id} my="1rem" padding="6px 18px" bg="white">
      <TableCell alignItems="center" m="6px" flex="2 2 220px !important">
        <UploadImageBox key={1} mr=".2rem">
          <Image src={`/assets/images/${item.icon}`} width="90%" />
        </UploadImageBox>
      </TableCell>
      <TableCell alignItems="center" m="6px" flex="2 2 220px !important">
        {item.title}
      </TableCell>
      <TableCell m="6px" textAlign="left" fontWeight="400">
        {item.description}
      </TableCell>
      <TableCell m="6px" textAlign="left" fontWeight="400">
        {isActive ? "Active" : "In-Active"}
      </TableCell>
      <TableCell m="2px" textAlign="left" fontWeight="400">
        {item.displayOrder}
      </TableCell>
      <TableCell color="text.muted" my="0px" mx="6px" className="pre" textAlign="center">

        <Link href={`/services/${item.id}`} passHref>

          <IconButton size="small">
            <Icon variant="small" defaultcolor="currentColor">
              edit
            </Icon>
          </IconButton>

        </Link>

        <IconButton size="small" onClick={() => {
          onToggle(item.id, item.active)
          setIsActive(!isActive)
        }}>
          <Icon variant="small" defaultcolor="currentColor">
            {isActive ? "close" : "check"}
          </Icon>
        </IconButton>
      </TableCell>
    </TableRows>
  )
}


