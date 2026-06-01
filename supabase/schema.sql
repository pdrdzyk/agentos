-- AgentOS MVP schema (PRD §5)
-- Run in Supabase SQL editor when connecting persistence.

create extension if not exists "pgcrypto";

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  goal text not null,
  status text not null check (status in ('planning', 'active', 'completed')),
  created_at timestamptz not null default now()
);

create table if not exists task_groups (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  name text not null,
  lead_agent_role text not null,
  definition_of_done text not null,
  status text not null check (status in ('pending', 'active', 'reviewing', 'completed'))
);

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references task_groups(id) on delete cascade,
  name text not null,
  assignee text not null check (assignee in ('agent', 'human')),
  agent_role text,
  status text not null,
  output text,
  completion_criteria text not null
);

create table if not exists decisions (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references tasks(id) on delete cascade,
  question text not null,
  options jsonb not null,
  chosen_option text,
  needs_intervention boolean,
  intervention_reason text,
  created_at timestamptz not null default now()
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references task_groups(id) on delete cascade,
  task_id uuid references tasks(id) on delete set null,
  sender text not null,
  sender_role text,
  content text not null,
  type text not null,
  decision_id uuid references decisions(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists idx_task_groups_project on task_groups(project_id);
create index if not exists idx_tasks_group on tasks(group_id);
create index if not exists idx_messages_group on messages(group_id);
