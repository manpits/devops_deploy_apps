import React from 'react';
import { Users, PhoneCall, Cake, Layers } from 'lucide-react';

export default function StatCards({ contacts }) {
  const totalContacts = contacts.length;
  
  const totalPhones = contacts.reduce(
    (acc, c) => acc + (c.phones ? c.phones.length : 0),
    0
  );

  const multiPhoneContacts = contacts.filter(
    (c) => c.phones && c.phones.length > 1
  ).length;

  const currentMonth = new Date().getMonth();
  const birthdaysThisMonth = contacts.filter((c) => {
    if (!c.birth_date) return false;
    const birthMonth = new Date(c.birth_date).getMonth();
    return birthMonth === currentMonth;
  }).length;

  const stats = [
    {
      title: 'Total Kontak',
      value: totalContacts,
      subtitle: `${totalPhones} nomor tersimpan`,
      icon: <Users className="w-5 h-5 text-indigo-400" />,
      color: 'from-indigo-500/20 to-indigo-500/5',
      borderColor: 'border-indigo-500/20',
      badgeColor: 'bg-indigo-500/10 text-indigo-300',
    },
    {
      title: 'Multi-Nomor',
      value: multiPhoneContacts,
      subtitle: 'Kontak dengan >1 nomor',
      icon: <Layers className="w-5 h-5 text-purple-400" />,
      color: 'from-purple-500/20 to-purple-500/5',
      borderColor: 'border-purple-500/20',
      badgeColor: 'bg-purple-500/10 text-purple-300',
    },
    {
      title: 'Ultah Bulan Ini',
      value: birthdaysThisMonth,
      subtitle: 'Bulan ' + new Date().toLocaleString('id-ID', { month: 'long' }),
      icon: <Cake className="w-5 h-5 text-pink-400" />,
      color: 'from-pink-500/20 to-pink-500/5',
      borderColor: 'border-pink-500/20',
      badgeColor: 'bg-pink-500/10 text-pink-300',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      {stats.map((item, idx) => (
        <div
          key={idx}
          className={`relative overflow-hidden rounded-2xl border ${item.borderColor} bg-gradient-to-br ${item.color} p-5 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] shadow-lg`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {item.title}
            </span>
            <div className={`p-2.5 rounded-xl ${item.badgeColor}`}>
              {item.icon}
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-extrabold text-white tracking-tight">
              {item.value}
            </h3>
            <span className="text-xs text-slate-400 font-medium">
              {item.subtitle}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
