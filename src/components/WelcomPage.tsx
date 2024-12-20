import { Box, VStack, Text, Button, SimpleGrid, Stat, StatLabel, StatNumber, HStack, Icon, useColorModeValue } from "@chakra-ui/react";
import { FaCalendarAlt, FaChartLine, FaCheckCircle, FaBell } from "react-icons/fa";
import Calendar from "./Calendar";

export default function WelcomePage() {
    const bgColor = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.600");

    // 데모 데이터
    const demoStats = {
        total: 150,
        completed: 120,
        money: 3500000,
    };

    

    // 데모 데이터 생성
    const demoTasks = [
        {
            id: 1,
            client: "카페 A",
            task_name: "아메리카노 체험단",
            created_at: "2024-11-25",
            due_date: "2024-12-06",
            type: "food",
            money: 15000,
            status: "in_progress",
            platform: { id: 1, name: "네이버", owner: 1 },
            note: "",
            duty: [],
            owner: 1
        },
        {
            id: 2,
            client: "레스토랑 B",
            task_name: "파스타 체험단",
            created_at: "2024-11-18",
            due_date: "2024-12-28",
            type: "food",
            money: 25000,
            status: "completed",
            platform: { id: 2, name: "인스타그램", owner: 1 },
            note: "",
            duty: [],
            owner: 1
        },
        {
            id: 3,
            client: "카페 C",
            task_name: "디저트 체험단",
            created_at: "2024-03-20",
            due_date: "2024-12-11",
            type: "food",
            money: 20000,
            status: "in_progress",
            platform: { id: 1, name: "네이버", owner: 1 },
            note: "",
            duty: [],
            owner: 1
        },
        {
            id: 3,
            client: "빵집",
            task_name: "디저트 체험단",
            created_at: "2024-03-20",
            due_date: "2024-12-11",
            type: "food",
            money: 20000,
            status: "completed",
            platform: { id: 1, name: "네이버", owner: 1 },
            note: "",
            duty: [],
            owner: 1
        },
        {
            id: 3,
            client: "A 김치찌개",
            task_name: "디저트 체험단",
            created_at: "2024-03-20",
            due_date: "2024-12-11",
            type: "food",
            money: 20000,
            status: "completed",
            platform: { id: 1, name: "네이버", owner: 1 },
            note: "",
            duty: [],
            owner: 1
        },
        {
            id: 3,
            client: "방탈출 카페",
            task_name: "디저트 체험단",
            created_at: "2024-03-20",
            due_date: "2024-12-11",
            type: "food",
            money: 20000,
            status: "in_progress",
            platform: { id: 1, name: "네이버", owner: 1 },
            note: "",
            duty: [],
            owner: 1
        },
        {
            id: 3,
            client: "B 김치찌개",
            task_name: "디저트 체험단",
            created_at: "2024-03-20",
            due_date: "2024-12-11",
            type: "food",
            money: 20000,
            status: "in_progress",
            platform: { id: 1, name: "네이버", owner: 1 },
            note: "",
            duty: [],
            owner: 1
        },
        {
            id: 3,
            client: "수공예 체험",
            task_name: "디저트 체험단",
            created_at: "2024-03-20",
            due_date: "2024-12-16",
            type: "food",
            money: 20000,
            status: "completed",
            platform: { id: 1, name: "네이버", owner: 1 },
            note: "",
            duty: [],
            owner: 1
        },
        {
            id: 3,
            client: "아기용품",
            task_name: "디저트 체험단",
            created_at: "2024-03-20",
            due_date: "2024-12-20",
            type: "food",
            money: 20000,
            status: "in_progress",
            platform: { id: 1, name: "네이버", owner: 1 },
            note: "",
            duty: [],
            owner: 1
        },
    ];

    return (
        <VStack spacing={8} w="100%" p={6} align="center">
            {/* 헤더 섹션 */}
            <Box textAlign="center" py={10}>
                <Text fontSize="4xl" fontWeight="bold" mb={4}>
                    체험단 관리를 더 쉽고 체계적으로
                </Text>
                <Text fontSize="xl" color="gray.600" mb={6}>
                    지금 시작하고 무료로 체험해보세요!
                </Text>
                <Button 
                    colorScheme="blue" 
                    size="lg"
                    onClick={() => window.location.href = "/signup"}
                >
                    무료로 시작하기
                </Button>
            </Box>

            {/* 주요 기능 소개 */}
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} w="95%">
                {/* 캘린더 데모 */}
                <Box p={6} borderRadius="lg" boxShadow="sm" bg={bgColor} borderWidth={1} borderColor={borderColor}>
                    <VStack align="start" spacing={4} w="100%">
                        <HStack>
                            <Icon as={FaCalendarAlt} w={6} h={6} color="blue.500" />
                            <Text fontSize="2xl" fontWeight="bold">캘린더 뷰</Text>
                        </HStack>
                        <Text color="gray.600" mb={4}>
                            한눈에 보는 체험단 일정 관리
                            마감일과 진행 상태를 직관적으로 확인하세요.
                        </Text>
                        
                    </VStack>
                </Box>

                {/* 통계 데모 */}
                <Box p={6} borderRadius="lg" boxShadow="sm" bg={bgColor} borderWidth={1} borderColor={borderColor}>
                    <VStack align="start" spacing={4}>
                        <HStack>
                            <Icon as={FaChartLine} w={6} h={6} color="green.500" />
                            <Text fontSize="2xl" fontWeight="bold">실시간 통계</Text>
                        </HStack>
                        <SimpleGrid columns={2} w="100%">
                            <Stat>
                                <StatLabel>총 체험단</StatLabel>
                                <StatNumber color="blue.500">{demoStats.total}건</StatNumber>
                            </Stat>
                            <Stat>
                                <StatLabel>달성 금액</StatLabel>
                                <StatNumber color="green.500">
                                    {demoStats.money.toLocaleString()}원
                                </StatNumber>
                            </Stat>
                        </SimpleGrid>
                    </VStack>
                </Box>

                {/* 상태 관리 데모 */}
                <Box p={6} borderRadius="lg" boxShadow="sm" bg={bgColor} borderWidth={1} borderColor={borderColor}>
                    <VStack align="start" spacing={4}>
                        <HStack>
                            <Icon as={FaCheckCircle} w={6} h={6} color="purple.500" />
                            <Text fontSize="2xl" fontWeight="bold">상태 관리</Text>
                        </HStack>
                        <Text color="gray.600">
                            진행중, 완료, 취소 등 체계적인 상태 관리
                            클릭 한 번으로 상태를 변경하세요.
                        </Text>
                    </VStack>
                </Box>

                {/* 알림 기능 데모 */}
                <Box p={6} borderRadius="lg" boxShadow="sm" bg={bgColor} borderWidth={1} borderColor={borderColor}>
                    <VStack align="start" spacing={4}>
                        <HStack>
                            <Icon as={FaBell} w={6} h={6} color="orange.500" />
                            <Text fontSize="2xl" fontWeight="bold">마감 알림</Text>
                        </HStack>
                        <Text color="gray.600">
                            마감이 임박한 체험단을 놓치지 마세요
                            7일 이내 마감 예정 체험단을 확인하세요.
                        </Text>
                    </VStack>
                </Box>
            </SimpleGrid>

            

            {/* 캘린더 전체 예시 */}
            <Box w="95%" p={6} borderRadius="lg" boxShadow="lg" bg={bgColor} borderWidth={1} borderColor={borderColor}>
                <VStack align="center" spacing={4} w="100%">
                    <Text fontSize="2xl" fontWeight="bold" mb={4} textAlign="center">
                        캘린더로 한눈에 보는 체험단 일정 관리
                    </Text>
                    <Box
                        w="100%" 
                        h="100%" 
                        overflow="hidden" 
                        borderRadius="md"
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Calendar tasks={demoTasks} isDemo={true} />
                    </Box>
                </VStack>
            </Box>
        </VStack>
    );
}