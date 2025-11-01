-- Feedback Loop Logger Schema
-- Tracks decision outcomes for autopilot learning

-- Decision logs table
CREATE TABLE IF NOT EXISTS public.decision_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  decision_id TEXT NOT NULL,
  decision_type TEXT NOT NULL,
  outcome TEXT NOT NULL CHECK (outcome IN ('success', 'partial', 'failure')),
  effectiveness_score INTEGER NOT NULL CHECK (effectiveness_score >= 0 AND effectiveness_score <= 100),
  metrics JSONB DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_decision_logs_decision_type ON public.decision_logs(decision_type);
CREATE INDEX IF NOT EXISTS idx_decision_logs_decision_id ON public.decision_logs(decision_id);
CREATE INDEX IF NOT EXISTS idx_decision_logs_effectiveness ON public.decision_logs(effectiveness_score DESC);
CREATE INDEX IF NOT EXISTS idx_decision_logs_created_at ON public.decision_logs(created_at DESC);

-- RLS policies
ALTER TABLE public.decision_logs ENABLE ROW LEVEL SECURITY;

-- Admins can view all logs
CREATE POLICY "Decision logs viewable by admins only" ON public.decision_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Service role can insert logs (for backend services)
CREATE POLICY "Service can insert decision logs" ON public.decision_logs
  FOR INSERT WITH CHECK (true);

-- Grant permissions
GRANT SELECT ON public.decision_logs TO authenticated;
GRANT INSERT ON public.decision_logs TO authenticated;

