import { useContext, useEffect, useState } from 'react';

import { Box } from '@mui/material';

import { AccountContext } from '../../../context/AccountProvider';
import { getConversation, setConversation } from '../../../service/api';

import ChatHeader from './ChatHeader';
import Messages from './Messages';

const ChatBox = () => {
    
    const { person, account } = useContext(AccountContext);

    const [conversation, setConversationData] = useState(null);

    useEffect(() => {
        const fetchConversation = async () => {

            if (!person?.sub || !account?.sub) return;

            // Create conversation if not exists
            await setConversation({
                senderId: account.sub,
                receiverId: person.sub
            });

            // Then fetch conversation
            const data = await getConversation({
                senderId: account.sub,
                receiverId: person.sub
            });

            setConversationData(data);
        };

        fetchConversation();

    }, [person?.sub, account?.sub]);


    return (
        <Box>
            <ChatHeader person={person} />
            <Messages person={person} conversation={conversation} />
        </Box>
    );
};

export default ChatBox;