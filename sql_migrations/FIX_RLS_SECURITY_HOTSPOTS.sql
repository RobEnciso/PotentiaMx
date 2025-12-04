-- ============================================================================
-- SECURITY FIX: Row Level Security (RLS) Policies for Hotspots Table
-- ============================================================================
--
-- PURPOSE: This migration fixes RLS bypass vulnerabilities in the hotspots table
--
-- ISSUES FIXED:
-- 1. Previous policy used "FOR ALL" without proper WITH CHECK clause
-- 2. No validation of terreno_id ownership before INSERT operations
-- 3. Single catch-all policy instead of granular operation-specific policies
--
-- SECURITY IMPACT:
-- - Prevents users from creating hotspots in other users' terrenos
-- - Ensures all UPDATE/DELETE operations verify ownership
-- - Follows principle of least privilege with operation-specific policies
--
-- INSTRUCTIONS:
-- 1. Copy this entire SQL code
-- 2. Go to Supabase Dashboard → SQL Editor
-- 3. Paste and execute
-- 4. Verify no errors in the output
--
-- ROLLBACK: If issues occur, you can restore the old policy (NOT RECOMMENDED):
-- DROP POLICY IF EXISTS hotspots_select ON hotspots;
-- DROP POLICY IF EXISTS hotspots_insert ON hotspots;
-- DROP POLICY IF EXISTS hotspots_update ON hotspots;
-- DROP POLICY IF EXISTS hotspots_delete ON hotspots;
-- CREATE POLICY hotspots_modify ON hotspots FOR ALL USING (
--   EXISTS (SELECT 1 FROM terrenos WHERE id = hotspots.terreno_id AND user_id = auth.uid())
-- );
--
-- ============================================================================

-- Step 1: Drop the old vulnerable policy
DROP POLICY IF EXISTS hotspots_modify ON hotspots;

-- Step 2: Create granular, secure policies

-- ============================================================================
-- SELECT Policy: Users can view hotspots for their own terrenos
-- ============================================================================
CREATE POLICY hotspots_select ON hotspots
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM terrenos
      WHERE terrenos.id = hotspots.terreno_id
        AND terrenos.user_id = auth.uid()
    )
  );

-- ============================================================================
-- INSERT Policy: Users can only create hotspots in their own terrenos
-- ============================================================================
-- CRITICAL: Uses WITH CHECK to validate terreno_id ownership BEFORE insert
CREATE POLICY hotspots_insert ON hotspots
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM terrenos
      WHERE terrenos.id = hotspots.terreno_id
        AND terrenos.user_id = auth.uid()
    )
  );

-- ============================================================================
-- UPDATE Policy: Users can only update hotspots in their own terrenos
-- ============================================================================
-- CRITICAL: Validates ownership for both the current state (USING)
-- and the new state (WITH CHECK) to prevent ownership transfer attacks
CREATE POLICY hotspots_update ON hotspots
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1
      FROM terrenos
      WHERE terrenos.id = hotspots.terreno_id
        AND terrenos.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM terrenos
      WHERE terrenos.id = hotspots.terreno_id
        AND terrenos.user_id = auth.uid()
    )
  );

-- ============================================================================
-- DELETE Policy: Users can only delete hotspots from their own terrenos
-- ============================================================================
CREATE POLICY hotspots_delete ON hotspots
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1
      FROM terrenos
      WHERE terrenos.id = hotspots.terreno_id
        AND terrenos.user_id = auth.uid()
    )
  );

-- ============================================================================
-- Verification Query
-- ============================================================================
-- Run this query to verify the policies were created correctly:
--
-- SELECT
--   schemaname,
--   tablename,
--   policyname,
--   permissive,
--   roles,
--   cmd
-- FROM pg_policies
-- WHERE tablename = 'hotspots';
--
-- Expected output: 4 policies (hotspots_select, hotspots_insert, hotspots_update, hotspots_delete)
-- ============================================================================

-- ============================================================================
-- Testing Recommendations
-- ============================================================================
--
-- After applying this migration, test the following scenarios:
--
-- TEST 1: Verify you can create hotspots in YOUR OWN terrenos
-- TEST 2: Verify you CANNOT create hotspots in OTHER USERS' terrenos
-- TEST 3: Verify you can update/delete hotspots in your own terrenos
-- TEST 4: Verify you CANNOT update/delete hotspots in other users' terrenos
--
-- To test, create two users and attempt cross-user operations.
-- All unauthorized operations should fail with permission errors.
-- ============================================================================
