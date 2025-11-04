import "./Chat.css";
import React, { useContext, useState, useEffect } from "react";
import { MyContext } from "./MyContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

function Chat() {
  const { newChat, prevChats, reply } = useContext(MyContext);
  const [latestReply, setLatestReply] = useState(null);

  // Typing animation effect
  useEffect(() => {
    if (!reply || !prevChats?.length) {
      setLatestReply(null);
      return;
    }

    const words = reply.split(" ");
    let idx = 0;

    const interval = setInterval(() => {
      setLatestReply(words.slice(0, idx + 1).join(" "));
      idx++;
      if (idx >= words.length) clearInterval(interval);
    }, 40);

    return () => clearInterval(interval);
  }, [reply, prevChats]);

  // Auto-scroll to bottom as messages appear or animate
  useEffect(() => {
    const chatDiv = document.querySelector(".chats");
    if (chatDiv) {
      chatDiv.scrollTop = chatDiv.scrollHeight;
    }
  }, [latestReply, prevChats]);

  return (
    <>
      {newChat && prevChats?.length === 0 && (
        <h1 className="newChatHeader">Where Should We Begin?</h1>
      )}

      <div className="chats">
        {/* Render all previous chats except the most recent */}
        {prevChats?.slice(0, -1).map(({ role, content }, idx) => (
          <div className={role === "user" ? "userDiv" : "gptDiv"} key={idx}>
            {role === "user" ? (
              <p className="userMessage">{content}</p>
            ) : (
              <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                {content}
              </ReactMarkdown>
            )}
          </div>
        ))}

        {/* Render the latest message (typing animation or static) */}
        {prevChats?.length > 0 && (
          <>
            {latestReply === null ? (
              <div className="gptDiv" key="non-typing">
                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                  {prevChats[prevChats.length - 1].content}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="gptDiv typing" key="typing">
                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                  {latestReply}
                </ReactMarkdown>
                <span className="cursor">|</span>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default Chat;
