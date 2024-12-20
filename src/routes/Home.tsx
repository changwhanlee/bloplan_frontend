import { useQuery } from "@tanstack/react-query";
import { getTasks, getTasksTotal, getTest, getUser, TasksUpdateByDate } from "../api";
import { ITask, ITaskTotal } from "../types";
import Calendar from "../components/Calendar";
import { Box, Text, VStack } from "@chakra-ui/react";
import TotalState from "../components/TotalState";
import WelcomePage from "../components/WelcomPage";

export default function Home() {

    const { data: user, isLoading: userLoading } = useQuery({
        queryKey: ["user"],
        queryFn: getUser,
    });

    const { data: updateByDate, isLoading: updateByDateLoading } = useQuery({
        queryKey: ["updateByDate"],
        queryFn: TasksUpdateByDate,
        enabled: !!user,     
    });
    
    const { data: tasks, isLoading: tasksLoading } = useQuery<ITask[]>({
        queryKey: ["tasks"],
        queryFn: getTasks,
        enabled: !!updateByDate,
    });

    const { data: tasksTotal, isLoading: tasksTotalLoading } = useQuery<ITaskTotal>({
        queryKey: ["tasksTotal"],
        queryFn: getTasksTotal,
        enabled: !!updateByDate,
    });


    if (tasksLoading || tasksTotalLoading || updateByDateLoading) return <span>Loading...</span>;
    if (!user) return <WelcomePage />;
    if (!tasks) return <WelcomePage />;

    console.log(tasks);

    if (updateByDate) {
        console.log(updateByDate);
    }   


    return (
        <>
            <VStack 
                gap={4}
                h="90%"
                w="100%"
                spacing={4}
                
                display="flex"
            >
                {tasksTotal && <TotalState tasksTotal={tasksTotal} tasks={tasks} />}
                <Calendar 
                    tasks={tasks} 
                />
            </VStack>
        </>
    );
  }