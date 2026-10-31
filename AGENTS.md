<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->


<!-- BEGIN:supabase-database-rules -->
## Supabase 데이터베이스 및 테이블 작업 규칙

테이블을 생성하거나 수정 및 액세스할 때 아래 보안 및 권한 규칙을 반드시 준수한다:

1. **명시적 권한 부여 (GRANT)**:
   - `anon`과 `authenticated` 역할(Role)이 PostgREST API를 통해 테이블에 접근할 수 있도록 명시적인 `GRANT` SQL 문(`SELECT`, `INSERT`, `UPDATE`, `DELETE` 등)을 반드시 포함한다.
   ```sql
   GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE <table_name> TO authenticated;
   GRANT SELECT ON TABLE <table_name> TO anon;
   ```

2. **RLS (Row Level Security) 활성화 및 정책(Policy) 작성**:
   - 모든 테이블에 대해 RLS를 필수로 활성화한다.
   ```sql
   ALTER TABLE <table_name> ENABLE ROW LEVEL SECURITY;
   ```
   - 인증된 유저(`authenticated`)만 데이터를 읽고 쓸 수 있도록 RLS 정책을 반드시 함께 작성한다.
   ```sql
   CREATE POLICY "Allow authenticated users to read"
   ON <table_name>
   FOR SELECT
   TO authenticated
   USING (true);

   CREATE POLICY "Allow authenticated users to insert/update/delete"
   ON <table_name>
   FOR ALL
   TO authenticated
   USING (auth.uid() = user_id)
   WITH CHECK (auth.uid() = user_id);
   ```
<!-- END:supabase-database-rules -->
