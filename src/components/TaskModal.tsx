import { ITask } from "../types";
import { deleteTask, getTaskDetail, updateTaskStatus } from "../api";
import { 
    Modal, 
    ModalOverlay, 
    ModalContent, 
    ModalHeader, 
    ModalCloseButton, 
    ModalBody, 
    Text,
    Badge,
    HStack,
    IconButton,
    VStack,
    Grid,
    GridItem,
    Tooltip,
    useToast,
    Menu,
    MenuButton,
    Button,
    MenuItem,
    MenuList,
    Box,
    useDisclosure,
    AlertDialog,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    AlertDialogBody,
    AlertDialogFooter
} from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FaEdit, FaTrash, FaTimes, FaChevronDown, FaEllipsisV, FaCheck, FaExclamationTriangle, FaPlay } from "react-icons/fa";
import { useRef, useState } from "react";
import { TaskEditModal } from "./TaskEditModal";

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    taskId: string | null;
}

export default function TaskModal({ isOpen, onClose, taskId }: TaskModalProps) {
    const { isOpen: isDeleteAlertOpen, onOpen: onDeleteAlertOpen, onClose: onDeleteAlertClose } = useDisclosure(); 
    const { 
        isOpen: isCancelAlertOpen, 
        onOpen: onCancelAlertOpen, 
        onClose: onCancelAlertClose 
    } = useDisclosure();
 
    const cancelRef = useRef<HTMLButtonElement>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const { data: task, isLoading, error } = useQuery<ITask, Error>({
        queryKey: ['task', taskId],
        queryFn: () => taskId ? getTaskDetail(taskId) : Promise.reject('No taskId'),
        enabled: !!taskId,
    });

    const toast = useToast();
    const queryClient = useQueryClient();

    const statusMutation = useMutation({
        mutationFn: ({ taskId, status }: { taskId: string; status: string }) => 
            updateTaskStatus(taskId, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['task', taskId] });
            queryClient.invalidateQueries({ queryKey: ['tasks'] }); // 캘린더 view 갱신
            queryClient.invalidateQueries({ queryKey: ['tasksTotal'] }); // 캘린더 view 갱신
            toast({
                title: "상태가 변경되었습니다.",
                status: "success",
                duration: 2000,
                isClosable: true,
            });
        },
        onError: (error) => {
            toast({
                title: "상태 변경 실패",
                description: "다시 시도해주세요.",
                status: "error",
                duration: 2000,
                isClosable: true,
            });
        },
    });

    const handleStatusChange = (newStatus: string) => {
        if (newStatus === 'cancelled') {
            onCancelAlertOpen();
            return;
        }
        if (taskId) {
            statusMutation.mutate({ taskId, status: newStatus });
        }
    };

    const handleCancelConfirm = () => {
        if (taskId) {
            statusMutation.mutate({ taskId, status: 'cancelled' });
            onCancelAlertClose();
        }
    };


    const deleteMutation = useMutation({
        mutationFn: (taskId: string) => deleteTask(taskId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            queryClient.invalidateQueries({ queryKey: ['tasksTotal'] });
            toast({
                title: "태스크가 삭제되었습니다.",
                status: "success",
                duration: 2000,
                isClosable: true,
            });
            onClose();
        },
        onError: (error) => {
            toast({
                title: "삭제 실패",
                description: "다시 시도해주세요.",
                status: "error",
                duration: 2000,
                isClosable: true,
            });
        },
    });

    const handleDelete = () => {
        if (taskId) {
            deleteMutation.mutate(taskId);
            onDeleteAlertClose();
        }
    };

    if (error) {
        console.error('Error fetching task details:', error);
    }
    if (isLoading) {
        return <Text></Text>;
    }

    const StatusMenu = () => {
        if (!task) return null;

        if (task.status === 'in_progress') {
            return(
                <Menu>
                    <MenuButton 
                        as={IconButton} 
                        aria-label="상태 변경"
                        icon={<FaEllipsisV />}
                        variant="ghost"
                        size="sm"
                        ml={2} 
                    />
                    
                    <MenuList
                        width="80px"
                    >
                        <MenuItem
                            icon={<FaCheck />}
                            onClick={() => handleStatusChange('completed')}
                            color="blue.500"
                            fontSize="sm"
                        >
                            완료로 변경
                        </MenuItem>
                        <MenuItem
                            icon={<FaTimes />}
                            onClick={() => handleStatusChange('cancelled')}
                            color="red.500"
                            fontSize="sm"
                        >
                            취소로 변경
                        </MenuItem>
                    </MenuList>
                </Menu>
            );
        }

        if (task.status === 'completed') {
            return (
                <Menu>
                    <MenuButton
                        as={IconButton}
                        icon={<FaEllipsisV />}
                        variant="ghost"
                        size="sm"
                        aria-label="상태 변경"
                        ml={2}
                    />
                    <MenuList>
                        <MenuItem
                            icon={<FaTimes />}
                            onClick={() => handleStatusChange('cancelled')}
                            color="red.500"
                            fontSize="sm"
                        >
                            취소로 변경
                        </MenuItem>
                        <MenuItem
                            icon={<FaPlay />}
                            onClick={() => handleStatusChange('in_progress')}
                            color="green.500"
                            fontSize="sm"
                        >
                            진행 중으로 변경
                        </MenuItem>
                    </MenuList>
                </Menu>
            );
        }

        return null;
    }

    if (task) {


        const getStatusBadge = (status: string) => {
            switch (status) {
                case 'in_progress': 
                    return <Badge colorScheme="green" fontSize="lg" fontWeight="bold" borderRadius="lg" px={4} py={1}>진행 중</Badge>;
                case 'completed': 
                    return <Badge colorScheme="blue" fontSize="lg" fontWeight="bold" borderRadius="lg" px={4} py={1}>완료</Badge>;
                case 'cancelled': 
                    return <Badge colorScheme="red" fontSize="lg" fontWeight="bold" borderRadius="lg" px={4} py={1}>취소</Badge>;
                case 'expired':
                    return <Badge colorScheme="orange" fontSize="lg" fontWeight="bold" borderRadius="lg" px={4} py={1}>만료</Badge>;
                default: 
                    return null;
            }
        }

        return (
            <>
                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                    <ModalHeader>
                        <HStack justifyContent='space-between'>
                            <HStack>
                                {task && getStatusBadge(task.status)}
                                <StatusMenu />
                            </HStack>
                            <HStack spacing={3}>
                                <Tooltip label="수정하기" hasArrow shouldWrapChildren>
                                    <IconButton 
                                        aria-label='Edit' 
                                        icon={<FaEdit />} 
                                        onClick={() => setIsEditModalOpen(true)}
                                    />
                                </Tooltip>
                                {task && <TaskEditModal 
                                    isOpen={isEditModalOpen} 
                                    onClose={() => setIsEditModalOpen(false)} 
                                    task={task}
                                />}
                                
                                <Tooltip label="삭제하기" hasArrow>
                                    <IconButton 
                                        aria-label='Delete' 
                                        icon={<FaTrash />}
                                        onClick={onDeleteAlertOpen}
                                    />
                                </Tooltip>
                                <IconButton aria-label='Close' icon={<FaTimes />} onClick={onClose} />                                
                            </HStack>
                        </HStack>
                    </ModalHeader>
                    <ModalBody>
                        <VStack 
                            align="start" 
                            spacing={6} 
                            p={6} 
                            borderWidth={1} 
                            borderRadius="xl" 
                            boxShadow="xl" 
                            bg="white"
                            w="full"
                        >
                            <Grid templateColumns="1fr 2fr" gap={6} width="100%">
                                <GridItem>
                                    <VStack align="start" spacing={6} height="100%">
                                        <Text fontSize="sm" fontWeight="semibold" color="gray.500" height="24px" lineHeight="24px" textAlign="center" width="100%">업체</Text>
                                        <Text fontSize="sm" fontWeight="semibold" color="gray.500" height="24px" lineHeight="24px" textAlign="center" width="100%">플랫폼</Text>
                                        <Text fontSize="sm" fontWeight="semibold" color="gray.500" height="24px" lineHeight="24px" textAlign="center" width="100%">제공 내용</Text>
                                        <Text fontSize="sm" fontWeight="semibold" color="gray.500" height="24px" lineHeight="24px" textAlign="center" width="100%">제공 가치</Text>
                                        <Text fontSize="sm" fontWeight="semibold" color="gray.500" height="24px" lineHeight="24px" textAlign="center" width="100%">선정 일</Text>
                                        <Text fontSize="sm" fontWeight="semibold" color="gray.500" height="24px" lineHeight="24px" textAlign="center" width="100%">만료 일</Text>
                                        <Text fontSize="sm" fontWeight="semibold" color="gray.500" height="24px" lineHeight="24px" textAlign="center" width="100%">분야</Text>
                                    </VStack>
                                </GridItem>
                                <GridItem>
                                    <VStack align="start" spacing={6} height="100%">
                                        <Text fontSize="md" fontWeight="medium" height="24px" lineHeight="24px">{task.client}</Text>
                                        <Text fontSize="md" fontWeight="medium" height="24px" lineHeight="24px">{task.platform.name}</Text>
                                        <Text fontSize="md" fontWeight="medium" height="24px" lineHeight="24px">{task.task_name}</Text>
                                        <Text fontSize="md" fontWeight="medium" color="teal.500" height="24px" lineHeight="24px">
                                            {new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(task.money)}
                                        </Text>
                                        <Text fontSize="md" fontWeight="medium" height="24px" lineHeight="24px">
                                            {new Date(task.created_at).toLocaleDateString('ko-KR', { 
                                                year: 'numeric', 
                                                month: 'long', 
                                                day: 'numeric' 
                                            })}
                                        </Text>
                                        <Text fontSize="md" fontWeight="medium" height="24px" lineHeight="24px">
                                            {new Date(task.due_date).toLocaleDateString('ko-KR', { 
                                                year: 'numeric', 
                                                month: 'long', 
                                                day: 'numeric' 
                                            })}
                                        </Text>
                                        <Badge colorScheme="teal" px={3} borderRadius="full" height="24px" lineHeight="24px">
                                            {task.type}
                                        </Badge>
                                    </VStack>
                                </GridItem>
                            </Grid>
                        </VStack>
                    </ModalBody>
                </ModalContent>
            </Modal>

            <AlertDialog
                isOpen={isDeleteAlertOpen}
                leastDestructiveRef={cancelRef}
                onClose={onDeleteAlertClose}
            >
                <AlertDialogOverlay />
                <AlertDialogContent>
                    <AlertDialogHeader>삭제 확인</AlertDialogHeader>
                    <AlertDialogBody>
                        <Text>정말로 이 태스크를 삭제하시겠습니까?</Text>
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={onDeleteAlertClose}>취소</Button>
                        <Button colorScheme="red" onClick={handleDelete} ml={3}>삭제</Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog
                isOpen={isCancelAlertOpen}
                leastDestructiveRef={cancelRef}
                onClose={onCancelAlertClose}
            >
                <AlertDialogOverlay />
                <AlertDialogContent>
                    <AlertDialogHeader>취소 확인</AlertDialogHeader>
                    <AlertDialogBody>
                        <Text>이 체험단을 취소하시겠습니까?</Text>
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={onCancelAlertClose}>아니오</Button>
                        <Button colorScheme="red" onClick={handleCancelConfirm} ml={3}>예</Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
} 
}