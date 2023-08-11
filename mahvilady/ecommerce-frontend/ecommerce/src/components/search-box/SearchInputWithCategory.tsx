import { FC, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { debounce } from "lodash";
import Box from "../Box";
import Menu from "../Menu";
import Card from "../Card";
import Icon from "../icon/Icon";
import FlexBox from "../FlexBox";
import MenuItem from "../MenuItem";
import { Span } from "../Typography";
import TextField from "../text-field";
import StyledSearchBox from "./styled";
import categoryApi from "@utils/real_api/category-api";
import productApi from "@utils/real_api/product-api";

const SearchInputWithCategory: FC = () => {
  const [resultList, setResultList] = useState([]);
  const [category, setCategory] = useState("All Categories");
  const [categories, setCategories] = useState(["All Categories"]);


  const handleCategoryChange = (cat) => () => setCategory(cat);


  const getCategories = async () => {
    const response = await categoryApi.getNames();
    const categoriesWithAll = ["All Categories", ...response];

    setCategories(categoriesWithAll);
  };

  const getSuggestions = async (value: any) => {
    console.log(`value ${value}`);
    const response = await productApi.getSuggestions(value, category);
    setResultList(response);
  };

  const search = debounce((e) => {
    const value = e.target.value;

    if (!value) { setResultList([]); }
  
    else { 
      getSuggestions(value);
    }
       
  }, 200);

  const hanldeSearch = useCallback((event) => {
    event.persist();
   console.log(event.target.value);
    search(event);
  }, []);

  useEffect(() => {
    getCategories();
  }, []);

  const handleDocumentClick = () => setResultList([]);

  useEffect(() => {
    window.addEventListener("click", handleDocumentClick);
    return () => window.removeEventListener("click", handleDocumentClick);
  }, []);

  return (
    <Box position="relative" flex="1 1 0" maxWidth="670px" mx="auto">
      <StyledSearchBox>
        <Icon className="search-icon" size="18px">
          search
        </Icon>

        <TextField
          fullwidth
          onChange={hanldeSearch}
          className="search-field"
          placeholder="Search and hit enter..."
        />

        <Menu
          direction="right"
          className="category-dropdown"
          handler={
            <FlexBox className="dropdown-handler" alignItems="center">
              <span>{category}</span>
              <Icon variant="small">chevron-down</Icon>
            </FlexBox>
          }
        >
          {categories.map((item) => (
            <MenuItem key={item} onClick={handleCategoryChange(item)}>
              {item}
            </MenuItem>
          ))}
        </Menu>
      </StyledSearchBox>

      {!!resultList.length && (
        <Card position="absolute" top="100%" py="0.5rem" width="100%" boxShadow="large" zIndex={99}>
          {resultList.map((item) => (
            <Link href={`/product/search/${item}`} key={item}>
              <MenuItem key={item}>
                <Span fontSize="14px">{item}</Span>
              </MenuItem>
            </Link>
          ))}
        </Card>
      )}
    </Box>
  );
};

export default SearchInputWithCategory;
