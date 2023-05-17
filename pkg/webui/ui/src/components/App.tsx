import React, { useState } from "react";

import "../index.css";
import { Box } from "@mui/material";
import { Outlet, useOutletContext } from "react-router-dom";
import { styled } from "@mui/system";
import { Layout } from "./layout";
import { Target } from "./targetDashboard/Target";

const BoxWrapper = styled(Box)({
  // width: "auto",
  color: "darkslategray",
  backgroundColor: "aliceblue",
  padding: 8,
  borderRadius: 4,
  background: "linear-gradient(180deg, #59A588 0%, #404846 100%)",
  overflow: "auto",
});
// import LeftDrawer from "./LeftDrawer";

export interface AppOutletContext {
  filters?: React.ReactNode;
  setFilters: (filter: React.ReactNode) => void;
}

export function useAppOutletContext(): AppOutletContext {
  return useOutletContext<AppOutletContext>();
}

const App = () => {
  const [filters, setFilters] = useState<React.ReactNode>();

  const context: AppOutletContext = {
    filters: filters,
    setFilters: setFilters,
  };
  console.log("filters", filters);
  return (
    <BoxWrapper height={"100%"}>
      <Layout context={context}>
        <Outlet context={context} />
      </Layout>
    </BoxWrapper>
  );
};

export default App;
