import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  Button,
  Input,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { logIn } from "../api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface IForm {
  username: string;
  password: string;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IForm>();
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: IForm) => logIn(data.username, data.password),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["user"] });
      toast({
        title: "로그인 성공!",
        status: "success",
        position: "bottom-right",
      });
      onClose();
      reset();
    },
  });

  const onSubmit = (data: IForm) => {
    mutation.mutate(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>로그인</ModalHeader>
        <ModalCloseButton />
        <ModalBody as="form" onSubmit={handleSubmit(onSubmit)}>
          <VStack spacing={4}>
            <Input
              {...register("username", { required: "아이디를 입력해주세요" })}
              placeholder="아이디"
            />
            <Input
              {...register("password", { required: "비밀번호를 입력해주세요" })}
              type="password"
              placeholder="비밀번호"
            />
            <Button
              isLoading={isLoading}
              type="submit"
              w="100%"
              colorScheme="red"
            >
              로그인
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
