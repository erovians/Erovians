import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/common/Layout";
import CompanyCard from "../components/cards/CompanyCard";
import companiesData from "../assets/fakeData/companyData";
import sellersData from "../assets/fakeData/sellerData";

const Home = () => {
  const navigate = useNavigate();

  const handleCompanyClick = (companyId) => {
    navigate(`/company/${companyId}`);
  };

  return (
    <Layout showSidebar={true}>
      <div className="w-full px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-2">
          {companiesData.map((company) => {
            const seller = sellersData.find((s) => s._id === company.sellerId);
            return (
              <CompanyCard
                key={company._id}
                company={company}
                seller={seller}
                onClick={handleCompanyClick}
              />
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default Home;
