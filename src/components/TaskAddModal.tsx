import { IPlatform, ITaskAdd } from "@/types";
import { addTask, getPlatforms } from "../api";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/modal";
import { Button, Input, Select, Text, VStack, FormControl, FormLabel, Textarea } from "@chakra-ui/react";
import { useToast } from '@chakra-ui/toast';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import PlatformAddModal from "./PlatformAddModal";



interface TaskAddModalProps {    
    isOpen: boolean;
    onClose: () => void;
}

export default function TaskAddModal({ isOpen, onClose }: TaskAddModalProps) {
    const [isPlatformAddModalOpen, setIsPlatformAddModalOpen] = useState(false);
    const { data: platforms, isLoading: isPlatformsLoading } = useQuery({
        queryKey: ['platforms'],
        queryFn: getPlatforms,
    });
    const { register, handleSubmit, reset, formState: { errors } } = useForm<ITaskAdd>();
    const toast = useToast();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: addTask,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            queryClient.invalidateQueries({ queryKey: ['tasksTotal'] });
            toast({
                title: "체험단이 추가되었습니다.",
                status: "success",
                position: "bottom-right",
            });
            onClose();
            reset();
            navigate("/");
        },
    })

    const onSubmit = (data: ITaskAdd) => {
        // 날짜 데이터 포맷팅
        const formattedData = {
            ...data,
            created_at: new Date(data.created_at).toISOString().split('T')[0],
            due_date: new Date(data.due_date).toISOString().split('T')[0]
        };

        console.log(formattedData);
        
        mutation.mutate(formattedData);
    };

    if (isPlatformsLoading) return <div>Loading...</div>;

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                <ModalHeader>
                    <Text>체험단 추가</Text>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody as="form" onSubmit={handleSubmit(onSubmit)}>
                    <VStack spacing={4}>
                        <Select 
                            placeholder="플랫폼 선택"
                            {...register("platform_id", {
                                required: "플랫폼을 선택해주세요",
                            })}
                        >
                            {platforms?.map((platform: IPlatform) => (
                                <option key={platform.id} value={platform.id}>{platform.name}</option>
                            ))}
                        </Select>
                        
                        <Button 
                            size="sm" 
                            colorScheme="teal" 
                            width="100%"
                            onClick={() => {
                                onClose();
                                setIsPlatformAddModalOpen(true);
                            }}
                            mb={4}
                        >
                            새 플랫폼 추가 +
                        </Button>

                        <Input 
                            {...register("client", {
                                required: "업체명을 입력해주세요",
                            })}
                            placeholder="업체명" 
                        />

                        <Input 
                            {...register("task_name", {
                                required: "제공 내용을 입력해주세요",
                            })}
                            placeholder="제공 내용(ex 영화 1편 시청, 파스타 2인분 등)" 
                        />

                        <FormControl display="flex" alignItems="center" justifyContent="space-between">
                            <FormLabel mb="0">선정일</FormLabel>
                            <Input 
                                type="date"
                                {...register("created_at", {
                                    required: "선정일을 선택해주세요",
                                })}
                                width="300px"
                            />
                        </FormControl>

                        <FormControl display="flex" alignItems="center" justifyContent="space-between">
                            <FormLabel mb="0">마감일</FormLabel>
                            <Input 
                                type="date"
                                {...register("due_date", {
                                    required: "마감일을 선택해주세요",
                                })}
                                width="300px"
                            />
                        </FormControl>

                        <Select 
                            placeholder="타입 선택"
                            {...register("type", {
                                required: "타입을 선택해주세요",
                            })}
                        >
                            <option value="food">음식</option>
                            <option value="stuff">물품</option>
                            <option value="activity">활동</option>
                        </Select>

                        <Input 
                            type="number"
                            {...register("money", {
                                required: "금액을 입력해주세요",
                                min: {
                                    value: 0,
                                    message: "0 이상의 금액을 입력해주세요"
                                }
                            })}
                            placeholder="금액" 
                        />

                        <Textarea 
                            {...register("note")}
                            placeholder="참고사항 (선택사항)"
                            minHeight="100px"  // 기본 높이 설정
                            resize="vertical"  // 수직 리사이즈만 가능하도록 설정
                        />

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

            <PlatformAddModal 
                isOpen={isPlatformAddModalOpen} 
                onClose={() => {
                    setIsPlatformAddModalOpen(false);
                    onClose();
                }} 
            />
        </>
    );
}