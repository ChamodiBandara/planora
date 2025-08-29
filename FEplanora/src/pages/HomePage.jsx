import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Shield,ArrowRight } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();

 

  return ( <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 relative overflow-hidden">
   
      {/* Background */}
      <div className="absolute inset-0 bg-[url(G:\ProjectPlanora\FEplanora\src\assets\image5.jpg)] bg-cover bg-center bg-fixed opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-blue-900/80 to-slate-900/85"></div>

      {/* Glow Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-52 h-52 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-3 drop-shadow-2xl">
            Planora
          </h1>
          <p className="text-xl md:text-2xl text-gray-100 font-light">
          Event Management Platform
          </p>
        </div>

        {/* Description */}
        <div className="mb-10 max-w-3xl">
          <p className="text-lg md:text-xl text-gray-200 leading-relaxed">
               <p>An Event Management System with Task Coordination</p>
    Plan events, assign responsibilities, and keep your committee organized - all in one platform.
          </p>
        </div>

        {/* Login Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          {/* Admin Login */}
          <div 
            onClick={() => navigate ('admin/login')}
            className="group relative bg-gradient-to-br from-blue-800/25 to-blue-900/20 backdrop-blur-xl border border-blue-400/25 rounded-3xl p-8 cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-blue-700/35 hover:border-blue-300/50"
          >
            <div className="relative z-10">
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md shadow-blue-500/25">
                  <Shield className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Committee President
              </h3>
              <p className="text-gray-200 mb-6 text-base leading-relaxed">
                Access administrative features to create and manage campus events with full control.
              </p>
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg shadow-md hover:shadow-blue-500/30">
                Login as Admin
                 <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>

          {/* Member Login */}
          <div 
            onClick={() => navigate('member/login')}
            className="group relative bg-gradient-to-br from-purple-800/25 to-purple-900/20 backdrop-blur-xl border border-purple-400/25 rounded-3xl p-8 cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-purple-700/35 hover:border-purple-300/50"
          >
            <div className="relative z-10">
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-md shadow-purple-500/25">
                  <Users className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Committee Member
              </h3>
              <p className="text-gray-200 mb-6 text-base leading-relaxed">
                Join events, view schedules, register, and stay connected with your committee community.
              </p>
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium rounded-lg shadow-md hover:shadow-purple-500/30">
                Login as Member
              <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10">
          <p className="text-gray-400 text-sm">
            Empowering seamless event management experiences
          </p>
        </div>
      </div>
    </div>
  );
}
