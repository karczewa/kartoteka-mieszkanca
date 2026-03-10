import { NavLink } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="bg-blue-700 text-white shadow-md">
      <div className="max-w-5xl mx-auto px-4 flex items-center gap-8 h-14">
        <span className="font-bold text-lg tracking-wide">Kartoteka Mieszkańca</span>
        <div className="flex gap-1">
          <NavLink
            to="/mieszkancy"
            className={({ isActive }) =>
              `px-4 py-1.5 rounded text-sm font-medium transition-colors ${
                isActive ? 'bg-white text-blue-700' : 'hover:bg-blue-600'
              }`
            }
          >
            Mieszkańcy
          </NavLink>
          <NavLink
            to="/rejestr"
            className={({ isActive }) =>
              `px-4 py-1.5 rounded text-sm font-medium transition-colors ${
                isActive ? 'bg-white text-blue-700' : 'hover:bg-blue-600'
              }`
            }
          >
            Rejestr
          </NavLink>
        </div>
      </div>
    </nav>
  )
}
