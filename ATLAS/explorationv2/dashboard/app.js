const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
const icon = name => `<svg aria-hidden="true"><use href="#i-${name}"/></svg>`;
const escapeText = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
let savedState = {};
try { savedState = JSON.parse(localStorage.getItem('atlas-preview-v1') || '{}'); } catch {}
if (!savedState || typeof savedState !== 'object') savedState = {};
const state = { goal: [3,5,7].includes(savedState.goal) ? savedState.goal : 5, lessonDone: savedState.lessonDone === true, saved: Array.isArray(savedState.saved) ? savedState.saved.filter(id => ['communication','thinking','ai','time'].includes(id)) : ['ai'], quizDone: savedState.quizDone === true };
function persist() { try { localStorage.setItem('atlas-preview-v1', JSON.stringify(state)); } catch {} }
const courses = [
 { id: 'communication', title: 'Effective Communication', category: 'PEOPLE & COMMUNICATION', lessons: 8, done: 3, percent: 38, theme: 'comms', cover: 'Make every<br>word count.', description: 'Listen with intent, ask better questions, and make space for meaningful conversations.' },
 { id: 'thinking', title: 'Critical Thinking Essentials', category: 'THINKING & PROBLEM SOLVING', lessons: 10, done: 2, percent: 20, theme: 'thinking', cover: 'A different<br>perspective.', description: 'Challenge assumptions, evaluate evidence, and make thoughtful decisions.' },
 { id: 'ai', title: 'AI for Everyday Work', category: 'DIGITAL SKILLS', lessons: 6, done: 4, percent: 67, theme: 'ai', cover: 'Meet your<br>new superpower.', description: 'Discover practical ways to use AI while checking its output and protecting your information.' },
 { id: 'time', title: 'Focus & Time Management', category: 'PERSONAL DEVELOPMENT', lessons: 5, done: 5, percent: 100, theme: 'time', cover: 'Less busy.<br>More focused.', description: 'Create room for what matters with intentional planning and better attention habits.' }
];
const coverArt = {
 comms: '<circle cx="100" cy="63" r="43" fill="#dfd9c4"/><path d="M65 34h48v39H92L76 87V73H65Z" fill="#768d99"/><path d="M90 55h43v34h-12l-10 13V89H90Z" fill="#a1bac6"/><path d="M74 45h23M74 53h16" stroke="#dcebf3" stroke-width="2"/>',
 thinking: '<g transform="translate(91 67) rotate(-24)"><rect x="-32" y="-32" width="64" height="64" rx="4" fill="#a8b6c8"/><rect x="-21" y="-21" width="42" height="42" rx="3" fill="#d6dfe8"/><rect x="-10" y="-10" width="20" height="20" rx="2" fill="#728da8"/><path d="m-32-32 22 22M32 32 10 10m22-42L10-10m-42 42 22-22" stroke="#859cb5" stroke-width="1"/></g>',
 ai: '<g transform="translate(95 63)"><path d="M0-47c5 32 15 42 47 47-32 5-42 15-47 47-5-32-15-42-47-47 32-5 42-15 47-47Z" fill="#b99a80"/><path d="M0-30c4 20 10 26 30 30-20 4-26 10-30 30-4-20-10-26-30-30 20-4 26-10 30-30Z" fill="#dfc6ac"/><circle r="12" fill="#f4e9db"/></g>',
 time: '<circle cx="94" cy="65" r="38" fill="#abc2cd"/><circle cx="94" cy="65" r="29" fill="#dcebf3"/><path d="M94 46v20l15 9" stroke="#578094" stroke-width="3"/>'
};
let filter = 'progress';
function courseProgress(course) { return course.id === 'communication' && state.lessonDone ? 50 : course.percent; }
function renderCourses() {
 const list = courses.filter(course => filter === 'saved' ? state.saved.includes(course.id) : filter === 'completed' ? courseProgress(course) === 100 : courseProgress(course) < 100);
 $('#course-grid').innerHTML = list.length ? list.map(course => `<button class="course-card" data-course="${course.id}" aria-label="Open ${course.title}, ${courseProgress(course)} percent complete"><div class="course-cover cover-${course.theme}"><span class="cover-eyebrow">ATLAS COLLECTION</span><strong class="cover-title">${course.cover}</strong><svg viewBox="0 0 140 130" aria-hidden="true">${coverArt[course.theme]}</svg></div><div class="course-info"><span class="course-type">${course.category}</span><h3>${course.title}</h3><p>${course.id === 'communication' && state.lessonDone ? 4 : course.done} of ${course.lessons} lessons completed</p><div class="course-progress-line"><div class="track"><span style="width:${courseProgress(course)}%"></span></div><span>${courseProgress(course)}%</span></div></div></button>`).join('') : '<div class="empty-state">A little inspiration for later.<br>Open a course and save it to find it here.</div>';
 $('#saved-count').textContent = state.saved.length;
 $('#hero-progress-fill').style.width = state.lessonDone ? '50%' : '38%';
 $('#hero-progress-text').textContent = `${state.lessonDone ? '50' : '38'}% complete`;
 $('#continue-learning').innerHTML = `${state.lessonDone ? 'Revisit your lesson' : 'Continue learning'}${icon('arrow')}`;
}
function renderGoal() {
 $('#goal-done').innerHTML = `3<span>/ ${state.goal}</span>`;
 $('#goal-ring').style.strokeDashoffset = 308 * (1 - 3/state.goal);
 $('#goal-caption').innerHTML = state.goal === 3 ? 'Weekly goal complete.<br>Look at you grow.' : `${state.goal-3} more days to hit<br>your weekly goal.`;
}
const dialog = $('#dialog');
let previousFocus;
function openDialog(content, eyebrow = 'YOUR LEARNING SPACE') {
 previousFocus = dialog.open ? previousFocus : document.activeElement;
 $('#dialog-eyebrow').textContent = eyebrow;
 $('#dialog-content').innerHTML = content;
 const title = $('#dialog-content h2');
 if (title) { title.id = 'modal-title'; dialog.setAttribute('aria-labelledby','modal-title'); }
 if (!dialog.open) dialog.showModal();
 dialog.scrollTop = 0;
 closeSidebar();
}
function closeDialog() { dialog.close(); previousFocus?.focus(); }
$('#close-dialog').addEventListener('click',closeDialog);
dialog.addEventListener('click', event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeDialog(); } });
let toastTimer;
function toast(message) { clearTimeout(toastTimer); $('#toast span').textContent=message; $('#toast').classList.add('show'); toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),3000); }

function showCourse(id) {
 const course = courses.find(item=>item.id===id); if(!course) return;
 openDialog(`<h2>${course.title}</h2><p>${course.description}</p><div class="dialog-progress"><div class="track"><span style="width:${courseProgress(course)}%"></span></div>${courseProgress(course)}% complete</div><div class="lesson-visual">${icon(course.theme==='comms'?'chat':course.theme==='thinking'?'target':course.theme==='ai'?'spark':'clock')}<h3>${course.cover.replace('<br>',' ')}</h3><p>${course.lessons} short lessons · Learn at your own pace</p></div><div class="dialog-actions"><button class="button primary" id="course-start">${courseProgress(course)===100?'Review course':'Continue course'}${icon('arrow')}</button><button class="button secondary" id="save-course">${state.saved.includes(id)?'Saved ✓':'Save for later'}</button></div>`,course.category);
 $('#course-start').onclick=()=>showLesson(id);
 $('#save-course').onclick=()=>{ state.saved=state.saved.includes(id)?state.saved.filter(item=>item!==id):[...state.saved,id]; persist(); renderCourses(); $('#save-course').textContent=state.saved.includes(id)?'Saved ✓':'Save for later'; toast(state.saved.includes(id)?'Saved to your learning list.':'Removed from your saved courses.'); };
}
function showLesson(id='communication') {
 const course = courses.find(item=>item.id===id);
 const lessons = {
  communication: { title:'The art of active listening', lead:'Listen to understand, not just to reply.', text:'Give the speaker your full attention. When they finish, reflect their main idea in your own words and ask an open question before offering advice.', tip:'Try this: “It sounds like the deadline is your main concern. What would make it more manageable?”' },
  thinking: {title:'Pause before you conclude',lead:'A strong conclusion starts with a better question.',text:'Separate what you observed from what you assumed. Look for evidence that could challenge your first explanation, then consider at least one alternative.',tip:'Try this: “What evidence would change my mind?”'},
  ai: {title:'Give your AI useful context',lead:'A clear request makes a useful starting point.',text:'Describe your goal, audience, and constraints. Ask for a specific format, then check the result for accuracy. Avoid including confidential or personal information.',tip:'Try this: “Draft three plain-language ways to explain active listening to a new team member.”'},
  time: {title:'Make space for focused work',lead:'Decide what deserves your attention.',text:'Choose one meaningful task, remove avoidable distractions, and work on it for a short, protected interval. Review what helped you focus before your next session.',tip:'Try this: write down your next action before opening another tab.'}
 };
 const lesson = lessons[id];
 openDialog(`<h2>${lesson.title}</h2><p>${course.title} · Lesson preview</p><div class="lesson-visual">${icon('book')}<h3>${lesson.lead}</h3><p>${lesson.text}</p></div><div class="lesson-tip">${lesson.tip}</div><div class="dialog-actions"><button class="button primary" id="lesson-complete">${id==='communication'&&state.lessonDone?'Completed ✓':'Mark lesson complete'}${icon('check')}</button><button class="button secondary" id="lesson-back">Back to course</button></div><p class="preview-note">This is a short sample lesson for the local design preview.</p>`,'A LITTLE FOCUS GOES A LONG WAY');
 $('#lesson-back').onclick=()=>showCourse(id);
 $('#lesson-complete').onclick=()=>{ if(id==='communication'){state.lessonDone=true;persist();renderCourses();} $('#lesson-complete').textContent='Completed ✓'; $('#lesson-complete').disabled=true; toast('One more step forward. Nicely done.'); };
}
$('#continue-learning').onclick=()=>showLesson();
$('#course-grid').onclick=event=>{ const card=event.target.closest('[data-course]');if(card)showCourse(card.dataset.course); };
$$('[data-filter]').forEach((button,index,buttons)=>{
 button.onclick=()=>{filter=button.dataset.filter;buttons.forEach(item=>{item.classList.toggle('selected',item===button);item.setAttribute('aria-selected',String(item===button));item.tabIndex=item===button?0:-1;});renderCourses();};
 button.tabIndex=index===0?0:-1;
 button.onkeydown=event=>{ if(['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){event.preventDefault();const target=event.key==='Home'?0:event.key==='End'?buttons.length-1:(index+(event.key==='ArrowRight'?1:-1)+buttons.length)%buttons.length;buttons[target].focus();buttons[target].click();} };
});

const quizQuestions = [
 {q:'A teammate is explaining a challenge. What is the best first response?',a:['Offer your solution right away.','Summarize what you heard and ask a question.','Share a similar experience before they finish.'],correct:1,why:'Reflecting their point checks your understanding and shows you are listening before jumping to a solution.'},
 {q:'Which question invites a more thoughtful conversation?',a:['“You agree with me, right?”','“Is everything fine?”','“What would make this easier for you?”'],correct:2,why:'Open questions give the other person room to share their perspective in their own words.'},
 {q:'What helps you evaluate an unfamiliar claim?',a:['Check the evidence and the source.','Trust it if many people share it.','Accept it if it matches your first impression.'],correct:0,why:'Reliable evidence and source context help you judge a claim beyond popularity or your existing beliefs.'},
 {q:'You ask an AI tool to draft a summary. What should you do next?',a:['Send it without reading.','Review the claims against the original material.','Assume every detail is correct.'],correct:1,why:'AI-generated text can contain errors. Check the summary against your source before using it.'},
 {q:'What is a useful way to end a learning session?',a:['Open several unrelated topics.','Skip reflection and immediately switch tasks.','Recall one key idea and how you could use it.'],correct:2,why:'Recalling and applying an idea helps you connect your learning to a situation where it matters.'}
];
let quizIndex=0,quizScore=0;
function startQuiz(){quizIndex=0;quizScore=0;showQuizQuestion();}
function showQuizQuestion(){
 const question=quizQuestions[quizIndex];
 openDialog(`<div class="dialog-progress" style="margin:0 0 22px"><div class="track"><span style="width:${quizIndex*20}%"></span></div>${quizIndex+1} of 5</div><h2>${question.q}</h2><div class="modal-list">${question.a.map((answer,index)=>`<button class="quiz-option" data-answer="${index}">${answer}</button>`).join('')}</div><div id="quiz-feedback" aria-live="polite"></div>`,'SMART BITES · DAILY PRACTICE');
 $$('.quiz-option').forEach(button=>button.onclick=()=>{
  const isCorrect=Number(button.dataset.answer)===question.correct;
  if(isCorrect)quizScore++;
  $$('.quiz-option').forEach(option=>{option.disabled=true;if(Number(option.dataset.answer)===question.correct)option.classList.add('correct');});
  if(!isCorrect)button.classList.add('incorrect');
  $('#quiz-feedback').innerHTML=`<div class="quiz-explanation"><strong>${isCorrect?'That’s it!':'A useful one to revisit.'}</strong><br>${question.why}</div><div class="dialog-actions"><button class="button primary" id="quiz-next">${quizIndex===4?'See my results':'Next question'}${icon('arrow')}</button></div>`;
  $('#quiz-next').onclick=()=>{quizIndex++;if(quizIndex<5)showQuizQuestion();else finishQuiz();};
  $('#quiz-next').focus();
 });
}
function finishQuiz(){state.quizDone=true;persist();openDialog(`<div class="success-art">✳</div><h2 style="text-align:center">A little wiser than before.</h2><p style="text-align:center">You answered <strong>${quizScore} out of 5</strong> correctly.<br>Every moment of practice is a step forward.</p><div class="dialog-actions" style="justify-content:center"><button class="button primary" id="quiz-finish">Back to my learning${icon('arrow')}</button><button class="button secondary" id="quiz-retry">Try again</button></div>`,'SMART BITES · COMPLETE');$('#quiz-finish').onclick=closeDialog;$('#quiz-retry').onclick=startQuiz;$('#start-quiz').innerHTML=`Practice again${icon('arrow')}`;}
$('#start-quiz').onclick=startQuiz;
if(state.quizDone)$('#start-quiz').innerHTML=`Practice again${icon('arrow')}`;
$('#edit-goal').onclick=()=>{let goal=state.goal;openDialog(`<h2>A little consistency adds up.</h2><p>Choose how many days you’d like to learn each week. Start with a rhythm that works for you.</p><div class="goal-options">${[3,5,7].map(value=>`<button class="goal-option ${goal===value?'selected':''}" data-goal="${value}" aria-pressed="${goal===value}"><strong>${value}</strong><span>days a week</span></button>`).join('')}</div><div class="dialog-actions"><button class="button primary" id="save-goal">Save my goal${icon('check')}</button></div>`,'YOUR WEEKLY GOAL');$$('[data-goal]').forEach(button=>button.onclick=()=>{goal=Number(button.dataset.goal);$$('[data-goal]').forEach(item=>{item.classList.toggle('selected',item===button);item.setAttribute('aria-pressed',String(item===button));});});$('#save-goal').onclick=()=>{state.goal=goal;persist();renderGoal();closeDialog();toast(`Your weekly goal is set to ${goal} days.`);};};

function courseList(title='Your course collection', search=false){
 openDialog(`<h2>${title}</h2><p>Follow your curiosity. Keep your momentum.</p>${search?'<input class="search-input" id="course-search" placeholder="Search courses or skills…" aria-label="Search courses" autocomplete="off">':''}<div class="modal-list" id="course-list"></div>`,'EXPLORE YOUR NEXT CHAPTER');
 const render=(query='')=>{const matches=courses.filter(course=>(course.title+' '+course.category+' '+course.description).toLowerCase().includes(query.toLowerCase()));$('#course-list').innerHTML=matches.length?matches.map(course=>`<button class="modal-row" data-open-course="${course.id}">${icon('book')}<div><strong>${course.title}</strong><small>${course.lessons} lessons · ${courseProgress(course)}% complete</small></div>${icon('chevron')}</button>`).join(''):'<div class="empty-state">No courses found. Try “communication”, “thinking”, or “AI”.</div>';$$('[data-open-course]').forEach(button=>button.onclick=()=>showCourse(button.dataset.openCourse));};render();if(search){$('#course-search').oninput=event=>render(event.target.value);setTimeout(()=>$('#course-search')?.focus(),20);}
}
$('#all-courses').onclick=()=>courseList();
$('#search-button').onclick=()=>courseList('What would you like to learn?',true);
document.addEventListener('keydown',event=>{if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){event.preventDefault();courseList('What would you like to learn?',true);}if(event.key==='Escape')closeSidebar();});

function showAssistant(initialPrompt=''){
 openDialog(`<h2>A little help, right here.</h2><p class="preview-note">Interactive demo · Sample responses, not a live AI connection.</p><div class="chat-log" id="chat-log" role="log" aria-label="Learning assistant conversation"><div class="chat-message">Hi Jamie. Want to make sense of a concept, choose your next step, or reflect on your progress?</div></div><div class="suggestions"><button data-prompt="Explain active listening">Explain active listening</button><button data-prompt="What should I learn next?">What’s next for me?</button></div><form class="chat-form" id="chat-form"><input class="chat-input" id="chat-input" aria-label="Message the demo assistant" placeholder="Ask a learning question…" maxlength="400" autocomplete="off" required><button class="button primary" aria-label="Send message">${icon('arrow')}</button></form>`,'YOUR LEARNING ASSISTANT');
 function reply(message){const log=$('#chat-log');const user=document.createElement('div');user.className='chat-message user';user.textContent=message;log.append(user);const answer=document.createElement('div');answer.className='chat-message';const lower=message.toLowerCase();answer.textContent=/listen|communicat/.test(lower)?'Active listening means giving someone your attention, checking that you understand, and responding thoughtfully. Try reflecting their point: “So your main concern is…” Then ask an open question. You can practice this in your next communication lesson.':/next|course/.test(lower)?'For this demo learning plan, continue Effective Communication, then try today’s Smart Bites. If you have more time, Critical Thinking Essentials is a useful next step.':/progress|goal/.test(lower)?`You have learned on 3 days this week toward your ${state.goal}-day goal. Your communication course is ${state.lessonDone?'50':'38'}% complete. Small, consistent sessions can help you keep going.`:'This preview has sample guidance for active listening, choosing your next course, and your weekly progress. Try one of those topics to explore the interaction.';log.append(answer);log.scrollTop=log.scrollHeight;}
 $('#chat-form').onsubmit=event=>{event.preventDefault();const input=$('#chat-input');const message=input.value.trim();if(message){reply(message);input.value='';}};
 $$('[data-prompt]').forEach(button=>button.onclick=()=>reply(button.dataset.prompt));
 if(typeof initialPrompt==='string' && initialPrompt.trim()) reply(initialPrompt.trim());
}

$('#assistant-ask-form').onsubmit=event=>{event.preventDefault();const input=$('#assistant-question');const question=input.value.trim();if(question){showAssistant(question);input.value='';}};
$$('[data-ask]').forEach(button=>button.onclick=()=>showAssistant(button.dataset.ask));

const views={
 overview:()=>{closeSidebar();window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});},
 courses:()=>courseList(),library:()=>courseList('A world of things to discover',true),assistant:showAssistant,
 path:()=>{openDialog(`<h2>Your path to confident communication.</h2><p>A sample PALS journey, built around one step at a time.</p><ol class="path-steps"><li data-step="✓"><strong>Find your starting point</strong><p>Diagnostic assessment · Complete</p></li><li data-step="2"><strong>Build a foundation</strong><p>Effective Communication · ${state.lessonDone?'50':'38'}% complete</p></li><li data-step="3"><strong>Put it into practice</strong><p>Try a conversation scenario with a teammate.</p></li><li data-step="4"><strong>See how far you’ve come</strong><p>Take your communication check-in.</p></li></ol><button class="button primary" id="path-continue">Continue my path${icon('arrow')}</button>`,'PALS · PERSONALIZED LEARNING');$('#path-continue').onclick=()=>showLesson();},
 assessments:()=>{openDialog(`<h2>A moment to check in.</h2><p>See what’s sticking and where you can grow next.</p><div class="modal-list"><div class="modal-row">${icon('assess')}<div><strong>Communication check-in</strong><small>10 questions · 15 minutes · Due 2 October</small></div><span class="row-tag">Upcoming</span></div></div><h3>Warm up with a little practice.</h3><p>Try five sample questions covering communication, critical thinking, and AI literacy.</p><div class="dialog-actions"><button class="button primary" id="assessment-practice">Start practice${icon('arrow')}</button></div><p class="preview-note">The scheduled assessment is sample content. Practice is available in this preview.</p>`,'YOUR ASSESSMENTS');$('#assessment-practice').onclick=startQuiz;},
 progress:()=>openDialog(`<h2>Look how far you’ve come.</h2><p>Your sample learning snapshot for this week.</p><div class="metric-grid"><div><strong>3</strong><span>Learning days</span></div><div><strong>84</strong><span>Minutes learned</span></div><div><strong>1</strong><span>Course completed</span></div></div><h3>Skills taking shape</h3><div class="modal-list">${[['Communication',state.lessonDone?50:38],['Critical thinking',20],['AI literacy',67]].map(([label,percent])=>`<div class="modal-row"><div><strong>${label}</strong><div class="dialog-progress"><div class="track"><span style="width:${percent}%"></span></div>${percent}%</div></div></div>`).join('')}</div>`,'YOUR PROGRESS'),
 practice:()=>{openDialog(`<h2>Make space for another perspective.</h2><p>Your teammate Alex is overwhelmed by an approaching deadline. Practice starting a supportive conversation.</p><div class="lesson-visual">${icon('chat')}<h3>“There’s too much to finish.<br>I don’t know where to start.”</h3><p>Alex · Your teammate</p></div><h3>How would you respond?</h3><div class="modal-list"><button class="quiz-option" data-response="support">“What feels most urgent? Let’s think through it together.”</button><button class="quiz-option" data-response="dismiss">“Don’t worry. I’m sure it’ll be fine.”</button></div><div id="scenario-feedback" aria-live="polite"></div><p class="preview-note">A guided sample scenario. Live AI role-play is not connected.</p>`,'SCENARIO PRACTICE');$$('[data-response]').forEach(button=>button.onclick=()=>{$$('[data-response]').forEach(item=>item.classList.remove('correct','incorrect'));button.classList.add(button.dataset.response==='support'?'correct':'incorrect');$('#scenario-feedback').innerHTML=`<div class="quiz-explanation">${button.dataset.response==='support'?'Good start. You acknowledged the challenge and invited Alex to share what matters most. Next, reflect what you hear before suggesting a solution.':'Reassurance can be well-intended, but it may overlook Alex’s concern. Try asking what feels most urgent and offering to think it through together.'}</div>`;});},
 help:()=>openDialog('<h2>Make yourself at home.</h2><p>Continue a lesson, explore your courses, or build a little momentum with Smart Bites. Your goal, saved courses, and communication lesson progress are remembered in this browser.</p><div class="lesson-tip">Tip: press Ctrl K (or ⌘ K) to find a course. Use Escape to close any dialog.</div><p class="preview-note">This local design prototype uses fictional learner data and sample lessons. It does not change your Atlas account.</p>','HELP & RESOURCES'),
 profile:()=>openDialog('<div class="avatar" style="width:56px;height:56px;font-size:18px;margin-bottom:15px">JL</div><h2>Jamie Lee</h2><p>Learner · My learning space</p><div class="lesson-tip">A little progress, every day.<br>Your learning journey is yours to shape.</div><p class="preview-note">Sample learner profile for this local design preview.</p>','YOUR PROFILE')
};
$$('[data-nav]').forEach(button=>button.onclick=()=>views[button.dataset.nav]?.());
$('.brand').onclick=event=>{event.preventDefault();views.overview();};
$('#notifications').onclick=()=>{openDialog(`<h2>A few things for you.</h2><div class="modal-list"><button class="modal-row" id="notification-assessment">${icon('assess')}<div><strong>Your communication check-in is coming up.</strong><small>Due 2 October · 10 questions</small></div>${icon('chevron')}</button><button class="modal-row" id="notification-quiz">${icon('spark')}<div><strong>Today’s Smart Bites are ready.</strong><small>Five questions to keep your knowledge fresh.</small></div>${icon('chevron')}</button></div><div class="dialog-actions"><button class="button secondary" id="mark-read">Mark all as read</button></div>`,'NOTIFICATIONS');$('#notification-assessment').onclick=views.assessments;$('#notification-quiz').onclick=startQuiz;$('#mark-read').onclick=()=>{$$('#dialog-content .modal-row').forEach(row=>row.classList.add('notification-read'));$('.notification-trigger i').style.display='none';$('#notifications').setAttribute('aria-label','Notifications, all read');$('#mark-read').textContent='All caught up ✓';$('#mark-read').disabled=true;toast('All caught up.');};};
function closeSidebar(){$('#sidebar').classList.remove('open');$('#sidebar-shade').classList.remove('open');$('#menu').setAttribute('aria-expanded','false');}
$('#menu').setAttribute('aria-expanded','false');$('#menu').setAttribute('aria-controls','sidebar');
$('#menu').onclick=()=>{const open=$('#sidebar').classList.toggle('open');$('#sidebar-shade').classList.toggle('open',open);$('#menu').setAttribute('aria-expanded',String(open));};
$('#sidebar-shade').onclick=closeSidebar;
renderCourses();renderGoal();
