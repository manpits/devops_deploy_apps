import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '../components/Navbar';
import StatCards from '../components/StatCards';
import ContactCard from '../components/ContactCard';
import ContactRow from '../components/ContactRow';
import ContactModal from '../components/ContactModal';
import ContactDetailModal from '../components/ContactDetailModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import Toast from '../components/Toast';
import api from '../api/axios';
import {
  Plus,
  Search,
  LayoutGrid,
  List,
  Calendar,
  Sparkles,
  Loader2,
  RefreshCw,
  Contact as ContactIcon,
  Filter,
} from 'lucide-react';

export default function DashboardPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [monthFilter, setMonthFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [detailContact, setDetailContact] = useState(null);
  const [deletingContact, setDeletingContact] = useState(null);

  // Toast state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/contacts');
      setContacts(response.data.data || response.data || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      showToast('Gagal memuat daftar kontak', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Filtered contacts based on search query and birthday month filter
  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => {
      const q = searchQuery.toLowerCase().trim();
      const matchName = contact.name?.toLowerCase().includes(q);
      const matchAddress = contact.address?.toLowerCase().includes(q);
      const matchPhone = contact.phones?.some((p) =>
        p.phone_number?.toLowerCase().includes(q)
      );
      const matchesSearch = !q || matchName || matchAddress || matchPhone;

      // Month filter
      let matchesMonth = true;
      if (monthFilter !== 'all' && contact.birth_date) {
        const birthMonth = new Date(contact.birth_date).getMonth().toString();
        matchesMonth = birthMonth === monthFilter;
      } else if (monthFilter !== 'all' && !contact.birth_date) {
        matchesMonth = false;
      }

      return matchesSearch && matchesMonth;
    });
  }, [contacts, searchQuery, monthFilter]);

  const handleSaveContact = async (payload, id = null) => {
    try {
      if (id) {
        const response = await api.put(`/contacts/${id}`, payload);
        const updated = response.data.data || response.data;
        setContacts((prev) =>
          prev.map((c) => (c.id === id ? updated : c))
        );
        showToast('Kontak berhasil diperbarui');
      } else {
        const response = await api.post('/contacts', payload);
        const created = response.data.data || response.data;
        setContacts((prev) => [created, ...prev]);
        showToast('Kontak baru berhasil ditambahkan');
      }
    } catch (error) {
      console.error('Save contact error:', error);
      throw error;
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingContact) return;
    try {
      await api.delete(`/contacts/${deletingContact.id}`);
      setContacts((prev) => prev.filter((c) => c.id !== deletingContact.id));
      showToast(`Kontak "${deletingContact.name}" berhasil dihapus`);
    } catch (error) {
      console.error('Delete contact error:', error);
      showToast('Gagal menghapus kontak', 'error');
    } finally {
      setDeletingContact(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Navigation */}
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stat Overview */}
        <StatCards contacts={contacts} />

        {/* Action Header: Search, Filters, Add Button */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama, nomor telepon, alamat..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white bg-slate-800 px-1.5 py-0.5 rounded"
              >
                Clear
              </button>
            )}
          </div>

          {/* Controls: Month filter, Layout switch, Refresh, Add Button */}
          <div className="flex items-center flex-wrap gap-2.5">
            {/* Birthday month filter */}
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <Calendar className="w-3.5 h-3.5 text-pink-400" />
              <select
                value={monthFilter}
                onChange={(e) => setMonthFilter(e.target.value)}
                className="bg-transparent focus:outline-none text-slate-200 text-xs"
              >
                <option value="all" className="bg-slate-900">Semua Bulan Lahir</option>
                <option value="0" className="bg-slate-900">Januari</option>
                <option value="1" className="bg-slate-900">Februari</option>
                <option value="2" className="bg-slate-900">Maret</option>
                <option value="3" className="bg-slate-900">April</option>
                <option value="4" className="bg-slate-900">Mei</option>
                <option value="5" className="bg-slate-900">Juni</option>
                <option value="6" className="bg-slate-900">Juli</option>
                <option value="7" className="bg-slate-900">Agustus</option>
                <option value="8" className="bg-slate-900">September</option>
                <option value="9" className="bg-slate-900">Oktober</option>
                <option value="10" className="bg-slate-900">November</option>
                <option value="11" className="bg-slate-900">Desember</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Tampilan Grid"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Tampilan Tabel"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Refresh */}
            <button
              onClick={fetchContacts}
              disabled={loading}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Segarkan Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            {/* Add Contact Button */}
            <button
              onClick={() => {
                setEditingContact(null);
                setIsModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 focus:ring-4 focus:ring-indigo-500/20 transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Kontak</span>
            </button>
          </div>
        </div>

        {/* Content Section */}
        {loading && contacts.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center text-slate-400 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            <p className="text-sm font-medium">Memuat data kontak...</p>
          </div>
        ) : filteredContacts.length === 0 ? (
          /* Empty State */
          <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-12 text-center my-8 backdrop-blur-sm">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <ContactIcon className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">
              {searchQuery || monthFilter !== 'all'
                ? 'Tidak Ada Kontak yang Cocok'
                : 'Belum Ada Kontak Tersimpan'}
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mb-6">
              {searchQuery || monthFilter !== 'all'
                ? 'Coba ganti kata kunci pencarian atau ubah filter bulan ulang tahun.'
                : 'Mulai kelola buku telepon pribadi Anda dengan menambahkan kontak pertama sekarang.'}
            </p>
            {searchQuery || monthFilter !== 'all' ? (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setMonthFilter('all');
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition-colors"
              >
                Reset Filter
              </button>
            ) : (
              <button
                onClick={() => {
                  setEditingContact(null);
                  setIsModalOpen(true);
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/30 inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Kontak Pertama</span>
              </button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid Card Layout */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredContacts.map((contact) => (
              <ContactCard
                key={contact.id}
                contact={contact}
                onEdit={(c) => {
                  setEditingContact(c);
                  setIsModalOpen(true);
                }}
                onDelete={(c) => setDeletingContact(c)}
                onView={(c) => setDetailContact(c)}
              />
            ))}
          </div>
        ) : (
          /* Table List Layout */
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl backdrop-blur-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900 text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4">Kontak</th>
                    <th className="py-3 px-4">Alamat</th>
                    <th className="py-3 px-4">Tgl Lahir</th>
                    <th className="py-3 px-4">Nomor Telepon</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContacts.map((contact) => (
                    <ContactRow
                      key={contact.id}
                      contact={contact}
                      onEdit={(c) => {
                        setEditingContact(c);
                        setIsModalOpen(true);
                      }}
                      onDelete={(c) => setDeletingContact(c)}
                      onView={(c) => setDetailContact(c)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <ContactModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingContact(null);
        }}
        onSave={handleSaveContact}
        contact={editingContact}
      />

      <ContactDetailModal
        isOpen={!!detailContact}
        onClose={() => setDetailContact(null)}
        contact={detailContact}
        onEdit={(c) => {
          setEditingContact(c);
          setIsModalOpen(true);
        }}
        onDelete={(c) => setDeletingContact(c)}
      />

      <DeleteConfirmModal
        isOpen={!!deletingContact}
        onClose={() => setDeletingContact(null)}
        onConfirm={handleDeleteConfirm}
        contactName={deletingContact?.name || ''}
      />
    </div>
  );
}
