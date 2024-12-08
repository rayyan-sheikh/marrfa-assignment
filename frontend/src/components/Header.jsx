import { Anchor, Flex, Text, Tooltip, UnstyledButton } from "@mantine/core";
import { useTheme } from "../contexts/ThemeContext";
import {
    IconBrandGithub,
    IconBrandLeetcode,
    IconBrandLinkedin,
    IconMoon,
    IconSun,
  } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

const Header = () => {

    const { isDarkMode, toggleTheme, bgColorHeader, textColorHeader } = useTheme();
    const navigate = useNavigate()



  return (
    <Flex align={"center"} bg={`${bgColorHeader}`} justify={"space-between"} h={60}>
    <Flex style={{cursor:"pointer"}} onClick={()=>{
      navigate('/')
    }}>
      
      <Text c={`${textColorHeader}`} fz={25} ml={20} fw={700}>MARRFA</Text>
      <Text c={`${textColorHeader}`} fz={25} fs={"italic"} fw={300}>BLOG</Text>
    </Flex>
    <Flex gap={10} mr={{base: 20, xs: 50}}>
      {isDarkMode ? (
        <Tooltip label="Change Theme">
        <UnstyledButton
          c={`${textColorHeader}`}
          onClick={() => {
            toggleTheme();
          }}
        >
          
          <IconMoon stroke={2} /> 
        </UnstyledButton>
        </Tooltip>
      ) : (
        <Tooltip label="Change Theme">
        <UnstyledButton
        c={`${textColorHeader}`}
          onClick={() => {
            toggleTheme();
          }}
        >
          <IconSun stroke={2} />
        </UnstyledButton>
        </Tooltip>
      )}
    </Flex>
  </Flex>
  )
}

export default Header