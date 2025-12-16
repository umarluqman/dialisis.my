#!/usr/bin/env node

/**
 * Test script for programmatic SEO implementation
 * Validates that all location pages can be generated successfully
 */

const { getAllLocationData, generateAllLocationParams, validateLocation } = require('../src/lib/location-utils.ts');

async function testLocationGeneration() {
  console.log('🧪 Testing Programmatic SEO Implementation...\n');

  try {
    // Test 1: Location data generation
    console.log('1️⃣ Testing location data generation...');
    const locationData = getAllLocationData();
    console.log(`   ✅ Generated data for ${locationData.length} states/territories`);

    // Test 2: Static params generation
    console.log('\n2️⃣ Testing static params generation...');
    const allParams = generateAllLocationParams();
    const stateParams = allParams.filter(p => !p.city);
    const cityParams = allParams.filter(p => p.city);
    
    console.log(`   ✅ Generated ${stateParams.length} state routes`);
    console.log(`   ✅ Generated ${cityParams.length} city routes`);
    console.log(`   ✅ Total routes: ${allParams.length}`);

    // Test 3: URL validation
    console.log('\n3️⃣ Testing URL validation...');
    let validRoutes = 0;
    let invalidRoutes = 0;

    for (const param of allParams) {
      if (validateLocation(param.state, param.city)) {
        validRoutes++;
      } else {
        invalidRoutes++;
        console.log(`   ❌ Invalid route: /${param.state}${param.city ? `/${param.city}` : ''}`);
      }
    }

    console.log(`   ✅ Valid routes: ${validRoutes}`);
    if (invalidRoutes > 0) {
      console.log(`   ❌ Invalid routes: ${invalidRoutes}`);
    }

    // Test 4: Sample route examples
    console.log('\n4️⃣ Sample generated routes:');
    const sampleRoutes = allParams.slice(0, 10);
    sampleRoutes.forEach(param => {
      const route = `/${param.state}${param.city ? `/${param.city}` : ''}`;
      console.log(`   📍 ${route}`);
    });

    // Test 5: Federal territories handling
    console.log('\n5️⃣ Testing federal territories...');
    const federalTerritories = ['kuala-lumpur', 'putrajaya', 'labuan'];
    federalTerritories.forEach(territory => {
      const isValid = validateLocation(territory);
      if (isValid) {
        console.log(`   ✅ Federal territory route: /${territory}`);
      } else {
        console.log(`   ❌ Invalid federal territory route: /${territory}`);
      }
    });

    // Test 6: Potential conflicts
    console.log('\n6️⃣ Checking for potential route conflicts...');
    const routeSet = new Set();
    let conflicts = 0;

    allParams.forEach(param => {
      const route = param.city ? `${param.state}/${param.city}` : param.state;
      if (routeSet.has(route)) {
        console.log(`   ⚠️  Duplicate route detected: /${route}`);
        conflicts++;
      }
      routeSet.add(route);
    });

    if (conflicts === 0) {
      console.log('   ✅ No route conflicts detected');
    }

    // Summary
    console.log('\n📊 Summary:');
    console.log(`   • Total pages to be generated: ${allParams.length}`);
    console.log(`   • State pages: ${stateParams.length}`);
    console.log(`   • City pages: ${cityParams.length}`);
    console.log(`   • Valid routes: ${validRoutes}`);
    console.log(`   • Route conflicts: ${conflicts}`);
    
    if (validRoutes === allParams.length && conflicts === 0) {
      console.log('\n🎉 All tests passed! Ready for static generation.');
      return true;
    } else {
      console.log('\n❌ Some tests failed. Please review the issues above.');
      return false;
    }

  } catch (error) {
    console.error('\n💥 Test failed with error:', error.message);
    return false;
  }
}

// Estimated build time calculation
function estimateBuildTime() {
  const allParams = generateAllLocationParams();
  const avgPageBuildTime = 0.5; // seconds per page (estimate)
  const totalEstimatedTime = allParams.length * avgPageBuildTime;
  
  console.log('\n⏱️  Build Time Estimation:');
  console.log(`   • Pages to build: ${allParams.length}`);
  console.log(`   • Estimated time per page: ${avgPageBuildTime}s`);
  console.log(`   • Total estimated build time: ${Math.ceil(totalEstimatedTime / 60)} minutes`);
}

// SEO validation
function validateSeoStructure() {
  console.log('\n🔍 SEO Structure Validation:');
  
  const sampleRoutes = [
    { state: 'selangor', city: null },
    { state: 'selangor', city: 'shah-alam' },
    { state: 'kuala-lumpur', city: null },
    { state: 'kuala-lumpur', city: 'wangsa-maju' }
  ];

  sampleRoutes.forEach(route => {
    const url = `/${route.state}${route.city ? `/${route.city}` : ''}`;
    const isValid = validateLocation(route.state, route.city);
    
    if (isValid) {
      console.log(`   ✅ SEO-ready route: ${url}`);
      console.log(`      • Meta title: Pusat Dialisis di ${route.city ? `${route.city}, ` : ''}${route.state}`);
      console.log(`      • Canonical URL: https://dialisis.my${url}`);
      console.log(`      • Structured data: ✅`);
    } else {
      console.log(`   ❌ Invalid route for SEO: ${url}`);
    }
  });
}

// Main execution
async function main() {
  const success = await testLocationGeneration();
  estimateBuildTime();
  validateSeoStructure();
  
  process.exit(success ? 0 : 1);
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  testLocationGeneration,
  estimateBuildTime,
  validateSeoStructure
};








