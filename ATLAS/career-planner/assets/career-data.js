/* ==========================================================================
   Career Planner sample data, shared by the admin and learner prototypes
   --------------------------------------------------------------------------
   Illustrative only: Tunas Muda has not sent its real departments, roles or
   skills yet. The admin prototype saves its edits in this browser
   (localStorage "atlas-career-admin-v1"); the learner prototype reads that
   saved copy when there is one, otherwise this seed.
   ========================================================================== */
(function () {
  'use strict';
  var BANDS = ['Novice', 'Developing', 'Competent', 'Proficient', 'Advanced'];
  var PATH_TYPES = {
    foundation: { label: 'Foundation', who: 'Everyone in the organisation, including new staff when they join.', eg: 'e.g. compliance onboarding' },
    role: { label: 'Role', who: 'Assigned automatically to everyone in the roles it is attached to.', eg: 'e.g. Customer Experience for Admissions' },
    growth: { label: 'Growth', who: 'Only staff HR nominates, for example high-potential staff.', eg: 'e.g. emerging leaders' }
  };

  // Content already in ATLAS. Pool items for Communication and Leadership let Choose-from stages work.
  function C(id, kind, title, mins, skills) { return { id: id, kind: kind, title: title, mins: mins, skills: skills }; }
  var CONTENT = [
    C('c1', 'Course', 'Child Safeguarding Essentials', 40, ['s_safe']),
    C('c2', 'Course', 'Personal Data Protection Basics', 30, ['s_data']),
    C('c3', 'Course', 'Workplace Safety Induction', 25, ['s_whs']),
    C('c4', 'Course', 'Code of Conduct for Staff', 20, ['s_code']),
    C('c5', 'Course', 'Customer Service Essentials', 44, ['s_enq', 's_recov']),
    C('c6', 'Course', 'Writing Clear Emails', 30, ['s_write']),
    C('c7', 'Course', 'Leading Your First Team', 50, ['s_lead']),
    C('c8', 'Course', 'Managing Stress at Work', 25, ['s_well']),
    C('c9', 'Course', 'Handling Records and Files', 30, ['s_data']),
    C('p1', 'PALS', 'Active Listening', 20, ['s_diff']),
    C('p2', 'PALS', 'Handling Difficult Conversations', 25, ['s_diff']),
    C('p3', 'PALS', 'Presenting with Confidence', 25, ['s_pres']),
    C('p4', 'PALS', 'Writing for Parents', 20, ['s_write']),
    C('p5', 'PALS', 'Phone Manner and Etiquette', 15, ['s_enq']),
    C('p6', 'PALS', 'Giving and Receiving Feedback', 20, ['s_diff', 's_coach']),
    C('p7', 'PALS', 'Clear Meeting Notes', 15, ['s_write']),
    C('p8', 'PALS', 'Explaining School Policies Simply', 20, ['s_pres', 's_enq']),
    C('p9', 'PALS', 'Communicating Across Cultures', 25, ['s_diff']),
    C('p10', 'PALS', 'Saying No Politely', 15, ['s_diff']),
    C('p11', 'PALS', 'Plain Language Writing', 20, ['s_write']),
    C('p12', 'PALS', 'Communication Skills', 30, ['s_pres', 's_diff']),
    C('p13', 'PALS', 'Coaching Conversations', 25, ['s_coach']),
    C('p14', 'PALS', 'Delegating Well', 20, ['s_lead']),
    C('p15', 'PALS', 'Running Effective Meetings', 20, ['s_lead']),
    C('p16', 'PALS', 'Mindfulness at Work', 15, ['s_well']),
    C('b1', 'CBL', 'Handling a parent enquiry call', 15, ['s_enq']),
    C('b2', 'CBL', 'Calming an upset parent', 15, ['s_recov', 's_diff']),
    C('b3', 'CBL', 'Leading a team meeting', 15, ['s_lead']),
    C('b4', 'CBL', 'Giving feedback to a colleague', 15, ['s_coach']),
    C('b5', 'CBL', 'Explaining a leave policy to staff', 15, ['s_pres']),
    C('a1', 'Assessment', 'Compliance check', 15, ['s_safe', 's_data', 's_whs', 's_code']),
    C('a2', 'Assessment', 'Admissions readiness check', 20, ['s_enq', 's_recov']),
    C('a3', 'Assessment', 'Leadership self-assessment', 15, ['s_lead', 's_coach']),
    C('a4', 'Assessment', 'Office administration check', 15, ['s_write', 's_data'])
  ];
  var KINDS = ['Course', 'PALS', 'CBL', 'Assessment'];

  // A few SkillsFuture skills for the import dialog. Sector names match the real dropdown.
  var SFW = {
    'Training and Adult Education': [
      ['Learning and Development', ['Learning Needs Analysis', 'Curriculum Development', 'Learning Facilitation']],
      ['Learner Engagement', ['Customer Orientation', 'Communication', 'Stakeholder Management']]
    ],
    'Workplace Safety and Health': [
      ['Workplace Safety', ['Workplace Safety and Health Practices', 'Incident Management', 'Risk Assessment']]
    ],
    'Human Resource': [
      ['Talent Management', ['Talent Management', 'Performance Management', 'Employee Engagement']],
      ['Employee Relations', ['Employee Relations Management', 'Workplace Fairness']]
    ],
    'Critical Core Skills': [
      ['Interacting with Others', ['Communication', 'Collaboration', 'Customer Orientation']],
      ['Staying Relevant', ['Adaptability', 'Learning Agility', 'Self Management']]
    ]
  };
  var SFW_SECTORS = ['Accountancy', 'Aerospace', 'Agrifood', 'Air Transport', 'Arts', 'Built Environment', 'Critical Core Skills', 'Design', 'Early Childhood', 'Financial Services', 'Food Services', 'Healthcare', 'Hotel and Accommodation Services', 'Human Resource', 'Infocomm Technology', 'Logistics', 'Retail', 'Security', 'Social Service', 'Tourism', 'Training and Adult Education', 'Workplace Safety and Health'];

  function S(id, name, from) { return { id: id, name: name, from: from || '', archived: false, aliases: [] }; }
  // ---------- Staff (fictional names). The first person is the learner in the My Career prototype. ----------
  var NAMES = ['Ayu Pratiwi', 'Rizky Hidayat', 'Dewi Kartika', 'Hendra Wijaya', 'Nina Sari', 'Fajar Nugroho', 'Putri Ananda',
    'Agus Setiawan', 'Lina Marlina', 'Yusuf Rahman', 'Rani Puspita', 'Teguh Prasetyo', 'Sinta Maharani', 'Bayu Saputra', 'Indah Permata',
    'Arif Kurniawan', 'Wulan Sari', 'Dimas Pratama', 'Mega Lestari', 'Rudi Hartono', 'Citra Dewi', 'Eko Santoso'];
  var JOINED = [262, 1130, 40, 610, 9, 480, 300, 820, 150, 700, 5, 365, 530, 210, 95, 1000, 420, 260, 75, 640, 3, 12];
  function staff() {
    var out = [], i = 0;
    [['r1', 'd1', 7], ['r2', 'd2', 8], ['r3', 'd3', 5], ['', '', 2]].forEach(function (g) {
      for (var k = 0; k < g[2]; k++, i++) {
        out.push({ id: 'u' + (i + 1), name: NAMES[i], role: g[0], dept: g[1], joined: JOINED[i], nominated: [1, 9, 15].indexOf(i) !== -1, seed: i, groups: i % 3 === 0 ? ['Open Day volunteers'] : [] });
      }
    });
    return out;
  }
  // How sure the AI tagger is about a tag (sample values, 0-100)
  function aiConfidence(contentId, skillId) {
    var h = 0, s = contentId + skillId; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 997;
    return 55 + h % 44;
  }

  function seed() {
    return {
      categories: [
        { id: 'k1', name: 'Compliance', skills: [S('s_safe', 'Child safeguarding'), S('s_data', 'Data protection', 'Human Resource'), S('s_whs', 'Workplace safety and health', 'Workplace Safety and Health'), S('s_code', 'Code of conduct')] },
        { id: 'k2', name: 'Communication', skills: [S('s_write', 'Written communication'), S('s_diff', 'Difficult conversations'), S('s_pres', 'Presenting information')] },
        { id: 'k3', name: 'Customer Experience', skills: [S('s_enq', 'Parent and student enquiries'), S('s_recov', 'Service recovery')] },
        { id: 'k4', name: 'Leadership', skills: [S('s_lead', 'Leading a team'), S('s_coach', 'Coaching others')] },
        { id: 'k5', name: 'Well-being', skills: [S('s_well', 'Personal well-being')] }
      ],
      departments: [
        { id: 'd1', name: 'Admissions', head: 'Siti Rahma' },
        { id: 'd2', name: 'Administration', head: 'Budi Santoso' },
        { id: 'd3', name: 'HR', head: 'Maya Lestari' }
      ],
      roles: [
        { id: 'r1', title: 'Admissions Officer', dept: 'd1', level: '', desc: 'First point of contact for families: answers enquiries, runs school tours and guides applications.', staff: 7,
          skills: [{ s: 's_enq', t: 4 }, { s: 's_recov', t: 3 }, { s: 's_diff', t: 3 }, { s: 's_write', t: 3 }, { s: 's_pres', t: 2 }] },
        { id: 'r2', title: 'Administration Executive', dept: 'd2', level: '', desc: 'Keeps school operations running: records, scheduling, correspondence and front office.', staff: 8,
          skills: [{ s: 's_write', t: 4 }, { s: 's_data', t: 4 }, { s: 's_enq', t: 2 }, { s: 's_diff', t: 2 }] },
        { id: 'r3', title: 'HR Executive', dept: 'd3', level: '', desc: 'Supports hiring, onboarding and staff matters, and keeps policies up to date.', staff: 5,
          skills: [{ s: 's_data', t: 4 }, { s: 's_code', t: 4 }, { s: 's_diff', t: 3 }, { s: 's_pres', t: 3 }, { s: 's_coach', t: 2 }] }
      ],
      staff: staff(),
      // Tag edits by admins: { contentId: [{ s: skillId, src: 'manual' | 'ai', conf }] }. Untouched content keeps its AI tags.
      tags: {},
      // PALS custom tags (Knowledge Spaces tag system), for organising and filtering content
      customTags: { p1: ['Onboarding'], p5: ['Parents', 'Phone'], p8: ['Parents'], p12: ['Onboarding'], p16: ['Well-being week'], p13: ['Managers'], p14: ['Managers'] },
      paths: [
        { id: 'pf', type: 'foundation', name: 'New staff compliance', active: true, roles: [], after: '',
          stages: [
            { id: 'st1', name: 'Compliance essentials', type: 'required', items: [{ c: 'c1', renew: '3' }, { c: 'c2', renew: '3' }, { c: 'c3', renew: '5' }, { c: 'c4', renew: '' }] },
            { id: 'st2', name: 'Check your understanding', type: 'required', items: [{ c: 'a1', renew: '3' }] }
          ] },
        { id: 'pr1', type: 'role', name: 'Admissions Officer path', active: true, roles: ['r1'], after: 'pf',
          stages: [
            { id: 'st3', name: 'Customer Experience', type: 'required', items: [{ c: 'c5', renew: '' }, { c: 'b1', renew: '' }, { c: 'b2', renew: '' }] },
            { id: 'st4', name: 'Communication', type: 'choose', n: 3, pool: { mode: 'category', cat: 'k2', list: [] }, items: [] },
            { id: 'st5', name: 'Ready for families', type: 'required', items: [{ c: 'a2', renew: '' }] }
          ] },
        { id: 'pr2', type: 'role', name: 'Administration Executive path', active: true, roles: ['r2'], after: 'pf',
          stages: [
            { id: 'st6', name: 'Office essentials', type: 'required', items: [{ c: 'c6', renew: '' }, { c: 'c9', renew: '' }] },
            { id: 'st7', name: 'Communication', type: 'choose', n: 2, pool: { mode: 'list', cat: '', list: ['p4', 'p5', 'p7', 'p8', 'p11'] }, items: [] },
            { id: 'st8', name: 'Check', type: 'required', items: [{ c: 'a4', renew: '' }] }
          ] },
        { id: 'pr3', type: 'role', name: 'HR Executive path', active: false, roles: ['r3'], after: 'pf',
          stages: [
            { id: 'st9', name: 'People conversations', type: 'required', items: [{ c: 'p2', renew: '' }, { c: 'b5', renew: '' }] }
          ] },
        { id: 'pg', type: 'growth', name: 'Emerging leaders', active: true, roles: [], after: 'role', nominated: 3,
          stages: [
            { id: 'st10', name: 'Leadership basics', type: 'choose', n: 2, pool: { mode: 'category', cat: 'k4', list: [] }, items: [] },
            { id: 'st11', name: 'Lead in practice', type: 'required', items: [{ c: 'b3', renew: '' }, { c: 'b4', renew: '' }, { c: 'a3', renew: '' }] }
          ] }
      ]
    };
  }

  window.CAREER = { BANDS: BANDS, PATH_TYPES: PATH_TYPES, CONTENT: CONTENT, KINDS: KINDS, SFW: SFW, SFW_SECTORS: SFW_SECTORS, S: S, seed: seed, staff: staff, aiConfidence: aiConfidence, STORE_KEY: 'atlas-career-admin-v1' };
})();
