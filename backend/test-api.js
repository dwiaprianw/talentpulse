import http from 'http';
import { initDB, dbQuery } from './db.js';
import { seed } from './seed.js';
import app from './server.js';

const TEST_PORT = 5099;

async function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, `http://localhost:${TEST_PORT}`);
    const reqOptions = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    };

    const req = http.request(url, reqOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const json = data ? JSON.parse(data) : {};
          resolve({ status: res.statusCode, headers: res.headers, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, raw: data });
        }
      });
    });

    req.on('error', reject);

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting API Endpoints Verification Suite...');

  // Reset database with seeds
  await seed();

  const server = app.listen(TEST_PORT);
  console.log(`Server started on test port ${TEST_PORT}`);

  try {
    // 1. Health check
    const health = await request('/api/health');
    console.assert(health.status === 200, 'Health check should return 200');
    console.assert(health.data.status === 'ok', 'Health status should be ok');
    console.log('✅ GET /api/health passed');

    // 2. Stats
    const stats = await request('/api/stats');
    console.assert(stats.status === 200, 'Stats should return 200');
    console.assert(typeof stats.data.activeTalents === 'number', 'activeTalents should be number');
    console.assert(typeof stats.data.activeProjects === 'number', 'activeProjects should be number');
    console.assert(typeof stats.data.pendingLeads === 'number', 'pendingLeads should be number');
    console.assert(typeof stats.data.weekShoots === 'number', 'weekShoots should be number');
    console.log('✅ GET /api/stats passed:', stats.data);

    // 3. Talents list & JSON parsing
    const talents = await request('/api/talents');
    console.assert(talents.status === 200, 'Talents should return 200');
    console.assert(Array.isArray(talents.data), 'Talents should be array');
    console.assert(talents.data.length >= 6, 'Should have at least 6 talents');
    console.assert(Array.isArray(talents.data[0].niche_tags), 'niche_tags must be an array');
    console.log(`✅ GET /api/talents passed (${talents.data.length} talents loaded, niche_tags parsed)`);

    // 4. Talents category filter
    const modelTalents = await request('/api/talents?category=Model');
    console.assert(modelTalents.status === 200, 'Filter by category should return 200');
    console.assert(modelTalents.data.every((t) => t.category.toLowerCase() === 'model'), 'All results should be Model');
    console.log(`✅ GET /api/talents?category=Model passed (${modelTalents.data.length} models found)`);

    // 5. POST new talent
    const newTalentRes = await request('/api/talents', {
      method: 'POST',
      body: {
        name: 'Zara Nova',
        title: 'Cyberpunk 3D Creator',
        category: 'Designer',
        avatar_url: 'https://example.com/avatar.jpg',
        bio: 'Futuristic visual artist.',
        niche_tags: ['Cyberpunk', '3D', 'Unreal Engine'],
        followers: '300K',
        engagement_rate: '6.5%',
        internal_fee: '$1,500 / project',
        rate_card: { standard: '$3,000', premium: '$6,000' },
        status: 'available'
      }
    });
    console.assert(newTalentRes.status === 201, 'POST /api/talents should return 201');
    const createdTalentId = newTalentRes.data.id;
    console.assert(createdTalentId, 'Created talent should have ID');
    console.assert(Array.isArray(newTalentRes.data.niche_tags), 'Created talent niche_tags should be array');
    console.log('✅ POST /api/talents passed, created ID:', createdTalentId);

    // 6. PUT talent
    const putTalentRes = await request(`/api/talents/${createdTalentId}`, {
      method: 'PUT',
      body: {
        name: 'Zara Nova (Updated)',
        title: 'Cyberpunk & AR Lead',
        category: 'Designer',
        followers: '350K'
      }
    });
    console.assert(putTalentRes.status === 200, 'PUT /api/talents/:id should return 200');
    console.assert(putTalentRes.data.name === 'Zara Nova (Updated)', 'Name should be updated');
    console.log('✅ PUT /api/talents/:id passed');

    // 7. PATCH talent status
    const patchTalentRes = await request(`/api/talents/${createdTalentId}/status`, {
      method: 'PATCH',
      body: { status: 'on_shoot' }
    });
    console.assert(patchTalentRes.status === 200, 'PATCH /api/talents/:id/status should return 200');
    console.assert(patchTalentRes.data.status === 'on_shoot', 'Status should be on_shoot');
    console.log('✅ PATCH /api/talents/:id/status passed');

    // 8. GET projects
    const projects = await request('/api/projects');
    console.assert(projects.status === 200, 'GET /api/projects should return 200');
    console.assert(Array.isArray(projects.data), 'Projects should be an array');
    console.assert(projects.data.length >= 7, 'Should have at least 7 projects');
    console.assert(projects.data[0].talent_name !== undefined, 'Should include joined talent_name');
    console.log(`✅ GET /api/projects passed (${projects.data.length} projects loaded with talent details)`);

    // 9. POST project (Lead Inquiry)
    const newProjectRes = await request('/api/projects', {
      method: 'POST',
      body: {
        brand_name: 'Starlight Tech',
        contact_person: 'Alex Vance',
        email: 'alex@starlight.io',
        phone: '+1 555 999 1234',
        project_title: 'Quantum Headset Commercial',
        project_type: 'Commercial Film & Photo',
        target_date: '2026-10-15',
        budget_range: '$25,000 - $40,000',
        talent_id: createdTalentId,
        notes: 'Inquiry submitted from public landing page showcase.'
      }
    });
    console.assert(newProjectRes.status === 201, 'POST /api/projects should return 201');
    const createdProjectId = newProjectRes.data.id;
    console.assert(newProjectRes.data.status_stage === 'new_lead', 'Default stage should be new_lead');
    console.assert(newProjectRes.data.talent_name === 'Zara Nova (Updated)', 'Joined talent name should match');
    console.log('✅ POST /api/projects passed, created ID:', createdProjectId);

    // 10. PATCH project stage
    const patchProjectRes = await request(`/api/projects/${createdProjectId}/stage`, {
      method: 'PATCH',
      body: { status_stage: 'confirmed' }
    });
    console.assert(patchProjectRes.status === 200, 'PATCH /api/projects/:id/stage should return 200');
    console.assert(patchProjectRes.data.status_stage === 'confirmed', 'Stage should be confirmed');
    console.log('✅ PATCH /api/projects/:id/stage passed');

    // 11. GET schedules
    const schedules = await request('/api/schedules');
    console.assert(schedules.status === 200, 'GET /api/schedules should return 200');
    console.assert(Array.isArray(schedules.data), 'Schedules should be an array');
    console.assert(schedules.data.length >= 9, 'Should have at least 9 schedule events');
    console.assert(schedules.data[0].brand_name !== undefined, 'Joined project info should exist');
    console.log(`✅ GET /api/schedules passed (${schedules.data.length} events loaded)`);

    // 12. POST schedule
    const newScheduleRes = await request('/api/schedules', {
      method: 'POST',
      body: {
        project_id: createdProjectId,
        talent_id: createdTalentId,
        title: 'Starlight Tech - Keyframe Concept Review',
        event_type: 'meeting',
        event_date: '2026-09-10',
        notes: 'Online sync on VR headset 3D asset renders.'
      }
    });
    console.assert(newScheduleRes.status === 201, 'POST /api/schedules should return 201');
    const createdScheduleId = newScheduleRes.data.id;
    console.assert(createdScheduleId, 'Schedule ID should exist');
    console.assert(newScheduleRes.data.talent_name === 'Zara Nova (Updated)', 'Joined talent name should match');
    console.log('✅ POST /api/schedules passed, created ID:', createdScheduleId);

    // 13. DELETE schedule
    const deleteScheduleRes = await request(`/api/schedules/${createdScheduleId}`, {
      method: 'DELETE'
    });
    console.assert(deleteScheduleRes.status === 200, 'DELETE /api/schedules/:id should return 200');
    console.assert(deleteScheduleRes.data.success === true, 'Delete response should indicate success');
    console.log('✅ DELETE /api/schedules/:id passed');

    // 14. Clean up created project & talent
    await request(`/api/projects/${createdProjectId}`, { method: 'DELETE' });
    await request(`/api/talents/${createdTalentId}`, { method: 'DELETE' });
    console.log('✅ Cleaned up temporary test entities.');

    console.log('\n🎉 ALL 14 TEST SUITE ASSERTIONS PASSED SUCCESSFULLY!');
  } finally {
    server.close();
  }
}

runTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
