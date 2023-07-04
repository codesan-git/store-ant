import { Fragment } from "react";

interface Props {
  hidden: boolean;
}

const Chat = ({ hidden } : Props) => {

  const chatroomItem = () => {
    return (
      <div className="flex flex-row">
        <div id="recepient-image-container">
          <div className="w-6 h-6 rounded-full bg-purple-300">
          </div>
        </div>
        <div id="chatroom-item-details">
          <h1>TokoAgung</h1>
          <p id="last-message" className="">Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit minima vero saepe assumenda illum nostrum voluptate ex, est itaque dolores enim maiores laborum odit porro ratione animi, nam corporis similique.</p>
        </div>
      </div>
    );
  }
  
  return (
    <Fragment>  
      <div hidden={hidden} className="h-96 flex flex-row">
        <section id="chatlist-web" className="h-96 w-1/4">
          <div id="search-container" className="bg-gray-500 h-1/6 flex justify-center items-center">
            <input type="text" className="w-5/6"/>
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
        <section id="chatroom-web" className="w-3/4">
          <div id="chat-chatroom-details" className="h-1/6 bg-gray-400 flex flex-row">
            <div className="w-6 h-6 rounded-full bg-purple-300">
            </div>
            <div id="recepient-and-status">
              <h1>TokoAgung</h1>
              <h1>online</h1>
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