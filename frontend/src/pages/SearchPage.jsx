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
} from "@mantine/core";
import SearchResultCard from "../components/SearchResultCard";
import { IconCalendarDown, IconCalendarUp, IconSearch, IconSortAscendingLetters, IconSortDescendingLetters, IconX } from "@tabler/icons-react";
import { FaSort } from "react-icons/fa";
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

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("http://localhost:5000/blogs");
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

    let filtered = blogs;
    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();

      filtered = filtered.filter((blog) => {
        const title = blog.title ? blog.title.toLowerCase().trim() : "";
        const content = blog.content ? blog.content.toLowerCase().trim() : "";
        const author = blog.author ? blog.author.toLowerCase().trim() : "";
        const tags = Array.isArray(blog.tags)
          ? blog.tags.map((tag) => tag.toLowerCase())
          : [];

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
        if (sortOption === "name_asc") return a.title.localeCompare(b.title);
        if (sortOption === "name_desc") return b.title.localeCompare(a.title);

        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);

        if (sortOption === "date_asc") return dateA - dateB;
        if (sortOption === "date_desc") return dateB - dateA;

        return 0;
      });
    }

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
    Name A to Z
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
    Name Z to A
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
    Date Ascending
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
    Date Descending
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
          <Flex direction="column" align="center">
            <Text c="red">{error}</Text>
            <Button mt="sm" onClick={() => window.location.reload()}>
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
              <Flex justify="center" w={"100%"}>
                <Pagination
                  page={currentPage}
                  onChange={setCurrentPage}
                  total={Math.ceil(filteredBlogs.length / blogsPerPage)}
                  color="#193750"
                  size="md"
                  autoContrast
                />
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
