import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";

// Define the shape of the socket context
interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  examStats: {
    totalStudents: number;
    studentsWritingExam: number;
    onlineStudents: number;
  };
}

// Create the context
const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  examStats: {
    totalStudents: 0,
    studentsWritingExam: 0,
    onlineStudents: 0,
  },
});

// Provider component
export const SocketProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [examStats, setExamStats] = useState({
    totalStudents: 0,
    studentsWritingExam: 0,
    onlineStudents: 0,
  });

  useEffect(() => {
    // Create socket connection
    const newSocket = io("http://localhost:5000", {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Connection events
    newSocket.on("connect", () => {
      setSocket(newSocket);
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
    });

    // Exam stats listener
    newSocket.on("exam-stats-update", (stats) => {
      setExamStats(stats);
    });

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected, examStats }}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook to use socket context
export const useSocket = () => {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }

  return context;
};
