import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from "@chakra-ui/modal";
import { Button, Input, Select, Text, VStack, HStack, FormControl, FormLabel, Textarea, Grid, GridItem, Badge, Box, Icon } from "@chakra-ui/react";
import { useToast } from '@chakra-ui/toast';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { FaArrowRight } from "react-icons/fa";
import { IPlatform, ITask, ITaskAdd } from "@/types";
import { getPlatforms, ModifyTask } from "../api";

interface TaskEditModalProps {    
    isOpen: boolean;
    onClose: () => void;
    task: ITask;
}

export const TaskEditModal = ({ isOpen, onClose, task }: TaskEditModalProps) => {

    const { data: platforms, isLoading: isPlatformsLoading } = useQuery({
        queryKey: ['platforms'],
        queryFn: getPlatforms,
    });

    const { register, handleSubmit, reset, formState: { errors } } = useForm<ITaskAdd>({
        defaultValues: {
            platform_id: task.platform.id,
            client: task.client,
            task_name: task.task_name,
            created_at: task.created_at.split('T')[0],
            due_date: task.due_date.split('T')[0],
            type: task.type,
            money: task.money,
            note: task.note,
        },
    });

    const toast = useToast();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (data: ITaskAdd) => ModifyTask(task.id.toString(), data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            queryClient.invalidateQueries({ queryKey: ['task', task.id] });
            toast({
                title: "체험단이 수정되었습니다.",
                status: "success",
                position: "bottom-right",
            });
            onClose();
        },
        onError: (error) => {
            toast({
                title: "체험단 수정 실패",
                description: error.message,
                status: "error",
                position: "bottom-right",
            });
        },
    });

    const onSubmit = (data: ITaskAdd) => {
        const formattedData = {
            ...data,
            created_at: new Date(data.created_at).toISOString().split('T')[0],
            due_date: new Date(data.due_date).toISOString().split('T')[0],
        };
        mutation.mutate(formattedData);
    }

    return(
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent maxWidth="800px" bg="cyan.50">
                <ModalHeader textAlign="center">
                    <Text>체험단 수정</Text>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack>
                        <Grid templateColumns="1fr auto 1fr" gap={4} alignItems="start" mt={4} width="90%"  >
                            {/* 현재 값 */}
                            <GridItem width="100%" borderWidth={1} borderRadius="md" p={4} bg="white">
                                <Text fontWeight="bold" ml={4} textAlign="center" mb={4}>현재 정보</Text>
                                <VStack spacing={4} align="stretch">
                                    <HStack justify="space-between">
                                        <Box p={2} borderWidth={1} borderRadius="md" width="35%" textAlign="center" height="40px">
                                            <Text fontWeight="bold">플랫폼</Text>
                                        </Box>
                                        <Box p={2} borderWidth={1} borderRadius="md" width="60%" textAlign="center" height="40px">
                                            <Text>{task.platform.name}</Text>
                                        </Box>
                                    </HStack>
                                    <HStack justify="space-between">
                                        <Box p={2} borderWidth={1} borderRadius="md" width="35%" textAlign="center" height="40px">
                                            <Text fontWeight="bold">업체명</Text>
                                        </Box>
                                        <Box p={2} borderWidth={1} borderRadius="md" width="60%" textAlign="center" height="40px">
                                            <Text>{task.client}</Text>
                                        </Box>
                                    </HStack>
                                    <HStack justify="space-between">
                                        <Box p={2} borderWidth={1} borderRadius="md" width="35%" textAlign="center" height="40px">
                                            <Text fontWeight="bold">제공 내용</Text>
                                        </Box>
                                        <Box p={2} borderWidth={1} borderRadius="md" width="60%" textAlign="center" height="40px">
                                            <Text>{task.task_name}</Text>
                                        </Box>
                                    </HStack>
                                    <HStack justify="space-between">
                                        <Box p={2} borderWidth={1} borderRadius="md" width="35%" textAlign="center" height="40px">
                                            <Text fontWeight="bold">선정일</Text>
                                        </Box>
                                        <Box p={2} borderWidth={1} borderRadius="md" width="60%" textAlign="center" height="40px">
                                            <Text>{new Date(task.created_at).toLocaleDateString()}</Text>
                                        </Box>
                                    </HStack>
                                    <HStack justify="space-between">
                                        <Box p={2} borderWidth={1} borderRadius="md" width="35%" textAlign="center" height="40px">
                                            <Text fontWeight="bold">마감일</Text>
                                        </Box>
                                        <Box p={2} borderWidth={1} borderRadius="md" width="60%" textAlign="center" height="40px">
                                            <Text>{new Date(task.due_date).toLocaleDateString()}</Text>
                                        </Box>
                                    </HStack>
                                    <HStack justify="space-between">
                                        <Box p={2} borderWidth={1} borderRadius="md" width="35%" textAlign="center" height="40px">
                                            <Text fontWeight="bold">타입</Text>
                                        </Box>
                                        <Box p={2} borderWidth={1} borderRadius="md" width="60%" textAlign="center" height="40px">
                                            <Text>{task.type}</Text>
                                        </Box>
                                    </HStack>
                                    <HStack justify="space-between">
                                        <Box p={2} borderWidth={1} borderRadius="md" width="35%" textAlign="center" height="40px">
                                            <Text fontWeight="bold">금액</Text>
                                        </Box>
                                        <Box p={2} borderWidth={1} borderRadius="md" width="60%" textAlign="center" height="40px">
                                            <Text>{task.money.toLocaleString()}원</Text>
                                        </Box>
                                    </HStack>
                                </VStack>
                            </GridItem>

                            {/* 화살표 */}
                            <GridItem display="flex" alignItems="center" justifyContent="center" height="100%">
                                <Icon as={FaArrowRight} w={6} h={6} color="blue.500" />
                            </GridItem>

                            {/* 수정 폼 */}
                            <GridItem as="form" onSubmit={handleSubmit(onSubmit)} borderWidth={1} borderRadius="md" p={4} bg="white">
                                <Text fontWeight="bold" ml={4} textAlign="center" mb={4}>수정 정보</Text>
                                <VStack spacing={4}>
                                    <Select 
                                        {...register("platform_id")}
                                        placeholder="플랫폼 선택"
                                        height="40px"
                                    >
                                        {platforms?.map((platform: IPlatform) => (
                                            <option key={platform.id} value={platform.id}>
                                                {platform.name}
                                            </option>
                                        ))}
                                    </Select>

                                    <Input 
                                        {...register("client")}
                                        placeholder="업체명" 
                                        height="40px"
                                    />

                                    <Input 
                                        {...register("task_name")}
                                        placeholder="제공 내용" 
                                        height="40px"
                                    />

                                    <FormControl>
                                        <Input 
                                            type="date"
                                            {...register("created_at")}
                                            height="40px"
                                        />
                                    </FormControl>

                                    <FormControl>
                                        
                                        <Input 
                                            type="date"
                                            {...register("due_date")}
                                            height="40px"
                                        />
                                    </FormControl>

                                    <Select 
                                        {...register("type")}
                                        placeholder="타입 선택"
                                        height="40px"
                                    >
                                        <option value="food">음식</option>
                                        <option value="stuff">물품</option>
                                        <option value="activity">활동</option>
                                    </Select>

                                    <Input 
                                        type="number"
                                        {...register("money")}
                                        placeholder="금액" 
                                        height="40px"
                                    />
                                </VStack>
                                <Button 
                                    mt={4}
                                    colorScheme="blue" 
                                    w="100%" 
                                    type="submit"
                                    
                                >
                                    수정하기
                                </Button>
                            </GridItem>
                        </Grid>
                        
                    </VStack>
                    
                    
                </ModalBody>
            </ModalContent>
        </Modal>
    )

}
