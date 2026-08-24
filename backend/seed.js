import { initDB, dbQuery, db } from './db.js';

const talentsData = [
  {
    name: 'Elena Rostova',
    title: 'High-Fashion & Runway Model',
    category: 'Model',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    bio: 'International editorial and runway model with 6+ years experience working with Vogue, Harper’s Bazaar, and luxury European fashion houses.',
    niche_tags: JSON.stringify(['High Fashion', 'Editorial', 'Runway', 'Luxury']),
    followers: '520K',
    engagement_rate: '5.2%',
    internal_fee: '$1,800 / day',
    rate_card: '$3,500 / day',
    status: 'available'
  },
  {
    name: 'Marcus Vance',
    title: 'Streetwear & Lifestyle Creator',
    category: 'Influencer',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    bio: 'Trendsetter in urban streetwear, sneaker culture, and dynamic lifestyle vlogging. Known for high-conversion reels and TikTok storytelling.',
    niche_tags: JSON.stringify(['Streetwear', 'Sneakers', 'Lifestyle', 'Tech']),
    followers: '890K',
    engagement_rate: '6.8%',
    internal_fee: '$2,200 / campaign',
    rate_card: '$4,800 / campaign',
    status: 'on_shoot'
  },
  {
    name: 'Aria Chen',
    title: 'Commercial & Editorial Photographer',
    category: 'Photographer',
    avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    bio: 'Award-winning visual artist specializing in cinematic studio lighting, luxury cosmetics, and vibrant fashion lookbooks.',
    niche_tags: JSON.stringify(['Commercial', 'Studio', 'Editorial', 'Color Grading']),
    followers: '210K',
    engagement_rate: '7.4%',
    internal_fee: '$1,500 / shoot',
    rate_card: '$3,200 / shoot',
    status: 'available'
  },
  {
    name: 'Julian Sterling',
    title: 'Cinematographer & Drone Director',
    category: 'Videographer',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    bio: 'Director of photography and licensed aerial drone pilot. Crafts fast-paced commercial promos, music videos, and cinematic brand reels.',
    niche_tags: JSON.stringify(['Cinematography', 'Drone 4K', 'Brand Commercials', 'VFX']),
    followers: '340K',
    engagement_rate: '4.9%',
    internal_fee: '$2,000 / day',
    rate_card: '$4,000 / day',
    status: 'available'
  },
  {
    name: 'Maya Linnea',
    title: 'Brand Identity & 3D Motion Designer',
    category: 'Designer',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
    bio: 'Creative director and 3D visual artist crafting futuristic brand identities, CGI packaging renders, and interactive digital experiences.',
    niche_tags: JSON.stringify(['3D Motion', 'Brand Identity', 'CGI', 'Creative Direction']),
    followers: '175K',
    engagement_rate: '8.1%',
    internal_fee: '$1,600 / project',
    rate_card: '$3,800 / project',
    status: 'available'
  },
  {
    name: 'Kaito Tanaka',
    title: 'Fitness & Adventure Athlete Influencer',
    category: 'Influencer',
    avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    bio: 'Extreme sports athlete and wellness ambassador pushing athletic performance and outdoor exploration across the globe.',
    niche_tags: JSON.stringify(['Fitness', 'Outdoor', 'Athletic', 'Nutrition']),
    followers: '640K',
    engagement_rate: '5.9%',
    internal_fee: '$1,900 / post',
    rate_card: '$3,600 / post',
    status: 'unavailable'
  }
];

const projectsData = [
  {
    brand_name: 'Aetheria Luxury Apparel',
    contact_person: 'Sarah Jenkins',
    email: 's.jenkins@aetheria.com',
    phone: '+1 (555) 234-5678',
    project_title: 'Autumn Paris Collection Campaign',
    project_type: 'Editorial Lookbook & Runway',
    target_date: '2026-09-12',
    budget_range: '$15,000 - $25,000',
    status_stage: 'in_execution',
    talent_index: 0, // Elena Rostova
    notes: 'Requires 2-day outdoor Paris shooting and 3 studio lookbook sessions.'
  },
  {
    brand_name: 'HyperPulse Sneakers',
    contact_person: 'David Zhao',
    email: 'partnerships@hyperpulse.io',
    phone: '+1 (555) 890-1234',
    project_title: 'Neon Drift Gen-Z Sneaker Drop',
    project_type: 'Social Campaign & Video Reels',
    target_date: '2026-09-01',
    budget_range: '$8,000 - $12,000',
    status_stage: 'confirmed',
    talent_index: 1, // Marcus Vance
    notes: 'Deliverable: 3 Instagram Reels, 2 TikToks, and high-res street style stills.'
  },
  {
    brand_name: 'Luminae Cosmetics',
    contact_person: 'Camille Dubois',
    email: 'camille@luminaecosmetics.fr',
    phone: '+33 6 12 34 56 78',
    project_title: 'Glow Serum Global Launch',
    project_type: 'Studio Product Photography',
    target_date: '2026-08-30',
    budget_range: '$5,000 - $10,000',
    status_stage: 'in_execution',
    talent_index: 2, // Aria Chen
    notes: 'Macro product shots, texture spreads, and lighting setups.'
  },
  {
    brand_name: 'Vortex Energy Drink',
    contact_person: 'Tyler Brooks',
    email: 'marketing@vortexenergy.com',
    phone: '+1 (555) 432-8765',
    project_title: 'Extreme Mountain Biking Promo',
    project_type: 'Commercial Drone Video',
    target_date: '2026-09-20',
    budget_range: '$12,000 - $18,000',
    status_stage: 'quotation_sent',
    talent_index: 3, // Julian Sterling
    notes: '4K FPV drone footage and action camera sync on steep trails.'
  },
  {
    brand_name: 'Solace Audio',
    contact_person: 'Henrik Larsson',
    email: 'brand@solaceaudio.se',
    phone: '+46 8 123 4567',
    project_title: 'Spatial Sound Headphone Rebrand',
    project_type: '3D CGI Brand Package',
    target_date: '2026-10-05',
    budget_range: '$10,000 - $16,000',
    status_stage: 'new_lead',
    talent_index: 4, // Maya Linnea
    notes: 'Client submitted booking inquiry via marketing showcase for 3D animation.'
  },
  {
    brand_name: 'Apex Horizon Apparel',
    contact_person: 'Rachel Miller',
    email: 'rachel@apexhorizon.com',
    phone: '+1 (555) 765-4321',
    project_title: 'Alpine Summit Performance Wear',
    project_type: 'Brand Ambassadorship',
    target_date: '2026-08-15',
    budget_range: '$20,000 - $30,000',
    status_stage: 'completed',
    talent_index: 5, // Kaito Tanaka
    notes: 'Completed multi-month campaign. Invoice cleared and metrics exceeded expectations.'
  },
  {
    brand_name: 'Velour Noir Perfumes',
    contact_person: 'Antoine Laurent',
    email: 'inquiries@velournoir.com',
    phone: '+33 1 98 76 54 32',
    project_title: 'Midnight Blossom Perfume Film',
    project_type: 'Commercial Film & Photo',
    target_date: '2026-09-28',
    budget_range: '$18,000 - $28,000',
    status_stage: 'new_lead',
    talent_index: 0, // Elena Rostova
    notes: 'Direct client inquiry from website contact form.'
  }
];

const schedulesData = [
  {
    project_index: 0,
    talent_index: 0,
    title: 'Aetheria - Haute Couture Fitting & Styling',
    event_type: 'fitting',
    event_date: '2026-08-27',
    notes: 'Wardrobe check at Atelier Montmartre, Paris.'
  },
  {
    project_index: 0,
    talent_index: 0,
    title: 'Aetheria - Day 1 Paris Outdoor Runway Shoot',
    event_type: 'shooting',
    event_date: '2026-08-29',
    notes: 'Call time: 6:00 AM at Place Vendôme.'
  },
  {
    project_index: 1,
    talent_index: 1,
    title: 'HyperPulse - Streetwear Video & Reels Production',
    event_type: 'shooting',
    event_date: '2026-08-28',
    notes: 'Location: Downtown Arts District rooftop.'
  },
  {
    project_index: 1,
    talent_index: 1,
    title: 'HyperPulse - Teaser Reel Social Post Drop',
    event_type: 'content_post',
    event_date: '2026-09-01',
    notes: 'Synchronized launch across Instagram and TikTok @ 12:00 PM EST.'
  },
  {
    project_index: 2,
    talent_index: 2,
    title: 'Luminae - Cosmetics Studio Lighting Prep',
    event_type: 'meeting',
    event_date: '2026-08-26',
    notes: 'Creative alignment with art director and product stylist.'
  },
  {
    project_index: 2,
    talent_index: 2,
    title: 'Luminae - Serum Macro Photo Shoot',
    event_type: 'shooting',
    event_date: '2026-08-30',
    notes: 'Studio A: High-speed liquid splash photography.'
  },
  {
    project_index: 3,
    talent_index: 3,
    title: 'Vortex - Location Scouting & Flight Permission',
    event_type: 'meeting',
    event_date: '2026-09-05',
    notes: 'Drone FAA clearance check and mountain route review.'
  },
  {
    project_index: 4,
    talent_index: 4,
    title: 'Solace Audio - 3D Wireframe Presentation',
    event_type: 'meeting',
    event_date: '2026-09-08',
    notes: 'Zoom presentation of 3D geometry and motion design moodboard.'
  },
  {
    project_index: 5,
    talent_index: 5,
    title: 'Apex Horizon - Final Campaign Invoice Cleared',
    event_type: 'payment',
    event_date: '2026-08-20',
    notes: 'Payment wire of $25,000 received and talent fee disbursed.'
  }
];

export async function seed() {
  try {
    console.log('🚀 Starting SQLite database initialization and seeding...');
    await initDB();

    // Clear existing data
    await dbQuery.run('DELETE FROM schedules;');
    await dbQuery.run('DELETE FROM projects;');
    await dbQuery.run('DELETE FROM talents;');
    await dbQuery.run('DELETE FROM sqlite_sequence WHERE name IN ("talents", "projects", "schedules");');

    // Insert Talents
    const talentIds = [];
    for (const t of talentsData) {
      const res = await dbQuery.run(
        `INSERT INTO talents (name, title, category, avatar_url, bio, niche_tags, followers, engagement_rate, internal_fee, rate_card, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          t.name,
          t.title,
          t.category,
          t.avatar_url,
          t.bio,
          t.niche_tags,
          t.followers,
          t.engagement_rate,
          t.internal_fee,
          t.rate_card,
          t.status
        ]
      );
      talentIds.push(res.lastID);
    }
    console.log(`✅ Seeded ${talentIds.length} talents.`);

    // Insert Projects
    const projectIds = [];
    for (const p of projectsData) {
      const assignedTalentId = p.talent_index !== undefined ? talentIds[p.talent_index] : null;
      const res = await dbQuery.run(
        `INSERT INTO projects (brand_name, contact_person, email, phone, project_title, project_type, target_date, budget_range, status_stage, talent_id, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          p.brand_name,
          p.contact_person,
          p.email,
          p.phone,
          p.project_title,
          p.project_type,
          p.target_date,
          p.budget_range,
          p.status_stage,
          assignedTalentId,
          p.notes
        ]
      );
      projectIds.push(res.lastID);
    }
    console.log(`✅ Seeded ${projectIds.length} projects.`);

    // Insert Schedules
    let scheduleCount = 0;
    for (const s of schedulesData) {
      const projId = projectIds[s.project_index];
      const talId = talentIds[s.talent_index];
      await dbQuery.run(
        `INSERT INTO schedules (project_id, talent_id, title, event_type, event_date, notes)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          projId,
          talId,
          s.title,
          s.event_type,
          s.event_date,
          s.notes
        ]
      );
      scheduleCount++;
    }
    console.log(`✅ Seeded ${scheduleCount} schedules.`);

    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
}

// Run directly if invoked as entrypoint
if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  seed().then(() => {
    db.close();
  });
}
