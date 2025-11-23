'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { AppShell, Container } from '../../components/layout/AppShell';
import { Button } from '../../components/ui/Button';
import { GuardMessage } from './components/GuardMessage';
import { LoadingState } from './components/LoadingState';
import { CoursesTab } from './components/CoursesTab';
import { IngestionPanel } from './components/IngestionPanel';
import {
  Activity,
  CalendarCheck,
  CalendarClock,
  CalendarDays,
  CalendarRange,
  Layers,
  MessageSquareText,
  TrendingUp,
  Users,
} from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();
  const { user, token, isAuthenticated, loading: authLoading } = useAuth();

  const buildApiUrl = useCallback((path) => {
    const rawApiBase = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';
    const trimmedApiBase = rawApiBase.replace(/\/$/, '');
    const apiBaseUrl = /\/api($|\/)/.test(trimmedApiBase)
      ? trimmedApiBase
      : `${trimmedApiBase}/api`;
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${apiBaseUrl}${normalizedPath}`;
  }, []);

  const isSuperuser = useMemo(() => {
    if (!user) return false;
    return !!user.isSuperuser || user.role === 'superadmin';
  }, [user]);

  const [tab, setTab] = useState('insights');
  const [courses, setCourses] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [files, setFiles] = useState([]);
  const [forceRecreate, setForceRecreate] = useState(false);
  const [ingestInfo, setIngestInfo] = useState(null);
  const [insights, setInsights] = useState(null);
  const [ingestLogs, setIngestLogs] = useState([]);

  const jsonHeaders = useMemo(
    () => ({
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }),
    [token]
  );

  useEffect(() => {
    if (isAuthenticated && !isSuperuser) {
      router.push('/Dashboard');
    }
  }, [isAuthenticated, isSuperuser, router]);

  const loadCourses = useCallback(async () => {
    try {
      const res = await fetch(buildApiUrl('/courses'));
      const data = await res.json();
      if (res.ok) {
        setCourses(data.courses || []);
      }
    } catch (err) {
      console.warn('Failed to load courses', err);
    }
  }, [buildApiUrl]);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const loadInsights = useCallback(async () => {
    try {
      const res = await fetch(buildApiUrl('/admin/insights'), { headers: jsonHeaders });
      const data = await res.json();
      if (res.ok) {
        setInsights(data);
      } else {
        setError(data?.message || 'Failed to load insights');
      }
    } catch (err) {
      setError(err.message);
    }
  }, [jsonHeaders, buildApiUrl]);

  useEffect(() => {
    loadInsights();
  }, [loadInsights]);

  const handleCreateCourse = useCallback(
    async (payload, reset) => {
      setSubmitting(true);
      setError('');
      try {
        const res = await fetch(buildApiUrl('/admin/courses'), {
          method: 'POST',
          headers: jsonHeaders,
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.message || 'Create failed');
        }
        reset?.();
        await loadCourses();
      } catch (err) {
        setError(err.message);
      } finally {
        setSubmitting(false);
      }
    },
    [jsonHeaders, loadCourses, buildApiUrl]
  );

  const handleDeleteCourse = useCallback(
    async (courseId) => {
      if (!courseId) return;
      if (!confirm(`Delete course ${courseId}? This does not drop vectors unless specified by backend.`)) {
        return;
      }
      setSubmitting(true);
      setError('');
      try {
        const res = await fetch(buildApiUrl(`/admin/courses/${courseId}`), {
          method: 'DELETE',
          headers: jsonHeaders,
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data?.message || 'Delete failed');
        }
        await loadCourses();
      } catch (err) {
        setError(err.message);
      } finally {
        setSubmitting(false);
      }
    },
    [jsonHeaders, loadCourses, buildApiUrl]
  );

  const handleCourseSelection = useCallback((courseId) => {
    setSelectedCourseId(courseId);
    setIngestInfo(null);
    setIngestLogs([]);
  }, []);

  const handleFilesSelected = useCallback((selectedFiles) => {
    setFiles(selectedFiles);
    setIngestInfo(null);
    setIngestLogs([]);
  }, []);

  const handleRemoveFile = useCallback((index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setIngestInfo(null);
  }, []);

  const handleIngest = useCallback(async () => {
    if (!selectedCourseId) {
      setError('Select a course before ingestion.');
      return;
    }
    if (files.length === 0) {
      setError('Select at least one .vtt file.');
      return;
    }

    setSubmitting(true);
    setError('');
    setIngestLogs([]);
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append('files', file));
      formData.append('forceRecreate', forceRecreate ? 'true' : 'false');

      const authHeaders = token ? { Authorization: `Bearer ${token}` } : undefined;

      const res = await fetch(buildApiUrl(`/admin/ingest/${selectedCourseId}`), {
        method: 'POST',
        headers: authHeaders,
        body: formData,
      });

      let data;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (!res.ok) {
        if (Array.isArray(data?.progress)) setIngestLogs(data.progress);
        throw new Error(data?.message || 'Ingestion failed');
      }

      const progress = Array.isArray(data?.progress) ? data.progress : [];
      setIngestLogs(progress);
      setIngestInfo({
        message: data?.message || 'Ingestion completed',
        upserted: data?.result?.upserted || 0,
        processedFiles: data?.result?.processedFiles ?? files.length,
        totalFiles: data?.result?.totalFiles ?? files.length,
        forceRecreate: data?.forceRecreate === true,
        progress,
      });

      setFiles([]);
      setForceRecreate(false);
      await loadCourses();
      if (tab === 'insights') {
        await loadInsights();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }, [files, forceRecreate, loadCourses, loadInsights, selectedCourseId, tab, token]);

  const handleNavigateDashboard = () => {
    router.push('/Dashboard');
  };

  if (authLoading) {
    return <LoadingState />;
  }

  if (!isAuthenticated) {
    return (
      <GuardMessage
        title="Authentication Required"
        description="Please log in to access the admin panel."
        actionLabel="Go to Login"
        onAction={() => router.push('/Login')}
      />
    );
  }

  if (!isSuperuser) {
    return (
      <GuardMessage
        title="Insufficient Permissions"
        description="Your account does not have superuser access. Contact an administrator."
        actionLabel="Return to Dashboard"
        onAction={() => router.push('/Dashboard')}
      />
    );
  }

  const messagesByCourseData = (insights?.messagesByCourse ?? [])
    .slice()
    .sort((a, b) => ((b?.messages ?? 0) - (a?.messages ?? 0)));
  const maxMessages = messagesByCourseData.reduce((max, entry) => Math.max(max, entry?.messages ?? 0), 0) || 1;
  const totalUsers = insights?.stats?.totalUsers ?? 0;
  const totalMessages = insights?.stats?.totalMessages ?? 0;
  const courseCount = insights?.courses?.length ?? 0;
  const userActivity = insights?.userActivity ?? {};
  const todaySignups = userActivity.today ?? 0;
  const weekSignups = userActivity.week ?? 0;
  const monthSignups = userActivity.month ?? 0;
  const activeNowUsers = userActivity.activeNow ?? 0;
  const avgMessagesPerCourse = messagesByCourseData.length
    ? Math.round(
      messagesByCourseData.reduce((sum, entry) => sum + (entry?.messages ?? 0), 0) /
      messagesByCourseData.length
    )
    : 0;
  const recentIngestions = (insights?.recentIngestions ?? []).slice(0, 6);
  const signupTrend = (insights?.signupTrend ?? []).slice();
  const maxSignupTrend = signupTrend.reduce((max, entry) => Math.max(max, entry?.signups ?? 0), 0) || 1;
  const ingestionStats = recentIngestions.reduce(
    (acc, entry) => {
      const status = (entry?.status ?? '').toLowerCase();
      if (['completed', 'success', 'succeeded'].includes(status)) {
        acc.completed += 1;
      } else if (['failed', 'error'].includes(status)) {
        acc.failed += 1;
      } else if (['running', 'processing', 'in-progress', 'pending', 'queued'].includes(status)) {
        acc.inflight += 1;
      } else {
        acc.other += 1;
      }
      return acc;
    },
    { completed: 0, failed: 0, inflight: 0, other: 0 }
  );
  const totalTrackedIngestions = Object.values(ingestionStats).reduce((sum, value) => sum + value, 0);
  const completionRate = totalTrackedIngestions
    ? Math.round((ingestionStats.completed / totalTrackedIngestions) * 100)
    : null;
  const topCourseLabel = messagesByCourseData[0]?._id ?? '—';

  return (
    <AppShell>
      <Container size="lg" className="py-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="border-white/20 bg-white/10 text-sm font-semibold text-white transition hover:bg-white/20 hover:text-black"
              onClick={handleNavigateDashboard}
            >
              Go to Dashboard
            </Button>
            <Button variant={tab === 'insights' ? 'secondary' : 'outline'} onClick={() => setTab('insights')} disabled={submitting}>Insights</Button>
            <Button variant={tab === 'courses' ? 'secondary' : 'outline'} onClick={() => setTab('courses')} disabled={submitting}>Courses</Button>
            <Button variant={tab === 'ingest' ? 'secondary' : 'outline'} onClick={() => setTab('ingest')} disabled={submitting}>Ingestion</Button>
          </div>
        </div>

        {error && (
          <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">{error}</div>
        )}

        {tab === 'courses' && (
          <CoursesTab
            courses={courses}
            submitting={submitting}
            onCreate={handleCreateCourse}
            onDelete={handleDeleteCourse}
          />
        )}

        {tab === 'ingest' && (
          <IngestionPanel
            courses={courses}
            selectedCourseId={selectedCourseId}
            onSelectCourse={handleCourseSelection}
            files={files}
            onFilesSelected={handleFilesSelected}
            onRemoveFile={handleRemoveFile}
            forceRecreate={forceRecreate}
            onToggleForceRecreate={setForceRecreate}
            ingestInfo={ingestInfo}
            onSubmit={handleIngest}
            submitting={submitting}
            logs={ingestLogs}
          />
        )}

        {tab === 'insights' && (
          <div className="space-y-6">
            {!insights && <div className="text-sm text-muted-foreground">Loading...</div>}
            {insights && (
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <MetricCard
                    icon={Users}
                    label="Total Users"
                    value={totalUsers.toLocaleString()}
                    helper={`${courseCount.toLocaleString()} courses onboarded`}
                    accent="from-emerald-400/50 via-emerald-500/10 to-transparent"
                  />
                  <MetricCard
                    icon={MessageSquareText}
                    label="Conversations"
                    value={totalMessages.toLocaleString()}
                    helper={`${avgMessagesPerCourse.toLocaleString()} avg / course`}
                    accent="from-sky-400/50 via-indigo-500/10 to-transparent"
                  />
                  <MetricCard
                    icon={Layers}
                    label="Active Courses"
                    value={courseCount.toLocaleString()}
                    helper={`Top course: ${topCourseLabel}`}
                    accent="from-purple-500/50 via-fuchsia-500/10 to-transparent"
                  />
                  <MetricCard
                    icon={CalendarClock}
                    label="Active Now"
                    value={activeNowUsers.toLocaleString()}
                    helper="Last 15 min"
                    accent="from-rose-400/50 via-amber-500/10 to-transparent"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <MetricCard
                    icon={CalendarCheck}
                    label="Signups Today"
                    value={todaySignups.toLocaleString()}
                    helper="Since midnight"
                    accent="from-sky-400/50 via-cyan-500/10 to-transparent"
                  />
                  <MetricCard
                    icon={CalendarRange}
                    label="Signups (7 days)"
                    value={weekSignups.toLocaleString()}
                    helper="Rolling week"
                    accent="from-indigo-400/50 via-blue-500/10 to-transparent"
                  />
                  <MetricCard
                    icon={CalendarDays}
                    label="Signups (month)"
                    value={monthSignups.toLocaleString()}
                    helper="Current month"
                    accent="from-emerald-400/50 via-lime-500/10 to-transparent"
                  />
                  <MetricCard
                    icon={TrendingUp}
                    label="Ingestion Success"
                    value={completionRate !== null ? `${completionRate}%` : '—'}
                    helper={`${ingestionStats.completed}/${totalTrackedIngestions || 0} completed recently`}
                    accent="from-amber-400/50 via-orange-500/10 to-transparent"
                  />
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                  <GlassPanel
                    title="Messages by Course"
                    description="Volume of user conversations across courses"
                    className="lg:col-span-2"
                  >
                    <CourseBarList data={messagesByCourseData} max={maxMessages} />
                  </GlassPanel>

                  <GlassPanel
                    title="Ingestion Pulse"
                    description="Snapshot of recent ingestion runs"
                  >
                    <IngestionSummary stats={ingestionStats} completionRate={completionRate} />
                  </GlassPanel>
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                  <GlassPanel
                    title="Signup Momentum"
                    description="New users joining over the last 7 days"
                    className="lg:col-span-2"
                  >
                    <SignupTrendChart data={signupTrend} max={maxSignupTrend} />
                  </GlassPanel>

                  <GlassPanel
                    title="Recent Ingestions"
                    description="Latest processing events across the platform"
                  >
                    <RecentIngestionList ingestions={recentIngestions} />
                  </GlassPanel>
                </div>
              </div>
            )}
          </div>
        )}

      </Container>
    </AppShell>
  );
}

function MetricCard({ icon: Icon, label, value, helper, accent }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl shadow-lg">
      <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-80`} />
      <div className="relative flex items-center gap-4 p-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-white/70">{label}</div>
          <div className="text-2xl font-semibold text-white">{value}</div>
          {helper && <div className="text-xs text-white/60">{helper}</div>}
        </div>
      </div>
    </div>
  );
}

function GlassPanel({ title, description, children, className = '' }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-2xl shadow-lg ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 opacity-70" />
      <div className="relative space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          {description && <p className="text-xs text-white/60">{description}</p>}
        </div>
        {children}
      </div>
    </div>
  );
}

function CourseBarList({ data, max }) {
  if (!data.length) {
    return <EmptyState message="No course conversations yet" />;
  }

  return (
    <div className="space-y-4">
      {data.map((item, index) => {
        const label = item?._id ?? `Course ${index + 1}`;
        const value = item?.messages ?? 0;
        const width = Math.max((value / max) * 100, value > 0 ? 8 : 0);

        return (
          <div key={label} className="space-y-1">
            <div className="flex items-center justify-between text-xs text-white/70">
              <span className="truncate pr-3 font-medium text-white/80">{label}</span>
              <span className="font-semibold text-white">{value.toLocaleString()}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-sky-400 via-indigo-400 to-fuchsia-400"
                style={{ width: `${width}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function IngestionSummary({ stats, completionRate }) {
  const rows = [
    { label: 'Completed', value: stats.completed, tone: 'from-emerald-400 via-emerald-500/60 to-teal-500/40' },
    { label: 'In Progress', value: stats.inflight, tone: 'from-sky-400 via-cyan-500/60 to-blue-500/40' },
    { label: 'Failed', value: stats.failed, tone: 'from-rose-400 via-pink-500/60 to-rose-600/40' },
    { label: 'Other', value: stats.other, tone: 'from-slate-400 via-slate-500/60 to-slate-600/40' },
  ];

  if (!rows.some(row => row.value > 0)) {
    return <EmptyState message="No recent ingestion activity" />;
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {rows.map(row => (
          <div key={row.label} className="space-y-1">
            <div className="flex items-center justify-between text-xs text-white/60">
              <span>{row.label}</span>
              <span className="font-semibold text-white">{row.value}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div className={`h-full rounded-full bg-gradient-to-r ${row.tone}`} style={{ width: `${Math.min(row.value * 20, 100)}%` }} />
            </div>
          </div>
        ))}
      </div>
      {completionRate !== null && (
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white/70">
          <Activity className="h-4 w-4 text-emerald-300" />
          <div>
            <div className="font-semibold text-white">{completionRate}% completion rate</div>
            <div className="text-white/60">Across the most recent ingestion runs</div>
          </div>
        </div>
      )}
    </div>
  );
}

function RecentIngestionList({ ingestions }) {
  if (!ingestions.length) {
    return <EmptyState message="No recent ingestions" />;
  }

  return (
    <div className="space-y-3">
      {ingestions.map(ing => {
        const courseLabel = ing?.courseId ?? 'Unknown course';
        const identifier = ing?._id ?? courseLabel;
        const timestamp = ing?.updatedAt || ing?.createdAt || null;
        const formattedTimestamp = timestamp ? formatTimestamp(timestamp) : null;

        return (
          <div
            key={identifier}
            className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur"
          >
            <div className="space-y-1">
              <div className="text-sm font-semibold text-white">{courseLabel}</div>
              {formattedTimestamp && <div className="text-xs text-white/60">{formattedTimestamp}</div>}
            </div>
            <StatusBadge status={ing?.status} />
          </div>
        );
      })}
    </div>
  );
}

function StatusBadge({ status }) {
  const normalized = (status ?? 'unknown').toLowerCase();
  const toneMap = {
    completed: 'border-emerald-400/60 bg-emerald-400/15 text-emerald-200',
    success: 'border-emerald-400/60 bg-emerald-400/15 text-emerald-200',
    succeeded: 'border-emerald-400/60 bg-emerald-400/15 text-emerald-200',
    running: 'border-sky-400/60 bg-sky-400/15 text-sky-200',
    processing: 'border-sky-400/60 bg-sky-400/15 text-sky-200',
    'in-progress': 'border-sky-400/60 bg-sky-400/15 text-sky-200',
    pending: 'border-amber-400/60 bg-amber-400/15 text-amber-200',
    queued: 'border-amber-400/60 bg-amber-400/15 text-amber-200',
    failed: 'border-rose-400/60 bg-rose-400/15 text-rose-200',
    error: 'border-rose-400/60 bg-rose-400/15 text-rose-200',
  };

  const badgeTone = toneMap[normalized] ?? 'border-white/40 bg-white/10 text-white/80';

  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium capitalize ${badgeTone}`}>
      {normalized.replace('-', ' ')}
    </span>
  );
}

function EmptyState({ message }) {
  return (
    <div className="rounded-xl border border-dashed border-white/10 bg-white/5 p-4 text-center text-xs text-white/60">
      {message}
    </div>
  );
}

function formatTimestamp(value) {
  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    return date.toLocaleString();
  } catch (err) {
    console.warn('Failed to format timestamp', err);
    return null;
  }
}

function SignupTrendChart({ data, max }) {
  if (!data.length) {
    return <EmptyState message="No recent signup activity" />;
  }

  return (
    <div className="flex h-36 items-end justify-between gap-4">
      {data.map((point) => {
        const value = point?.signups ?? 0;
        const height = Math.max((value / max) * 100, value > 0 ? 12 : 0);
        const dayLabel = formatDayLabel(point?.date);

        return (
          <div key={point?.date ?? Math.random()} className="flex w-full max-w-[56px] flex-col items-center gap-1">
            <div className="flex h-full w-full items-end justify-center">
              <div
                className="w-full rounded-t-xl bg-gradient-to-t from-sky-500 via-indigo-500 to-purple-400 shadow-lg"
                style={{ height: `${height}%` }}
              />
            </div>
            <div className="text-xs font-medium text-white/80">{dayLabel}</div>
            <div className="text-[10px] text-white/50">{value}</div>
          </div>
        );
      })}
    </div>
  );
}

function formatDayLabel(value) {
  if (!value) return '—';
  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString(undefined, { weekday: 'short' });
  } catch {
    return value;
  }
}