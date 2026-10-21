(function(){
  'use strict';

  const SOURCES = {
    level1: { name:'VOA Let’s Learn English · Level 1', url:'https://learningenglish.voanews.com/p/5644.html' },
    level2: { name:'VOA Let’s Learn English · Level 2', url:'https://learningenglish.voanews.com/p/6765.html' },
    minute: { name:'VOA English in a Minute', url:'https://learningenglish.voanews.com/z/3619' },
    words:  { name:'VOA News Words', url:'https://learningenglish.voanews.com/z/3620' },
    science:{ name:'VOA Science in the News', url:'https://learningenglish.voanews.com/z/1579' },
    l1a: { name:'VOA Lesson 1 · Welcome!', url:'https://learningenglish.voanews.com/a/lets-learn-english-lesson-one/3111026.html' },
    l1b: { name:'VOA Lesson 2 · Hello, I’m Anna!', url:'https://learningenglish.voanews.com/a/lets-learn-english-lesson-2-hello/3113733.html' },
    l1c: { name:'VOA Lesson 3 · I’m Here!', url:'https://learningenglish.voanews.com/a/lets-learn-english-lesson-3-i-am-here/3126527.html' }
  };

  const LEVELS = {
    A1:{ name:'入门', color:'#54d6ff', method:'短句识别 · 慢速模仿', read:10, listen:10, output:'说出 3 个完整短句', sources:['l1a','l1a','l1b','l1b','l1c','l1c','level1'] },
    A2:{ name:'基础', color:'#63e6be', method:'主旨理解 · 句型复用', read:15, listen:15, output:'用 3–5 句话复述', sources:['level1','level1','level2','level2','minute','minute','level1'] },
    B1:{ name:'中级', color:'#ffd166', method:'细节提取 · 结构化复述', read:20, listen:20, output:'写或说 6–8 句摘要', sources:['level2','level2','minute','minute','words','words','level2'] },
    B2:{ name:'中高级', color:'#c4a7ff', method:'观点分析 · 自然表达', read:25, listen:25, output:'用 90 秒总结并表达观点', sources:['science','science','words','words','minute','minute','science'] }
  };

  const GOALS = {
    general:{ name:'日常交流', icon:'💬', prompt:'把今天的表达换成与你真实生活有关的内容。' },
    technical:{ name:'技术英语', icon:'💻', prompt:'补充一句：How can I use this expression when explaining code or a bug?' },
    interview:{ name:'求职面试', icon:'🎯', prompt:'把今天的表达放进一段面试回答，并说清楚一个具体例子。' },
    travel:{ name:'旅行生活', icon:'🧳', prompt:'想象一个真实旅行场景，用今天的表达完成请求或回应。' }
  };

  const PACES = {
    light:{ name:'轻量', factor:.65, note:'忙碌版：保住连续性即可' },
    standard:{ name:'标准', factor:1, note:'理解、跟读、输出形成闭环' },
    deep:{ name:'深入', factor:1.45, note:'增加复听、精读和二次输出' }
  };

  const DAY_FOCUS = [
    { icon:'🎧', title:'先听后读', action:'第一遍不要看文本，只记录你听到的人物、地点和动作。' },
    { icon:'🗣️', title:'语音模仿', action:'选 5 句做“听一句—暂停—模仿”，注意重音和连读。' },
    { icon:'🔎', title:'抓住细节', action:'写下 3 个事实，再回到文本核对；最多查 3 个关键词。' },
    { icon:'🧩', title:'句型替换', action:'找 3 个有用句型，把人物、时间或动作换成自己的信息。' },
    { icon:'⚡', title:'无字幕挑战', action:'不看文本再听一遍，之后只检查真正影响主旨的部分。' },
    { icon:'🎙️', title:'主动复述', action:'合上文本，用自己的话复述；卡住时先绕开，不立即查原句。' },
    { icon:'🧠', title:'一周回忆', action:'任选本周材料，不看笔记说主旨、3 个细节和 1 个自己的观点。' }
  ];

  function safeLevel(value){ return Object.prototype.hasOwnProperty.call(LEVELS,value) ? value : 'A2'; }
  function safeGoal(value){ return Object.prototype.hasOwnProperty.call(GOALS,value) ? value : 'general'; }
  function safePace(value){ return Object.prototype.hasOwnProperty.call(PACES,value) ? value : 'standard'; }
  function dayNumber(dateString){
    const now = new Date((dateString||new Date().toISOString().slice(0,10))+'T00:00:00');
    const anchor = new Date('2026-10-21T00:00:00');
    return Math.max(0, Math.floor((now-anchor)/86400000));
  }
  function profile(settings){
    settings=settings||{};
    return { level:safeLevel(settings.studyLevel), goal:safeGoal(settings.studyGoal), pace:safePace(settings.studyPace) };
  }
  function mission(settings,dateString){
    const p=profile(settings), level=LEVELS[p.level], goal=GOALS[p.goal], pace=PACES[p.pace];
    const n=dayNumber(dateString), slot=((n%7)+7)%7, focus=DAY_FOCUS[slot];
    const source=SOURCES[level.sources[slot]];
    const read=Math.max(6,Math.round(level.read*pace.factor));
    const listen=Math.max(6,Math.round(level.listen*pace.factor));
    const vocab=p.pace==='light'?0:(p.level==='A1'?2:3);
    const depth=p.pace==='deep'?'完成后隔 10 分钟，再进行一次不看文本的复述。':'';
    return { profile:p, level, goal, pace, source, focus, slot, cycle:n+1, read, listen, vocab,
      output:level.output, depth,
      total:read+listen+(p.pace==='light'?5:p.pace==='deep'?20:10) };
  }

  window.EnglishPlan = { SOURCES, LEVELS, GOALS, PACES, profile, mission };
})();
