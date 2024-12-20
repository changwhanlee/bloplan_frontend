import { Outlet } from "react-router-dom";
import Header from "./Header";
import { Box } from "@chakra-ui/react";

export default function Root() {
  return (
    <h1>
      <Box bg="white" h="100vh" w="100%">
        <Header />  
        <Outlet />
      </Box>
    </h1>
  );
}