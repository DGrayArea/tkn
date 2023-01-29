import React, { useEffect } from "react";
import Meta from "../../components/Meta";
import { Partners } from "../../components/component";
import Hero_8 from "../../components/hero/hero_8";
import MintBox from "../../components/MintBox";
import Characters from "../../components/characters";
import Statistic from "../../components/promo/statistic";
import Statistic_promo_2 from "../../components/promo/statistic_promo_2";
import Features from "../../components/features/features";
import Newsletter from "../../components/nwesletter/newsletter";
import { useTheme } from "next-themes";

const Home_8 = () => {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setTheme("dark");
  }, [setTheme]);

  return (
    <>
      <Meta title="Home | Holey Aliens" />
      <Hero_8 />
      <MintBox />
      <Characters />
      <Statistic />
      <Features />
      <Partners />
    </>
  );
};

export default Home_8;
