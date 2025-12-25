
import { createContext, useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';

export const AccountContext = createContext(null);

const AccountProvider = ({ children }) => {
  const [account, setAccount] = useState();          // Logged-in user
  const [person, setPerson] = useState({});          // Current chat person
  const [activeUsers, setActiveUsers] = useState([]); 
  const [newMessageFlag, setMessageFlag] = useState(false);

  const socket = useRef(null);

  useEffect(() => {
    socket.current = io('http://localhost:9000');

    socket.current.on('connect', () => {
      console.log('Socket connected:', socket.current.id);
    });

    socket.current.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    return () => {
      socket.current.off();
      socket.current.disconnect();
    };
  }, []);

  return (
    <AccountContext.Provider
      value={{
        account,
        setAccount,
        person,
        setPerson,
        socket,
        activeUsers,
        setActiveUsers,
        newMessageFlag,
        setMessageFlag
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export default AccountProvider;
