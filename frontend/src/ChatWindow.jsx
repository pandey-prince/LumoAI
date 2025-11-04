import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect, useCallback } from "react";
import { ScaleLoader } from "react-spinners";

function ChatWindow() {
  const {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setPrevChats,
    setNewChat,
  } = useContext(MyContext);

  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // ✅ send message function
  const getReply = useCallback(async () => {
    if (!prompt.trim() || loading) return; // prevent empty or duplicate sends

    setLoading(true);
    setNewChat(false);

    try {
      const response = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: prompt,
          threadId: currThreadId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const res = await response.json();
      setReply(res.reply || "No response received");
    } catch (err) {
      console.error("Error fetching chat reply:", err);
      setReply("⚠️ Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }, [prompt, currThreadId, loading]);

  // ✅ append conversation to chat history
  useEffect(() => {
    if (prompt && reply) {
      setPrevChats((prev) => [
        ...prev,
        { role: "user", content: prompt },
        { role: "assistant", content: reply },
      ]);
      setPrompt("");
    }
  }, [reply]);

  // ✅ dropdown toggle
  const handleProfileClick = () => setIsOpen((prev) => !prev);

  return (
    <div className="chatWindow">
      {/* Navbar */}
      <div className="navbar">
        <span className="title">
          LumoAI{" "}
          <i className={`fa-solid fa-chevron-${isOpen ? "up" : "down"}`}></i>
        </span>
        <div className="userIconDiv" onClick={handleProfileClick}>
          <span className="userIcon">
            <i className="fa-solid fa-user"></i>
          </span>
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="dropDown">
          <div className="dropDownItem">
            <i className="fa-solid fa-gear"></i> Settings
          </div>
          <div className="dropDownItem">
            <i className="fa-solid fa-cloud-arrow-up"></i> Upgrade plan
          </div>
          <div className="dropDownItem">
            <i className="fa-solid fa-arrow-right-from-bracket"></i> Log out
          </div>
        </div>
      )}

      {/* Chat Display */}
      <Chat />

      {/* Loader */}
      {loading && (
        <div className="loaderWrapper">
          <ScaleLoader color="#fff" loading={loading} />
        </div>
      )}

      {/* Input Box */}
      <div className="chatInput">
        <div className="inputBox">
          <input
            placeholder="Ask anything..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && getReply()}
            disabled={loading}
          />
          <div
            id="submit"
            onClick={getReply}
            style={{
              opacity: loading ? 0.5 : 1,
              pointerEvents: loading ? "none" : "auto",
            }}
          >
            <i className="fa-solid fa-paper-plane"></i>
          </div>
        </div>

        <p className="info">
          LumoAI can make mistakes. Check important info. See Cookie
          Preferences.
        </p>
      </div>
    </div>
  );
}

export default ChatWindow;
