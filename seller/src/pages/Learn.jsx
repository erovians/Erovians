import { assets } from "@/assets/assets";
import Banner from "@/common/Banner";
import Sidebar from "@/common/Sidebar";
import React from "react";

const Learn = () => {
  return (
   <>
    <Banner title="Grow Your Business with Erovians" description=" Sell your products online and reach crores of customers
            through Erovians’s selling tools for suppliers" subdescription="Don’t have a GSTIN or have a Composition GSTIN? You can still sell on Erovians." img={assets.bannerimg}/>



            <Sidebar/>
    </>
  );
};

export default Learn;
