import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, VStack, Text } from "@chakra-ui/react";
import { ITask } from "../types";
import { Badge, HStack } from "@chakra-ui/react";
interface DateTasksModalProps {
    isOpen: boolean;
    onClose: () => void;
    tasks: ITask[];
    date: Date;
}

export default function DateTasksModal({ isOpen, onClose, tasks, date }: DateTasksModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
            <ModalContent mx={4} bg="white" shadow="xl" borderRadius="lg">
                <ModalHeader 
                    borderBottom="1px" 
                    borderColor="gray.100"
                    fontSize="xl"
                    color="blue.600"
                >
                    {date.toLocaleDateString()} 체험단 목록 : {tasks.length}건
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <VStack align="stretch" spacing={4}>
                        {tasks.map((task) => (
                            <VStack 
                                key={task.id} 
                                p={4} 
                                border="1px" 
                                borderColor="gray.200" 
                                borderRadius="lg"
                                align="start"
                                bg="gray.50"
                                _hover={{
                                    transform: "translateY(-2px)",
                                    shadow: "md",
                                    borderColor: "blue.200",
                                    transition: "all 0.2s"
                                }}
                            >
                                <HStack justify="space-between" width="100%">
                                    <Text 
                                        fontWeight="bold" 
                                        fontSize="lg"
                                        color="gray.700"
                                    >
                                        {task.client}
                                    </Text>
                                    <Badge 
                                        colorScheme="blue" 
                                        borderRadius="full" 
                                        px={2}
                                        py={1}
                                        fontSize="sm"
                                    >
                                        마감일: {new Date(task.due_date).toLocaleDateString()}
                                    </Badge>
                                </HStack>
                            </VStack>
                        ))}
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}