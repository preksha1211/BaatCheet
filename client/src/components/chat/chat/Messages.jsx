import { useState, useEffect, useContext, useRef } from 'react';
import { Box, styled } from '@mui/material';
import { AccountContext } from '../../../context/AccountProvider';
import { getMessages, newMessages } from '../../../service/api';
import Footer from './Footer';
import Message from './Message';

const Wrapper = styled(Box)`
  background-image: url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png');
  background-size: 50%;
`;

const Component = styled(Box)`
  height: 77vh;
  overflow-y: scroll;
`;

const Containe = styled(Box)`
  padding: 1px 80px;
`;

const Messages = ({ person, conversation }) => {
  const [value, setValue] = useState('');
  const [messages, setMessages] = useState([]);
  const [file, setFile] = useState();
  const [image, setImage] = useState('');
  const [incomingMessage, setIncomingMessage] = useState(null);

  const scrollRef = useRef();
  const { account, socket, newMessageFlag, setMessageFlag } = useContext(AccountContext);

  // Receive real-time messages
  useEffect(() => {
    socket.current.on('getMessage', data => {
      setIncomingMessage({
        ...data,
        createdAt: Date.now()
      });
    });

    return () => socket.current.off('getMessage');
  }, []);

  // Add incoming message to UI
  useEffect(() => {
    if (incomingMessage && conversation?.members?.includes(incomingMessage.senderId)) {
      setMessages(prev => [...prev, incomingMessage]);
    }
  }, [incomingMessage, conversation]);

  // Fetch messages
  useEffect(() => {
    const getMessageDetails = async () => {
      if (!conversation || !conversation._id) return;

      const data = await getMessages(conversation._id);
      setMessages(data);
    };

    getMessageDetails();
  }, [conversation, newMessageFlag]);

  // Scroll to last message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message on Enter
  const sendText = async (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();

      if (!conversation || !conversation._id) return;

      const message = {
        senderId: account.sub,
        receiverId: person.sub,
        conversationId: conversation._id,
        type: file ? 'file' : 'text',
        text: file ? image : value
      };

      socket.current.emit('sendMessage', message);
      await newMessages(message);

      setValue('');
      setFile('');
      setImage('');
      setMessageFlag(prev => !prev);
    }
  };

  return (
    <Wrapper>
      <Component>
        {messages.map(message => (
          <Containe ref={scrollRef} key={message._id}>
            <Message message={message} />
          </Containe>
        ))}
      </Component>

      <Footer
        sendText={sendText}
        setValue={setValue}
        value={value}
        file={file}
        setFile={setFile}
        setImage={setImage}
      />
    </Wrapper>
  );
};

export default Messages;
