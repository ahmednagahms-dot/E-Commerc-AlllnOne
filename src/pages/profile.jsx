// ProfilePage.jsx
import { Camera } from 'lucide-react';
import { useState } from 'react';

export default function ProfilePage() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    phone:'' ,
  });

  const handleSave = () => {
    console.log('Saved', form);
    
  }

  return (
    <div >
      <h1 className="text-2xl font-bold p-4 ml-18">My Profile</h1>
      <p className="text-gray-500 mb-6 ml-18 ">Manage your personal information.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="bg-white p-8 rounded-2xl shadow-sm border text-center w-[500px] ml-18 border border-white border border-[80px]">
          <div className="relative inline-block">
            <div className="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto">
              ahmed_l
            </div>
            <button className="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full text-white">
              <Camera size={16}/>
            </button>
          </div>
          <h3 className="mt-4 font-semibold">ahmed_lead</h3>
          <p className="text-sm text-gray-500">ahmednagahsharaf@gmail.com</p>
          <span className="inline-block mt-2 px-3 py-1 bg-purple-100 text-purple-600 text-xs font-medium rounded-full">
            Admin
          </span>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border w-[700px] border border-white border border[80px] mr-10">
          <h3 className="font-semibold mb-4">Personal Information</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Username</label>
              <input type="text" value={form.username}
                onChange={e => setForm({...form, username: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"/>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Email address</label>
              <input type="email" value={form.email} 
                              onChange={e => setForm({...form, email: e.target.value})}

                className="w-full border rounded-lg px-3 py-2 bg-gray-50 text-gray-500"/>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Phone number</label>
              <input type="tel" value={form.phone}
                onChange={e => setForm({...form, phone: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"/>
            </div>

            <button onClick={handleSave}
              className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700">
              Save Changes
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}