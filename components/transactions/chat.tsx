import { HiEllipsisVertical, HiMagnifyingGlass } from "react-icons/hi2";
import { BsCheck2, BsCheck2All } from "react-icons/bs"
import { AiOutlineSend } from "react-icons/ai";
import { GrAttachment }  from "react-icons/gr"
import { MdArrowBack } from "react-icons/md"
import { Fragment } from "react";

interface Props {
  hidden: boolean;
}

const Chat = ({ hidden } : Props) => {

  const chatroomItem = () => {
    return (
      <div className="flex flex-row h-24 bg-gray-300 hover:bg-gray-500 transition">
        <div id="recepient-image-container" className="w-1/4 flex justify-center items-center">
          <div className="w-14 h-14 rounded-full bg-purple-300">
          </div>
        </div>
        <div id="chatroom-item-details" className="w-3/4 p-4 flex flex-col items-start">
          <h1>TokoAgung</h1>
          <p id="last-message" className="truncate w-64 h-48">Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit minima vero saepe assumenda illum nostrum voluptate ex, est itaque dolores enim maiores laborum odit porro ratione animi, nam corporis similique.</p>
        </div>
      </div>
    );
  }

  const chatroomItemForModal = () => {
    return (
      <div className="flex flex-row h-24 bg-gray-300 hover:bg-gray-500 transition">
        <div id="recepient-image-container" className="w-1/4 flex justify-center items-center">
          <div className="w-14 h-14 rounded-full bg-purple-300">
          </div>
        </div>
        <div id="chatroom-item-details" className="w-3/4 p-4 flex flex-col items-start">
          <h1>TokoAgung</h1>
          <p id="last-message" className="truncate w-64 h-48">Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit minima vero saepe assumenda illum nostrum voluptate ex, est itaque dolores enim maiores laborum odit porro ratione animi, nam corporis similique.</p>
        </div>
      </div>
    );
  }

  const messageElement = (isSender: boolean) => {

    const userMessageContainerStyle = "w-full px-4 py-2 flex justify-end";
    const userMessageBoxStyle = "rounded-lg w-2/3 p-4 bg-green-400 shadow-xl space-y-2"

    const recieverMessageContainerStyle = "w-full px-4 py-2";
    const recieverMessageBoxStyle = "rounded-lg w-2/3 p-4 bg-gray-400 shadow-xl space-y-2";
    
    return (
      <div id="message-container" className={(isSender) ? userMessageContainerStyle : recieverMessageContainerStyle}>
        <div id="message-box" className={(isSender) ? userMessageBoxStyle : recieverMessageBoxStyle}>
          <div id="message-text-container" className="">
            <p className="">Lorem ipsum dolor sit amet consectetur aaaaaaa adipisicing elit. Accusantium officiis sunt aliquid totam! Soluta nesciunt beatae magnam incidunt officiis non saepe, commodi similique molestias facilis libero voluptates, sapiente pariatur quibusdam.</p>
          </div>
          <div id="message-date" className="flex justify-end items-center space-x-2">
            <BsCheck2 className="w-4 h-4 lg:w-6 lg:h-6"/>
            <h1 className="text-xs lg:text-base">2 July 2023, 10:30 WIB</h1>
          </div>
        </div>
      </div>
    );
  }
  
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
              {chatroomItem()}
              {chatroomItem()}
              {chatroomItem()}
              {chatroomItem()}
              {chatroomItem()}
              {chatroomItem()}
              {chatroomItem()}
            </div>
          </section>
          <section hidden={hidden} id="chatroom-web" className="w-3/4">
            <div id="chat-chatroom-details" className="h-1/6 p-2 bg-gray-400 flex flex-row space-x-4">
              <div className="w-16 flex justify-center items-center">
                <div className="w-10 h-10 rounded-full bg-purple-300">
                </div>  
              </div>
              <div id="recepient-and-status" className="flex flex-col items-start w-1/2">
                <h1 className="text-xl">TokoAgung</h1>
                <div className="flex flex-row justify-center items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-green-600"></div>
                  <h1 className="text-xs">Online</h1>
                </div>
              </div>
              <div className="w-full flex items-center justify-end">
                <HiEllipsisVertical className="w-6 h-6 hover:cursor-pointer"/>
              </div>
            </div>
            <div className="h-4/6 overflow-y-auto flex flex-col-reverse">
              {messageElement(true)}
              {messageElement(false)}
              {messageElement(true)}
              {messageElement(false)}
              {messageElement(true)}
              {messageElement(false)}
              {messageElement(true)}
              {messageElement(true)}
              {messageElement(false)}
            </div>
            <div className="h-1/6 flex flex-row bg-gray-400">
              <div className="w-full flex flex-row justify-center items-center p-2 relative">
                <textarea name="" id="" className="w-full h-full items-start" ></textarea>
                <GrAttachment className="absolute right-6"/>
              </div>
              <div className="flex justify-center items-center w-24">
                <button className="bg-green-500 rounded-full w-12 h-12 flex justify-center items-center">
                  <AiOutlineSend className="w-6 h-6 fill-white"/>
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
      <div id="chat-chatlist-mobile" className="">
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
								<button className="text-2xl font-bold float-right">✕</button>
              </div>
            </div>
            <div id="chatlist" className="h-5/6 flex flex-col overflow-y-auto">
              {chatroomItemForModal()}
              {chatroomItemForModal()}
              {chatroomItemForModal()}
              {chatroomItemForModal()}
              {chatroomItemForModal()}
              {chatroomItemForModal()}
              {chatroomItemForModal()}
              {chatroomItemForModal()}
              {chatroomItemForModal()}
              {chatroomItemForModal()}
            </div>
          </div>
        </div>
      </div>
      <div id="chat-chatroom-mobile">
        <div id="chat-chatroom-modal" className="lg:hidden bg-gray-900 bg-opacity-75 fixed h-full w-full top-0 left-0 bottom-0 right-0 z-50 pointer-events-auto">
          <div id="chat-chatlist-box" className="h-full w-full bg-white">
            <div className="flex flex-row p-2 w-full bg-gray-400 h-16 space-x-2">
              <div className="flex justify-center items-center">
                <MdArrowBack className="w-6 h-6"/>
              </div>
              <div className="w-16 flex justify-center items-center">
                <div className="w-10 h-10 rounded-full bg-purple-300">
                </div>  
              </div>
              <div id="recepient-and-status" className="flex flex-col items-start w-1/2">
                <h1 className="text-xl">TokoAgung</h1>
                <div className="flex flex-row justify-center items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-green-600"></div>
                  <h1 className="text-xs">Online</h1>
                </div>
              </div>
              <div className="w-full flex items-center justify-end">
                <HiEllipsisVertical className="w-6 h-6 hover:cursor-pointer"/>
              </div>
            </div>
            <div id="chatlist" className="h-5/6 flex flex-col overflow-y-auto">
              {messageElement(true)}
              {messageElement(false)}
              {messageElement(true)}
              {messageElement(false)}
              {messageElement(true)}
              {messageElement(false)}
              {messageElement(true)}
              {messageElement(true)}
              {messageElement(false)}
            </div>
            <div className="flex flex-row w-full bg-gray-400">
              <div className="w-5/6 flex flex-row justify-center items-center p-2 relative">
                <textarea name="" id="" className="w-full h-full items-start" ></textarea>
                <GrAttachment className="absolute right-6"/>
              </div>
              <div className="w-1/6 flex justify-center items-center">
                <button className="bg-green-500 rounded-full w-12 h-12 flex justify-center items-center">
                  <AiOutlineSend className="w-6 h-6 fill-white"/>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default Chat;