import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight, Check } from 'lucide-react';

export default function ScaleUpView() {
  const { showToast } = useApp();
  const [solutions, setSolutions] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Scale Parameters
  const [scaleDepts, setScaleDepts] = useState(5);
  const [scaleDistricts, setScaleDistricts] = useState(20);
  const [totalDeployments, setTotalDeployments] = useState(25);

  useEffect(() => {
    fetchSolutions();
  }, []);

  const fetchSolutions = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/scale');
      if (res.ok) {
        const data = await res.json();
        setSolutions(data);
        if (data.length > 0 && !selectedId) {
          const ready = data.find(s => s.status === 'READY FOR SCALE-UP') || data[0];
          setSelectedId(ready.id);
          setScaleDepts(ready.scale_departments > 1 ? ready.scale_departments : 5);
          setScaleDistricts(ready.scale_districts > 1 ? ready.scale_districts : 20);
          setTotalDeployments(ready.total_deployments > 1 ? ready.total_deployments : 25);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleScaleSolution = async (solutionId) => {
    try {
      setSubmitting(true);
      const res = await fetch(`/api/scale/${solutionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scale_departments: scaleDepts,
          scale_districts: scaleDistricts,
          total_deployments: totalDeployments
        })
      });

      if (res.ok) {
        showToast("Scale-up initiated.");
        fetchSolutions();
      } else {
        alert("Action failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Unable to initiate scale-up. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const current = solutions.find(s => s.id === selectedId) || solutions[0];
  const isScaled = current?.status === 'SOLUTION SCALED';

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Scale-Up</h1>
          <p className="page-desc">
            Expand validated innovations to additional public departments and districts.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '20px' }}>
        {/* Left: Solution Selector */}
        <div>
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#0F172A', marginBottom: '8px' }}>
            Validated Solutions ({solutions.length})
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {solutions.map((sol) => {
              const isSelected = sol.id === (current ? current.id : null);
              const solScaled = sol.status === 'SOLUTION SCALED';

              return (
                <div
                  key={sol.id}
                  onClick={() => {
                    setSelectedId(sol.id);
                    setScaleDepts(sol.scale_departments > 1 ? sol.scale_departments : 5);
                    setScaleDistricts(sol.scale_districts > 1 ? sol.scale_districts : 20);
                    setTotalDeployments(sol.total_deployments > 1 ? sol.total_deployments : 25);
                  }}
                  style={{
                    border: isSelected ? '1px solid #0F172A' : '1px solid #E2E8F0',
                    background: '#FFFFFF',
                    borderRadius: '6px',
                    padding: '10px 12px',
                    cursor: 'pointer',
                    boxShadow: isSelected ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.86rem', color: '#0F172A' }}>
                      {sol.startup_name}
                    </span>
                    <span className={`status-pill ${solScaled ? 'status-pill-success' : 'status-pill-open'}`}>
                      {solScaled ? 'Scaled' : 'Ready'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '2px' }}>
                    {sol.solution_name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Scale Workspace */}
        {current ? (
          <div>
            <div className="card">
              <div style={{ paddingBottom: '16px', borderBottom: '1px solid #E2E8F0', marginBottom: '20px' }}>
                <div style={{ fontSize: '0.78rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>
                  Solution Ready for Scale
                </div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', marginTop: '2px' }}>
                  {current.startup_name} — {current.solution_name}
                </h2>
                <div style={{ fontSize: '0.84rem', color: '#475569', marginTop: '2px' }}>
                  Originating Department: {current.department || 'Public Works Department'}
                </div>
              </div>

              {/* Current Deployment vs Expansion Scope */}
              <div className="grid-2" style={{ marginBottom: '24px' }}>
                <div style={{ background: '#F8FAFC', padding: '14px 16px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>
                    Current Deployment
                  </div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', marginTop: '4px' }}>
                    1 Department
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px' }}>
                    Single municipal testbed location
                  </div>
                </div>

                <div style={{ background: '#F8FAFC', padding: '14px 16px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>
                    Potential Expansion
                  </div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#059669', marginTop: '4px' }}>
                    5 Departments, 20 Districts
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px' }}>
                    25 target municipal deployment zones
                  </div>
                </div>
              </div>

              {/* Simple Progress Timeline */}
              <div style={{ marginBottom: '24px', background: '#F8FAFC', padding: '14px 18px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '0.76rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', marginBottom: '10px' }}>
                  Scale Progress Timeline
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0F172A', fontWeight: 600 }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#059669' }} />
                    <span>Procurement Approved</span>
                  </div>
                  <span style={{ color: '#CBD5E1' }}>→</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0F172A', fontWeight: 600 }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: isScaled ? '#059669' : '#2563EB' }} />
                    <span>{isScaled ? 'Scale Sanctioned' : 'Expansion Plan'}</span>
                  </div>
                  <span style={{ color: '#CBD5E1' }}>→</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: isScaled ? '#0F172A' : '#64748B', fontWeight: isScaled ? 600 : 400 }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: isScaled ? '#059669' : '#CBD5E1' }} />
                    <span>Multi-District Rollout</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '16px', borderTop: '1px solid #E2E8F0' }}>
                {!isScaled ? (
                  <button
                    className="btn btn-primary"
                    onClick={() => handleScaleSolution(current.id)}
                    disabled={submitting}
                  >
                    <span>{submitting ? 'Initiating...' : 'Start Scale-Up'}</span>
                    <ArrowRight size={14} />
                  </button>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#059669', fontSize: '0.86rem', fontWeight: 600 }}>
                    <Check size={16} />
                    <span>Scale-up active across 5 Departments and 20 Districts</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ padding: '32px', textAlign: 'center', color: '#64748B' }}>
            Select a solution to review scale-up expansion.
          </div>
        )}
      </div>
    </div>
  );
}
