import { Box, SimpleGrid, Stat, StatLabel, StatNumber, Text, VStack, HStack, Progress } from "@chakra-ui/react";
import { ITask, ITaskTotal } from "../types";
import { useState } from "react";
import TaskModal from "./TaskModal";

interface TotalStateProps { 
    tasksTotal: ITaskTotal;
    tasks: ITask[];
}

export default function TotalState({ tasksTotal, tasks }: TotalStateProps) {
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 비율 계산 함수
    console.log(tasksTotal)

    const calculatePercentage = (value: number) => {
        return ((value / tasksTotal.total) * 100).toFixed(1);
    };

    // 7일 이내 마감 예정인 테스크 필터링
    const getUpcomingTasks = () => {
        const today = new Date();
        const sevenDaysLater = new Date();
        sevenDaysLater.setDate(today.getDate() + 7);

        return tasks.filter(task => {
            const dueDate = new Date(task.due_date);
            return dueDate >= today && dueDate <= sevenDaysLater && task.status === 'in_progress';
        }).sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());
    };

    const upcomingTasks = getUpcomingTasks();

    return (
        <Box p={6} borderRadius="lg" boxShadow="sm" bg="white" mb={6} mt={6} w="95%">
            <SimpleGrid 
                columns={{ base: 1, lg: 2 }} 
                gap={6}
                templateColumns={{ base: "1fr", lg: "630px 1fr" }}
            >
                {/* 왼쪽 섹션: 주요 통계 */}
                <SimpleGrid columns={{ base: 1, lg: 2 }} gap={4}>
                    <Stat 
                        borderWidth={1} 
                        borderRadius="lg" 
                        p={5} 
                        border="2px solid" 
                        borderColor="gray.200" 
                        w={{ base: "100%", lg: "320px" }}
                    >
                        <HStack justify="center" align="center" gap={5}>
                            <VStack align="center" gap={5} >
                                <StatLabel fontSize="2xl">총 체험단 선정</StatLabel>
                                <StatNumber fontSize="4xl" color="blue.500" fontWeight="bold">{tasksTotal.total}개</StatNumber>
                                <Text fontSize="lg" color="gray.500">{tasksTotal.start_date} ~ </Text>
                            </VStack>
                            
                            <VStack align="flex-start" gap={3} color="gray.700" fontSize="md" ml={5}>
                                <HStack gap={2}>
                                    <Text fontWeight="medium">진행중:</Text>
                                    <Text color="blue.500" fontSize="lg">{tasksTotal.in_progress_count}건</Text>
                                </HStack>
                                <HStack gap={2}>
                                    <Text fontWeight="medium">완료:</Text>
                                    <Text color="green.500" fontSize="lg">{tasksTotal.completed_count}건</Text>
                                </HStack>
                                <HStack gap={2}>
                                    <Text fontWeight="medium">취소:</Text>
                                    <Text color="red.500" fontSize="lg">{tasksTotal.cancelled_count}건</Text>
                                </HStack>
                                <HStack gap={2}>
                                    <Text fontWeight="medium">만료:</Text>
                                    <Text color="orange.500" fontSize="lg">{tasksTotal.expired_count}건</Text>
                                </HStack>
                            </VStack>
                        </HStack>
                    </Stat>
                    <Stat 
                        borderWidth={1} 
                        borderColor="gray.200" 
                        borderRadius="lg" 
                        p={5} 
                        w={{ base: "100%", lg: "300px" }}
                        ml={{base: 0, lg: 5}}
                    >
                        <HStack justify="center" align="center" gap={5}>
                            <VStack align="center" gap={5}>
                                <StatLabel fontSize="2xl">달성 금액 (완료기준)</StatLabel>
                                <StatNumber fontSize="4xl" color="green.500" fontWeight="bold">
                                    {tasksTotal.completed_money.toLocaleString()}원
                                </StatNumber>
                                <Text fontSize="lg" color="gray.500">{tasksTotal.start_date} ~</Text>
                            </VStack>
                        </HStack>
                    </Stat>
                </SimpleGrid>
                <SimpleGrid columns={1} gap={4}>
                    <VStack align="stretch" width="100%" spacing={2} border="2px solid" borderColor="gray.200" borderRadius="lg" p={5}>
                        <Text fontSize="lg" fontWeight="bold" color="red.500" textAlign="center" width="100%">
                            7일 이내 마감 예정 ({upcomingTasks.length}건)
                        </Text>
                        <VStack align="stretch" maxH="150px" overflowY="auto" spacing={2}>
                            {upcomingTasks.map(task => (
                                <HStack 
                                    key={task.id} 
                                    justify="space-between" 
                                    p={2} 
                                    bg="red.50" 
                                    borderRadius="md"
                                    cursor="pointer"
                                    onClick={() => {
                                        setSelectedTaskId(task.id.toString());
                                        setIsModalOpen(true);
                                    }}
                                    _hover={{ bg: 'red.100' }}
                                >
                                    <Text fontWeight="medium">{task.client}</Text>
                                    <Text color="red.500" fontWeight="bold">
                                        ~ {new Date(task.due_date).toLocaleDateString()}
                                    </Text>
                                </HStack>
                            ))}
                        </VStack>
                    </VStack>
                </SimpleGrid>

                
            </SimpleGrid>
            <TaskModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                taskId={selectedTaskId}
            />
        </Box>
    );
}   