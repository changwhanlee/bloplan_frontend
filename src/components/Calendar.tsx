import { Box, Grid, Text, VStack, HStack, IconButton, Button, SimpleGrid } from "@chakra-ui/react";
import { ITask } from "../types";
import { FaCaretSquareLeft, FaCaretSquareRight, FaPlus } from "react-icons/fa";
import React, { useState, useRef } from 'react';
import TaskModal from './TaskModal';
import TaskAddModal from './TaskAddModal';
import DateTasksModal from './DateTaskModal';

interface CalendarProps {
    tasks: ITask[];
    isDemo?: boolean;
}

export default function Calendar({ tasks, isDemo = false }: CalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [filterStatus, setFilterStatus] = useState<string[]>([]);
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTaskAddModalOpen, setIsTaskAddModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isDateTasksModalOpen, setIsDateTasksModalOpen] = useState(false);

    const taskRefs = useRef<Map<string, React.RefObject<HTMLDivElement>>>(new Map());
    
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };
    
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    const calendar = [];
    const startDay = firstDay.getDay();
    const totalDays = startDay + lastDay.getDate();
    const totalWeeks = Math.ceil(totalDays / 7);
    const totalCells = totalWeeks * 7;
    const nextMonthDays = totalCells - (lastDay.getDate() + startDay);
    
    // 이전 달의 날짜들
    for (let i = startDay - 1; i >= 0; i--) {
        const prevMonthLastDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
        const day = prevMonthLastDate.getDate() - i;
        calendar.push(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, day));
    }
    
    // 현재 달의 날짜들
    for (let i = 1; i <= lastDay.getDate(); i++) {
        calendar.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
    }
    
    // 다음 달의 날짜들
    for (let i = 1; i <= nextMonthDays; i++) {
        calendar.push(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, i));
    }

    // 특정 날짜의 task 위치 계산을 위한 함수
    const getAllTasksOrder = () => {
        // 모든 태스크의 순서를 결정하기 위해 시작일 기준으로 정렬
        return [...tasks].sort((a, b) => 
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
    };

    const getTaskPosition = (task: ITask) => {
        const allTasks = getAllTasksOrder();
        return allTasks.findIndex(t => t.id === task.id);
    };

    const getTasksForDate = (date: Date) => {
        if (!date) return [];
        return tasks.filter(task => {
            const taskEnd = new Date(task.due_date);
            
            const compareDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            const compareEnd = new Date(taskEnd.getFullYear(), taskEnd.getMonth(), taskEnd.getDate());

            const isEndDate = compareDate.getTime() === compareEnd.getTime();

            // 취소와 만료 상태 제외
            if (task.status === 'cancelled' || task.status === 'expired') {
                return false;
            }

            if (filterStatus.length === 0) return isEndDate;
            
            return isEndDate && filterStatus.includes(task.status);
        }).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    };

    // 공휴일 목록 추가
    const holidays = [
        { month: 1, day: 1, name: "신정" },
        { month: 3, day: 1, name: "삼일절" },
        { month: 5, day: 5, name: "어린이날" },
        { month: 6, day: 6, name: "현충일" },
        { month: 8, day: 15, name: "광복절" },
        { month: 10, day: 3, name: "개천절" },
        { month: 10, day: 9, name: "한글날" },
        { month: 12, day: 25, name: "크리스마스" }
    ];

    // 공휴일 체크 함수 추가
    const isHoliday = (date: Date) => {
        return holidays.some(holiday => 
            holiday.month === date.getMonth() + 1 && 
            holiday.day === date.getDate()
        );
    };

    // 추가 헬퍼 함수들
    const isFirstDayOfTask = (date: Date, task: ITask) => {
        const taskStart = new Date(task.created_at);
        return date.getDate() === taskStart.getDate() && 
               date.getMonth() === taskStart.getMonth() && 
               date.getFullYear() === taskStart.getFullYear();
    };

    const isLastDayOfTask = (date: Date, task: ITask) => {
        const taskEnd = new Date(task.due_date);
        return date.getDate() === taskEnd.getDate() && 
               date.getMonth() === taskEnd.getMonth() && 
               date.getFullYear() === taskEnd.getFullYear();
    };

    const getBorderRadius = (date: Date, task: ITask) => {
        const isFirst = isFirstDayOfTask(date, task);
        const isLast = isLastDayOfTask(date, task);
        
        if (isFirst && isLast) return '4px';
        if (isFirst) return '4px 0 0 4px';
        if (isLast) return '0 4px 4px 0';
        return '0';
    };

    // 색상 배열 추가
    const taskColors = [
        "blue.200",
        "green.200",
        "purple.200",
        "pink.200",
        "orange.200",
        "teal.200",
        "yellow.200",
        "red.200",
        "cyan.200",
        "gray.200"
    ];

    // task의 색상을 결정하는 함수 추가
    const getTaskColor = (task: ITask) => {
        if (task.status === 'in_progress') {
            return {
                bg: '#ffffe6',
                border: 'none',
                borderColor: 'green.500',
                _hover: {
                    bg: '#e6ffcc',
                    transform: 'translateY(-2px)',
                    boxShadow: 'md'
                }
            };
        }
        if (task.status === 'completed') {
            return {
                bg: '#e6e6ff',
                border: 'none',
                borderColor: 'purple.500',
                _hover: {
                    bg: '#d1d1ff',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }
            };
        }
        const position = getTaskPosition(task);
        return {
            bg: taskColors[position % taskColors.length],
            border: 'none',
            borderColor: 'transparent'
        };
    };

    const handleTaskClick = (taskId: string) => {
        if (isDemo) return;
        setSelectedTaskId(taskId);
        setIsModalOpen(true);
    };

    const handleFilterClick = (status: string | null) => {
        if (status === null) {
            // "이번달 전체" 클릭시
            setFilterStatus([]);
            return;
        }

        if (filterStatus.includes(status)) {
            // 이미 선택된 상태라면 제거
            setFilterStatus(filterStatus.filter(s => s !== status));
        } else {
            // 새로운 상태 추가
            setFilterStatus([...filterStatus, status]);
        }
    };

    return (
        <>
            <VStack 
                gap={4} 
                mt={6}
                border="3px solid"
                borderColor="black"
                borderRadius="lg"
                boxShadow="sm" 
                p={2}
                w="95%"
                bg="white"
                alignItems="center"
                pointerEvents={isDemo ? "none" : "auto"}
            >
                <HStack mt={2}>
                    <IconButton
                        aria-label="Previous month"
                        onClick={handlePrevMonth}
                        isDisabled={isDemo}
                    >
                        <FaCaretSquareLeft />
                    </IconButton>
                    <Text fontSize="xl" fontWeight="bold">
                        {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </Text>
                    <IconButton
                        aria-label="Next month"
                        onClick={handleNextMonth}
                        isDisabled={isDemo}
                    >
                        <FaCaretSquareRight />
                    </IconButton>
                </HStack>
                {!isDemo && (
                    <Box width="100%" display="flex" justifyContent="flex-end">
                        <Button
                            leftIcon={<FaPlus />}
                            colorScheme="blue"
                            variant="outline"
                            onClick={() => setIsTaskAddModalOpen(true)}
                        >
                            체험단 추가하기
                        </Button>
                    </Box>
                )}

                <SimpleGrid 
                    columns={{ base: 1, lg: 2 }} 
                    spacing={4} 
                    width="100%" 
                    p={4}
                    pointerEvents={isDemo ? "none" : "auto"}
                    opacity={isDemo ? 0.7 : 1}
                >
                    {/* 왼쪽 영역: 상태별 태스크 현황 */}
                    <SimpleGrid 
                        columns={{ base: 1, sm: 2, md: 3 }}
                        spacing={4}
                    >
                        <HStack
                            cursor="pointer"
                            onClick={() => handleFilterClick(null)}
                            bg={filterStatus.length === 0 ? "blue.100" : "transparent"}
                            p={2}
                            borderRadius="md" 
                            border="1px solid"
                            borderColor={filterStatus.length === 0 ? "blue.300" : "gray.300"}
                            _hover={{
                                borderColor: "blue.300",
                                boxShadow: "sm"
                            }}
                        >
                            <Text fontWeight="medium">이번 달 전체:</Text>
                            <Text color="blue.500" fontSize="lg" fontWeight="bold">
                                {tasks.filter(task => {
                                    const taskStart = new Date(task.created_at);
                                    const taskEnd = new Date(task.due_date);
                                    const currentMonth = currentDate.getMonth();
                                    const currentYear = currentDate.getFullYear();

                                    return (
                                        (taskStart.getMonth() === currentMonth && taskStart.getFullYear() === currentYear) ||
                                        (taskEnd.getMonth() === currentMonth && taskEnd.getFullYear() === currentYear) ||
                                        (taskStart <= new Date(currentYear, currentMonth, 1) && 
                                        taskEnd >= new Date(currentYear, currentMonth + 1, 0))
                                    ) && 
                                    task.status !== 'cancelled' && 
                                    task.status !== 'expired';
                                }).length}건
                            </Text>
                        </HStack>
                        <HStack
                            cursor="pointer"
                            onClick={() => handleFilterClick('in_progress')}
                            bg={filterStatus.includes('in_progress') ? "green.100" : "transparent"}
                            p={2}
                            borderRadius="md"
                            border="1px solid"
                            borderColor={filterStatus.includes('in_progress') ? "green.300" : "gray.300"}
                            _hover={{
                                borderColor: "green.300",
                                boxShadow: "sm"
                            }}
                        >
                            <Text fontWeight="medium">진행중:</Text>
                            <Text color="green.500" fontSize="lg" fontWeight="bold">
                                {tasks.filter(task => {
                                    const taskStart = new Date(task.created_at);
                                    const taskEnd = new Date(task.due_date);
                                    const currentMonth = currentDate.getMonth();
                                    const currentYear = currentDate.getFullYear();

                                    return (
                                        ((taskStart.getMonth() === currentMonth && taskStart.getFullYear() === currentYear) ||
                                        (taskEnd.getMonth() === currentMonth && taskEnd.getFullYear() === currentYear) ||
                                        (taskStart <= new Date(currentYear, currentMonth, 1) && 
                                        taskEnd >= new Date(currentYear, currentMonth + 1, 0))) &&
                                        task.status === 'in_progress'
                                    );
                                }).length}건
                            </Text>
                        </HStack>
                        <HStack
                            cursor="pointer"
                            onClick={() => handleFilterClick('completed')}
                            bg={filterStatus.includes('completed') ? "purple.100" : "transparent"}
                            p={2}
                            borderRadius="md"
                            border="1px solid"
                            borderColor={filterStatus.includes('completed') ? "purple.300" : "gray.300"}
                            _hover={{
                                borderColor: "purple.300",
                                boxShadow: "sm"
                            }}
                        >
                            <Text fontWeight="medium">완료:</Text>
                            <Text color="purple.500" fontSize="lg" fontWeight="bold">
                                {tasks.filter(task => {
                                    const taskStart = new Date(task.created_at);
                                    const taskEnd = new Date(task.due_date);
                                    const currentMonth = currentDate.getMonth();
                                    const currentYear = currentDate.getFullYear();

                                    return (
                                        ((taskStart.getMonth() === currentMonth && taskStart.getFullYear() === currentYear) ||
                                        (taskEnd.getMonth() === currentMonth && taskEnd.getFullYear() === currentYear) ||
                                        (taskStart <= new Date(currentYear, currentMonth, 1) && 
                                        taskEnd >= new Date(currentYear, currentMonth + 1, 0))) &&
                                        task.status === 'completed'
                                    );
                                }).length}건
                            </Text>
                        </HStack>
                        
                        
                    </SimpleGrid>

                    {/* 오른쪽 영역: 이번 달 달성 */}
                    <Box>
                        <HStack 
                            justify={{ base: "center", lg: "flex-end" }}
                            alignItems="center"
                            height="100%"
                            >
                            <Text fontWeight="bold" fontSize="2xl">이번 달 달성 (완료 기준) : </Text>
                            <Text color="blue.600" fontSize="2xl" fontWeight="bold" ml={2}>
                                {tasks.filter(
                                    task => {
                                        const taskEnd = new Date(task.due_date);
                                        const currentMonth = currentDate.getMonth();
                                        const currentYear = currentDate.getFullYear();

                                        return (
                                            taskEnd.getMonth() === currentMonth &&
                                            taskEnd.getFullYear() === currentYear &&
                                            task.status === 'completed'
                                        );
                                    })
                                    .reduce((sum, task) => sum + (task.money || 0), 0)
                                    .toLocaleString()}원
                            </Text>
                        </HStack>
                    </Box>
                </SimpleGrid>

                <Grid templateColumns="repeat(7, 1fr)" gap="1px 0" width="100%">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                        <Box 
                            key={day} 
                            textAlign="center" 
                            height="30px" 
                            bg="#baf7ad"
                            display="flex"         // flex container로 설정
                            alignItems="center"    // 세로 가운데 정렬
                            justifyContent="center" // 가로 가운데 정
                            border="1px solid"
                            borderColor="gray.200"
                        >
                            <Text 
                                fontWeight="bold"
                                color={
                                    day === "Sun"
                                    ? "red.500"
                                    : day === "Sat"
                                    ? "blue.500"
                                    : "inherit"
                                }
                            >{day}</Text>
                        </Box>
                    ))}
                    
                    {calendar.map((date, index) => (
                        <Box 
                            key={`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${index}`}
                            p={0} 
                            border="0.5px"
                            borderColor={
                                date.getDate() === new Date().getDate() && 
                                date.getMonth() === new Date().getMonth() && 
                                date.getFullYear() === new Date().getFullYear()
                                ? "red.500"  // 오늘인 경우 빨간색
                                : "gray.300" // 그 외의 경우 기존 색상
                            }
                            borderWidth={
                                date.getDate() === new Date().getDate() && 
                                date.getMonth() === new Date().getMonth() && 
                                date.getFullYear() === new Date().getFullYear()
                                    ? "2px"     // 오늘인 경우 더 두껍게
                                    : "0.5px"   // 그 외의 경우 기존 두께
                            }
                            height="100%"
                            overflow="hidden"
                            minH="200px"
                            boxShadow="sm"
                            _hover={{
                                borderColor: "gray.300",
                                boxShadow: "md"
                            }}
                        >
                            {date && (
                                <>
                                    <Text
                                        ml={1} 
                                        mb={2} 
                                        display="inline-flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        width="24px"
                                        height="24px"
                                        borderRadius="full"
                                        backgroundColor={isHoliday(date) ? "red.500" : "transparent"}
                                        color={
                                            isHoliday(date) 
                                                ? "white" 
                                                : date.getMonth() !== currentDate.getMonth()
                                                    ? "gray.400"
                                                    : index % 7 === 0
                                                        ? "red.500"
                                                            : index % 7 === 6
                                                                ? "blue.500"
                                                            : "inherit"
                                        }
                                        fontWeight={date.getMonth() === currentDate.getMonth() ? "bold" : "normal"}
                                        transition="all 0.2s"
                                        _hover={{
                                            transform: "scale(1.1)"
                                        }}
                                    >
                                        {date.getDate()}
                                        
                                    </Text>
                                    {date.getDate() === new Date().getDate() && 
                                            date.getMonth() === new Date().getMonth() && 
                                            date.getFullYear() === new Date().getFullYear() && (
                                                <Text as="span" ml={3} color="red.500" fontSize="sm" fontWeight="bold">
                                                    오늘
                                                </Text>
                                    )}
                                    <VStack 
                                        align="stretch" 
                                        gap={1}
                                        height="100%"
                                        overflow="auto"
                                    >
                                        {(() => {
                                            const dateTasks = getTasksForDate(date);
                                            const visibleTasks = dateTasks.slice(0, 4);
                                            const remainingCount = dateTasks.length - 4;

                                            return (
                                                <>
                                                    {visibleTasks.map((task) => {
                                                        const taskId = task.id.toString();
                                                        if (!taskRefs.current.has(taskId)) {
                                                            taskRefs.current.set(taskId, React.createRef());
                                                        }
                                                        const taskRef = taskRefs.current.get(taskId);
                                                        return (
                                                        <Box
                                                            key={taskId}
                                                            ref={taskRef}
                                                            p={1}
                                                            bg={getTaskColor(task).bg}
                                                            border={getTaskColor(task).border}
                                                            borderColor={getTaskColor(task).borderColor}
                                                            borderRadius="sm"
                                                            fontSize="sm"
                                                            onClick={() => handleTaskClick(taskId)}
                                                            cursor="pointer"
                                                            style={{
                                                                order: getTaskPosition(task),
                                                                width: '90%',
                                                                margin: '0 auto',
                                                                transition: 'transform 0.2s',
                                                            }}
                                                            _hover={getTaskColor(task)._hover}
                                                        >
                                                            {task.client}
                                                        </Box>
                                                        );
                                                    })}
                                                    {remainingCount > 0 && (
                                                        <Box
                                                            p={1}
                                                            color="blue.500"
                                                            borderRadius="sm"
                                                            fontSize="xs"
                                                            textAlign="center"
                                                            cursor="pointer"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedDate(date);
                                                                setIsDateTasksModalOpen(true);
                                                            }}
                                                            _hover={{ color: 'blue.700' }}
                                                            style={{ order: 9999 }}
                                                        >
                                                            {remainingCount}개 더보기
                                                        </Box>
                                                    )}
                                                </>
                                            );
                                        })()}
                                    </VStack>
                                </>
                            )}
                        </Box>
                    ))}
                </Grid>
            </VStack>
            {!isDemo && (
                <>
                    <TaskModal 
                        isOpen={isModalOpen} 
                        onClose={() => setIsModalOpen(false)} 
                        taskId={selectedTaskId}
                    />
                    <TaskAddModal 
                        isOpen={isTaskAddModalOpen} 
                        onClose={() => setIsTaskAddModalOpen(false)} 
                    />
                    {selectedDate && (
                        <DateTasksModal 
                            isOpen={isDateTasksModalOpen}
                            onClose={() => setIsDateTasksModalOpen(false)}
                            tasks={getTasksForDate(selectedDate)}
                            date={selectedDate}
                        />
                    )}
                </>
            )}
        </>
    );
}
