import { Flex, Text, Title } from "@mantine/core";
import React, { memo } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useNavigate } from "react-router-dom";

const SearchResultCard = memo(({ blog }) => {
  const { isDarkMode } = useTheme();
  const color = isDarkMode ? "#193750" : "#f1f3f5";
  const text = isDarkMode ? "#e3fafc" : "#193750";
  const border = isDarkMode ? "#3bc9db" : "#193750";
  const navigate = useNavigate();
  

  function formatDate(dateString) {
    const date = new Date(dateString);

    const options = { month: "long" };
    const month = new Intl.DateTimeFormat("en-US", options).format(date);

    const day = date.getDate();
    const daySuffix = (day) => {
      if (day % 10 === 1 && day !== 11) return `${day}st`;
      if (day % 10 === 2 && day !== 12) return `${day}nd`;
      if (day % 10 === 3 && day !== 13) return `${day}rd`;
      return `${day}th`;
    };

    const year = date.getFullYear();

    return `${month} ${daySuffix(day)}, ${year}`;
  }

  return (
    <Flex
    onClick={()=>{navigate(`/article/${blog._id}`)}}
      style={{
        border: `3px solid ${border}`,
        borderRadius: "10px",
        cursor: "pointer"
      }}
      py={15}
      px={20}
      bg={`${color}`}
      c={`${text}`}
      gap={10}
      direction={"column"}
      w={{base:320, xs:500, sm:700, md:800}}
    >
      <Title
      ta={{base:"center", xs:"start"}}
    fz={{ base: 20, xs: 30 }}
    tt="uppercase"
    fw={700}
    sx={{
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    }}
  >
    {blog.title}
  </Title>
      <Text ta={{base:"center", xs:"start"}} fz={16} fw={400} fs={"italic"} lineClamp={3}>
        {blog.content}
      </Text>
      <Flex justify={{base:"center", xs:"end"}} mt={{base:0, xs:15}}>
        <Flex gap={5} direction={{base:"column", xs:"row"}}>
          <Flex gap={5} >
          <Text fz={16} fw={400}>
            Published by
          </Text>
          <Text fz={16} fs={"italic"} fw={700}>
            {blog.author}
          </Text>
          </Flex>
          <Flex gap={5} mt={{base:-10, xs:0}} >
          <Text fz={16} fw={400}>
            on
          </Text>
          <Text fz={16} fs={"italic"} fw={700}>
            {formatDate(blog.createdAt)}
          </Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
});

export default SearchResultCard;
