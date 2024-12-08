import { Box, Button, Paper } from "@mantine/core";
import "./App.css";
import SearchPage from "./pages/SearchPage";
import Header from "./components/Header";
import { Routes, Route } from "react-router-dom";
import BlogPage from "./pages/BlogPage";

function App() {
  return (
    <>
    <Header />
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/article/:blogId" element={<BlogPage />} />
      </Routes>
    </>
  );
}

export default App;
