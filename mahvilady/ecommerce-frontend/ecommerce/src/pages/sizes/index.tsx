import { FC, Fragment, useEffect, useState } from "react";
import Icon from "@component/icon/Icon";
import FlexBox from "@component/FlexBox";
import Pagination from "@component/pagination";
import DashboardPageHeader from "@component/layout/DashboardPageHeader";
import { PageMeta } from "interfaces";
import {Size} from "@models/size.model";
import AdminDashboardLayout from "@component/layout/admin-dashboard";
import { TableWrapper, TableRows, TableHeaderCell, TableCell } from "@component/TableRow";
import { IconButton } from "@component/buttons";
import Link from "next/link";


import sizeApi from "@utils/real_api/size-api";
function Sizes() {
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<PageMeta>(null);
  const [sizes, setSizes] = useState<Size[]>([]);
  useUserRoleValidation([UserRole.ADMIN]);

  const getSizes = async () => {
    const { data, meta } = await sizeApi.getByPaging(page - 1, 10);
    setSizes(data);
    setMeta(meta);
  };

  useEffect(() => {
    getSizes();
  }, [page]);


  return (
    <Fragment>
      <DashboardPageHeader title="Sizes" iconName="delivery-box" />
      <TableWrapper>
        {/* Table Header */}
        <thead>
          <TableRows padding="0px 18px" mb="-0.125rem" boxShadow="none" bg="none">
            <TableHeaderCell my="0px" mx="6px" flex="2 2 220px !important">
              Size
            </TableHeaderCell>
            <TableHeaderCell color="text.muted" my="0px" mx="6px" className="pre" textAlign="center">  Option</TableHeaderCell>
          </TableRows>
        </thead>
        {/* Table Body */}
        <tbody>
          {sizes.map((item, id) => (
            <SizeRow item={item} id={id} />
          ))}
        </tbody>
      </TableWrapper>
      <FlexBox justifyContent="center" mt="2.5rem">
        <Pagination pageCount={meta?.totalPages || 1} onChange={(data) => setPage(data + 1)} />
      </FlexBox>
    </Fragment>
  );
}

Sizes.layout = AdminDashboardLayout;

export default Sizes;

interface SizeRowProps {
  item: Size;
  id: any;
}


const SizeRow: FC<SizeRowProps> = ({ item, id }) => {
  return (
    <TableRows key={id} my="1rem" padding="6px 18px" bg="white">
     <TableCell color="text.muted" my="0px" mx="6px" className="pre" textAlign="center">
        {item.name}
      </TableCell>
      <TableCell color="text.muted" my="0px" mx="6px" className="pre" textAlign="center">
        <Link href={`/sizes/${item.id}`} passHref>
          <IconButton size="small">
            <Icon variant="small" defaultcolor="currentColor">
              edit
            </Icon>
          </IconButton>
        </Link>
      </TableCell>
    </TableRows>
  )
}


