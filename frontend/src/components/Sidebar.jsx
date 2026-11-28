
import {
  LayoutDashboard,
  FilePlus,
  History,
  Users,
  Settings,
  LogOut,
} from 'lucide-react'

import { NavLink } from 'react-router-dom'

const navigation = [
  { name: 'Overview', path: '/workspace', icon: LayoutDashboard },
  { name: 'Create Invoice', path: '/workspace/create-invoice', icon: FilePlus },
  { name: 'Invoice History', path: '/workspace/invoices', icon: History },
  { name: 'Clients', path: '/workspace/clients', icon: Users },
  { name: 'Settings', path: '/workspace/settings', icon: Settings },
]

function Sidebar() {
  return (
    <aside className="flex h-screen w-64 flex-col border-r border-[#173B5E]/10 bg-white px-5 py-6">

      {/* Brand */}
      <div className="mb-10 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#173B5E] text-white">
          <span className="text-2xl font-bold">I</span>
        </div>
        <span className="text-2xl font-bold text-[#173B5E]">
          Invoqta<span className="text-[#E97863]">.</span>
        </span>
      </div>

      {/* Navigation */}
      <p className="mb-4 px-3 text-xs font-bold tracking-widest text-[#173B5E]/40">
        WORKSPACE
      </p>

      <nav className="flex flex-col gap-2">
        {navigation.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/workspace'}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-[#EAF4FC] text-[#173B5E]'
                    : 'text-[#173B5E]/65 hover:bg-[#EAF4FC]/70'
                }`
              }
            >
              <Icon size={19} />
              {item.name}
            </NavLink>
          )
        })}
      </nav>

      {/* Account */}
      <div className="mt-auto border-t border-[#173B5E]/10 pt-5">
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EAF4FC] font-bold text-[#173B5E]">
            U
          </div>
          <div>
            <p className="text-sm font-bold text-[#173B5E]">Your Account</p>
            <p className="text-xs text-[#173B5E]/50">Freelancer</p>
          </div>
        </div>
      </div>

    </aside>
  )
}

export default Sidebar
