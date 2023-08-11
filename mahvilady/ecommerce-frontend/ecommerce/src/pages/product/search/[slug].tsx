import { useCallback, useEffect, useState } from "react";
import Box from "@component/Box";
import Card from "@component/Card";
import Select from "@component/Select";
import Hidden from "@component/hidden";
import Grid from "@component/grid/Grid";
import Icon from "@component/icon/Icon";
import FlexBox from "@component/FlexBox";
import { IconButton } from "@component/buttons";
import Sidenav from "@component/sidenav/Sidenav";
import { H5, Paragraph } from "@component/Typography";
import NavbarLayout from "@component/layout/NavbarLayout";
import ProductCard1List from "@component/products/ProductCard1List";
import ProductCard9List from "@component/products/ProductCard9List";
import ProductFilterCard from "@component/products/ProductFilterCard";
import useWindowSize from "@hook/useWindowSize";
import { useRouter } from "next/router";
import Product from "@models/product.model";
import productApi from "@utils/real_api/product-api";
import brandApi from "@utils/real_api/brand-api";
import { PageMeta } from "interfaces";

const ProductSearchResult = () => {
  const width = useWindowSize();
  const [view, setView] = useState<"grid" | "list">("grid");

  const isTablet = width < 1025;
  const toggleView = useCallback((v) => () => setView(v), []);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [products, setProducts] = useState<Product[]>(null);
  const [pageMeta, setPageMeta] = useState<PageMeta>(null);
  const [page, setPage] = useState(0);
  const { slug } = router.query;
  const [selectedSortOption, setSelectedSortOption] = useState(sortOptions[0]);
  const [selectedPaginationOption, setSelectedPaginationOption] = useState(paginationOption[3]);
  const [brandNamesList, setBrandNamesList] = useState<string[]>([]);
  const [criteria, setCriteria] = useState<any>();
  const [applyCriteria, setApplyCriteria] = useState(false);


  const getProduct = async () => {
    if (slug !== null && slug !== undefined) {
      if (!loading) {
        setLoading2(true);
      }
      console.log(page);
      let response;
      if (!applyCriteria) {
        response = await productApi.getProductsByNameContaining(slug, page, selectedSortOption.value, selectedPaginationOption.value);
      } else {
        response = await productApi.getProductsByFilter(criteria, page, selectedSortOption.value, selectedPaginationOption.value);
      }


      setProducts(response.data);
      setPageMeta(response.meta)
      if (loading) {
        setLoading(false);
      }
      setLoading2(false);

    }

  };

  const getBrandsNames = async () => {
    if (slug !== null && slug !== undefined) {
      console.log(page);
      const response = await brandApi.getNames();
      setBrandNamesList(response);
    }

  };

  useEffect(() => {
    getBrandsNames()
  }, [])
  
  useEffect(() => {
    getProduct();
  }, [slug, page, selectedSortOption, selectedPaginationOption, criteria]);

  const handleSelectChange = (newValue) => {
    setSelectedSortOption(newValue);
    setPage(0);
  };

  const handlePaginationChange = (newValue) => {
    setSelectedPaginationOption(newValue);
    setPage(0);
  };


  const callCriteria = (newValue) => {
    const filter = {
      ...newValue,
      name: slug
    }
    setCriteria(filter);
    setApplyCriteria(true);
    setPage(0);
    console.log("filter call");
  };

  return (
    <Box pt="20px">
      {loading && <H5>Loading....</H5>}
      {!loading &&
        <FlexBox
          as={Card}
          mb="55px"
          p="1.25rem"
          elevation={5}
          flexWrap="wrap"
          alignItems="center"
          justifyContent="space-between"
        >
          <div>
            <H5>Searching for “ {slug} ”</H5>
            <Paragraph color="text.muted">{pageMeta.totalElements} results found</Paragraph>
          </div>

          <FlexBox alignItems="center" flexWrap="wrap">
            <Paragraph color="text.muted" mr="1rem">
              Products per page:
            </Paragraph>

            <Box flex="1 1 0" mr="1.75rem" minWidth="150px">
              <Select placeholder="products per page" defaultValue={selectedPaginationOption} options={paginationOption} onChange={(newValue) => handlePaginationChange(newValue)} />
            </Box>
            <Paragraph color="text.muted" mr="1rem">
              Sort by:
            </Paragraph>
            <Box flex="1 1 0" mr="1.75rem" minWidth="150px">
              <Select placeholder="Short by" defaultValue={selectedSortOption} options={sortOptions} onChange={(newValue) => handleSelectChange(newValue)} />
            </Box>

            <Paragraph color="text.muted" mr="0.5rem">
              View:
            </Paragraph>

            <IconButton size="small" onClick={toggleView("grid")}>
              <Icon
                variant="small"
                defaultcolor="auto"
                color={view === "grid" ? "primary" : "inherit"}
              >
                grid
              </Icon>
            </IconButton>

            <IconButton size="small" onClick={toggleView("list")}>
              <Icon
                variant="small"
                defaultcolor="auto"
                color={view === "list" ? "primary" : "inherit"}
              >
                menu
              </Icon>
            </IconButton>

            {isTablet && (
              <Sidenav
                position="left"
                scroll={true}
                handle={
                  <IconButton size="small">
                    <Icon>options</Icon>
                  </IconButton>
                }
              >
                <ProductFilterCard brandNamesList={brandNamesList} applyFilter={callCriteria} />
              </Sidenav>
            )}
          </FlexBox>
        </FlexBox>}
      {!loading &&
        <Grid container spacing={6}>
          <Hidden as={Grid} item lg={3} xs={12} down={1024}>
            <ProductFilterCard brandNamesList={brandNamesList} applyFilter={callCriteria} />
          </Hidden>

          <Grid item lg={9} xs={12}>
            {!loading2 && view === "grid" &&
              <ProductCard1List products={products} pageMeta={pageMeta} onPageChange={setPage} />
            } {!loading2 && view !== "grid" &&
              <ProductCard9List products={products} pageMeta={pageMeta} onPageChange={setPage} />
            }
          </Grid>

        </Grid>
      }
    </Box>
  );
};

const sortOptions = [
  { label: "Price Low to High", value: "price,asc" },
  { label: "Price High to Low", value: "price,desc" },
  { label: "Rating Low to High", value: "rating,asc" },
  { label: "Rating High to Low", value: "rating,desc" },
  { label: "Alphabatically A-Z", value: "title,asc" },
  { label: "Alphabatically Z-A", value: "title,desc" },
  { label: "Date new to old", value: "creationTimeStamp,asc" },
  { label: "Date old to new", value: "creationTimeStamp,desc" },
];

const paginationOption = [
  { label: "Show 5 products", value: "5" },
  { label: "Show 10 products", value: "10" },
  { label: "Show 15 products", value: "15" },
  { label: "Show 20 products", value: "20" },
];

ProductSearchResult.layout = NavbarLayout;

export default ProductSearchResult;
