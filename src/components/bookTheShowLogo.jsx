import React from 'react';

export default function BookTheShowLogo() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex items-center space-x-1">
        <span className="text-xl font-bold text-indigo-900">book</span>
        <div className="bg-yellow-400 rounded-md transform rotate-6 px-3 py-1">
          <span className="text-xl font-bold text-indigo-900">the</span>
        </div>
        <span className="text-xl font-bold text-purple-800">show</span>
      </div>
      {/* <div className="mt-2 flex items-center">
        <div className="h-1 w-10 bg-yellow-400 rounded-full"></div>
        <div className="mx-2">
          <Ticket className="text-indigo-900 w-5 h-5" strokeWidth={2.5} />
        </div>
        <div className="h-1 w-10 bg-yellow-400 rounded-full"></div>
      </div> */}
    </div>
  );
}

function Ticket(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="M13 5v2" />
      <path d="M13 17v2" />
      <path d="M13 11v2" />
    </svg>
  );
}