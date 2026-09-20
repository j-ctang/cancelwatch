create table memberships (
  id uuid primary key default gen_random_uuid(),
  token text not null,               -- shared across all rows for one email; not unique per row
  email text not null,
  activity_name text not null,
  start_date date not null,
  cycle_days int not null,
  notice_days int not null,
  next_deadline date not null,
  canceled_at timestamptz,
  created_at timestamptz not null default now()
);

create index memberships_token_idx on memberships (token);
create index memberships_email_idx on memberships (email);
