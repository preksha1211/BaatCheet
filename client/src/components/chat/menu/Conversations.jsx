import React, { useState, useEffect, useContext } from 'react';
import { Box, styled, Divider } from '@mui/material';
import { AccountContext } from '../../../context/AccountProvider';
import Conversation from './Conversation';
import { getUsers } from '../../../service/api';

const Component = styled(Box)`
    
    height: 8vh;
`;

const StyledDivider = styled(Divider)`
    margin: 0 0 0 70px;
    background-color: #e9edef;
    opacity: 0.6;
`;

const Conversations = ({ text }) => {
    const [users, setUsers] = useState([]);
    const { account, socket, setActiveUsers } = useContext(AccountContext);

    // 🔹 Fetch users for sidebar
    useEffect(() => {
        const fetchData = async () => {
            const data = await getUsers();
            console.log("Users from API:", data);
            const filteredData = (data || []).filter(user =>
                user.name.toLowerCase().includes((text || '').toLowerCase())
            );
            setUsers(filteredData);
        };
        fetchData();
    }, [text]);

    // 🔹 Emit addUser only when account exists
    useEffect(() => {
        if (!account) return;       // critical
        if (!socket.current) return;

        console.log("Emitting addUser:", account);
        socket.current.emit('addUser', account);

        socket.current.on('getUsers', users => {
            console.log("Received users from socket:", users);
            setActiveUsers(users);
        });

        return () => {
            socket.current.off('getUsers');
        };
    }, [account, socket, setActiveUsers]);

    return (
        <Component>
            {users.map((user, index) => (
                user.sub !== account?.sub && (
                    <Box key={user.sub}>
                        <Conversation user={user} />
                        {users.length !== index + 1 && <StyledDivider />}
                    </Box>
                )
            ))}
        </Component>
    );
};

export default Conversations;
