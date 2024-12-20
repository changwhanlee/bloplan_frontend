import { Box, Button, HStack, Text, VStack } from "@chakra-ui/react";
import { FaGithub, FaGoogle, FaApple, FaComment } from "react-icons/fa";

export default function SocialLogin() {
    return (
        <Box>
            <HStack>
                <Text textTransform={"uppercase"} color="gray.500" fontSize={"xs"} fontWeight={"medium"}>Or</Text>
            </HStack>
            <VStack>
                <Button colorScheme={"gray"} variant={"outline"}>
                    <FaGithub /> Continue with Github
                </Button>
                <Button colorScheme={"gray"} variant={"outline"}>
                    <FaComment /> Continue with Kakao
                </Button>
            </VStack>
        </Box>
    )
}   
