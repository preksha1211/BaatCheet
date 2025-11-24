import { useContext, useState ,useEffect, useRef} from 'react';
import { Box, Container, styled } from '@mui/material';
import { AccountContext } from '../../../context/AccountProvider';
import { getMessages,newMessages } from '../../../service/api';
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
  
  const [file,setFile] = useState();
  const [image, setImage] = useState('');
  const [incomingMessage, setIncomingMessage] = useState(null);

  const scrollRef = useRef();

  const { account, socket,newMessageFlag ,setMessageFlag} = useContext(AccountContext);
    
 useEffect(() =>{
   socket.current.on('getMessage', data=>{
        setIncomingMessage({
           ...data,
           createAt: Date.now()
        })
   })
 },[])

 useEffect(() => {
  const getMessageDetails = async () => {

    // 🛑 Prevent calling API before conversation exists
    if (!conversation || !conversation._id) return;

    let data = await getMessages(conversation._id);
    setMessages(data);
  };

  getMessageDetails();
}, [conversation,newMessageFlag]); // 👈 run again when conversation updates

 useEffect(() => {
      scrollRef.current?.scrollIntoView({transtition: 'smooth'})
 }, [messages]) 

   useEffect(() => {
        incomingMessage && conversation?.members?.includes(incomingMessage.senderId) && 
            setMessages((prev) => [...prev, incomingMessage]);
        
    }, [incomingMessage, conversation]);


  const sendText = async (e) => {
    const code = e.keyCode || e.which;
    if (code === 13) {

      
      if (!conversation || !conversation._id) {
        console.log("Conversation not created yet ❌");
        return;
      }
      let message = {};
      if(!file){
        message = {
          senderId: account.sub,
          receiverId: person.sub,
          conversationId: conversation._id,
          type: 'text',
          text: value
        }
      } else {
        message = {
          senderId: account.sub,
          receiverId: person.sub,
          conversationId: conversation._id,
          type: 'file',
          text: image
        };

      }

      socket.current.emit('sendMessage',message);

      await newMessages(message);
      setValue('');
      setFile('');
      setImage('');
      setMessageFlag(prev =>!prev);
    }
  };

  return (
    <Wrapper>
      <Component>
  {messages && messages.map(message => (
     <Containe ref={scrollRef}>
             <Message key={message._id} message={message} />
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
