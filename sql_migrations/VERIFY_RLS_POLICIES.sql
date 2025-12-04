-- ============================================================================
-- VERIFICATION SCRIPT: RLS Policies for Hotspots Table
-- ============================================================================
--
-- PURPOSE: Verify that all security policies were created correctly
--
-- INSTRUCTIONS:
-- 1. Copy this SQL query
-- 2. Go to Supabase Dashboard → SQL Editor
-- 3. Paste and execute
-- 4. Review the results
--
-- EXPECTED OUTPUT: 4 policies
-- - hotspots_select (SELECT)
-- - hotspots_insert (INSERT)
-- - hotspots_update (UPDATE)
-- - hotspots_delete (DELETE)
-- ============================================================================

-- Query 1: List all policies for hotspots table
SELECT
  schemaname AS schema,
  tablename AS table,
  policyname AS policy_name,
  permissive AS is_permissive,
  roles,
  cmd AS operation,
  qual AS using_clause,
  with_check AS with_check_clause
FROM pg_policies
WHERE tablename = 'hotspots'
ORDER BY cmd;

-- ============================================================================
-- Expected Output:
-- ============================================================================
-- schema | table    | policy_name       | is_permissive | roles  | operation | using_clause           | with_check_clause
-- -------|----------|-------------------|---------------|--------|-----------|------------------------|------------------
-- public | hotspots | hotspots_select   | PERMISSIVE    | {public}| SELECT   | (EXISTS (...))         | NULL
-- public | hotspots | hotspots_insert   | PERMISSIVE    | {public}| INSERT   | NULL                   | (EXISTS (...))
-- public | hotspots | hotspots_update   | PERMISSIVE    | {public}| UPDATE   | (EXISTS (...))         | (EXISTS (...))
-- public | hotspots | hotspots_delete   | PERMISSIVE    | {public}| DELETE   | (EXISTS (...))         | NULL
-- ============================================================================

-- Query 2: Verify RLS is enabled on the hotspots table
SELECT
  schemaname,
  tablename,
  rowsecurity AS rls_enabled
FROM pg_tables
WHERE tablename = 'hotspots';

-- Expected: rls_enabled = true

-- Query 3: Count policies (should be 4)
SELECT COUNT(*) AS total_policies
FROM pg_policies
WHERE tablename = 'hotspots';

-- Expected: total_policies = 4
