// import React, { useState } from 'react';
// import { Avatar, TextField, IconButton } from '@mui/material';
// import { Send, Search, EmojiEmotions, AttachFile } from '@mui/icons-material';
// import MatrixChat from './Matrixchat';

// const users = [
//   { id: 1, name: 'Ambrose', joined: '2 Jan 2023' },
//   { id: 2, name: 'John', joined: '2 Jan 2023' },
//   { id: 3, name: 'David', joined: '2 Jan 2023' },
//   { id: 4, name: 'Antony', joined: '2 Jan 2023' },
//   { id: 5, name: 'Albert', joined: '2 Jan 2023' },
//   { id: 6, name: 'Sandy', joined: '2 Jan 2023' },
// ];

// const messages = {
//   1: [
//     { sender: 'Admin', text: 'Hi there! I see you have an issue with your order.', time: '5:33 PM' },
//     { sender: 'Ambrose', text: 'Yes, I keep getting a payment processing error.', time: '5:33 PM' },
//   ],
//   2: [],
//   3: [],
// };

// const Chatapp = () => {
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [message, setMessage] = useState('');
//   const [selectedFile, setSelectedFile] = useState(null);

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar */}
//       {/* <div className="w-1/3 bg-white border-r">
//         <div className="p-4 border-b">
//           <div className="flex items-center bg-gray-100 p-2 rounded-full">
//             <Search sx={{ color: '#047235' }} />
//             <input
//               type="text"
//               placeholder="Search"
//               className="ml-2 w-full bg-transparent outline-none"
//             />
//           </div>
//         </div>
//         <ul className="bg-white">
//           {users.map((user) => (
//             <li
//               key={user.id}
//               className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 ${
//                 selectedUser === user.id ? 'bg-gray-100 border border-[#047235]' : ''
//               }`}
//               onClick={() => setSelectedUser(user.id)}
//             >
//               <Avatar className="mr-4" sx={{ bgcolor: '#047235' }}>{user.name[0]}</Avatar>
//               <div>
//                 <h3 className="text-sm font-semibold">{user.name}</h3>
//                 <p className="text-xs text-gray-500">Member Since {user.joined}</p>
//               </div>
//             </li>
//           ))}
//         </ul>
//       </div> */}

//       {/* Chat Section */}
//       <div className="flex-1 flex flex-col h-screen">
//         {/* Chat Header */}
//         <div className="p-4 bg-white border-b">
//           {selectedUser ? (
//             <h2 className="text-lg font-bold">
//               Chat with {users.find((user) => user.id === selectedUser)?.name}
//             </h2>
//           ) : (
//             <h2 className="text-lg font-bold">Select a user to start chatting</h2>
//           )}
//         </div>

//         {/* Chat Messages */}
//         <div className="flex-1 overflow-y-auto p-4 bg-white">
//           {selectedUser && messages[selectedUser] ? (
//             messages[selectedUser].map((msg, index) => (
//               <div
//                 key={index}
//                 className={`mb-4 p-3 rounded-lg ${
//                   msg.sender === 'Admin' ? 'text-right ml-auto' : 'text-left'
//                 } ${
//                   msg.sender === 'Admin' ? 'bg-[#F0FFF8]' : 'bg-gray-100'
//                 }`}
//               >
//                 <p className="text-sm">{msg.text}</p>
//                 <span className={`text-xs ${msg.sender === 'Admin' ? 'text-gray-200' : 'text-gray-500'}`}>
//                   {msg.time}
//                 </span>
//               </div>
//             ))
//           ) : (
//             <p className="text-gray-500">No messages yet.</p>
//           )}
//         </div>

//         {/* Message Input */}
//         {selectedUser && (
//           <div className="sticky bottom-0 bg-white border-t shadow-lg">
//             <div className="p-4">
//               <div className="flex items-center gap-2">
//                 {/* Message Input */}
//                 <TextField
//                   fullWidth
//                   size="small"
//                   variant="outlined"
//                   placeholder="Type a message"
//                   value={message}
//                   onChange={(e) => setMessage(e.target.value)}
//                 />

//                 {/* Emoji Button */}
//                 <IconButton color="default" size="small">
//                   <EmojiEmotions sx={{ color: '#047235' }} />
//                 </IconButton>

//                 {/* File Input */}
//                 <input
//                   type="file"
//                   id="file-input"
//                   className="hidden"
//                   onChange={(e) => setSelectedFile(e.target.files[0])}
//                 />
//                 <IconButton 
//                   color="default" 
//                   size="small"
//                   onClick={() => document.getElementById('file-input').click()}
//                 >
//                   <AttachFile sx={{ color: '#047235' }} />
//                 </IconButton>

//                 {/* Send Button */}
//                 <IconButton
//                   color="primary"
//                   onClick={() => {
//                     // Handle send message logic here
//                     console.log(`Send message to ${selectedUser}: ${message}`);
//                     if (selectedFile) {
//                       console.log('File to upload:', selectedFile);
//                     }
//                     setMessage('');
//                     setSelectedFile(null);
//                   }}
//                 >
//                   <Send sx={{ color: '#047235' }} />
//                 </IconButton>
//               </div>
//               {/* Show selected file name if any */}
//               {selectedFile && (
//                 <div className="mt-2 text-sm text-gray-600">
//                   Selected file: {selectedFile.name}
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
    

//       {/* <MatrixChat/> */}
//     </div>
//   );
// };

// export default Chatapp;








import React, { useState } from 'react';
import { Avatar, TextField, IconButton } from '@mui/material';
import { Send, Search, EmojiEmotions, AttachFile } from '@mui/icons-material';
import MatrixChat from './Matrixchat';

const users = [
  { id: 1, name: 'Ambrose', joined: '2 Jan 2023' },
  { id: 2, name: 'John', joined: '2 Jan 2023' },
  { id: 3, name: 'David', joined: '2 Jan 2023' },
  { id: 4, name: 'Antony', joined: '2 Jan 2023' },
  { id: 5, name: 'Albert', joined: '2 Jan 2023' },
  { id: 6, name: 'Sandy', joined: '2 Jan 2023' },
];

const messages = {
  1: [
    { sender: 'Admin', text: 'Hi there! I see you have an issue with your order.', time: '5:33 PM' },
    { sender: 'Ambrose', text: 'Yes, I keep getting a payment processing error.', time: '5:33 PM' },
  ],
  2: [],
  3: [],
};

const Chatapp = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  return (
    <div className="flex h-auto width-full bg-gray-100 overflow-y-auto">
    
{/* <iframe src="https://app.element.io/#/login" width="100%" height="auto" /> */}
{/* <iframe src="http://localhost:3000/#/login" width="100%" height="auto" /> */}
    

      <MatrixChat/>
    </div>
  );
};

export default Chatapp;