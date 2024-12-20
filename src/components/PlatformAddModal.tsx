
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from "@chakra-ui/modal";
import { Button, Input, Text, VStack } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@chakra-ui/toast";
import { addPlatform } from "../api";
import { IPlatformAdd } from "@/types";

interface PlatformAddModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function PlatformAddModal({ isOpen, onClose }: PlatformAddModalProps) {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<IPlatformAdd>();
    const toast = useToast();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: addPlatform,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['platforms'] });
            toast({
                title: "플랫폼이 추가되었습니다.",
                status: "success",
                position: "bottom-right",
            });
            onClose();
            reset();
        },
    });

    const onSubmit = (data: IPlatformAdd) => {
        mutation.mutate(data);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    <Text>새 플랫폼 추가</Text>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody as="form" onSubmit={handleSubmit(onSubmit)}>
                    <VStack spacing={4}>
                        <Input 
                            {...register("name", {
                                required: "플랫폼 이름을 입력해주세요",
                            })}
                            placeholder="플랫폼 이름" 
                        />
                        {errors.name && (
                            <Text fontSize="sm" color="red.500">
                                {errors.name.message}
                            </Text>
                        )}
                        <Button 
                            colorScheme="blue" 
                            w="100%" 
                            type="submit"
                            mt={4}
                        >
                            추가하기
                        </Button>
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}

