import { FC } from "react";
import Link from "next/link";
import styled from "styled-components";
import Box from "@component/Box";
import Image from "@component/Image";
import Grid from "@component/grid/Grid";
import Icon from "@component/icon/Icon";
import FlexBox from "@component/FlexBox";
//import AppStore from "@component/AppStore";
import { Paragraph } from "@component/Typography";
import { deviceSize } from "@utils/constants";
import { getTheme } from "@utils/utils";

// styled component
const StyledLink = styled.a`
  display: block;
  padding: 0.35rem 0rem;
  color: ${getTheme("colors.gray.500")};
  cursor: pointer;
  border-radius: 4px;
  :hover {
    color: ${getTheme("colors.gray.100")};
  }
  z-index: 999;
  position: relative;
`;

const StyledBox = styled(Box)`
  margin-right: auto;
  margin-left: auto;

  @media only screen and (max-width: ${deviceSize.sm}px) {
    margin-right: unset;
    margin-left: unset;
  }
`;

const Wrapper = styled(Box)`
  margin-bottom: 1rem;
  padding: 40px;
  color: white;
  overflow: hidden;
  border-radius: 8px;
  background-color: #0f3460;

  @media only screen and (max-width: 900px) {
    margin-bottom: 3.75rem;
  }
`;

const Footer2: FC = () => {
  return (
    <footer>
      <Wrapper>
        <Link href="/">
          <a>
            <Image mb="1.5rem" src="/assets/images/logo.svg" alt="logo" />
          </a>
        </Link>

        <Grid container spacing={6}>
          <Grid item md={6} sm={6} xs={12}>
            <Paragraph mb="1.25rem" color="gray.500" maxWidth="370px">
                Cosmetics are products designed to cleanse, protect and change the appearance of external parts of our bodies. 
                The key ingredients present in most cosmetics include water, emulsifiers, preservatives, thickeners, moisturizers, colors and fragrances.
            </Paragraph>

            {/* <AppStore /> */}
          </Grid>

          <Grid item md={6} sm={6} xs={12}>
            <StyledBox maxWidth="230px" mt="-0.35rem">
              <div>
                {customerCareLinks.map((item, ind) => (
                  <Link href="/" key={ind}>
                    <StyledLink>{item}</StyledLink>
                  </Link>
                ))}
              </div>

              <FlexBox mx="-5px" mt="1rem">
                {iconList.map((item, ind) => (
                  <a href={item.url} key={ind}>
                    <Box
                      m="5px"
                      size="small"
                      p="10px"
                      bg="rgba(0,0,0,0.2)"
                      borderRadius="50%"
                      cursor="pointer"
                    >
                      <Icon size="12px" defaultcolor="auto">
                        {item.iconName}
                      </Icon>
                    </Box>
                  </a>
                ))}
              </FlexBox>
            </StyledBox>
          </Grid>
        </Grid>
      </Wrapper>
    </footer>
  );
};

const customerCareLinks = [
  "Help Center",
  "Track Your Order",
  "Corporate & Bulk Purchasing",
  "Returns & Refunds",
];

const iconList = [  { iconName: "facebook", url: "https://www.facebook.com/Mehvilady/" },
{ iconName: "tiktok", url: "https://www.tiktok.com/discover/mehvi-lady-base?lang=en" },
{ iconName: "youtube", url: "https://www.youtube.com/@mehviladyofficial4330" },
{ iconName: "google", url: "https://www.google.com/search?q=mehvi+lady" },
{ iconName: "instagram", url: "https://www.instagram.com/preciouxmehwish/?hl=en" },];

export default Footer2;
