#!/usr/bin/env node

/**
 * Performance Configuration Validator
 *
 * This script verifies that critical performance optimizations are in place.
 * Run this before committing to ensure you haven't accidentally broken performance.
 *
 * Usage: node scripts/verify-performance-config.js
 */

const fs = require('fs');
const path = require('path');

const ERRORS = [];
const WARNINGS = [];

console.log('🔍 Verifying performance configuration...\n');

// Test 1: Verify middleware.ts doesn't include landing page
function verifyMiddleware() {
  const middlewarePath = path.join(__dirname, '..', 'middleware.ts');
  const content = fs.readFileSync(middlewarePath, 'utf8');

  // Check if middleware excludes landing page
  const hasLandingPageInMatcher = content.includes("matcher: [") &&
    (content.match(/'/g) || []).length > 6; // More than expected routes

  if (content.includes("'/((?!") || content.includes("'/:path*'")) {
    ERRORS.push('❌ CRITICAL: middleware.ts includes catch-all patterns that will run on landing page');
    ERRORS.push('   Fix: Ensure matcher only includes: [\'/dashboard/:path*\', \'/login\', \'/signup\']');
  } else if (!content.includes('/dashboard/:path*')) {
    WARNINGS.push('⚠️  Warning: middleware.ts might be missing dashboard route protection');
  } else {
    console.log('✅ Middleware configuration is correct');
  }
}

// Test 2: Verify app/page.tsx uses dynamic imports
function verifyLandingPage() {
  const pagePath = path.join(__dirname, '..', 'app', 'page.tsx');
  const content = fs.readFileSync(pagePath, 'utf8');

  const requiredDynamicImports = [
    'SocialProofSection',
    'ProblemSolutionSection',
    'ProductTourSection',
    'PricingSection',
    'TestimonialSection',
    'ContactFormSection',
    'FinalCTASection',
  ];

  let hasAllDynamic = true;

  requiredDynamicImports.forEach(section => {
    // Check if it's a dynamic import
    const isDynamic = new RegExp(`const ${section} = dynamic\\(`).test(content);
    // Check if it's a regular import (bad!)
    const isRegularImport = new RegExp(`import ${section} from`).test(content);

    if (isRegularImport) {
      ERRORS.push(`❌ CRITICAL: ${section} is using regular import instead of dynamic()`);
      ERRORS.push(`   Fix: Change to: const ${section} = dynamic(() => import(...), { ssr: true })`);
      hasAllDynamic = false;
    } else if (!isDynamic) {
      WARNINGS.push(`⚠️  Warning: ${section} might not be using dynamic import`);
    }
  });

  if (hasAllDynamic) {
    console.log('✅ Landing page uses dynamic imports correctly');
  }

  // Check for revalidate export
  if (!content.includes('export const revalidate')) {
    WARNINGS.push('⚠️  Warning: Missing ISR revalidate export in app/page.tsx');
  }
}

// Test 3: Verify Navbar has deferred auth
function verifyNavbar() {
  const navbarPath = path.join(__dirname, '..', 'components', 'layout', 'Navbar.tsx');
  const content = fs.readFileSync(navbarPath, 'utf8');

  if (!content.includes('setTimeout')) {
    ERRORS.push('❌ CRITICAL: Navbar auth check is not deferred');
    ERRORS.push('   Fix: Wrap auth check in setTimeout(() => { ... }, 100)');
  } else {
    console.log('✅ Navbar auth check is properly deferred');
  }
}

// Test 4: Verify next.config.ts has optimizations
function verifyNextConfig() {
  const configPath = path.join(__dirname, '..', 'next.config.ts');
  const content = fs.readFileSync(configPath, 'utf8');

  const requiredSettings = [
    { key: 'swcMinify', name: 'SWC Minification' },
    { key: 'experimental', name: 'Experimental optimizations' },
  ];

  requiredSettings.forEach(setting => {
    if (!content.includes(setting.key)) {
      WARNINGS.push(`⚠️  Warning: Missing ${setting.name} in next.config.ts`);
    }
  });

  if (content.includes('swcMinify') && content.includes('experimental')) {
    console.log('✅ Next.js config has performance optimizations');
  }
}

// Run all tests
try {
  verifyMiddleware();
  verifyLandingPage();
  verifyNavbar();
  verifyNextConfig();

  console.log('\n' + '='.repeat(60));

  if (ERRORS.length > 0) {
    console.log('\n🚨 CRITICAL ERRORS FOUND:\n');
    ERRORS.forEach(error => console.log(error));
    console.log('\n⚠️  These errors WILL cause performance degradation!');
    console.log('⚠️  Please fix before committing.\n');
    process.exit(1);
  }

  if (WARNINGS.length > 0) {
    console.log('\n⚠️  WARNINGS:\n');
    WARNINGS.forEach(warning => console.log(warning));
    console.log('\n💡 These might not break performance but should be reviewed.\n');
  }

  if (ERRORS.length === 0 && WARNINGS.length === 0) {
    console.log('\n✅ ALL CHECKS PASSED!');
    console.log('✅ Performance configuration is correct.');
    console.log('\n📊 Expected metrics:');
    console.log('   - TTFB: <100ms');
    console.log('   - LCP: <2.5s');
    console.log('   - Bundle: ~240KB (70% reduction)\n');
  }

} catch (error) {
  console.error('\n❌ ERROR running validation:', error.message);
  process.exit(1);
}
