import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  FolderOpen,
  FileText,
  Download,
  Eye,
  CheckCircle2,
  X
} from 'lucide-react';

export default function DocumentsView() {
  const { showToast } = useApp();
  const [docs, setDocs] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/documents');
      if (res.ok) {
        const data = await res.json();
        setDocs(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredDocs = categoryFilter === 'All'
    ? docs
    : docs.filter(d => d.category === categoryFilter);

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Documents</h1>
          <p className="page-desc">
            Central repository of problem briefs, technical proposals, pilot agreements, and audit reports.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <select
            className="form-select"
            style={{ width: '200px' }}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Problem Statement">Problem Briefs</option>
            <option value="Startup Registration">Registrations</option>
            <option value="Eligibility Documents">Eligibility</option>
            <option value="Technical Proposal">Proposals</option>
            <option value="Pilot Agreement">Agreements</option>
            <option value="Performance Report">Reports</option>
            <option value="Validation Report">Validation</option>
            <option value="Procurement Decision">Procurement</option>
          </select>
        </div>
      </div>

      {/* Documents Table */}
      <div className="table-container">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Document</th>
                <th>Category</th>
                <th>File</th>
                <th>Size</th>
                <th>Date</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.map((doc) => (
                <tr key={doc.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <FileText size={16} color="#475569" />
                      <span style={{ fontWeight: 600, color: '#0F172A' }}>{doc.title}</span>
                    </div>
                  </td>

                  <td>
                    <span style={{ fontSize: '0.78rem', color: '#64748B' }}>{doc.category}</span>
                  </td>

                  <td>
                    <code style={{ fontSize: '0.76rem', background: '#F1F5F9', padding: '2px 6px', borderRadius: '4px', color: '#334155' }}>
                      {doc.file_name}
                    </code>
                  </td>

                  <td>
                    <span style={{ fontSize: '0.78rem', color: '#64748B' }}>{doc.file_size}</span>
                  </td>

                  <td>
                    <span style={{ fontSize: '0.78rem', color: '#64748B' }}>{doc.upload_date}</span>
                  </td>

                  <td>
                    <span className="status-pill status-pill-success">
                      {doc.status}
                    </span>
                  </td>

                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setSelectedDoc(doc)}
                      >
                        <Eye size={12} />
                        <span>Preview</span>
                      </button>

                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => showToast(`Downloaded: ${doc.file_name}`)}
                      >
                        <Download size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Document Preview Modal */}
      {selectedDoc && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <div>
                <div className="modal-title">{selectedDoc.title}</div>
                <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                  {selectedDoc.file_name} • {selectedDoc.file_size}
                </div>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '24px', textAlign: 'center' }}>
                <FileText size={36} color="#2563EB" style={{ margin: '0 auto 10px' }} />
                <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#0F172A' }}>
                  Verified Procurement Record
                </div>
                <p style={{ fontSize: '0.82rem', color: '#64748B', maxWidth: '420px', margin: '6px auto 16px', lineHeight: 1.45 }}>
                  This official document is digitally archived in ProcureFlow. It contains authenticated telemetry benchmarks, compliance filings, and sign-offs.
                </p>

                <div style={{ display: 'inline-flex', gap: '8px' }}>
                  <span className="status-pill status-pill-success">Status: {selectedDoc.status}</span>
                  <span className="status-pill status-pill-draft">Uploaded: {selectedDoc.upload_date}</span>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setSelectedDoc(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  showToast(`Downloaded: ${selectedDoc.file_name}`);
                  setSelectedDoc(null);
                }}
              >
                <Download size={14} />
                <span>Download Document</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
