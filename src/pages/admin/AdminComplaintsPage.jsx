import React, { useState } from 'react';
import AdminLayout from './AdminLayout.jsx';
import { useApp } from '../../context/AppContext.jsx';
import {
  MessageSquare, Search, CheckCircle2, Clock, AlertTriangle,
  User, Shield, Send
} from 'lucide-react';

export default function AdminComplaintsPage() {
  const { supportTickets, resolveTicket, showToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicketId, setSelectedTicketId] = useState(supportTickets[0]?.id || 't-1');
  const [resolutionNote, setResolutionNote] = useState('');

  const selectedTicket = supportTickets.find(t => t.id === selectedTicketId) || supportTickets[0];

  const filteredTickets = supportTickets.filter(t => {
    return t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
           t.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           t.id.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleResolve = () => {
    if (selectedTicket) {
      resolveTicket(selectedTicket.id);
      setResolutionNote('');
      showToast(`Support Ticket #${selectedTicket.id} marked as resolved`, 'success');
    }
  };

  return (
    <AdminLayout activePage="complaints">
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">
            <span>Customer Resolution</span>
            <span>•</span>
            <span>Quality Assurance</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Complaints & Support Tickets</h1>
          <p className="text-sm text-gray-500">
            Handle customer disputes, kitchen packaging reports, pickup window inquiries, and escrow refunds.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Ticket List (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-gray-200/80 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-900">Tickets Queue ({filteredTickets.length})</h2>
              <span className="text-xs text-gray-500">Average resolution: 18 mins</span>
            </div>

            <div className="divide-y divide-gray-100">
              {filteredTickets.map((ticket) => {
                const isSelected = selectedTicket?.id === ticket.id;
                return (
                  <div
                    key={ticket.id}
                    onClick={() => setSelectedTicketId(ticket.id)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition flex items-start justify-between gap-4 ${
                      isSelected ? 'bg-emerald-50/50 border-l-4 border-l-emerald-600' : ''
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-gray-700">#{ticket.id}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          ticket.priority === 'high' ? 'bg-rose-100 text-rose-800' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {ticket.priority} priority
                        </span>
                        {ticket.status === 'open' ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                            Open
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Resolved
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-gray-900 mt-1">{ticket.subject}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">
                        By {ticket.userName} ({ticket.userRole}) • {ticket.createdAt}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ticket Inspector (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-xl border border-gray-200/80 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <span className="text-xs font-bold text-gray-500">Ticket #{selectedTicket?.id}</span>
                <h3 className="text-base font-bold text-gray-900 mt-0.5">{selectedTicket?.subject}</h3>
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Requester:</span>
                <span className="font-bold text-gray-900">{selectedTicket?.userName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Role:</span>
                <span className="capitalize font-semibold text-gray-800">{selectedTicket?.userRole}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Created:</span>
                <span className="text-gray-700">{selectedTicket?.createdAt}</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Issue Description</label>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-800 leading-relaxed">
                {selectedTicket?.description}
              </div>
            </div>

            {selectedTicket?.status === 'open' ? (
              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold text-gray-700 block">Resolution Action & Reply</label>
                <textarea
                  rows="3"
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  placeholder="Enter resolution notes, refund authorization, or customer response..."
                  className="w-full p-2.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  onClick={handleResolve}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs transition flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark Resolved & Issue Credit</span>
                </button>
              </div>
            ) : (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>This ticket has been marked as resolved.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
