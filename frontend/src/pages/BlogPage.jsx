import { Badge, Button, Flex, Image, Loader, Text, Title } from '@mantine/core';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { IconArrowLeft } from '@tabler/icons-react';

const BlogPage = () => {
  const { blogId } = useParams();
  const [blog, setBlog] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);

  const { isDarkMode } = useTheme();
  const color = isDarkMode ? "#0a1320" : "#e3fafc";
  const text = isDarkMode ? "#e3fafc" : "#193750";
  const navigate = useNavigate()

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`http://localhost:5000/blogs/${blogId}`);
        if (!response.ok) {
          throw new Error('Blog not found');
        }
        const data = await response.json();
        setBlog(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId]);

  if (loading) {
    return <Flex justify={'center'} align={'center'}  w={"100%"} mih={"100vh"} bg={`${color}`} >
        <Loader h={"100vh"} color={`${text}`} />
    </Flex>
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!blog) {
    return <Flex justify={'center'} align={'center'}  w={"100%"} mih={"100vh"} bg={`${color}`} >
    <Title c={`${text}`} fz={{base:20, xs:35, sm:35, md:35}}  >Oops! COuld not find the Blog.</Title>

</Flex>;
  }

  const paragraphLength = 1200;
  const paragraphs = [];
  for (let i = 0; i < blog.content.length; i += paragraphLength) {
    paragraphs.push(blog.content.substring(i, i + paragraphLength));
  }

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
    <Flex justify={'center'}  w={"100%"} mih={"100vh"} bg={`${color}`} >
        <Flex mt={50} mx={50} mb={150}  direction={'column'} w={{base:320, xs:500, sm:700, md:1000}} >
            <Button variant='outline' w={175} mb={15} color={`${text}`} leftSection={<IconArrowLeft/>} onClick={()=>{
                navigate('/')
            }}>Back to Home</Button>
            <Title c={`${text}`} fz={{base:20, xs:35, sm:35, md:35}}  >{blog.title}</Title>
            <Flex> <Text fw={500} c={`${text}`} >{blog.author}</Text>
            <Text mb={20} fw={500} c={`${text}`} >, {formatDate(blog.createdAt)}</Text>
            </Flex>
            
            <Image src={blog.image}/>
            <Text fw={500} c={`${text}`} >{paragraphs.map((para, index) => (
          <p key={index}>{para}</p>
        ))}</Text>
        <Flex direction={'column'} gap={10}> <Text fw={500} c={`${text}`} >Tags:</Text>
        <Flex gap={10} wrap={"wrap"}>
            {blog.tags.map((tag, index)=>(
                <Badge key={index} variant='outline' color={`${text}`} size='lg'>{tag}</Badge>
            ))}
        </Flex>
        </Flex>
        </Flex>

    </Flex>
  );
};

export default BlogPage;
