import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/modal";
import { Box, Button, HStack, Input, Text, VStack } from "@chakra-ui/react";
import { ISignUp } from "../types";
import { useToast } from '@chakra-ui/toast'
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { checkUsername, usernameSignUp } from "../api";
import { useForm } from "react-hook-form";
import { useState } from "react";

interface SignUpModalProps {    
    isOpen: boolean;
    onClose: () => void;
}

export default function SignUpModal({ isOpen, onClose }: SignUpModalProps) {

    const [isUsernameValid, setIsUsernameValid] = useState(false);
    const [showValidationMessage, setShowValidationMessage] = useState(false);
    const { register, handleSubmit, reset, formState: { errors }, getValues } = useForm<ISignUp>({
        mode: "onChange",
    });
    const toast = useToast();

    const navigate = useNavigate();
    const mutation = useMutation({
        mutationFn: usernameSignUp,
        onSuccess: () => {
            toast({
                title: "Sign up successful",
                description: "Welcome to the app!",
                status: "success",
                position: "bottom-right",
            });
            onClose();
            reset();
            navigate("/");
        },
        onError: () => {
            toast({
                title: "Sign up failed",
                description: "Please try again",
                status: "error",
                position: "bottom-right",
            });
        },
    });

    const onSignUpSubmit = ({name, email, username, password}: ISignUp) => {
        setShowValidationMessage(true);

        if (!isUsernameValid) {
            toast({
                title: "아이디 중복확인을 해주세요",
                status: "error",
                position: "bottom-right",
            });
            return;
        }
        mutation.mutate({name, email, username, password});
    }

    const checkUsernameMutation = useMutation({
        mutationFn: checkUsername,
        onSuccess: () => {
            toast({
                title: "사용 가능한 아이디입니다",
                status: "success",
                position: "bottom-right",
            });
            setIsUsernameValid(true);
        },
        onError: () => {
            toast({
                title: "이미 사용중인 아이디입니다",
                status: "error",
                position: "bottom-right",
            });
            setIsUsernameValid(false);
        },
    });

    const handleCheckUsername = () => {
        const username = getValues("username");
        if (!username) {
            toast({
                title: "아이디를 입력해주세요",
                status: "error",
                position: "bottom-right",
            });
            return;
        }
        checkUsernameMutation.mutate(username);
    }


    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    <Text fontSize="2xl" fontWeight="bold" textAlign="center">회원가입</Text>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody as="form" onSubmit={handleSubmit(onSignUpSubmit)}>
                    <VStack>
                        <Input 
                            _invalid={
                                errors.name && {
                                    borderColor: "red.500",
                                }
                            }
                            {...register("name", {
                                required: "Name is required",
                            })}
                            variant="outline" placeholder="이름" />
                        <VStack w="100%" spacing={2} mt={5}>
                            <HStack w="100%" >
                                    <Input 
                                    _invalid={
                                        errors.username && {
                                            borderColor: "red.500",
                                        }
                                    }
                                    {...register("username", {
                                        required: "아이디를 입력해주세요",
                                        validate: (value) => {
                                            if (!value) return true;
                                            // 1. 영문/숫자 패턴 검사
                                            if (value === "") return true;
                                            if (!/^[A-Za-z0-9]+$/.test(value)) {
                                                return "영문 또는 숫자만 입력 가능합니다";
                                            }
                                            // 2. 길이 검사
                                            if (value.length < 5) {
                                                return "아이디는 최소 5글자 이상이어야 합니다";
                                            }
                                            return true;
                                        }
                                    })}
                                    variant="outline" placeholder="아이디 - 5글자 이상(영문 또는 숫자)" />
                                <Button 
                                    onClick={handleCheckUsername}
                                    isLoading={checkUsernameMutation.isPending}
                                    size="sm"
                                >
                                    중복확인
                                </Button>
                            </HStack>
                            <Box h="30px">
                                {errors.username && (
                                    <Text fontSize="sm" color="red.500" mt={1}>
                                        {errors.username.message?.toString()}
                                    </Text>
                                )}
                                {isUsernameValid && (
                                    <Text fontSize="sm" color="green.500" mt={1}>
                                        사용 가능한 아이디입니다
                                    </Text>
                                )}
                            </Box>
                            
                        </VStack>
                        
                        <Input 
                            _invalid={
                                errors.email && {
                                    borderColor: "red.500",
                                }
                            }
                            {...register("email", {
                                required: "Email is required",
                            })}
                            variant="outline" placeholder="Email" />
                        <Input 
                            type="password"
                            _invalid={
                                errors.password && {
                                    borderColor: "red.500",
                                }
                            }
                            {...register("password", {
                                required: "Password is required",
                                validate: (value) => {
                                    if (!value) return true; // 실시간 검사 시에는 빈 값 허용
                                    
                                    if (value.length < 8) {
                                        return "비밀번호는 최소 8글자 이상이어야 합니다";
                                    }
                                    
                                    if (!/[A-Za-z]/.test(value)) {
                                        return "비밀번호에 영문자를 포함해주세요";
                                    }
                                    
                                    if (!/[0-9]/.test(value)) {
                                        return "비밀번호에 숫자를 포함해주세요";
                                    }
                                    
                                    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
                                        return "비밀번호에 특수문자를 포함해주세요";
                                    }
                                    
                                    return true;
                                }
                            })}
                            variant="outline" 
                            placeholder="비밀번호 - 8글자 이상(영문, 숫자, 특수문자 모두포함)" 
                            mt={5}
                        />
                        {errors.password && (
                            <Text fontSize="sm" color="red.500" mt={1}>
                                {errors.password.message?.toString()}
                            </Text>
                        )}
                    </VStack>
                    <Button colorScheme={"red"} w="100%" type="submit" mt={5}>
                        Sign Up
                    </Button>
                    <Box h="30px" mt={2}>
                        {showValidationMessage && !isUsernameValid && (
                            <Text fontSize="sm" color="red.500" mt={1} textAlign="center">
                                아이디 중복확인을 해주세요
                            </Text>
                        )}
                    </Box>
                    
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}
