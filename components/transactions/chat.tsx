import { HiEllipsisVertical, HiMagnifyingGlass } from "react-icons/hi2";
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
  
  return (
    <Fragment>  
      <div hidden={hidden} className="h-96 flex flex-row">
        <section hidden={hidden} id="chatlist-web" className="h-96 w-1/4">
          <div id="search-container" className="bg-gray-500 h-1/6 flex justify-center items-center">
            <div className="w-5/6 relative">
              <div className="absolute top-1 bottom-1 left-1">
                <HiMagnifyingGlass />
              </div>
              <input type="text" className=""/>
            </div>
          </div>
          <div id="chatroom-list" className="h-5/6 overflow-y-auto">
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
          <div className="h-5/6 overflow-y-auto">
            <h1>hello</h1>
            <h1>hello</h1>
            <h1>hello</h1>
            <h1>hello</h1>
          </div>
        </section>
      </div>
      <div id="chat-chatlist-mobile"></div>
      <div id="chat-chatroom-mobile"></div>
    </Fragment>
  );
}

export default Chat;