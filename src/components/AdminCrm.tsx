import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Download,
  ExternalLink,
  LogOut,
  RefreshCw,
  Search,
  ShieldCheck,
} from 'lucide-react';
import { TranslationContent } from '../i18n/translations';
import {
  deleteLeadRequest,
  fetchLeadsRequest,
  getStoredAdminToken,
  loginAdminRequest,
  setStoredAdminToken,
  updateLeadRequest,
  verifyAdminSessionRequest,
} from '../lib/api';
import { ACTIVE_PLANS, LEAD_CONSTRAINTS, sanitizeText } from '../lib/validation';
import { LeadRecord, LeadStatus, PlanId } from '../types';

interface AdminCrmProps {
  copy: TranslationContent;
  onBackToSite: () => void;
}

export const AdminCrm: React.FC<AdminCrmProps> = ({ copy, onBackToSite }) => {
  const [token, setToken] = useState<string>(() => getStoredAdminToken());
  const [authReady, setAuthReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(false);

  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');
  const [planFilter, setPlanFilter] = useState<PlanId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [draftNotes, setDraftNotes] = useState<Record<string, string>>({});
  const [savedNoteId, setSavedNoteId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const loadLeads = useCallback(async (activeToken: string) => {
    if (!activeToken) return;
    setLoadingLeads(true);
    try {
      const list = await fetchLeadsRequest(activeToken);
      setLeads(list);
    } catch (err) {
      if (err instanceof Error && err.message === 'UNAUTHORIZED') {
        setStoredAdminToken('');
        setToken('');
        setIsAuthenticated(false);
      }
    } finally {
      setLoadingLeads(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!token) {
        if (mounted) {
          setIsAuthenticated(false);
          setAuthReady(true);
        }
        return;
      }

      const valid = await verifyAdminSessionRequest(token);
      if (!mounted) return;

      if (valid) {
        setIsAuthenticated(true);
        setAuthReady(true);
        loadLeads(token);
      } else {
        setStoredAdminToken('');
        setToken('');
        setIsAuthenticated(false);
        setAuthReady(true);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [token, loadLeads]);

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setLoggingIn(true);
    try {
      const issuedToken = await loginAdminRequest(passwordInput);
      setStoredAdminToken(issuedToken);
      setToken(issuedToken);
      setIsAuthenticated(true);
      setPasswordInput('');
      await loadLeads(issuedToken);
    } catch {
      setAuthError(copy.crm.invalidPasswordError);
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setStoredAdminToken('');
    setToken('');
    setIsAuthenticated(false);
    setLeads([]);
  };

  const handleStatusChange = async (leadId: string, nextStatus: LeadStatus) => {
    try {
      const updated = await updateLeadRequest(token, leadId, { status: nextStatus });
      setLeads((prev) => prev.map((l) => (l.id === leadId ? updated : l)));
    } catch (err) {
      console.error('Status update error:', err);
    }
  };

  const handleSaveNotes = async (lead: LeadRecord) => {
    const rawNote = draftNotes[lead.id] ?? lead.notes;
    const cleanNote = sanitizeText(rawNote, LEAD_CONSTRAINTS.NOTES_MAX);
    try {
      const updated = await updateLeadRequest(token, lead.id, { notes: cleanNote });
      setLeads((prev) => prev.map((l) => (l.id === lead.id ? updated : l)));
      setSavedNoteId(lead.id);
      setTimeout(() => {
        setSavedNoteId((curr) => (curr === lead.id ? null : curr));
      }, 1800);
    } catch (err) {
      console.error('Notes update error:', err);
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    try {
      await deleteLeadRequest(token, leadId);
      setLeads((prev) => prev.filter((l) => l.id !== leadId));
      setConfirmDeleteId(null);
    } catch (err) {
      console.error('Delete lead error:', err);
    }
  };

  const filteredLeads = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return leads.filter((lead) => {
      if (statusFilter !== 'all' && lead.status !== statusFilter) return false;
      if (planFilter !== 'all' && lead.selectedPlan !== planFilter) return false;
      if (q) {
        const matchName = lead.studentName.toLowerCase().includes(q);
        const matchPhone = lead.phone.toLowerCase().includes(q);
        const matchCampaign = lead.utmCampaign.toLowerCase().includes(q);
        if (!matchName && !matchPhone && !matchCampaign) return false;
      }
      return true;
    });
  }, [leads, statusFilter, planFilter, searchQuery]);

  const kpis = useMemo(() => {
    return {
      total: leads.length,
      newCount: leads.filter((l) => l.status === 'new').length,
      diagnosticCount: leads.filter((l) => l.status === 'diagnostic_scheduled').length,
      enrolledCount: leads.filter((l) => l.status === 'enrolled').length,
    };
  }, [leads]);

  const handleExportCsv = () => {
    const headers = [
      'ID',
      'Date',
      'Student Name',
      'Phone',
      'Grade',
      'Plan',
      'Price View',
      'Locale',
      'Status',
      'UTM Source',
      'UTM Medium',
      'UTM Campaign',
      'Notes',
    ];
    const escapeCsv = (val: string) => `"${val.replace(/"/g, '""')}"`;
    const rows = filteredLeads.map((l) => [
      escapeCsv(l.id),
      escapeCsv(new Date(l.createdAtMillis).toLocaleString('ru-KZ')),
      escapeCsv(l.studentName),
      escapeCsv(l.phone),
      escapeCsv(l.grade),
      escapeCsv(copy.form.planNames[l.selectedPlan] ?? l.selectedPlan),
      escapeCsv(copy.crm.paymentModeLabels[l.paymentMode] ?? l.paymentMode),
      escapeCsv(l.locale.toUpperCase()),
      escapeCsv(copy.crm.statusLabels[l.status]),
      escapeCsv(l.utmSource),
      escapeCsv(l.utmMedium),
      escapeCsv(l.utmCampaign),
      escapeCsv(l.notes),
    ]);

    const csvContent =
      '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `satosphere_leads_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const statuses: LeadStatus[] = [
    'new',
    'contacted',
    'diagnostic_scheduled',
    'enrolled',
    'archived',
  ];

  return (
    <div className="min-h-screen w-full overflow-x-clip bg-[#D3E3FC]/25 text-brand-ink">
      {/* Admin Top Bar */}
      <header className="border-b border-[#D3E3FC] bg-[#FFFFFF]">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-3 px-4 sm:gap-8 sm:px-6">
          <button
            type="button"
            onClick={onBackToSite}
            className="flex min-w-0 items-center gap-2 text-xs font-semibold text-brand-muted transition-colors hover:text-[#00887A] sm:text-sm"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="truncate">{copy.crm.backToSite}</span>
          </button>

          <span className="hidden font-display text-base font-bold tracking-tight text-brand-ink sm:inline whitespace-nowrap shrink-0">
            SATosphere CRM
          </span>

          <div className="flex items-center gap-2 shrink-0">
            {isAuthenticated && (
              <>
                <button
                  type="button"
                  onClick={() => loadLeads(token)}
                  disabled={loadingLeads}
                  className="flex items-center gap-1.5 rounded-lg border border-[#D3E3FC] bg-[#FFFFFF] px-3 py-2 text-xs font-semibold text-brand-ink transition-colors hover:bg-[#D3E3FC]/40 disabled:opacity-50 whitespace-nowrap shrink-0"
                >
                  <RefreshCw
                    className={`h-3.5 w-3.5 shrink-0 ${loadingLeads ? 'animate-spin' : ''}`}
                    aria-hidden="true"
                  />
                  <span className="hidden sm:inline">{copy.crm.refreshButton}</span>
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 rounded-lg border border-[#77A6F7]/60 bg-[#FFFFFF] px-3 py-2 text-xs font-semibold text-brand-ink transition-colors hover:bg-[#D3E3FC]/50 whitespace-nowrap shrink-0"
                >
                  <LogOut className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>{copy.crm.signOutButton}</span>
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 sm:py-10">
        {!authReady ? (
          <div className="py-20 text-center text-sm text-brand-muted">Загрузка...</div>
        ) : !isAuthenticated ? (
          <form
            onSubmit={handlePasswordLogin}
            className="mx-auto max-w-md rounded-xl border border-[#D3E3FC] bg-[#FFFFFF] p-6 sm:p-8"
          >
            <ShieldCheck className="h-7 w-7 text-[#00887A]" aria-hidden="true" />
            <h1 className="mt-4 font-display text-xl font-bold text-brand-ink">
              {copy.crm.signInPromptTitle}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-brand-muted">
              {copy.crm.signInPromptDesc}
            </p>

            <div className="mt-5">
              <label className="mb-1.5 block text-xs font-semibold text-brand-ink">
                {copy.crm.passwordLabel}
              </label>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  if (authError) setAuthError(null);
                }}
                placeholder={copy.crm.passwordPlaceholder}
                className="h-11 w-full rounded-lg border border-[#77A6F7]/55 bg-[#FFFFFF] px-3.5 text-sm text-brand-ink placeholder:text-brand-muted/60 focus:border-[#00887A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00887A]/25"
              />
            </div>

            {authError && (
              <p className="mt-3 rounded-lg bg-[#FFCCBC]/65 px-3 py-2 text-xs font-semibold text-brand-ink">
                {authError}
              </p>
            )}

            <button
              type="submit"
              disabled={loggingIn}
              className="mt-6 flex h-11 w-full items-center justify-center rounded-lg bg-[#00887A] px-5 text-sm font-semibold text-[#FFFFFF] transition-colors hover:bg-brand-teal-hover disabled:opacity-60"
            >
              {copy.crm.signInButton}
            </button>
          </form>
        ) : (
          <div className="min-w-0">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div className="min-w-0">
                <h1 className="font-display text-2xl font-bold tracking-tight text-brand-ink">
                  {copy.crm.title}
                </h1>
                <p className="mt-1 text-sm text-brand-muted">{copy.crm.subtitle}</p>
              </div>
              <button
                type="button"
                onClick={handleExportCsv}
                disabled={filteredLeads.length === 0}
                className="flex h-10 items-center justify-center gap-2 self-start rounded-lg bg-[#00887A] px-4 text-xs font-semibold text-[#FFFFFF] transition-colors hover:bg-brand-teal-hover disabled:opacity-50 sm:self-auto whitespace-nowrap shrink-0"
              >
                <Download className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>{copy.crm.exportCsv}</span>
              </button>
            </div>

            {/* KPI Summary Row */}
            <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              <div className="rounded-xl border border-[#D3E3FC] bg-[#FFFFFF] p-4 sm:p-5">
                <p className="text-xs text-brand-muted">{copy.crm.kpiTotal}</p>
                <p className="mt-2 font-mono text-2xl font-semibold tabular-nums text-brand-ink sm:text-3xl">
                  {kpis.total}
                </p>
              </div>
              <div className="rounded-xl border border-[#FFCCBC] bg-[#FFCCBC]/35 p-4 sm:p-5">
                <p className="text-xs font-medium text-brand-ink">{copy.crm.kpiNew}</p>
                <p className="mt-2 font-mono text-2xl font-semibold tabular-nums text-brand-ink sm:text-3xl">
                  {kpis.newCount}
                </p>
              </div>
              <div className="rounded-xl border border-[#D3E3FC] bg-[#FFFFFF] p-4 sm:p-5">
                <p className="text-xs text-brand-muted">{copy.crm.kpiDiagnostic}</p>
                <p className="mt-2 font-mono text-2xl font-semibold tabular-nums text-brand-ink sm:text-3xl">
                  {kpis.diagnosticCount}
                </p>
              </div>
              <div className="rounded-xl border border-[#00887A]/40 bg-[#FFFFFF] p-4 sm:p-5">
                <p className="text-xs text-brand-muted">{copy.crm.kpiEnrolled}</p>
                <p className="mt-2 font-mono text-2xl font-semibold tabular-nums text-[#00887A] sm:text-3xl">
                  {kpis.enrolledCount}
                </p>
              </div>
            </div>

            {/* Filter & Search Toolbar */}
            <div className="mt-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <div className="flex max-w-full flex-wrap items-center gap-1 rounded-lg bg-[#D3E3FC]/70 p-1">
                <button
                  type="button"
                  onClick={() => setStatusFilter('all')}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                    statusFilter === 'all'
                      ? 'bg-[#FFFFFF] text-brand-ink shadow-xs'
                      : 'text-brand-muted hover:text-brand-ink'
                  }`}
                >
                  {copy.crm.allStatuses}
                </button>
                {statuses.map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatusFilter(st)}
                    className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                      statusFilter === st
                        ? 'bg-[#FFFFFF] text-brand-ink shadow-xs'
                        : 'text-brand-muted hover:text-brand-ink'
                    }`}
                  >
                    {copy.crm.statusLabels[st]}
                  </button>
                ))}
              </div>

              <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center">
                <select
                  value={planFilter}
                  onChange={(e) => setPlanFilter(e.target.value as PlanId | 'all')}
                  className="h-10 w-full min-w-0 rounded-lg border border-[#77A6F7]/55 bg-[#FFFFFF] px-3 text-xs font-medium text-brand-ink focus:border-[#00887A] focus:outline-none sm:w-auto"
                >
                  <option value="all">{copy.crm.allPlans}</option>
                  {ACTIVE_PLANS.map((p) => (
                    <option key={p} value={p}>
                      {copy.form.planNames[p]}
                    </option>
                  ))}
                </select>

                <div className="relative min-w-0">
                  <Search
                    className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-brand-muted"
                    aria-hidden="true"
                  />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={copy.crm.searchPlaceholder}
                    className="h-10 w-full min-w-0 rounded-lg border border-[#77A6F7]/55 bg-[#FFFFFF] pr-3 pl-9 text-xs text-brand-ink placeholder:text-brand-muted/60 focus:border-[#00887A] focus:outline-none sm:w-64"
                  />
                </div>
              </div>
            </div>

            {/* Leads Table */}
            <div className="mt-6 w-full max-w-full min-w-0 overflow-x-auto rounded-xl border border-[#D3E3FC] bg-[#FFFFFF]">
              {loadingLeads ? (
                <div className="p-12 text-center text-sm text-brand-muted">
                  Загрузка заявок...
                </div>
              ) : filteredLeads.length === 0 ? (
                <div className="p-12 text-center text-sm text-brand-muted">
                  {copy.crm.emptyLeads}
                </div>
              ) : (
                <table className="w-full min-w-[960px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-[#D3E3FC] bg-[#D3E3FC]/45 text-xs font-semibold text-brand-muted">
                      <th className="px-4 py-3.5">{copy.crm.colStudent}</th>
                      <th className="px-4 py-3.5">{copy.crm.colContacts}</th>
                      <th className="px-4 py-3.5">{copy.crm.colProgram}</th>
                      <th className="px-4 py-3.5">{copy.crm.colSource}</th>
                      <th className="px-4 py-3.5">{copy.crm.colStatus}</th>
                      <th className="px-4 py-3.5">{copy.crm.colNotes}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D3E3FC] align-top">
                    {filteredLeads.map((lead) => {
                      const waDigits = lead.phone.replace(/\D/g, '');
                      const currentDraft = draftNotes[lead.id] ?? lead.notes;

                      return (
                        <tr key={lead.id} className="hover:bg-[#D3E3FC]/20">
                          <td className="px-4 py-4">
                            <p className="font-semibold text-brand-ink">{lead.studentName}</p>
                            <p className="mt-1 text-xs text-brand-muted">
                              <span className="font-mono tabular-nums">{lead.grade}</span>{' '}
                              {copy.form.gradeSuffix} · {lead.locale.toUpperCase()} ·{' '}
                              <span className="font-mono tabular-nums">
                                {new Date(lead.createdAtMillis).toLocaleString('ru-KZ', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </p>
                          </td>

                          <td className="px-4 py-4">
                            <p className="font-mono text-sm font-medium tabular-nums text-brand-ink">
                              {lead.phone}
                            </p>
                            <a
                              href={`https://wa.me/${waDigits}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-[#00887A] hover:underline whitespace-nowrap shrink-0"
                            >
                              <span>{copy.crm.whatsappAction}</span>
                              <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
                            </a>
                          </td>

                          <td className="px-4 py-4">
                            <p className="font-medium text-brand-ink">
                              {copy.form.planNames[lead.selectedPlan] ?? lead.selectedPlan}
                            </p>
                            <p className="mt-1 text-xs text-brand-muted">
                              {copy.crm.paymentModeLabels[lead.paymentMode] ?? lead.paymentMode}
                            </p>
                          </td>

                          <td className="px-4 py-4 font-mono text-xs tabular-nums text-brand-muted">
                            <p className="text-brand-ink">{lead.utmSource}</p>
                            <p className="mt-0.5 text-brand-muted/75">
                              {lead.utmMedium} / {lead.utmCampaign}
                            </p>
                          </td>

                          <td className="px-4 py-4">
                            <select
                              value={lead.status}
                              onChange={(e) =>
                                handleStatusChange(lead.id, e.target.value as LeadStatus)
                              }
                              className="h-9 w-44 rounded-lg border border-[#77A6F7]/55 bg-[#FFFFFF] px-2.5 text-xs font-semibold text-brand-ink focus:border-[#00887A] focus:outline-none"
                            >
                              {statuses.map((st) => (
                                <option key={st} value={st}>
                                  {copy.crm.statusLabels[st]}
                                </option>
                              ))}
                            </select>

                            <div className="mt-2">
                              {confirmDeleteId === lead.id ? (
                                <div className="flex items-center gap-2 text-xs">
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteLead(lead.id)}
                                    className="rounded bg-[#FFCCBC] px-2 py-0.5 font-semibold text-brand-ink hover:bg-[#FFCCBC]/80 whitespace-nowrap shrink-0"
                                  >
                                    {copy.crm.confirmDelete}
                                  </button>
                                  <span className="text-brand-muted">·</span>
                                  <button
                                    type="button"
                                    onClick={() => setConfirmDeleteId(null)}
                                    className="text-brand-muted hover:text-brand-ink whitespace-nowrap shrink-0"
                                  >
                                    {copy.crm.cancelDelete}
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setConfirmDeleteId(lead.id)}
                                  className="text-xs text-brand-muted/75 hover:text-brand-ink whitespace-nowrap shrink-0"
                                >
                                  {copy.crm.deleteAction}
                                </button>
                              )}
                            </div>
                          </td>

                          <td className="px-4 py-4">
                            <div className="flex items-start gap-2">
                              <textarea
                                rows={2}
                                maxLength={LEAD_CONSTRAINTS.NOTES_MAX}
                                value={currentDraft}
                                onChange={(e) =>
                                  setDraftNotes((prev) => ({
                                    ...prev,
                                    [lead.id]: e.target.value,
                                  }))
                                }
                                placeholder={copy.crm.notesPlaceholder}
                                className="w-56 rounded-lg border border-[#77A6F7]/55 bg-[#FFFFFF] px-2.5 py-1.5 text-xs text-brand-ink placeholder:text-brand-muted/60 focus:border-[#00887A] focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => handleSaveNotes(lead)}
                                className="h-8 rounded-lg border border-[#77A6F7] bg-[#D3E3FC]/55 px-2.5 text-xs font-semibold text-brand-ink transition-colors hover:bg-[#D3E3FC] whitespace-nowrap shrink-0"
                              >
                                {savedNoteId === lead.id
                                  ? copy.crm.savedNote
                                  : copy.crm.saveNote}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
