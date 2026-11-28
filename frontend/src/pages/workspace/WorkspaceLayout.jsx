
import { Outlet } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'

function WorkspaceLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#EAF4FC]">
      <Sidebar />

      <main className="h-screen min-w-0 flex-1 overflow-y-auto p-6 md:p-10">
        <Outlet />
      </main>
    </div>
  )
}

export default WorkspaceLayout
