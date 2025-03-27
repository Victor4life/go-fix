import React from "react";
import ServicePage from "./ServicePage";
import CategoryProfiles from "./CategoryProfiles";
import { Routes, Route } from "react-router-dom";

const index = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<ServicePage />} />
        <Route path=":categoryName" element={<CategoryProfiles />} />
      </Routes>
    </div>
  );
};

export default index;
