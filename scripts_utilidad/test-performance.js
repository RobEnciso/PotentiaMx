/**
 * Performance Testing Script
 * Tests TTFB on production URL to diagnose cold start issues
 */

const https = require('https');

const PRODUCTION_URL = process.env.PRODUCTION_URL || 'https://potentiamx.com';

console.log('🔍 Testing performance on:', PRODUCTION_URL);
console.log('━'.repeat(60));

function testTTFB(url, testName) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    let ttfb = null;

    const req = https.get(url, (res) => {
      ttfb = Date.now() - startTime;
      const totalTime = Date.now() - startTime;

      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        const endTime = Date.now() - startTime;

        console.log(`\n📊 ${testName}`);
        console.log('─'.repeat(60));
        console.log(`⏱️  TTFB (Time to First Byte): ${ttfb}ms`);
        console.log(`⏱️  Total Download Time: ${endTime}ms`);
        console.log(`📦 HTML Size: ${(body.length / 1024).toFixed(2)} KB`);
        console.log(`🔢 Status Code: ${res.statusCode}`);
        console.log(`🌐 Server: ${res.headers['server'] || 'Unknown'}`);
        console.log(`💾 Cache: ${res.headers['x-nf-request-id'] ? 'Netlify' : 'Unknown'}`);

        // Analyze TTFB
        if (ttfb < 100) {
          console.log('✅ EXCELLENT: Static HTML served instantly');
        } else if (ttfb < 500) {
          console.log('✅ GOOD: Acceptable server response time');
        } else if (ttfb < 2000) {
          console.log('⚠️  WARNING: Slower than expected');
        } else {
          console.log('❌ CRITICAL: Cold start detected - middleware/SSR blocking');
        }

        // Check if HTML contains static markers
        const isStatic = body.includes('<!DOCTYPE html>') && body.length > 10000;
        console.log(`📄 Static HTML: ${isStatic ? '✅ YES' : '❌ NO (SSR)'}`);

        resolve({
          ttfb,
          totalTime: endTime,
          size: body.length,
          statusCode: res.statusCode,
          isStatic,
        });
      });
    });

    req.on('error', (err) => {
      console.error('❌ Request failed:', err.message);
      reject(err);
    });

    req.setTimeout(30000, () => {
      console.error('❌ Request timeout (30s)');
      req.destroy();
      reject(new Error('Timeout'));
    });
  });
}

async function runTests() {
  try {
    // Test 1: Landing page
    await testTTFB(PRODUCTION_URL + '/', 'Test 1: Landing Page (/)');

    // Wait 2 seconds between tests
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Test 2: Landing page again (should be even faster if cached)
    await testTTFB(PRODUCTION_URL + '/', 'Test 2: Landing Page (/) - Second Request');

    console.log('\n' + '━'.repeat(60));
    console.log('✅ Performance tests completed');
    console.log('━'.repeat(60));
  } catch (error) {
    console.error('❌ Tests failed:', error.message);
    process.exit(1);
  }
}

runTests();
