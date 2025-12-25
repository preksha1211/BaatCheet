import { useState, useEffect, useContext } from "react";
import { styled, Box, Typography } from '@mui/material';
import { AccountContext } from '../../../context/AccountProvider';
import { setConversation, getConversation } from '../../../service/api';
import { formatDate } from '../../../utils/common-utils';

const Component = styled(Box)`
    height: 45px;
    display: flex;
    padding: 13px 0;
    cursor: pointer;
`;

const Image = styled('img')({
    width: 50,
    height: 50,
    objectFit: 'cover',
    borderRadius: '50%',
    padding: '0 14px',
    objectFit: 'cover'
});

const Container = styled(Box)`
    display: flex;
`;

const Timestamp = styled(Typography)`
    font-size: 12px;
    margin-left: auto;
    color: #00000099;
    margin-right: 20px;
`;

const Text = styled(Typography)`
    font-size: 14px;
    color: #00000099;
`;

const Conversation = ({ user }) => {
    const { setPerson, account, socket, newMessageFlag } = useContext(AccountContext);
    const [message, setMessage] = useState({});

    // ✅ Fetch last message (API fallback)
    useEffect(() => {
        const getConversationMessage = async () => {
            if (!user?.sub) return;

            const data = await getConversation({
                senderId: account.sub,
                receiverId: user.sub
            });

            setMessage({
                text: data?.message,
                timestamp: data?.updatedAt
            });
        };

        getConversationMessage();
    }, [newMessageFlag, user, account.sub]);

    // ✅ REAL-TIME update for conversation preview
    useEffect(() => {
        socket.current.on('getMessage', data => {
            if (
                data.senderId === user.sub ||
                data.receiverId === user.sub
            ) {
                setMessage({
                    text: data.text,
                    timestamp: Date.now()
                });
            }
        });

        return () => {
            socket.current.off('getMessage');
        };
    }, [socket, user]);

    const getUser = async () => {
        setPerson(user);
        await setConversation({
            senderId: account.sub,
            receiverId: user.sub
        });
    };

    return (
        <Component onClick={getUser}>
            <Box>
                <Image src={user.picture} alt="dp" />
            </Box>
            <Box style={{ width: '100%' }}>
                <Container>
                    <Typography>{user.name}</Typography>
                    {message?.text && (
                        <Timestamp>{formatDate(message.timestamp)}</Timestamp>
                    )}
                </Container>
                <Box>
                    <Text>
                        {message?.text?.includes('localhost') ? 'media' : message?.text}
                    </Text>
                </Box>
            </Box>
        </Component>
    );
};

export default Conversation;
