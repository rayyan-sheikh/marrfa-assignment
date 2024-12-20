import React, { useEffect, useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import {
  Box,
  Button,
  Flex,
  Text,
  Loader,
  TextInput,
  Select,
  Pagination,
  Menu,
  Title,
  UnstyledButton,
  Tooltip,
  Center,
} from "@mantine/core";
import SearchResultCard from "../components/SearchResultCard";
import { IconCalendarDown, IconCalendarUp, IconChevronLeft, IconChevronRight, IconSearch, IconSortAscendingLetters, IconSortDescendingLetters, IconX } from "@tabler/icons-react";
import styles from "../custom.module.css";

const SearchPage = () => {
  const { isDarkMode } = useTheme();
  const color = isDarkMode ? "#0a1320" : "#e3fafc";
  const text = isDarkMode ? "#e3fafc" : "#193750";

  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("name_asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [blogsPerPage] = useState(5);
const url=import.meta.env.VITE_REACT_APP_BASEURL
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(`${url}/blogs`);
        if (!response.ok) {
          throw new Error("Failed to fetch blogs");
        }
        const data = await response.json();
        setBlogs(data);
        setFilteredBlogs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  
    let filtered = [...blogs];

    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
  
      filtered = filtered.filter((blog) => {
        const title = blog.title ? blog.title.toLowerCase().trim() : "";
        const content = blog.content ? blog.content.toLowerCase().trim() : "";
        const author = blog.author ? blog.author.toLowerCase().trim() : "";
        const tags = Array.isArray(blog.tags) ? blog.tags.map((tag) => tag.toLowerCase()) : [];
  
        return (
          title.includes(query) ||
          content.includes(query) ||
          author.includes(query) ||
          tags.some((tag) => tag.includes(query))
        );
      });
    }
  
    if (sortOption) {
      filtered = filtered.sort((a, b) => {
        // Sorting by title (name_asc, name_desc)
        if (sortOption === "name_asc" || sortOption === "name_desc") {
          const titleA = a.title ? a.title.toLowerCase() : "";
          const titleB = b.title ? b.title.toLowerCase() : "";
  
          if (sortOption === "name_asc") {
            return titleA.localeCompare(titleB);
          }
          if (sortOption === "name_desc") {
            return titleB.localeCompare(titleA);
          }
        }
        if (sortOption === "date_asc" || sortOption === "date_desc") {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
  
          if (sortOption === "date_asc") {
            return dateB - dateA;
          }
          if (sortOption === "date_desc") {
            return dateA - dateB;
          }
        }
  
        return 0;
      });
    }
  
    // Update the filtered blogs state
    setFilteredBlogs(filtered);
  }, [searchQuery, sortOption, blogs]);
  
  
  

  const menuStyles = (option) => {
    const isSelected = sortOption === option;
    return {
      color: isSelected ? "#f8f9fa" : "#193750",
      fontWeight: isSelected ? 700 : 500,
      background: isSelected ? "#193750" : "transparent",
      iconColor: isSelected ? "#f8f9fa" : "#193750",
    };
  };

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredBlogs.length / blogsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <Box bg={`${color}`}>
      <Flex w={"100%"} align={"center"} justify={"center"} c={`${text}`}>
        <Flex hiddenFrom="sm">
        <IconSearch style={{marginTop: 5}} size={37} stroke={1} />
        </Flex>
        <Flex visibleFrom="sm">
        <IconSearch style={{marginTop: 5}} size={65} stroke={1} />
        </Flex>
        <Title fz={{base:40, sm:70}} fw={100}>
          SEARCH
        </Title>
        <Title fz={{base:40, sm:70}} fs={"italic"} fw={600}>
          BLOGS
        </Title>
      </Flex>
      <Flex w={"100%"} justify={"center"}>
        <Flex justify="center" w={{base:320, xs:500, sm:700, md:800}} my={10}>
          <TextInput
            classNames={{ input: styles.searchInput }}
            leftSection={
              <Flex ml={10}>
                <IconSearch />
              </Flex>
            }
            rightSection={
              <Tooltip position="bottom" withArrow label={"Clear"}>
                <IconX
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setSearchQuery("");
                    setSortOption("name_asc");
                  }}
                />
              </Tooltip>
            }
            placeholder="Type Author Name or Title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            flex={1}
          />
          <Menu width={200} position="bottom-start">
            <Menu.Target>
              <Tooltip position="bottom" withArrow label={"Sort By"}>
                <UnstyledButton
                  style={{ borderRadius: "0 10px 10px 0" }}
                  px={6}
                  bg={"#193750"}
                >
                  {sortOption === "name_asc" && <IconSortAscendingLetters color="white" />}
      {sortOption === "name_desc" && <IconSortDescendingLetters color="white" />}
      {sortOption === "date_asc" && <IconCalendarUp color="white" />}
      {sortOption === "date_desc" && <IconCalendarDown color="white" />}
                </UnstyledButton>
              </Tooltip>
            </Menu.Target>

            <Menu.Dropdown>
  <Menu.Item
    c={menuStyles("name_asc").color}
    fw={menuStyles("name_asc").fontWeight}
    bg={menuStyles("name_asc").background}
    leftSection={
      <IconSortAscendingLetters color={menuStyles("name_asc").iconColor} />
    }
    onClick={() => setSortOption("name_asc")}
  >
    Title A to Z
  </Menu.Item>

  <Menu.Item
    c={menuStyles("name_desc").color}
    fw={menuStyles("name_desc").fontWeight}
    bg={menuStyles("name_desc").background}
    leftSection={
      <IconSortDescendingLetters color={menuStyles("name_desc").iconColor} />
    }
    onClick={() => setSortOption("name_desc")}
  >
    Title Z to A
  </Menu.Item>

  <Menu.Item
    c={menuStyles("date_asc").color}
    fw={menuStyles("date_asc").fontWeight}
    bg={menuStyles("date_asc").background}
    leftSection={
      <IconCalendarUp color={menuStyles("date_asc").iconColor} />
    }
    onClick={() => setSortOption("date_asc")}
  >
    Latest First
  </Menu.Item>

  <Menu.Item
    c={menuStyles("date_desc").color}
    fw={menuStyles("date_desc").fontWeight}
    bg={menuStyles("date_desc").background}
    leftSection={
      <IconCalendarDown color={menuStyles("date_desc").iconColor} />
    }
    onClick={() => setSortOption("date_desc")}
  >
    Oldest First
  </Menu.Item>
</Menu.Dropdown>
          </Menu>
        </Flex>
      </Flex>

      <Flex
        w="100%"
        bg={`${color}`}
        align="center"
        justify="center"
        direction="column"
      >
        {loading && <Loader h={"100vh"} color="cyan.9" />}
        {error && (
          <Flex h={"100vh"} direction="column" align="center">
            <Text c="red">{error}</Text>
            <Button mt="sm" color="cyan.9" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </Flex>
        )}
        {!loading && !error && (
          <>
            <Flex
              gap={10}
              mih={"100vh"}
              justify={"start"}
              align="center"
              direction={"column"}
              wrap="wrap"
              py={10}
              mb={150}
              w="100%"
            >
              <Flex style={{userSelect:"none"}} justify="center" align={"center"} gap={10} w={"100%"}>
                <Tooltip label="Previous Page">
                  <IconChevronLeft stroke={3} onClick={handlePreviousPage} style={{cursor:"pointer"}} color={`${text}`}/>
                </Tooltip>
                <Text fw={400} c={`${text}`} fz={18}>
                  Page <span style={{fontWeight:700}}>{currentPage} </span> of <span style={{fontWeight:700}}>{Math.ceil(filteredBlogs.length / blogsPerPage)}</span>
                </Text>
                <Tooltip label="Next Page">
                  <IconChevronRight stroke={3} onClick={handleNextPage} style={{cursor:"pointer"}} color={`${text}`}/>
                </Tooltip>
              </Flex>
              {currentBlogs.length > 0 ? (
                currentBlogs.map((blog) => (
                  <SearchResultCard key={blog._id} blog={blog} />
                ))
              ) : (
                <Text c={`${text}`}>
                  No blogs found. Try adjusting your filters.
                </Text>
              )}
            </Flex>
          </>
        )}
      </Flex>
    </Box>
  );
};

export default SearchPage;
