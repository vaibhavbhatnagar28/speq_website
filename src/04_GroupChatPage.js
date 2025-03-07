import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { db, auth } from "./firebase";
import {
    collection,
    addDoc,
    doc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp,
} from "firebase/firestore";
import { FaPaperPlane, FaEdit, FaTrash } from "react-icons/fa";

const GroupChatPage = () => {
    const { groupId } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [editingMessageId, setEditingMessageId] = useState(null);
    const [editedMessage, setEditedMessage] = useState("");
    const chatEndRef = useRef(null);

    useEffect(() => {
        const messagesRef = collection(db, "groups", groupId, "messages");
        const q = query(messagesRef, orderBy("timestamp", "asc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedMessages = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setMessages(fetchedMessages);
        });

        return () => unsubscribe();
    }, [groupId]);

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const sendMessage = async () => {
        if (newMessage.trim() === "") return;
        await addDoc(collection(db, "groups", groupId, "messages"), {
            sender: auth.currentUser.uid,
            message: newMessage.trim(),
            timestamp: serverTimestamp(),
        });
        setNewMessage("");
    };

    const startEditing = (msg) => {
        setEditingMessageId(msg.id);
        setEditedMessage(msg.message);
    };

    const saveEdit = async (msgId) => {
        if (editedMessage.trim() === "") return;
        await updateDoc(doc(db, "groups", groupId, "messages", msgId), {
            message: editedMessage.trim(),
        });
        setEditingMessageId(null);
    };

    const deleteMessage = async (msgId) => {
        await deleteDoc(doc(db, "groups", groupId, "messages", msgId));
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100 text-black">
            <header className="p-4 bg-white text-black font-bold text-lg text-center shadow-md">
                Group Chat: {groupId}
            </header>

            <div className="flex-grow overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.sender === auth.currentUser.uid ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`relative max-w-xs p-3 rounded-2xl text-black shadow-md ${
                                msg.sender === auth.currentUser.uid
                                    ? "bg-blue-400 text-white self-end"
                                    : "bg-white text-black self-start"
                            }`}
                        >
                            <p className="text-xs font-bold text-gray-500">ADMIN</p>
                            <p className="mt-1">{msg.message}</p>
                            <p className="text-xs text-gray-400 mt-1 text-right">
                                {msg.timestamp?.toDate().toLocaleTimeString()}
                            </p>

                            {msg.sender === auth.currentUser.uid && (
                                <div className="flex justify-end space-x-2 mt-1">
                                    {editingMessageId === msg.id ? (
                                        <>
                                            <input
                                                type="text"
                                                value={editedMessage}
                                                onChange={(e) => setEditedMessage(e.target.value)}
                                                className="bg-gray-200 text-black p-1 rounded"
                                            />
                                            <button onClick={() => saveEdit(msg.id)} className="text-green-400">
                                                <FaPaperPlane />
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => startEditing(msg)} className="text-yellow-400">
                                                <FaEdit />
                                            </button>
                                            <button onClick={() => deleteMessage(msg.id)} className="text-red-400">
                                                <FaTrash />
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                <div ref={chatEndRef}></div>
            </div>

            {/* Input Box */}
            <div className="p-4 bg-white shadow-md flex">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-grow p-2 border rounded-full text-black bg-gray-200"
                />
                <button
                    onClick={sendMessage}
                    className="ml-2 bg-blue-500 text-white p-3 rounded-full flex items-center justify-center"
                >
                    <FaPaperPlane />
                </button>
            </div>
        </div>
    );
};

export default GroupChatPage;