import { ChangeEvent, FC, useState } from "react";
import Card from "@component/Card";
import Rating from "@component/rating";
import Divider from "@component/Divider";
import FlexBox from "@component/FlexBox";
import CheckBox from "@component/CheckBox";
import TextField from "@component/text-field";
//import { Accordion, AccordionHeader } from "@component/accordion";
import { H5, H6, SemiSpan } from "@component/Typography";
import Button from "@component/buttons/Button";

type Props = {
  brandNamesList: string[];
  applyFilter: (newValue: any) => void
};

const ProductFilterCard: FC<Props> = (props) => {
  const { brandNamesList, applyFilter } = props;

  const [priceMin, setPriceMin] = useState<number | null>(null);
  const [priceMax, setPriceMax] = useState<number | null>(null);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [stock, setStock] = useState(false);
  const [discount, setDiscount] = useState(false);
  const [featured, setfeatured] = useState(false);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  //const [selectedColors, setSelectedColors] = useState<string[]>([]);



  const handlePriceMinChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const parsedValue = Number(value);

    setPriceMin(isNaN(parsedValue) ? null : parsedValue);
    console.log(`${value} ${parsedValue} ${priceMin}`);

  };

  const handlePriceMaxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const parsedValue = Number(value);
    setPriceMax(isNaN(parsedValue) ? null : parsedValue);
  };

  const handleBrandChange = (brand: string, checked: boolean) => {
    if (checked) {
      setSelectedBrands((prevBrands) => [...prevBrands, brand]);
    } else {
      setSelectedBrands((prevBrands) => prevBrands.filter((b) => b !== brand));
    }
    console.log(selectedBrands);
  };

  const handleItemsChange = (item: string, checked: boolean) => {
    if (item === "stock") {
      handleStockChange(checked);
    } else if (item === "discount") {
      handleDiscountChange(checked);
    } else if (item === "Featured") {
      setfeatured(checked);
    }
  };

  const handleStockChange = (checked: boolean) => {
    setStock(checked);
  };

  const handleDiscountChange = (checked: boolean) => {
    setDiscount(checked);
  };

  const handleRatingChange = (rating: number, checked: boolean) => {
    if (checked) {
      setSelectedRatings((prevRatings) => [...prevRatings, rating]);
    } else {
      setSelectedRatings((prevRatings) => prevRatings.filter((r) => r !== rating));
    }
  };

  // const handleColorChange = (color: string, checked: boolean) => {
  //   if (checked) {
  //     setSelectedColors((prevColors) => [...prevColors, color]);
  //   } else {
  //     setSelectedColors((prevColors) => prevColors.filter((c) => c !== color));
  //   }
  // };

  const createQuery = () => {
    const query = {
      priceMin,
      priceMax,
      brands: selectedBrands,
      stock,
      discount,
      ratings: selectedRatings,
      featured,
    };
    console.log(query);
    applyFilter(query)
  };


  // const render = (items: string[]) =>
  //   items.map((name) => (
  //     <Paragraph
  //       py="6px"
  //       pl="22px"
  //       key={name}
  //       fontSize="14px"
  //       color="text.muted"
  //       className="cursor-pointer"
  //     >
  //       {name}
  //     </Paragraph>
  //   ));



  return (
    <Card p="18px 27px" elevation={5}>
      {/* <H6 mb="10px">Categories</H6> */}
      {/* {categroyList.map((item) =>
        item.child ? (
          <Accordion key={item.title} expanded>
            <AccordionHeader px="0px" py="6px" color="text.muted">
              <SemiSpan className="cursor-pointer" mr="9px">
                {item.title}
              </SemiSpan>
            </AccordionHeader>

            {render(item.child)}
          </Accordion>
        ) : (
            
              <Paragraph
                py="6px"
                fontSize="14px"
                key={item.title}
                color="text.muted"
                className="cursor-pointer"
                onClick={()=>console.log("logged")}
              >
                {item.title}
              </Paragraph>
            
        )
      )} */}

      {/* <Divider mt="18px" mb="24px" /> */}

      {/* PRICE RANGE FILTER */}
      <H6 mb="16px">Price Range</H6>
      <FlexBox justifyContent="space-between" alignItems="center">
        <TextField placeholder="0" type="number" fullwidth value={priceMin === null ? "" : String(priceMin)}
          onChange={handlePriceMinChange} // Attach the onChange event handler 
        />

        <H5 color="text.muted" px="0.5rem">
          -
        </H5>

        <TextField placeholder="250" type="number" fullwidth onChange={handlePriceMaxChange} />
      </FlexBox>

      {/* BRANDS FILTER */}
      {brandNamesList && brandNamesList.length > 0 &&
        <> <Divider my="24px" />  <H6 mb="16px">Brands</H6></>

      }
      {brandNamesList.map((item) => (
        <CheckBox
          my="10px"
          key={item}
          name={item}
          value={item}
          color="secondary"
          label={<SemiSpan color="inherit">{item}</SemiSpan>}
          onChange={(e) => handleBrandChange(e.target.value, e.target.checked)}
        />
      ))}

      <Divider my="24px" />

      {/* STOCK AND SALES FILTERS */}
      {otherOptions.map((item) => (
        <CheckBox
          my="10px"
          key={item.value}
          name={item.value}
          value={item.value}
          color="secondary"
          label={<SemiSpan color="inherit">{item.label}</SemiSpan>}
          onChange={(e) => handleItemsChange(e.target.value, e.target.checked)}
        />
      ))}

      <Divider my="24px" />

      {/* RATING FILTER */}
      <H6 mb="16px">Ratings</H6>
      {[5, 4, 3, 2, 1].map((item) => (
        <CheckBox
          my="10px"
          key={item}
          value={item}
          color="secondary"
          label={<Rating value={item} outof={5} color="warn" />}
          onChange={(e) => handleRatingChange(Number(e.target.value), e.target.checked)}
        />
      ))}

      <Divider my="24px" />

      {/* COLORS FILTER */}

      {/* <H6 mb="16px">Colors</H6>
      <FlexBox mb="1rem">
        {colorList.map((item, ind) => (
          <Avatar key={ind} bg={item} size={25} mr="10px" style={{ cursor: "pointer" }} />
        ))}
      </FlexBox> */}
      <FlexBox>
        <Button color="primary" bg="primary.light" px="2rem" onClick={() => console.log(createQuery())}> Apply Filter</Button>
      </FlexBox>

    </Card>
  );
};

// const categroyList = [
//   { title: "Bath Preparations", child: ["Bubble Bath", "Bath Capsules", "Others"] },
//   { title: "Eye Makeup Preparations" },
//   { title: "Fragrance" },
//   { title: "Hair Preparations" },
// ];

const otherOptions = [{ label: "On Discount", value: "discount" }, { label: "In Stock", value: "stock" },];
//const brandList = ["Maccs", "Karts", "Baars", "Bukks", "Luasis"];
//const colorList = ["#1C1C1C", "#FF7A7A", "#FFC672", "#84FFB5", "#70F6FF", "#6B7AFF"];

export default ProductFilterCard;
