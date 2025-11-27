// File: src/pages/sellerdashboard/team/TeamRow.jsx (JSX only)
import React, { useEffect, useState } from 'react';

export function TeamRow({ member, onEdit, onDelete, timeAgo }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = React.useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const initials = (member.name || 'U')
    .split(' ')
    .map((n) => n[0] || '')
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <tr className="align-middle border-b">
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
            {member.photo ? (
              <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
            ) : (
              <div className="text-blue-600 font-semibold">{initials}</div>
            )}
          </div>

          <div>
            <div className="text-gray-800 font-medium">{member.name}</div>
            <div className="text-gray-500 text-xs">{member.email || 'No Email'}</div>
          </div>
        </div>
      </td>

      <td className="px-4 py-4 text-gray-700">{member.role}</td>
      <td className="px-4 py-4 text-gray-500">{member.site || '---'}</td>
      <td className="px-4 py-4 text-sm text-gray-500">{timeAgo(member.lastActive || member.updatedAt || member.createdAt)} ago</td>
      <td className="px-4 py-4 relative" ref={menuRef}>
        <button aria-haspopup="true" aria-expanded={menuOpen} onClick={() => setMenuOpen((p) => !p)} className="px-2 py-1 rounded hover:bg-gray-100">⋮</button>

        {menuOpen && (
          <div role="menu" aria-label="actions" className="absolute right-2 mt-2 w-36 bg-white border rounded shadow z-50">
            <button onClick={() => { setMenuOpen(false); onEdit(); }} className="block w-full text-left px-3 py-2 hover:bg-gray-100">Edit</button>
            <button onClick={() => { setMenuOpen(false); onDelete(); }} className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-red-600">Delete</button>
          </div>
        )}
      </td>
    </tr>
  );
}
