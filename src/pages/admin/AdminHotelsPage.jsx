import React, { useState } from 'react';
import AdminLayout from './AdminLayout.jsx';
import { useApp } from '../../context/AppContext.jsx';
import {
  Store, Search, CheckCircle2, XCircle, Clock, FileText,
  ShieldCheck, AlertTriangle, ExternalLink, Phone, Mail, MapPin,
  Download, Eye, Filter, Sparkles, Building2, UserCheck, Check
} from 'lucide-react';

export default function AdminHotelsPage() {
  const { hotelVerifications, updateHotelVerification, showToast } = useApp();
  const [selectedHotelId, setSelectedHotelId] = useState(hotelVerifications[0]?.id || 'APP-8841');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Universal helper getters to handle schema variations safely
  const getHotelName = (h) => h?.name || h?.hotelName || 'Commercial Partner';
  const getOwnerName = (h) => h?.ownerName || h?.ownerContact || h?.managingPartner || 'Owner / Manager';
  const getCity = (h) => h?.city || (h?.hubAddress ? h.hubAddress.split(',').slice(-2)[0]?.trim() : 'Indore');
  const getAddress = (h) => h?.address || h?.hubAddress || 'Commercial Hub, Indore';
  const getFssai = (h) => h?.fssaiLicense || h?.fssaiNumber || 'FSSAI #1001901100234';
  const getGst = (h) => h?.gstNumber || h?.gstin || '23AABCS1429B1Z8';
  const getType = (h) => h?.type || (Array.isArray(h?.categories) ? h.categories.join(', ') : 'Kitchen & Restaurant');
  const getStatus = (h) => {
    const s = (h?.status || 'pending').toLowerCase();
    if (s.includes('verif') || s === 'active') return 'verified';
    if (s.includes('reject')) return 'rejected';
    return 'pending';
  };
  const getAppliedDate = (h) => h?.appliedDate || h?.registrationTime || 'Recent';

  const selectedHotel = hotelVerifications.find(h => h.id === selectedHotelId) || hotelVerifications[0];

  const filteredHotels = hotelVerifications.filter(h => {
    const q = (searchQuery || '').toLowerCase().trim();
    const name = getHotelName(h).toLowerCase();
    const owner = getOwnerName(h).toLowerCase();
    const city = getCity(h).toLowerCase();
    const fssai = getFssai(h).toLowerCase();
    const id = (h?.id || '').toLowerCase();

    const matchesSearch = !q || name.includes(q) || owner.includes(q) || city.includes(q) || fssai.includes(q) || id.includes(q);
    const hotelStatus = getStatus(h);
    const matchesStatus = statusFilter === 'all' || hotelStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = hotelVerifications.filter(h => getStatus(h) === 'pending').length;
  const verifiedCount = hotelVerifications.filter(h => getStatus(h) === 'verified').length;
  const rejectedCount = hotelVerifications.filter(h => getStatus(h) === 'rejected').length;

  return (
    <AdminLayout activePage="hotels">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">
              <span>Partner Compliance</span>
              <span>•</span>
              <span>FSSAI Verification Queue</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Hotel & Restaurant Onboarding Queue</h1>
            <p className="text-sm text-gray-500">
              Inspect kitchen safety certifications, FSSAI licenses, GSTIN compliance, and approve partner storefronts.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => showToast('Exported Verification Audit Report', 'success')}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 shadow-xs transition"
            >
              <Download className="w-4 h-4 text-gray-500" />
              <span>Export Audit Sheet</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs">
            <div className="text-xs font-semibold text-gray-500 uppercase">Pending Review</div>
            <div className="mt-1 flex items-baseline justify-between">
              <div className="text-2xl font-bold text-amber-600">
                {pendingCount}
              </div>
              <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Requires Action</span>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs">
            <div className="text-xs font-semibold text-gray-500 uppercase">Verified Partners</div>
            <div className="mt-1 flex items-baseline justify-between">
              <div className="text-2xl font-bold text-emerald-700">
                {verifiedCount}
              </div>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Active Sellers</span>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs">
            <div className="text-xs font-semibold text-gray-500 uppercase">Rejected Applications</div>
            <div className="mt-1 flex items-baseline justify-between">
              <div className="text-2xl font-bold text-rose-600">
                {rejectedCount}
              </div>
              <span className="text-xs font-medium text-gray-400">Non-compliant</span>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs">
            <div className="text-xs font-semibold text-gray-500 uppercase">Avg SLA Turnaround</div>
            <div className="mt-1 flex items-baseline justify-between">
              <div className="text-2xl font-bold text-gray-900">4.2 hrs</div>
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">&lt; 24h Target</span>
            </div>
          </div>
        </div>

        {/* Search & Status Pills */}
        <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by hotel name, owner, city, or FSSAI number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="inline-flex bg-gray-100 p-1 rounded-lg text-xs font-medium text-gray-600">
              {['all', 'pending', 'verified', 'rejected'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-md capitalize transition ${
                    statusFilter === st ? 'bg-white text-gray-900 font-bold shadow-xs' : 'hover:text-gray-900'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Split Queue Inspection View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* List Table (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-gray-200/80 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-900">Partner Applications ({filteredHotels.length})</h2>
              <span className="text-xs text-gray-500">Select partner to review full dossier</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50/75 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-100">
                  <tr>
                    <th className="py-3 px-4">Establishment</th>
                    <th className="py-3 px-3">Type & Location</th>
                    <th className="py-3 px-3">FSSAI / GST</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Quick Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {filteredHotels.map((hotel) => {
                    const isSelected = selectedHotel?.id === hotel.id;
                    const hotelStatus = getStatus(hotel);
                    const hotelName = getHotelName(hotel);
                    const ownerName = getOwnerName(hotel);
                    const city = getCity(hotel);
                    const type = getType(hotel);
                    const fssai = getFssai(hotel);
                    const gst = getGst(hotel);

                    return (
                      <tr
                        key={hotel.id}
                        onClick={() => setSelectedHotelId(hotel.id)}
                        className={`cursor-pointer transition hover:bg-emerald-50/40 ${
                          isSelected ? 'bg-emerald-50/70 font-medium' : ''
                        }`}
                      >
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-gray-900">{hotelName}</div>
                          <div className="text-[11px] text-gray-500">{ownerName} • {hotel.phone || '+91 98260 12345'}</div>
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="text-gray-800 font-medium">{type}</div>
                          <div className="text-[10px] text-gray-400">{city}</div>
                        </td>
                        <td className="py-3.5 px-3 font-mono text-[11px]">
                          <div className="text-gray-800 font-semibold">{fssai}</div>
                          <div className="text-[10px] text-gray-400">GST: {gst}</div>
                        </td>
                        <td className="py-3.5 px-3">
                          {hotelStatus === 'verified' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                              <CheckCircle2 className="w-3 h-3" /> Verified
                            </span>
                          )}
                          {hotelStatus === 'pending' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                              <Clock className="w-3 h-3" /> Pending Review
                            </span>
                          )}
                          {hotelStatus === 'rejected' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">
                              <XCircle className="w-3 h-3" /> Rejected
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            {hotelStatus !== 'verified' && (
                              <button
                                onClick={() => updateHotelVerification(hotel.id, 'verified')}
                                title="Approve Verification"
                                className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-md"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            )}
                            {hotelStatus !== 'rejected' && (
                              <button
                                onClick={() => updateHotelVerification(hotel.id, 'rejected')}
                                title="Reject Application"
                                className="p-1 text-rose-600 hover:bg-rose-50 rounded-md"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Detailed Review Dossier (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-xl border border-gray-200/80 shadow-xs p-5 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Partner Verification Dossier
                </span>
                <h3 className="text-lg font-bold text-gray-900 mt-1">{getHotelName(selectedHotel)}</h3>
                <p className="text-xs text-gray-500 font-mono">ID: {selectedHotel?.id} • Applied {getAppliedDate(selectedHotel)}</p>
              </div>
              <div>
                {getStatus(selectedHotel) === 'verified' && (
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Certified
                  </span>
                )}
                {getStatus(selectedHotel) === 'pending' && (
                  <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Under Audit
                  </span>
                )}
                {getStatus(selectedHotel) === 'rejected' && (
                  <span className="px-3 py-1 bg-rose-100 text-rose-800 rounded-full text-xs font-bold flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> Rejected
                  </span>
                )}
              </div>
            </div>

            {/* Contact & Location */}
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200/70 space-y-2 text-xs">
              <div className="font-bold text-gray-900 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-gray-500" />
                <span>{getHotelName(selectedHotel)} ({getType(selectedHotel)})</span>
              </div>
              <div className="flex items-start gap-1.5 text-gray-600">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                <span>{getAddress(selectedHotel)}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-gray-200/60 text-[11px]">
                <div className="flex items-center gap-1 text-gray-700">
                  <Phone className="w-3 h-3 text-gray-400" />
                  <span>{selectedHotel?.phone || '+91 98260 12345'}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-700">
                  <Mail className="w-3 h-3 text-gray-400" />
                  <span>{selectedHotel?.email || 'contact@kitchen.in'}</span>
                </div>
              </div>
            </div>

            {/* Compliance Certifications */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Statutory Compliance & Legal Certificates</span>
              </h4>

              <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">FSSAI 14-Digit License:</span>
                  <span className="font-mono font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200">
                    {getFssai(selectedHotel)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">GST Identification Number:</span>
                  <span className="font-mono font-bold text-gray-800 bg-white px-2 py-0.5 rounded border border-gray-200">
                    {getGst(selectedHotel)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Food Safety Supervisor:</span>
                  <span className="font-semibold text-gray-800">{getOwnerName(selectedHotel)}</span>
                </div>
              </div>
            </div>

            {/* Submitted Verification Documents */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                Submitted Verification Documents
              </h4>
              <div className="space-y-1.5">
                {['FSSAI_Certificate_Scan.pdf', 'GSTIN_Registration_Certificate.pdf', 'Commercial_Kitchen_Inspection.pdf'].map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-600" />
                      <span className="font-medium text-gray-800">{doc}</span>
                    </div>
                    <button
                      onClick={() => showToast(`Opening ${doc} for verification inspection`, 'info')}
                      className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
                    >
                      <span>View</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Decision Actions */}
            <div className="pt-3 border-t border-gray-100 flex gap-2">
              <button
                onClick={() => updateHotelVerification(selectedHotel.id, 'verified')}
                className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve & Authorize Live Sales</span>
              </button>
              <button
                onClick={() => updateHotelVerification(selectedHotel.id, 'rejected')}
                className="py-2.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
