import React, { useState } from 'react';
import { useAdminLogic } from '../hooks/useAdminLogic';
import { Icons } from '../components/Icons';
import type { TabType, AdminUser, AdminAnnouncement } from '../types/admin';

const StatCard = ({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4 hover:shadow-md transition-shadow">
    <div className={`p-4 rounded-xl ${color} text-white shadow-md`}>{icon}</div>
    <div>
      <p className="text-gray-500 text-xs font-bold uppercase tracking-wide">{title}</p>
      <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
    </div>
  </div>
);

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, isDestructive }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-gray-100">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
            isDestructive ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
          }`}
        >
          {isDestructive ? <Icons.Trash /> : <Icons.Bolt />}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-8 leading-relaxed">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
          >
            Anuluj
          </button>
          <button
            onClick={onConfirm}
            className={`px-5 py-2.5 text-white rounded-lg transition font-medium shadow-sm ${
              isDestructive ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            Potwierdź
          </button>
        </div>
      </div>
    </div>
  );
};

const PaginationControls = ({ page, totalPages, setPage, search, setSearch }: any) => (
  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-gray-50 border-b border-gray-200">
    <div className="relative w-full sm:w-64">
      <input
        type="text"
        placeholder="Szukaj..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
      />
      <div className="absolute left-3 top-2.5 text-gray-400">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <button
        onClick={() => setPage((p: number) => Math.max(1, p - 1))}
        disabled={page === 1}
        className="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm disabled:opacity-50 hover:bg-gray-100"
      >
        Poprzednia
      </button>
      <span className="text-sm font-medium text-gray-700">
        Strona {page} z {totalPages}
      </span>
      <button
        onClick={() => setPage((p: number) => Math.min(totalPages, p + 1))}
        disabled={page === totalPages || totalPages === 0}
        className="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm disabled:opacity-50 hover:bg-gray-100"
      >
        Następna
      </button>
    </div>
  </div>
);

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const {
    data,
    loading,
    modal,
    setModal,
    openModal,
    executeAction,
    navigate,
    page,
    setPage,
    totalPages,
    search,
    setSearch,
  } = useAdminLogic(activeTab);

  const tabs = [
    { id: 'dashboard', label: 'Pulpit', icon: <Icons.Dashboard /> },
    { id: 'users', label: 'Użytkownicy', icon: <Icons.Users /> },
    { id: 'announcements', label: 'Ogłoszenia', icon: <Icons.Ads /> },
    { id: 'logs', label: 'Dziennik', icon: <Icons.Logs /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <ConfirmModal
        isOpen={modal.isOpen}
        title={modal.title}
        message={modal.message}
        onConfirm={executeAction}
        onCancel={() => setModal((prev) => ({ ...prev, isOpen: false }))}
        isDestructive={modal.type?.includes('delete') || modal.type === 'toggleBan'}
      />

      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Panel Administratora</h1>
              <p className="text-sm text-gray-500 mt-1">Zarządzanie systemem Market</p>
            </div>
            <div className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium border border-gray-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400"></span>
              Admin Access
            </div>
          </div>
          <div className="flex space-x-1 border-b border-gray-200 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`px-5 py-3 font-medium text-sm rounded-t-lg transition-all whitespace-nowrap flex items-center gap-2 border-b-2 
                                    ${
                                      activeTab === tab.id
                                        ? 'border-blue-600 text-blue-700 bg-blue-50/50'
                                        : 'border-transparent text-gray-500 hover:bg-gray-50'
                                    }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-blue-600"></div>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && data.stats && (
              <div className="space-y-6 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <StatCard
                    title="Użytkownicy"
                    value={data.stats.totalUsers}
                    icon={<Icons.Users />}
                    color="bg-indigo-600"
                  />
                  <StatCard
                    title="Ogłoszenia"
                    value={data.stats.totalAnnouncements}
                    icon={<Icons.Ads />}
                    color="bg-blue-600"
                  />
                  <StatCard
                    title="Nowe Dzisiaj"
                    value={data.stats.newAnnouncementsToday}
                    icon={<Icons.Bolt />}
                    color="bg-emerald-500"
                  />
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Icons.Bolt /> Ostatnie aktywności
                  </h2>
                  <div className="space-y-0">
                    {data.stats.recentLogs.map((log, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center p-4 hover:bg-gray-50 transition border-b border-gray-100 last:border-0"
                      >
                        <div className="flex items-center gap-4">
                          <span className="bg-gray-50 text-gray-600 border border-gray-200 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                            {log.action}
                          </span>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">{log.message}</span>
                            <span className="text-xs text-gray-500">
                              Przez: <span className="font-semibold">{log.username}</span>
                            </span>
                          </div>
                        </div>
                        <span className="text-xs text-gray-400 font-mono hidden sm:block">
                          {new Date(log.createdAt).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-fade-in">
                <PaginationControls
                  page={page}
                  totalPages={totalPages}
                  setPage={setPage}
                  search={search}
                  setSearch={setSearch}
                />
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 border-b text-gray-500 uppercase text-xs font-semibold">
                    <tr>
                      <th className="p-4">ID</th>
                      <th className="p-4">Użytkownik</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Rola</th>
                      <th className="p-4 text-right">Akcje</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data.users.map((u: AdminUser) => (
                      <tr
                        key={u.id}
                        className={`hover:bg-gray-50 transition ${
                          u.isBanned ? 'bg-red-50/30' : ''
                        }`}
                      >
                        <td className="p-4 text-gray-400 font-mono">#{u.id}</td>
                        <td className="p-4 font-medium">
                          {u.username}{' '}
                          {u.isBanned && (
                            <span className="text-red-700 bg-red-100 px-2 py-0.5 rounded text-[10px] font-bold ml-1 uppercase">
                              ZBANOWANY
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-gray-600">{u.email}</td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                              u.role === 'Admin'
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="p-4 text-right flex justify-end gap-2">
                          <button
                            onClick={() => navigate(`/users/${u.id}`)}
                            className="px-3 py-1.5 text-blue-700 bg-blue-50 rounded-lg text-xs font-semibold"
                          >
                            Profil
                          </button>
                          {u.role !== 'Admin' && (
                            <>
                              <button
                                onClick={() =>
                                  openModal(
                                    'toggleBan',
                                    u.id,
                                    'Blokada',
                                    `Zmienić status blokady dla ${u.username}?`
                                  )
                                }
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                                  u.isBanned
                                    ? 'text-green-700 bg-green-50'
                                    : 'text-orange-700 bg-orange-50'
                                }`}
                              >
                                {u.isBanned ? 'Odbanuj' : 'Zbanuj'}
                              </button>
                              <button
                                onClick={() =>
                                  openModal(
                                    'deleteUser',
                                    u.id,
                                    'Usuń użytkownika',
                                    'Usunąć użytkownika trwale?'
                                  )
                                }
                                className="px-3 py-1.5 text-red-700 bg-red-50 rounded-lg text-xs font-semibold"
                              >
                                Usuń
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'announcements' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-fade-in">
                <PaginationControls
                  page={page}
                  totalPages={totalPages}
                  setPage={setPage}
                  search={search}
                  setSearch={setSearch}
                />
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 border-b text-gray-500 uppercase text-xs font-semibold">
                    <tr>
                      <th className="p-4">ID</th>
                      <th className="p-4">Tytuł</th>
                      <th className="p-4">Autor</th>
                      <th className="p-4">Cena</th>
                      <th className="p-4 text-right">Akcje</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data.announcements.map((a: AdminAnnouncement) => (
                      <tr key={a.id} className="hover:bg-gray-50 transition">
                        <td className="p-4 text-gray-400 font-mono">#{a.id}</td>
                        <td
                          className="p-4 font-medium text-blue-600 cursor-pointer hover:underline"
                          onClick={() => navigate(`/announcements/${a.id}`)}
                        >
                          {a.title}
                        </td>
                        <td className="p-4 text-gray-700">{a.author}</td>
                        <td className="p-4 font-bold text-gray-900">
                          {a.price.toLocaleString()} zł
                        </td>
                        <td className="p-4 text-right flex justify-end gap-2">
                          <button
                            onClick={() => navigate(`/announcements/${a.id}`)}
                            className="px-3 py-1.5 text-blue-700 bg-blue-50 rounded-lg text-xs font-semibold"
                          >
                            Podgląd
                          </button>
                          <button
                            onClick={() =>
                              openModal(
                                'deleteAnnouncement',
                                a.id,
                                'Usuń ogłoszenie',
                                'Usunąć ogłoszenie?'
                              )
                            }
                            className="px-3 py-1.5 text-red-700 bg-red-50 rounded-lg text-xs font-semibold"
                          >
                            Usuń
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'logs' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-fade-in">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 border-b text-gray-500 uppercase text-xs font-semibold">
                    <tr>
                      <th className="p-4">Data</th>
                      <th className="p-4">Akcja</th>
                      <th className="p-4">Użytkownik</th>
                      <th className="p-4">Opis</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data.logs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50 transition text-gray-600">
                        <td className="p-4 text-xs whitespace-nowrap">
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                        <td className="p-4 font-bold uppercase text-[10px] tracking-wider">
                          {log.action}
                        </td>
                        <td className="p-4 text-gray-900 font-medium">{log.username}</td>
                        <td className="p-4">{log.message}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
