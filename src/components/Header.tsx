import { useEffect } from "react";
import useUser from "../lib/usdUser";
import { Avatar, Button, HStack, Text, useDisclosure } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/toast";
import SignUpModal from "./SignUpModal";
import LoginModal from "./LoginModal";
import { useQueryClient } from "@tanstack/react-query";
import { logOut } from "../api";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const { userLoading, isLoggedIn, user } = useUser();
  const toast = useToast();

  const {       
    isOpen : isLoginOpen,
    onOpen : onLoginOpen,
    onClose : onLoginClose,
  } = useDisclosure();

  const {   
    isOpen : isSignUpOpen,
    onOpen : onSignUpOpen,
    onClose : onSignUpClose,
  } = useDisclosure();

  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const onLogOut = async () => {
    const toastId = toast({
        title: "로그아웃 중...",
        description: "안녕히 가세요...",
        status: "loading",
        position: "bottom-right",
      });
    await logOut();
    queryClient.refetchQueries({ queryKey: ["user"] });
    toast.update(toastId, {
        title: "로그아웃 완료",
        description: "다음에 또 만나요!",
        status: "success",
    }); 
    navigate("/");
    window.location.reload();
  }


  return (
    <HStack
        justifyContent={"space-between"}
        py={5}
        px={4}
        borderBottomWidth={1}
        borderColor={"gray.200"}    
    >
        <Text fontSize={"3xl"} fontWeight={"bold"}>
            체험단 동반자
        </Text>

        <HStack gap={2}>
            {!userLoading ? (
                !isLoggedIn ? (
                    <>
                        <Button onClick={onLoginOpen} colorScheme={"gray"}>
                            Log in
                        </Button>
                        <Button onClick={onSignUpOpen} colorScheme={"red"}>
                            Sign up
                        </Button>
                    </>
                ) : (
                    <HStack>
                        <Text>{user?.username} 님 안녕하세요!</Text>
                        <Button onClick={onLogOut} colorScheme={"red"}>
                            Log out
                        </Button>
                    </HStack>
                )
            ) : null}
        </HStack>
        <LoginModal isOpen={isLoginOpen} onClose={onLoginClose} />
        <SignUpModal isOpen={isSignUpOpen} onClose={onSignUpClose} />
    </HStack>
  ) 

}
