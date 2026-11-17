/* ==========================================================================
   Sample course: Customer Service Essentials
   --------------------------------------------------------------------------
   One course, read by both sides of the prototype:
   - admin  (atlas-authoring-v3-prototype.html) loads it as an editable course
   - learner (courses list, course page, lesson player with ?course=cs) renders it
   The data uses the admin's lesson and block format. Fields the admin does not
   edit (outcomes, Jen answers, sample discussion posts) are extra and kept as is.

   CONTENT IS A SAMPLE written for the redesign review, not production content.
   ========================================================================== */
(function () {
  'use strict';
  var n = 0;
  function B(type, data) { n += 1; return { id: 'csb' + n, type: type, data: data, state: 'reviewed', why: '' }; }
  function Q(stem, options, correct, why) { return { id: 'csq' + (++n), stem: stem, options: options, correct: correct, confirmed: true, why: why }; }
  var VIDEO = 'https://youtu.be/OpGsOTBUshI';   // placeholder link, as in the other sample lessons

  function lesson(i, title, type, mins, blocks, review, jen, disc) {
    return {
      id: 'cs' + i, mod: 'csm1', title: title, type: type, mins: mins, minsManual: true, legacy: '', url: type === 'Video' ? VIDEO : '',
      blocks: blocks, converted: true, resources: [],
      review: { mode: 'authored', pass: 70, later: true, questions: review },
      jen: { on: true, chips: jen.map(function (j) { return j[0]; }), answers: jen.reduce(function (o, j) { o[j[0]] = j[1]; return o; }, {}), glossary: [] },
      disc: { on: true, starter: disc.starter, posts: disc.posts || [] }
    };
  }

  var lessons = [
    lesson(1, 'Why great service brings customers back', 'Article', 5, [
      B('lead', { text: 'For a small business, every conversation with a customer is a chance to be remembered. In this course you will learn practical ways to serve customers well, handle problems calmly, and turn feedback into improvements.' }),
      B('cards', { title: 'What you will learn', numbered: false, cards: [
        { title: 'Understand', text: 'Know what customers expect at each moment they deal with you.', more: '' },
        { title: 'Respond', text: 'Listen well, handle complaints and serve customers online.', more: '' },
        { title: 'Improve', text: 'Use feedback to make your service a little better every month.', more: '' }] }),
      B('text', { heading: 'Why it matters', body: 'Winning a new customer usually costs far more than keeping one you already have. Customers who feel looked after come back more often, spend more over time and recommend you to friends and family.\n\nPoor service travels just as fast: one bad experience is often shared with more people than a good one.' }),
      B('define', { title: 'Service is more than the sale', intro: 'Good service starts before a customer buys and continues long after.', leftTitle: 'Before the sale', leftLead: '', left: ['Answering questions clearly', 'Being easy to reach', 'Setting honest expectations'], rightTitle: 'After the sale', rightLead: '', right: ['Following up', 'Putting problems right', 'Thanking loyal customers'] }),
      B('callout', { variant: 'good', title: 'Key idea', text: 'Great service is not about grand gestures. It is about being reliable, friendly and quick to put things right, every time.' })
    ], [
      Q('Why is keeping existing customers important for a small business?', ['It usually costs less than winning new ones, and loyal customers recommend you.', 'Existing customers never complain.', 'New customers are not worth the effort.', 'It means you can raise prices.'], 0, 'Keeping customers is usually cheaper than finding new ones, and loyal customers bring others through recommendations.'),
      Q('When does customer service happen?', ['Only at the moment of payment.', 'Before, during and after the sale.', 'Only when something goes wrong.', 'Only on the phone.'], 1, 'Service covers every contact: answering questions before, the sale itself, and following up after.')
    ], [
      ['Summarise this lesson', '<p>Good service keeps customers coming back:</p><ul><li>Keeping a customer usually costs less than finding a new one.</li><li>Happy customers spend more over time and recommend you.</li><li>Service happens <b>before, during and after</b> the sale.</li></ul>'],
      ['Give me an example', '<p>A small bakery remembers that Mrs. Lim likes her bread sliced. She feels noticed, comes back every week and tells her neighbours. Nothing expensive, just reliable and personal.</p>']
    ], { starter: 'Think of a business you keep going back to. What do they do that makes you return?', posts: [
      { who: 'Rina P.', ago: 1440, kind: 'comment', likes: 4, text: 'My tailor always remembers my measurements and asks about my family. I would never go anywhere else.' }] }),

    lesson(2, 'The moments that matter', 'Video', 6, [
      B('video', { url: VIDEO, title: 'The moments that matter', clean: true, transcript: 'Every customer meets your business at several moments. They might see a post online, send you a message, walk into your shop, pay, and then use what they bought. At each of these moments they form an opinion of you.\n\nWe call these moments of truth. A friendly reply, a clear price or a quick fix builds trust. A message left unanswered or a rude word can undo it.\n\nYou cannot be perfect everywhere at once. So start by mapping the moments your customers go through, and ask: what does the customer need from me right here? Then make sure that one thing happens every time.' }),
      B('lead', { text: 'Customers meet your business at several moments, from the first time they hear about you to long after they have paid. Each one shapes how they feel about you.' }),
      B('stages', { title: 'The customer journey', intro: 'Select a stage to see what customers need from you there.', stages: [
        { name: 'Discover', text: 'They hear about you or find you online. They need clear, friendly information and an easy way to contact you.' },
        { name: 'First contact', text: 'They call, message or walk in. They need a quick, warm response and honest answers.' },
        { name: 'Purchase', text: 'They buy. They need it to be easy, and to get exactly what was promised.' },
        { name: 'After the sale', text: 'They use what they bought. They need help if something goes wrong, and a reason to come back.' }],
        starts: [{ label: 'Amina', stage: 2, text: 'Has just messaged your shop on WhatsApp asking about opening hours.' }, { label: 'Mr. Tan', stage: 4, text: 'Bought a blender last week and it has stopped working.' }] }),
      B('callout', { variant: 'info', title: 'Moments of truth', text: 'A moment of truth is any moment when a customer forms an opinion of your business. A slow reply, a smile at the counter or a missed call can each change how they feel.' })
    ], [
      Q('What is a "moment of truth"?', ['The moment a customer pays.', 'Any moment when a customer forms an opinion of your business.', 'The end of the financial year.', 'When you check your stock.'], 1, 'A moment of truth is any contact where the customer forms an opinion about you, good or bad.'),
      Q('Mr. Tan bought a blender last week and it stopped working. Which stage is he in?', ['Discover', 'First contact', 'Purchase', 'After the sale'], 3, 'He has already bought, so he is in the after-the-sale stage, where he needs help putting the problem right.'),
      Q('What is a good first step to improve these moments?', ['Change everything at once.', 'Map the moments your customers go through and what they need at each one.', 'Only focus on advertising.', 'Wait for complaints.'], 1, 'Start by mapping the moments and asking what the customer needs at each, then make that happen every time.')
    ], [
      ['Summarise this lesson', '<p>Customers form opinions at many <b>moments of truth</b>:</p><ul><li>Discover, first contact, purchase, after the sale.</li><li>At each one, ask what the customer needs from you right there.</li><li>Make that one thing happen every time.</li></ul>'],
      ['Explain it simply', '<p>Think of every time a customer “meets” your business, online or in person. Each meeting leaves a small impression. Good service means making each of those impressions a good one.</p>']
    ], { starter: 'Which moment do your customers find hardest right now: finding you, contacting you, buying, or getting help afterwards?' }),

    lesson(3, 'Listening and asking good questions', 'Article', 5, [
      B('lead', { text: 'Many service problems start with a misunderstanding. Listening carefully and asking the right questions helps you understand what the customer really needs.' }),
      B('cards', { title: 'Four habits of active listening', numbered: true, cards: [
        { title: 'Give full attention', text: 'Put your phone down and face the customer, or read their whole message.', more: '' },
        { title: 'Let them finish', text: 'Do not interrupt, even if you think you know the answer.', more: '' },
        { title: 'Repeat it back', text: '“So the order arrived late and one item was missing?”', more: '' },
        { title: 'Check you got it right', text: 'Ask if there is anything else before you offer a solution.', more: '' }] }),
      B('define', { title: 'Two kinds of questions', intro: '', leftTitle: 'Open questions', leftLead: 'Invite the customer to explain.', left: ['What happened when you used it?', 'How can I help you today?'], rightTitle: 'Closed questions', rightLead: 'Confirm facts quickly.', right: ['Did you buy it this week?', 'Is your order number 2041?'] }),
      B('callout', { variant: 'note', title: 'Try to avoid', text: 'Interrupting, jumping to a solution too early, or telling an upset customer to “calm down”. These make people feel unheard.' }),
      B('flashcards', { title: 'Test yourself', cards: [
        { front: 'What is active listening?', back: 'Giving full attention, letting the customer finish, repeating back what you heard and checking you understood.' },
        { front: 'When are open questions useful?', back: 'When you want the customer to explain the situation in their own words.' },
        { front: 'When are closed questions useful?', back: 'When you need to confirm a specific fact quickly, such as a date or order number.' },
        { front: 'Name one thing to avoid with an upset customer.', back: 'Interrupting, rushing to a solution, or telling them to calm down.' }] })
    ], [
      Q('Which is an open question?', ['Did you buy it today?', 'What happened when you used it?', 'Is your name Sara?', 'Was it the blue one?'], 1, 'Open questions invite the customer to explain in their own words.'),
      Q('Why repeat back what the customer said?', ['To fill the silence.', 'To check you understood correctly and show you were listening.', 'To make the call longer.', 'To avoid giving a solution.'], 1, 'Repeating back confirms your understanding and shows the customer they were heard.')
    ], [
      ['Summarise this lesson', '<p>Listen first, solve second:</p><ul><li>Give full attention and let them finish.</li><li>Repeat back and check you understood.</li><li>Use <b>open</b> questions to understand and <b>closed</b> questions to confirm facts.</li></ul>'],
      ['Give me an example', '<p>A customer says “my order is wrong”. Instead of guessing, ask “What did you receive?” (open), then “So you got size M instead of L?” (repeat back), then “Is the order number 2041?” (closed).</p>']
    ], { starter: 'Share a question you often ask customers. Is it open or closed?' }),

    lesson(4, 'Exercise: handle a complaint', 'Scenario', 7, [
      B('lead', { text: 'Complaints are a chance to win a customer back. A simple, calm routine helps you stay in control, even when the customer is upset.' }),
      B('cards', { title: 'A simple routine: LAST', numbered: true, cards: [
        { title: 'Listen', text: 'Let the customer explain fully, without interrupting.', more: '' },
        { title: 'Apologise', text: 'Say sorry for their experience, sincerely and without blaming.', more: '' },
        { title: 'Solve', text: 'Offer clear options, such as a repair, replacement or refund.', more: '' },
        { title: 'Thank and follow up', text: 'Thank them for telling you, then check later that all is well.', more: '' }] }),
      B('personas', { title: 'The situation', intro: 'Read about the customer, then plan your response below.', personas: [
        { name: 'Mr. Tan', demographic: 'Regular customer who buys kitchen appliances from your shop', needs: 'His new blender stopped working after a week. He is frustrated and needs it working before his daughter’s birthday party on Saturday.', can: 'Apologise, offer a same-week replacement or repair, and confirm the timing', touch: 'Phone call, shop counter' }] }),
      B('task', { title: 'Your turn: respond to Mr. Tan', prompt: 'Write what you would say or do at each step of LAST.', fields: [
        { label: 'Listen: what would you ask to understand the problem?', hint: 'Try one open question.' },
        { label: 'Apologise: what would you say?', hint: '' },
        { label: 'Solve: which options would you offer?', hint: 'Remember the party on Saturday.' },
        { label: 'Follow up: how and when would you check in?', hint: '' }] }),
      B('callout', { variant: 'good', title: 'Good to know', text: 'A complaint handled well can make a customer more loyal than one who never had a problem at all.' })
    ], [
      Q('What does the "S" in LAST stand for?', ['Smile', 'Solve', 'Sell', 'Stop'], 1, 'LAST is Listen, Apologise, Solve, Thank and follow up.'),
      Q('Mr. Tan needs the blender for Saturday. Which response fits best?', ['Tell him repairs take three weeks.', 'Offer a replacement he can collect before Saturday.', 'Ask him to write an email.', 'Explain that blenders often break.'], 1, 'A replacement before Saturday solves his real need: having it for the party.'),
      Q('Why follow up after solving a complaint?', ['To sell something else.', 'To check the problem is really fixed and show you care.', 'It is required by law.', 'To ask for a review straight away.'], 1, 'Following up confirms the fix worked and turns a bad experience into a good one.')
    ], [
      ['Help me with the task', '<p>Work through LAST for Mr. Tan:</p><ol><li><b>Listen</b>: “What happens when you switch it on?”</li><li><b>Apologise</b>: “I’m sorry it stopped working so soon, especially with the party coming.”</li><li><b>Solve</b>: offer a replacement he can collect by Friday.</li><li><b>Follow up</b>: message him after the weekend.</li></ol>'],
      ['Summarise this lesson', '<p>Handle complaints with <b>LAST</b>: Listen, Apologise, Solve, Thank and follow up. A well-handled complaint can build more loyalty than no problem at all.</p>']
    ], { starter: 'How would you respond to Mr. Tan? Share your “Solve” step.', posts: [
      { who: 'Dewi K.', ago: 600, kind: 'comment', likes: 2, text: 'I would give him a new one straight away and fix the old one later. The party matters most to him.' }] }),

    lesson(5, 'Serving customers online and on chat', 'Article', 5, [
      B('lead', { text: 'Many customers now contact small businesses through WhatsApp, social media and online reviews. The same service skills apply, but speed and tone matter even more in writing.' }),
      B('cards', { title: 'Four habits for online service', numbered: false, cards: [
        { title: 'Reply quickly', text: 'If you cannot answer fully, say when you will.', more: '' },
        { title: 'Keep it friendly', text: 'Short, warm sentences. Use the customer’s name.', more: '' },
        { title: 'Go private for details', text: 'Move orders, payments and addresses to a private chat.', more: '' },
        { title: 'Answer every review', text: 'Thank people for good ones; respond calmly to bad ones.', more: '' }] }),
      B('define', { title: 'Replying to a negative review', intro: 'Other customers read your reply as much as the review itself.', leftTitle: 'Do', leftLead: '', left: ['Thank them for the feedback', 'Apologise for their experience', 'Offer to put it right in a private message'], rightTitle: 'Do not', rightLead: '', right: ['Argue or blame the customer', 'Share private details in public', 'Ignore it'] }),
      B('callout', { variant: 'info', title: 'Save time with ready answers', text: 'Keep a few short, friendly replies for common questions such as prices, opening hours and delivery. Personalise them before sending.' })
    ], [
      Q('A customer asks a question on chat but you need time to check. What should you do?', ['Wait until you have the full answer.', 'Reply quickly and say when you will get back to them.', 'Ignore the message.', 'Send a link to your website only.'], 1, 'A quick reply that sets expectations keeps the customer informed and confident.'),
      Q('Which is the best reply to a negative review?', ['Explain why the customer is wrong.', 'Thank them, apologise and offer to fix it in a private message.', 'Delete the review.', 'Share their order details publicly.'], 1, 'A calm, helpful reply reassures the reviewer and every future customer who reads it.')
    ], [
      ['Summarise this lesson', '<p>Online, speed and tone matter even more:</p><ul><li>Reply quickly, even if only to say when you will answer.</li><li>Keep it warm and short, and move private details to a private chat.</li><li>Answer every review, calmly.</li></ul>'],
      ['Give me an example', '<p>Review: “Delivery was two days late.” Reply: “Thank you for telling us, Sara, and sorry for the wait. We’d like to put this right. We’ve sent you a private message.”</p>']
    ], { starter: 'What is the most common question customers send you online? How do you answer it?' }),

    lesson(6, 'Turning feedback into improvements', 'Article', 5, [
      B('lead', { text: 'Feedback is free advice from the people who matter most to your business. The trick is to collect it regularly and act on it, one change at a time.' }),
      B('cards', { title: 'Easy ways to collect feedback', numbered: false, cards: [
        { title: 'Ask in person', text: '“Was everything all right today?” at the counter or after delivery.', more: '' },
        { title: 'A three-question survey', text: 'What went well, what could be better, would you recommend us?', more: '' },
        { title: 'Read what is already there', text: 'Reviews, comments and chat messages are feedback too.', more: '' }] }),
      B('steps', { title: 'A monthly feedback routine', steps: ['Collect comments from every channel', 'Sort them into themes', 'Choose one thing to improve', 'Make the change and tell customers'], current: 1 }),
      B('task', { title: 'Your turn: find one improvement', prompt: 'Think about the feedback you already hear.', fields: [
        { label: 'What feedback have you heard more than once?', hint: '' },
        { label: 'What one change could you make this month?', hint: 'Small and specific works best.' }] }),
      B('callout', { variant: 'good', title: 'Close the loop', text: 'When you improve something, tell your customers: “You asked, we listened.” It shows their feedback matters and encourages more.' })
    ], [
      Q('Which is the best way to act on feedback?', ['Change many things at once.', 'Collect it regularly, sort it into themes and improve one thing at a time.', 'Only listen to positive comments.', 'Wait for a big complaint.'], 1, 'A simple routine of collecting, sorting and fixing one thing at a time keeps improvements steady.'),
      Q('What does "close the loop" mean?', ['Stop collecting feedback.', 'Tell customers what you changed because of their feedback.', 'Delete old reviews.', 'Close the shop early.'], 1, 'Closing the loop means telling customers about the change, so they know their feedback mattered.')
    ], [
      ['Summarise this lesson', '<p>Treat feedback as free advice:</p><ul><li>Collect it in person, with a short survey and from reviews.</li><li>Each month: collect, sort, choose one thing, act.</li><li>Tell customers what you changed.</li></ul>'],
      ['Help me with the task', '<p>Look for words customers repeat, such as “wait”, “price” or “delivery”. Pick the one you can improve fastest, for example adding a second delivery slot on Saturdays.</p>']
    ], { starter: 'Share one change you made because a customer suggested it.' }),

    lesson(7, 'Exercise: your service promise', 'Scenario', 6, [
      B('lead', { text: 'A service promise is a short statement that tells customers what they can always expect from you. It also guides anyone who works with you.' }),
      B('cards', { title: 'Examples from small businesses', numbered: false, cards: [
        { title: 'A tailor', text: '“Every alteration ready when we say, or the next one is free.”', more: '' },
        { title: 'An online shop', text: '“We reply to every message within two hours during opening times.”', more: '' },
        { title: 'A café', text: '“We remember our regulars, and their usual order.”', more: '' }] }),
      B('task', { title: 'Your turn: write your service promise', prompt: 'Answer the first two questions, then write your promise.', fields: [
        { label: 'What do your customers value most?', hint: 'Speed, friendliness, quality, reliability…' },
        { label: 'What can you always deliver, even on a busy day?', hint: '' },
        { label: 'Your promise in one or two sentences', hint: 'Start with “We…”.' }] }),
      B('callout', { variant: 'note', title: 'Keep it realistic', text: 'Only promise what you can deliver every time. A broken promise does more harm than no promise at all.' })
    ], [
      Q('What makes a good service promise?', ['It is long and detailed.', 'It is short, clear and something you can deliver every time.', 'It promises everything to everyone.', 'It is only for staff.'], 1, 'A good promise is short, specific and realistic, so customers can trust it.'),
      Q('Why is a broken promise a problem?', ['It is not a problem.', 'It damages trust more than having no promise.', 'It makes customers buy more.', 'It saves time.'], 1, 'Customers remember broken promises, so only promise what you can always keep.')
    ], [
      ['Help me write my promise', '<p>Combine what customers value with what you can always deliver:</p><p>“We <b>[what you always do]</b> so that <b>[what the customer gets]</b>.”</p><p>For example: “We confirm every order within one hour, so you always know when it will arrive.”</p>']
    ], { starter: 'Share your service promise. What do you think of each other’s?' }),

    // Lesson 8: the course quiz
    {
      id: 'cs8', mod: 'csm1', title: 'Quiz', type: 'Quiz', mins: 5, minsManual: true, legacy: '', url: '', blocks: [], converted: true, resources: [],
      review: { mode: 'off', pass: 70, later: true, questions: [] }, jen: { on: true, chips: [], answers: {}, glossary: [] }, disc: { on: true, starter: '', posts: [] },
      quiz: { pass: 80, checked: true, questions: [
        { id: 'csz1', scenario: 'A customer messages your shop on Instagram at 9 pm asking if a dress is available in size L. You will not be able to check the stock until tomorrow morning.', stem: 'What is the best reply?', options: ['Do not reply until you have checked.', '“Thanks for asking! I’ll check our stock first thing tomorrow and message you by 10 am.”', '“We might have it, come and see.”', '“Check our website.”'], correct: 1, confirmed: true, why: 'A quick reply that sets a clear time keeps the customer informed and confident, even when you cannot answer yet.' },
        { id: 'csz2', scenario: 'An upset customer calls: the cake they ordered for tonight has the wrong name on it.', stem: 'What should you do first?', options: ['Explain that the order form was unclear.', 'Listen fully, then apologise sincerely.', 'Offer a discount on their next order straight away.', 'Ask them to come back tomorrow.'], correct: 1, confirmed: true, why: 'LAST starts with Listen and Apologise. Solutions come after the customer feels heard.' },
        { id: 'csz3', scenario: 'You receive a one-star review saying delivery was late and nobody answered the phone.', stem: 'Which response is best?', options: ['Reply explaining it was a busy week and they should be patient.', 'Ignore it; one review does not matter.', 'Thank them, apologise and offer to put it right in a private message.', 'Ask friends to post five-star reviews.'], correct: 2, confirmed: true, why: 'A calm, public apology with an offer to fix it privately reassures the reviewer and future customers.' },
        { id: 'csz4', scenario: 'Over the last month, several customers have said the wait at lunchtime is too long.', stem: 'What is the most useful next step?', options: ['Choose one change to shorten the wait, try it, and tell customers.', 'Wait until more people complain.', 'Change the whole menu.', 'Stop opening at lunchtime.'], correct: 0, confirmed: true, why: 'Pick one specific improvement, act on it and close the loop by telling customers.' },
        { id: 'csz5', scenario: 'You want to write a service promise for your small online shop.', stem: 'Which promise is best?', options: ['“We are the best shop in the country.”', '“Free delivery to anywhere in the world, always.”', '“We reply to every message within two hours during opening times.”', '“We will make every customer happy.”'], correct: 2, confirmed: true, why: 'It is specific, realistic and something customers can check, so it builds trust.' }] }
    }
  ];

  window.ATLAS_COURSES = window.ATLAS_COURSES || {};
  window.ATLAS_COURSES.cs = {
    key: 'cs',
    sample: true,
    lessons: lessons,
    modules: [{ id: 'csm1', title: 'Module 1', desc: 'Customer service that brings customers back' }],
    obj: { sel: [], custom: [], roles: [], map: {} }, km: {}, kmSug: {},
    status: 'published', ver: 'V1',
    details: {
      title: 'Customer Service Essentials',
      description: 'Learn practical ways to look after your customers: understand the moments that matter, listen and ask good questions, handle complaints calmly, serve customers online, and turn feedback into improvements.',
      difficulty: 'Beginner', industry: ['Retail', 'Hospitality'], linked: [],
      cover: { type: 'image', src: 'assets/courses/customer-service-cover.webp', x: 50, y: 50 },
      outcomes: [
        'Recognise the moments that shape how customers feel about your business.',
        'Use active listening and good questions to understand what customers need.',
        'Handle complaints calmly with a simple routine.',
        'Serve customers well online and reply to reviews.',
        'Turn feedback into improvements and write your own service promise.'
      ],
      about: [
        'Good service is one of the most powerful advantages a small business has. In this course you will look at your business through your customers’ eyes and practise simple habits that make them want to come back.',
        'Each lesson takes about five minutes and ends with a short review. Two exercises let you apply what you learn to your own business.'
      ]
    },
    course: { duration: 0, durationAuto: true }
  };
})();
