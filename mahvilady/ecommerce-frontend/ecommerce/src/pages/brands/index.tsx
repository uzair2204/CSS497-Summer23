import { FC, Fragment, useEffect, useState } from "react";
import brandApi from "@utils/real_api/brand-api";
import Icon from "@component/icon/Icon";
import FlexBox from "@component/FlexBox";
import Pagination from "@component/pagination";
import DashboardPageHeader from "@component/layout/DashboardPageHeader";
import { PageMeta } from "interfaces";
import Brand from "@models/Brand.model";
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

const Brands = () => {
  
  useUserRoleValidation([UserRole.ADMIN]);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<PageMeta>(null);
  const [brands, setBrands] = useState<Brand[]>([]);

  const getBrands = async () => {
    const { data, meta } = await brandApi.getByPaging(page - 1, 10);
    setBrands(data);
    setMeta(meta);
  };

  useEffect(() => {
    getBrands();
  }, [page]);

  const togleActiveStatus = (id: any, toggle: boolean) => {
    try {
      brandApi.toggleActive(id);
      if (toggle) {
        showAlert(`marked in-active for brand ${id}`, "success");
      } else {
        showAlert(`marked active for brand ${id}`, "success");
      }
    } catch {
      showAlert(`error occured for brand ${id}`, "error");
    }


  }

  return (
    <Fragment>
      <DashboardPageHeader title="Brands" iconName="delivery-box" />
      <TableWrapper>
        {/* Table Header */}
        <thead>
          <TableRows key={"0"} padding="0px 18px" mb="-0.125rem" boxShadow="none" bg="none">
            <TableHeaderCell my="0px" mx="6px" flex="2 2 220px !important">
              Image
            </TableHeaderCell>
            <TableHeaderCell my="0px" mx="6px" flex="2 2 220px !important">
              Name
            </TableHeaderCell>
            <TableHeaderCell color="text.muted" my="0px" mx="6px" textAlign="left">
              Slug
            </TableHeaderCell>

            <TableHeaderCell color="text.muted" my="0px" mx="6px" textAlign="left">

              Featured
            </TableHeaderCell>
            <TableHeaderCell color="text.muted" my="0px" mx="2px" textAlign="left">
              Active
            </TableHeaderCell>
            <TableHeaderCell color="text.muted" my="0px" mx="6px" className="pre" textAlign="center" >  Option</TableHeaderCell>
          </TableRows>
        </thead>
        {/* Table Body */}
        <tbody>
          {brands.map((item) => (
            <BrandRow key={item.id} item={item} onToggle={togleActiveStatus} />
          ))}
        </tbody>
      </TableWrapper>
      <FlexBox justifyContent="center" mt="2.5rem">
        <Pagination pageCount={meta?.totalPages || 1} onChange={(data) => setPage(data + 1)} />
      </FlexBox>
    </Fragment>
  );
};

Brands.layout = AdminDashboardLayout;

export default Brands;

interface BrandRowProps {
  item: Brand;
  onToggle: (id: any, toggle: boolean) => void;
}


const BrandRow: FC<BrandRowProps> = ({ item, onToggle }) => {
  const [isActive, setIsActive] = useState(item.active);
  return (
    <TableRows key={item.id} my="1rem" padding="6px 18px" bg="white">
      <TableCell alignItems="center" m="6px" flex="2 2 220px !important">
        <UploadImageBox key={item.id} mr=".2rem">
          <Image src={`/assets/images/${item.image}`} width="90%" />
        </UploadImageBox>
      </TableCell>
      <TableCell alignItems="center" m="6px" flex="2 2 220px !important">
        {item.name}
      </TableCell>
      <TableCell m="6px" textAlign="left" fontWeight="400">
        {item.slug}
      </TableCell>
      <TableCell m="6px" textAlign="left" fontWeight="400">
        {item.featured ? "Featured" : "Un-Featured"}
      </TableCell>
      <TableCell m="6px" textAlign="left" fontWeight="400">
        {isActive ? "Active" : "In-Active"}
      </TableCell>
      <TableCell color="text.muted" my="0px" mx="6px" className="pre" textAlign="center">

        <Link href={`/brands/${item.id}`} passHref>

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


