import React, { useState } from 'react';

export default function UpdateEmployee() {
  const [projectCode, setProjectCode] = useState('');
  const [coordinatorName, setCoordinatorName] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    // Handle form submission logic here
    console.log({ projectCode, coordinatorName, password });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-300 to-purple-400">
      <div className="relative w-full max-w-md">
        
        <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full relative overflow-hidden">
          {/* Pink circle decoration */}
          <div className="absolute -left-16 top-0 w-40 h-40 rounded-full bg-pink-500 opacity-20"></div>
          
          {/* Yellow circle decoration */}
          <div className="absolute -right-16 bottom-0 w-40 h-40 rounded-full bg-yellow-300 opacity-20"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl font-semibold text-white text-center mb-8">
              Update Employee
            </h2>
            
            <div className="mb-6">
              <label className="block text-indigo-300 text-sm mb-2" htmlFor="projectCode">
                Project Code
              </label>
              <input 
                id="projectCode"
                type="text" 
                className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white" 
                value={projectCode}
                onChange={(e) => setProjectCode(e.target.value)}
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-indigo-300 text-sm mb-2" htmlFor="coordinatorName">
                Coordinator Name
              </label>
              <input 
                id="coordinatorName"
                type="text" 
                className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white" 
                value={coordinatorName}
                onChange={(e) => setCoordinatorName(e.target.value)}
              />
            </div>
            
            <div className="mb-8">
              <label className="block text-indigo-300 text-sm mb-2" htmlFor="password">
                Password
              </label>
              <input 
                id="password"
                type="password" 
                className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <button 
              onClick={handleSubmit} 
              className="w-full py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition duration-200"
            >
              Enter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}