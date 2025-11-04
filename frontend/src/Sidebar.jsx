import "./Sidebar.css";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";
const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;

function Sidebar() {
  
  const {
    allThreads,
    setAllThreads,
    currThreadId,
    setNewChat,
    setPrompt,
    setReply,
    setCurrThreadId,
    setPrevChats,
    
  } = useContext(MyContext);

  const [loading, setLoading] = useState(false);

  //  Fetch all threads from server
  const getAllThreads = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URI}/api/thread`);
      if (!response.ok) throw new Error("Failed to fetch threads");

      const data = await response.json();
      const formatted = data.map((t) => ({
        threadId: t.threadId,
        title: t.title || "Untitled Chat",
      }));

      setAllThreads(formatted);
     
    } catch (err) {
      console.error(" Error fetching threads:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load threads initially & refresh when a thread changes (if needed)
  useEffect(() => {
    getAllThreads();
  }, []);
  
  // Create a new chat thread
  const createNewChat = async () => {
    const newId = uuidv1();
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(newId);
    setPrevChats([]);

    // optional: instantly add it to sidebar for UX
    setAllThreads((prev) => [{ threadId: newId, title: "New Chat" }, ...prev]);
  };

  //  Change current thread and load its messages
  const changeThread = async (newThreadId) => {
    if (newThreadId === currThreadId) return;
    setCurrThreadId(newThreadId);
    setNewChat(false);
    setReply(null);

    try {
      const response = await fetch(
        `${BACKEND_URI}/api/thread/${newThreadId}`
      );
      if (!response.ok) throw new Error("Failed to load thread messages");

      const messages = await response.json();
      setPrevChats(messages);
    } catch (err) {
      console.error(" Error loading thread:", err.message);
    }
  };

  //  Delete a thread
  const deleteThread = async (threadId) => {
    try {
      const response = await fetch(
        `${BACKEND_URI}/api/thread/${threadId}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Failed to delete thread");

      setAllThreads((prev) => prev.filter((t) => t.threadId !== threadId));

      // if the current one was deleted → reset UI
      if (threadId === currThreadId) {
        createNewChat();
      }
    } catch (err) {
      console.error("Error deleting thread:", err.message);
    }
  };

  return (
    <section className="sidebar">
      {/* New Chat button */}
      <button onClick={createNewChat}>
        <img
          src="/blacklogo.png" 
          alt="GPT logo"
          className="logo"
        />
        <span>
          <i className="fa-solid fa-pen-to-square"></i>
        </span>
      </button>

      {/* Chat history list */}
      <ul className="history">
        {loading ? (
          <li className="loading">Loading chats...</li>
        ) : allThreads.length === 0 ? (
          <li className="empty">No chats yet</li>
        ) : (
          allThreads.map((thread) => (
            <li
              key={thread.threadId}
              onClick={() => changeThread(thread.threadId)}
              className={thread.threadId === currThreadId ? "highlighted" : ""}
            >
              {thread.title}
              <i
                className="fa-solid fa-trash"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteThread(thread.threadId);
                }}
              ></i>
            </li>
          ))
        )}
      </ul>

      {/* Footer */}
      <div className="sign">
        <p>By Prince Pandey &hearts;</p>
      </div>
    </section>
  );
}

export default Sidebar;
