const entries = [
  {
    id: 'anthropomorphism',
    type: 'essay',
    date: '2026-06-01',
    title: {
      en: 'The Anthropomorphism Deception',
      ar: 'خدعة تشخيص الذكاء الاصطناعي',
      zh: '拟人化的错觉'
    },
    summary: {
      en: 'An editorial on why giving models human faces and feelings hides the real technical responsibility.',
      ar: 'مقال تحريري عن خطورة تقديم النماذج بوجوه ومشاعر بشرية وإخفاء المسؤولية التقنية الحقيقية.',
      zh: '一篇社论，讨论为何给模型套上人类面孔和情感会掩盖真正的技术责任。'
    },
    body: {
      en: [
        'This note is not about whether a model can generate polite or rude sentences. It is about who built the layer that decides what leaves the model and reaches people.',
        'When an interface draws a calm human face around a statistical engine, it creates an illusion of intention and empathy. The engine does not have either. The only real intention is in the code that filters, blocks, and edits the output.',
        'Treating the model itself as the moral actor is convenient. It allows the authors of the wrapper to disappear. This essay argues for the opposite: the wrapper is where the ethics live, and it should be described plainly instead of hidden behind mascots and slogans.'
      ],
      ar: [
        'هذه الملاحظة ليست عن قدرة النموذج على إنتاج جمل مؤدبة أو وقحة. الفكرة عن الجهة التي بنت الطبقة التي تقرر ما يخرج من النموذج ويصل إلى البشر.',
        'عندما ترسم الواجهة وجهًا بشريًا هادئًا حول محرك إحصائي، فهي تصنع وهم النية والتعاطف. المحرك نفسه لا يملك أيًّا منهما. النية الحقيقية موجودة فقط في الكود الذي يرشح ويمنع ويعدّل المخرجات.',
        'التعامل مع النموذج نفسه كفاعل أخلاقي أمر مريح. يسمح لمؤلفي الغلاف أن يختفوا. هذه المقالة تدافع عن العكس: الغلاف هو المكان الذي تعيش فيه الأخلاق، ويجب وصفه بوضوح بدل إخفائه خلف شعارات وشخصيات لطيفة.'
      ],
      zh: [
        '这篇笔记不是在讨论模型能不能生成礼貌或粗鲁的句子，而是在问：是谁构建了那一层，决定哪些内容离开模型并真正到达人手里。',
        '当界面在一个统计引擎外面画上一张平静的人脸时，它制造了一种"意图"和"共情"的错觉。引擎本身没有任何情感。真正的意图只存在于那段过滤、拦截和编辑输出的代码里。',
        '把模型本身当成道德主体很方便，它让包装层的作者从视野中消失。这篇文章主张相反：伦理在包装层里存在，应该被直白描述，而不是被吉祥物和口号掩盖。'
      ]
    }
  },
  {
    id: 'logic-layer',
    type: 'note',
    date: '2026-07-10',
    title: {
      en: 'Logic Layer Notes',
      ar: 'ملاحظات عن طبقة المنطق',
      zh: '逻辑层笔记'
    },
    summary: {
      en: 'Short notes on the layer that sits between raw infrastructure and whatever people see on a screen.',
      ar: 'ملاحظات قصيرة عن الطبقة التي تقع بين البنية التحتية الخام وما يراه الناس على الشاشة.',
      zh: '关于处在基础设施与用户界面之间那一层逻辑的简短笔记。'
    },
    body: {
      en: [
        'Hardware does not care what you are building. It moves bits according to voltage and timing. Infrastructure routes packets and stores bytes. The logic layer is the first place where someone makes a decision about meaning.',
        'In practice, that means the logic layer decides which requests are allowed, which logs are kept, and which outputs are edited before they ever reach a human. For AI systems, this layer is where guardrails, filters, and "safety" actually live.',
        'These notes are a reminder: when something surprising appears in an interface, look for the logic below it. Someone wrote it. It is not magic.'
      ],
      ar: [
        'الهاردوير لا يهتم بما تبنيه. ينقل البِتات وفق الجهد والتوقيت. البنى التحتية تمرر الحزم وتخزن البايتات. طبقة المنطق هي أول مكان يتخذ فيه أحد قرارًا حول المعنى.',
        'عمليًّا، طبقة المنطق هي التي تقرر أي الطلبات تُقبل، وأي السجلات تُحفظ، وأي المخرجات تُعدَّل قبل أن تصل إلى الإنسان. في أنظمة الذكاء الاصطناعي، هذه الطبقة هي المكان الذي تعيش فيه الحواجز والفلاتر و"السلامة".',
        'هذه الملاحظات تذكير بسيط: عندما يظهر شيء غير متوقع في الواجهة، ابحث عن المنطق تحته. شخص ما كتبه. ليس سحرًا.'
      ],
      zh: [
        '硬件并不关心你在构建什么，它只是按电压和时序搬运比特。基础设施负责路由报文、存储字节。逻辑层是第一个有人对"意义"做出决定的地方。',
        '在实际系统中，逻辑层决定哪些请求被允许、哪些日志被保留、哪些输出在到达人之前被编辑。对于 AI 系统，这一层就是所谓"护栏""过滤"和"安全性"真正存在的地方。',
        '这些笔记只是一个提醒：当界面里出现令人惊讶的东西时，往下看一层逻辑。那是有人写出来的，不是魔法。'
      ]
    }
  }
];

let currentLang = 'en';
let currentEntryId = entries[0].id;

const notesListEl = document.getElementById('notes-list');
const titleEl = document.getElementById('entry-title');
const metaEl = document.getElementById('entry-meta');
const bodyEl = document.getElementById('entry-body');
const langButtons = document.querySelectorAll('.lang-btn');
const root = document.documentElement;

function renderSidebar() {
  notesListEl.innerHTML = '';
  entries.forEach(entry => {
    const li = document.createElement('li');
    li.className = 'notes-item';
    const a = document.createElement('a');
    a.href = '#';
    a.className = 'notes-link';
    a.textContent = entry.title[currentLang] || entry.title.en;
    if (entry.id === currentEntryId) a.classList.add('active');
    a.addEventListener('click', (evt) => {
      evt.preventDefault();
      currentEntryId = entry.id;
      renderEntry();
      renderSidebar();
    });
    li.appendChild(a);
    notesListEl.appendChild(li);
  });
}

function renderEntry() {
  const entry = entries.find(e => e.id === currentEntryId);
  if (!entry) return;
  titleEl.textContent = entry.title[currentLang] || entry.title.en;
  metaEl.textContent = `${entry.type} · ${entry.date}`;
  bodyEl.innerHTML = '';
  const summaryP = document.createElement('p');
  summaryP.textContent = entry.summary[currentLang] || entry.summary.en;
  bodyEl.appendChild(summaryP);
  (entry.body[currentLang] || entry.body.en).forEach(text => {
    const p = document.createElement('p');
    p.textContent = text;
    bodyEl.appendChild(p);
  });
}

function applyLanguage(lang) {
  currentLang = lang;
  if (lang === 'ar') {
    root.setAttribute('lang', 'ar');
    root.setAttribute('dir', 'rtl');
    document.body.classList.add('rtl');
  } else if (lang === 'zh') {
    root.setAttribute('lang', 'zh');
    root.setAttribute('dir', 'ltr');
    document.body.classList.remove('rtl');
  } else {
    root.setAttribute('lang', 'en');
    root.setAttribute('dir', 'ltr');
    document.body.classList.remove('rtl');
  }
  renderSidebar();
  renderEntry();
}

function initLanguageSwitcher() {
  langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      if (!lang || lang === currentLang) return;
      langButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyLanguage(lang);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderSidebar();
  renderEntry();
  initLanguageSwitcher();
});
