import { HiEllipsisVertical, HiMagnifyingGlass } from "react-icons/hi2";
import { BsCheck2, BsCheck2All } from "react-icons/bs"
import { AiOutlineSend } from "react-icons/ai";
import { GrAttachment }  from "react-icons/gr"
import { MdArrowBack } from "react-icons/md"
import { ChangeEvent, FormEvent, Fragment, KeyboardEvent, useEffect, useState } from "react";
import axios from 'axios';
import { useSession } from "next-auth/react";
import { Socket, io } from 'socket.io-client'
import { useRouter } from "next/router";
import { Textarea } from "@material-tailwind/react";

interface Conversation {
  recepient?: User;
  id?: number;
  messages: Message[];
}

interface Message {
  id?: number;
  message: string;
  senderId: string;
  recipientId: string;
  sender: User;
  recipient: User;
  createdAt?: Date,
  isSeen?: boolean,
}

interface User {
  id: string;
  name: string;
  image: string;
  shop: Shop;
}

interface Shop {
  name: string;
  image: string;
}

interface MessageForm {
  senderId: string;
  recipientId: string;
  message: string;
}

let socket : Socket;

interface Props {
  newChatUserId? : string;
  hidden: boolean;
  onClose: () => any;
}


const Chat = ({ newChatUserId, hidden, onClose } : Props) => {

  const router = useRouter();

  const {data: session} = useSession();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [chatroomModalIsHidden, setChatroomModalIsHidden] = useState<boolean>(true);
  const [selectedConversation, setSelectedConversation] = useState<Conversation>();
  const [currentChatroomMessages, setCurrentChatroomMessages] = useState<Message[]>([]);

  //const [messageForm, setMessageForm] = useState<MessageForm>({senderId: String(session?.user.id), recipientId: "1", message:""});
  const [newMessage, setNewMessage] = useState<Message>();
  const [newConversation, setNewConversation] = useState<Conversation>();
  
  const [selectedRecepient, setSelectedRecepient] = useState<User>();

  let chatDoesNotExistYet = true;

  const socketInitializer = async () => {
    await fetch("/api/socket");

    socket = io('ws://localhost:3000', {transports: ['websocket']});
    console.log(session?.user.id);
    socket.emit("connect-user", session?.user.id);
  }

  const listen = () => {    
    socket.on("receive-message", (data : Message) => {
      setCurrentChatroomMessages([...currentChatroomMessages as Message[], data]);
    });
  }

  const fetchConversations = async () => {
    const conversationsRes = await axios.get("/api/chat");
    const data: Conversation[] = conversationsRes.data.conversations;
    setConversations(data);

    if(newChatUserId) {
      const res = await axios.get(`/api/user/${newChatUserId}`);

      const {user: userToBeChatted} : {user: User} = res.data;

      const newConversation: Conversation = {

        messages: [],
      }

      chatDoesNotExistYet = true;

      data.map((c) => {
        console.log("Running map")
        const latestMessage = c.messages.at(c.messages.length-1);
        const recepient = getRecepient(latestMessage!);

        if(recepient.id == userToBeChatted.id) {
          setSelectedConversation(c);
          setSelectedRecepient(recepient);
          setCurrentChatroomMessages(c.messages);

          chatDoesNotExistYet = false;
        }
      })

      if(chatDoesNotExistYet) {
        setSelectedConversation(newConversation);
        setSelectedRecepient(userToBeChatted);
        setCurrentChatroomMessages([]);

        setNewConversation(newConversation);
      }
    }
  }

  
  useEffect(() => {
    socketInitializer();
  }, [session?.user.id]);

  useEffect(() => {
    if(socket) listen();
  });

  useEffect(() => {
    fetchConversations();
    // if(newChatUserId){
    //   fetchNewRecepientDetails();
    // }
  },[]);


  
  
  const handleSubmitMessage = (e: KeyboardEvent<HTMLTextAreaElement> | KeyboardEvent<HTMLInputElement>) => {
    
    if(e.key  === 'Enter'){
      e.preventDefault();
      socket.emit("send-message", newMessage);
      setCurrentChatroomMessages([...currentChatroomMessages as Message[], newMessage as Message]);
      try{
          fetch('http://localhost:3000/api/chat/send', {
              body: JSON.stringify(newMessage),
              headers: {
                  'Content-Type' : 'application/json'
              },
              method: 'POST'
          }).then()
      }catch(error){
          //console.log(error)
      }
  
      setNewMessage({...newMessage as Message, message: ""});
    }
  }

  const handleMobileSubmitMessage = (e: FormEvent) => {
    e.preventDefault();
    socket.emit("send-message", newMessage);
      setCurrentChatroomMessages([...currentChatroomMessages as Message[], newMessage as Message]);
      try{
          fetch('http://localhost:3000/api/chat/send', {
              body: JSON.stringify(newMessage),
              headers: {
                  'Content-Type' : 'application/json'
              },
              method: 'POST'
          }).then()
      }catch(error){
          //console.log(error)
      }
  
      setNewMessage({...newMessage as Message, message: ""});
  }
  
  const chatroomItemOnClick = (conversation: Conversation) => {
    setChatroomModalIsHidden(false);
    setSelectedConversation(conversation);

    const latestMessage = conversation.messages.at(conversation.messages.length-1);
    const recepient = getRecepient(latestMessage!);
    setSelectedRecepient(recepient);
    console.log(recepient.id);

    setCurrentChatroomMessages(conversation?.messages);

    // setMessageForm(newMessageForm);
    setNewMessage({
      message: "",
      recipient: recepient,
      recipientId: recepient.id,
      sender: session?.user as unknown as User,
      senderId: String(session?.user.id)
    });
    // console.log(messageForm);
  }

  const getRecepient = (latestMessage: Message) : User => {
    let recepient; //TODO: create user names variable in Conversation Model

    if(latestMessage?.recipientId === session?.user.id) recepient = latestMessage?.sender;
    else recepient = latestMessage?.recipient;

    return recepient;
  }


  const chatroomItem = (conversation: Conversation) => {

    const latestMessage = conversation.messages.at(conversation.messages.length-1);

    const recepient = getRecepient(latestMessage!);

    return (
      <div onClick={() => chatroomItemOnClick(conversation)} className="flex flex-row h-24 bg-gray-300 hover:bg-gray-500 transition hover:cursor-pointer">
        <div id="recepient-image-container" className="w-1/4 flex justify-center items-center">
          <img
            src={recepient?.image} 
            className="w-14 h-14 rounded-full bg-purple-300"
          />
        </div>
        <div id="chatroom-item-details" className="w-3/4 p-4 flex flex-col items-start">
          <h1 className="font-bold">{recepient?.name.toString()}</h1>
          <p id="last-message" className="truncate w-64 h-48">{latestMessage?.message.toString()}</p>
        </div>
      </div>
    );
  }

  const chatroomItemForModal = (conversation: Conversation) => {

    const latestMessage = conversation.messages.at(conversation.messages.length-1);

    const recepient = getRecepient(latestMessage!);

    const latestMessageDate = new Date(latestMessage?.createdAt as Date);

    return (
      <div onClick={() => chatroomItemOnClick(conversation)} className="flex flex-row h-24 bg-gray-300 hover:bg-gray-500 transition hover:cursor-pointer">
        <div id="recepient-image-container" className="w-1/4 flex justify-center items-center">
          <img
            src={recepient?.image} 
            className="w-14 h-14 rounded-full bg-purple-300"
          />
        </div>
        <div id="chatroom-item-details" className="w-3/4 p-4 flex flex-col items-start">
          <div className="w-full flex flex-row">
            <h1 className="font-bold w-1/2">{recepient?.name.toString()}</h1>
            <div className="w-full flex justify-end items-center">
              <h1 className="text-sm">{latestMessageDate?.toDateString()}</h1>
            </div>
          </div>
          <p id="last-message" className="text-sm truncate w-60 h-48">{latestMessage?.message.toString()}</p>
        </div>
      </div>
    );
  }

  const messageElement = (message: Message) => {

    let isSender: boolean;

    if (message.senderId === session?.user.id) isSender = true;
    else isSender = false;

    const messageDate = new Date(message.createdAt as Date);


    const userMessageContainerStyle = "px-4 py-2 flex justify-end";
    const userMessageBoxStyle = "rounded-lg w-2/3 p-4 bg-green-400 shadow-xl space-y-2"

    const recieverMessageContainerStyle = "px-4 py-2";
    const recieverMessageBoxStyle = "rounded-lg w-2/3 p-4 bg-gray-400 shadow-xl space-y-2";
    
    return (
      <div id="message-container" className={(isSender) ? userMessageContainerStyle : recieverMessageContainerStyle}>
        <div id="message-box" className={(isSender) ? userMessageBoxStyle : recieverMessageBoxStyle}>
          <div id="message-text-container" className="">
            <p className="break-words h-auto">{message.message}</p>
          </div>
          <div id="message-date" className="flex justify-end items-center space-x-2">
            {(message.isSeen) ? <BsCheck2All className="w-4 h-4 lg:w-6 lg:h-6"/> : <BsCheck2 className="w-4 h-4 lg:w-6 lg:h-6"/>}
            <h1 className="text-xs lg:text-base">{messageDate?.toDateString()}</h1>
          </div>
        </div>
      </div>
    );
  }

  const renderMessages = () => {
    const cloneMessages = currentChatroomMessages?.slice();
    const reversedMessages = cloneMessages?.reverse();
    
    return (
      <>
        {reversedMessages?.map((m) => messageElement(m))}
      </>
    );
  }

  const handleMessageChange = (e: ChangeEvent<HTMLTextAreaElement>) => setNewMessage({
    message:  e.target.value,
    recipient: selectedRecepient as User,
    recipientId: String(selectedRecepient?.id),
    sender: session?.user as unknown as User,
    senderId: String(session?.user.id),
    createdAt: new Date(Date.now())
  });
  
  return (
    <Fragment>  
      <div hidden={hidden} className="">
        <div className="h-96 flex flex-row">
          <section hidden={hidden} id="chatlist-web" className="w-1/4">
            <div id="search-container" className="bg-gray-500 h-1/6 flex justify-center items-center">
              <div className="w-5/6 relative">
                <div className="absolute top-1 bottom-1 left-1">
                  <HiMagnifyingGlass />
                </div>
                <input type="text" className="w-full pl-6"/>
              </div>
            </div>
            <div id="chatroom-list" className="h-5/6 flex flex-col overflow-y-auto">
              {conversations?.map((c)=> chatroomItem(c))}
              {
                (newConversation)
                ? <div className="flex flex-row h-24 bg-gray-300 hover:bg-gray-500 transition hover:cursor-pointer">
                    <div id="recepient-image-container" className="w-1/4 flex justify-center items-center">
                      <img
                        src={selectedRecepient?.image} 
                        className="w-14 h-14 rounded-full bg-purple-300"
                      />
                    </div>
                    <div id="chatroom-item-details" className="w-3/4 p-4 flex flex-col items-start">
                      <h1 className="font-bold">{selectedRecepient?.name.toString()}</h1>
                      {/* <p id="last-message" className="truncate w-64 h-48">{latestMessage?.message.toString()}</p> */}
                    </div>
                  </div>
                : <></>
              }
            </div>
          </section>
          <section hidden={hidden} id="chatroom-web" className="w-3/4">
            <div id="chat-chatroom-details" className="h-1/6 p-2 bg-gray-400 flex flex-row space-x-4">
              <div className="w-16 flex justify-center items-center">
                <img 
                  src={selectedRecepient?.image}
                  className="w-10 h-10 rounded-full bg-purple-300">
                </img>  
              </div>
              {/* <div id="recepient-and-status" className="flex flex-col items-start w-1/2"> */}
              <div id="recepient-and-status" className="flex flex-col justify-center w-1/2">
                <h1 className="text-xl">{selectedRecepient?.name.toString()}</h1>
                {/* <div className="flex flex-row justify-center items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-green-600"></div>
                  <h1 className="text-xs">Online</h1>
                </div> */}
              </div>
              <div className="w-full flex items-center justify-end">
                <HiEllipsisVertical className="w-6 h-6 hover:cursor-pointer"/>
              </div>
            </div>
            <div className="h-4/6 overflow-y-auto flex flex-col-reverse"> {/*I need to put justify-end so that it renders from the top but if I do so it will break the UI */}
              {
                (selectedConversation) 
                ? renderMessages() 
                : <div>No Conversation</div>
              }
            </div>
            <form className="h-1/6 flex flex-row bg-gray-400">
              <div className="w-full flex flex-row justify-center items-center p-2 relative">
                {/* <textarea aria-multiline="true" value={newMessage?.message} name="" id="" className="w-full h-full items-start pr-10" onKeyDown={(e) => handleSubmitMessage(e)} onChange={handleMessageChange}/> */}
                <textarea aria-multiline="true" value={newMessage?.message} name="" id="" className="w-full h-full items-start " onKeyDown={(e) => handleSubmitMessage(e)} onChange={handleMessageChange}/>
                {/* <GrAttachment className="absolute right-6"/> */}
              </div>
              <div className="flex justify-center items-center w-24">
                <button type="submit" className="bg-green-500 rounded-full w-12 h-12 flex justify-center items-center">
                  <AiOutlineSend className="w-6 h-6 fill-white"/>
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
      <div hidden={hidden} id="chat-chatlist-mobile" className="">
        <div id="chat-chatlist-modal" className="lg:hidden bg-gray-900 bg-opacity-75 fixed h-full w-full top-0 left-0 bottom-0 right-0 z-50 pointer-events-auto">
          <div id="chat-chatlist-box" className="h-full w-full bg-white">
            <div className="flex flex-row w-full bg-gray-400 h-16">
              <div>

              </div>
              <div id="chat-chatlist-modal-title-container" className="flex justify-start items-center w-full p-4">
                <h1 className="font-bold text-xl">Chat</h1>
              </div>
              <div id="actions-container" className="flex flex-row items-center p-4 space-x-4">
                <HiMagnifyingGlass />
								<button onClick={onClose} className="text-2xl font-bold float-right">✕</button>
              </div>
            </div>
            <div id="chatlist" className="h-5/6 flex flex-col overflow-y-auto">
              {conversations?.map((c) => chatroomItemForModal(c))}
            </div>
          </div>
        </div>
      </div>
      <div hidden={chatroomModalIsHidden} id="chat-chatroom-mobile">
        <div id="chat-chatroom-modal" className="lg:hidden bg-gray-900 bg-opacity-75 fixed h-full w-full top-0 left-0 bottom-0 right-0 z-50 pointer-events-auto">
          <div id="chat-chatlist-box" className="h-full w-full bg-white">
            <div className="flex flex-row p-2 w-full bg-gray-400 h-16 space-x-2">
              <button onClick={() => setChatroomModalIsHidden(true)} className="flex justify-center items-center">
                <MdArrowBack className="w-6 h-6"/>
              </button>
              <div className="w-16 flex justify-center items-center">
                <img 
                  src={selectedRecepient?.image}
                  className="w-10 h-10 rounded-full bg-purple-300">
                </img>  
              </div>
              <div id="recepient-and-status" className="flex flex-col items-start w-3/4">
                <div className="h-1/2 w-full">
                  <h1 className="text-base font-bold">{selectedRecepient?.name}</h1>
                </div>
                <div className="h-1/2 flex flex-row justify-center items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-green-600"></div>
                  <h1 className="text-xs">Online</h1>
                </div>
              </div>
              <div className="w-1/4 flex items-center justify-end">
                <HiEllipsisVertical className="w-6 h-6 hover:cursor-pointer"/>
              </div>
            </div>
            <div id="chatlist" className="h-5/6 overflow-y-auto flex flex-col-reverse">
              {
                (selectedConversation) 
                ? renderMessages() 
                : <div>No Conversation</div>
              }
            </div>
            <div className="flex flex-row w-full bg-gray-400">
              <form onSubmit={(e) => handleMobileSubmitMessage(e)} className="w-full flex flex-row relative bg-gray-400">
                <div className="w-full flex flex-row justify-center items-center p-2 relative">
                  {/* <textarea aria-multiline="true" value={newMessage?.message} name="" id="" className="w-full h-full items-start" onKeyDown={(e) => handleSubmitMessage(e)} onChange={handleMessageChange}/> */}
                  <textarea aria-multiline="true" value={newMessage?.message} name="" id="" className="w-full h-full items-start" onKeyDown={(e) => handleSubmitMessage(e)} onChange={handleMessageChange}/>
                  {/* <GrAttachment className="absolute right-6"/> */}
                </div>
                <div className="flex justify-center items-center w-24">
                  <button type="submit" className="bg-green-500 rounded-full w-12 h-12 flex justify-center items-center">
                    <AiOutlineSend className="w-6 h-6 fill-white"/>
                  </button>
                </div>
              </form>
              {/* <div className="w-5/6 flex flex-row justify-center items-center p-2 relative">
                <textarea name="" id="" className="w-full h-full items-start" ></textarea>
                <GrAttachment className="absolute right-6"/>
              </div>
              <div className="w-1/6 flex justify-center items-center">
                <button className="bg-green-500 rounded-full w-12 h-12 flex justify-center items-center">
                  <AiOutlineSend className="w-6 h-6 fill-white"/>
                </button>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default Chat;