import React, { useEffect, useState } from "react";
import axiosInstance,{baseURL} from "../config/AxiosHelper";
import { useNavigate } from "react-router-dom";

const ChatsPage = () => {
  const [chats, setChats] = useState({});
  const [names, setNames] = useState({});
  const [loading, setLoading] = useState(true);
  const [unreadMap, setUnreadMap] = useState({});
  const userEmail = localStorage.getItem("email");
  const userRole = localStorage.getItem("userRole");
  const navigate = useNavigate();

  useEffect(() => {
    if (!userEmail || !userRole) return;

    const fetchChats = async () => {
      try {
        const response = await axiosInstance.get(
          `${baseURL}/chat/all`,
          { params: { carrierEmail: userEmail } } // assuming only carriers can see this page
        );

        const chatData = response.data || {};
        setChats(chatData);

        const unread = {};
        for (const sender in chatData) {
          const msgs = chatData[sender];
          unread[sender] = msgs.some(
            (msg) => msg.senderEmail === sender && msg.read === false
          );
        }
        setUnreadMap(unread);

        const uniqueEmails = Object.keys(chatData);
        await fetchNames(uniqueEmails);
      } catch (error) {
        console.error("Error fetching chats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
    const interval = setInterval(fetchChats, 10000);
    return () => clearInterval(interval);
  }, [userEmail, userRole]);

  const fetchNames = async (emails) => {
    const updatedNames = { ...names };
    for (const email of emails) {
      try {
        const res = await axiosInstance.get(
          `${baseURL}/users/name`,
          { params: { email } }
        );
        updatedNames[email] = res.data;
      } catch {
        updatedNames[email] = email;
      }
    }
    setNames(updatedNames);
  };

  const renderSkeleton = () => (
    <ul className="space-y-4">
      {[...Array(4)].map((_, idx) => (
        <li
          key={idx}
          className="p-5 bg-gray-200 animate-pulse rounded-xl shadow-sm"
        >
          <div className="h-4 bg-gray-300 rounded w-1/3 mb-2" />
          <div className="h-3 bg-gray-300 rounded w-2/3" />
        </li>
      ))}
    </ul>
  );

  const sortedSenders = Object.keys(chats).sort((a, b) => {
    const aMsgs = chats[a];
    const bMsgs = chats[b];
    const aLast = aMsgs[aMsgs.length - 1]?.timestamp || 0;
    const bLast = bMsgs[bMsgs.length - 1]?.timestamp || 0;
    return new Date(bLast) - new Date(aLast);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white p-4 sm:p-6">
      <div className="max-w-5xl mx-auto bg-white p-4 sm:p-6 rounded-2xl shadow-lg animate-fadeIn">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center sm:text-left">
          Chats with Senders
        </h2>

        {loading ? (
          renderSkeleton()
        ) : sortedSenders.length > 0 ? (
          <ul className="space-y-4">
            {sortedSenders.map((otherEmail) => {
              const messages = chats[otherEmail] || [];
              const lastMessage = messages[messages.length - 1];
              const isUnread = unreadMap[otherEmail];

              const senderEmail =
                userRole === "sender" ? userEmail : otherEmail;
              const carrierEmail =
                userRole === "carrier" ? userEmail : otherEmail;
              const roomId = `${senderEmail}_${carrierEmail}`;

              return (
                <li
                  key={otherEmail}
                  onClick={() => navigate(`/join-chat?roomId=${roomId}`)}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-5 rounded-xl shadow-sm transition-all duration-200 cursor-pointer ${
                    isUnread
                      ? "bg-indigo-100 border-l-4 border-indigo-500 animate-pulse-fast"
                      : "bg-gray-50 hover:shadow-md hover:bg-gray-100"
                  }`}
                >
                  <div className="flex-1">
                    <div className="text-lg sm:text-xl font-semibold text-indigo-700 truncate">
                      {names[otherEmail] || otherEmail}
                    </div>
                    <div className="text-sm text-gray-600 mt-1 truncate max-w-full">
                      {lastMessage ? (
                        <span
                          className={`italic ${isUnread ? "font-bold" : ""}`}
                        >
                          {lastMessage.message}
                        </span>
                      ) : (
                        <span className="italic text-gray-400">
                          No messages yet
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 min-w-[150px] text-right">
                    <span className="text-xs text-gray-400">{otherEmail}</span>
                    <span className="text-xs text-gray-400 hidden sm:block">
                      Tap to open chat →
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-center text-gray-500 py-8">No chats available.</p>
        )}
      </div>
    </div>
  );
};

export default ChatsPage;
