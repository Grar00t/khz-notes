/* app.js — خوارزم article data + grid renderer */

const ARTICLES = [
  {
    id: 'a1',
    tag: 'فلسفة',
    title: 'الذكاء الاصطناعي لا يفهم — يتنبأ',
    excerpt: 'الفرق بين الفهم والتنبؤ مهم جداً. النموذج يعطيك جواباً صحيحاً بدون أن يعرف لماذا هو صحيح. هذا ليس تفكيراً — هذا أحصاء.',
    text: 'الذكاء الاصطناعي لا يفهم يتنبأ نموذج لغوي إحصاءي فهم إجابة فلسفة منطق دليل حجة',
    href: '#a1',
    date: 'أغسطس 2026',
  },
  {
    id: 'a2',
    tag: 'كوميديا',
    title: 'كيف تكذب بثقة: دليل النماذج اللغوية',
    excerpt: 'النموذج لا يكذب — يهلوس بثقة عالية. الفرق دقيق لكنه يغيّر كل شيء.',
    text: 'كذب ثقة هلوسة نموذج لغوي hallucination توليد كوميديا نقد دليل',
    href: '#a2',
    date: 'يوليو 2026',
  },
  {
    id: 'a3',
    tag: 'هندسة',
    title: 'BM25 وSHA-256: الحقيقة المحسوبة',
    excerpt: 'لماذا بنيت محرك بحث محلياً بدون خوادم أو APIs. Athar.Engine تجربة في بناء بحث يمكن التحقق من نتائجه.',
    text: 'BM25 SHA-256 محرك بحث محلي خوارزمية فهرسة خوارزم تقني هندسة برمجيات',
    href: 'https://github.com/Grar00t/Athar.Engine',
    date: 'أغسطس 2026',
  },
  {
    id: 'a4',
    tag: 'ملاحظات',
    title: 'الآلة التي لا تنام',
    excerpt: 'السؤال ليس هل تنام الآلة. السؤال: من يستفيد من آلة لا تعرف التعب.',
    text: 'آلة نوم تعب فلسفة إنسان عمل سلطة مسؤولية تقنية تفكير',
    href: '#a4',
    date: 'يونيو 2026',
  },
  {
    id: 'a5',
    tag: 'تقنية',
    title: 'Niyah.Engine: نموذج C11 لا يحتاج سحابة',
    excerpt: 'بنيت Transformer decoder بلغة C11 بدون PyTorch وبدون Docker. فقط gcc وخيال.',
    text: 'Niyah Engine C11 transformer decoder GQA SwiGLU RoPE inference بدون سحابة محلي niyah نموذج تدريب',
    href: 'https://github.com/Grar00t',
    date: 'مايو 2026',
  },
  {
    id: 'a6',
    tag: 'رأي',
    title: 'لماذا تثق بالنموذج حين تثق بالطبيب؟',
    excerpt: 'مقارنة غريبة. الطبيب يخطئ. النموذج يهلوس. لكننا نتعامل معهما بنفس مستوى الثقة.',
    text: 'ثقة طبيب نموذج خطأ هلوسة مسؤولية صحة علم رأي نقد',
    href: '#a6',
    date: 'مارس 2026',
  },
];

/* Render article grid */
function renderGrid() {
  const grid = document.getElementById('article-grid');
  if (!grid) return;
  grid.innerHTML = ARTICLES.map(a => `
    <a class="article-card" href="${a.href}" ${a.href.startsWith('http') ? 'target="_blank" rel="noopener"' : ''}>
      <div>
        <small>${a.tag} &middot; ${a.date}</small>
        <h3>${a.title}</h3>
        <p>${a.excerpt}</p>
      </div>
      <span class="card-read">اقرأ →</span>
    </a>`).join('');
}

document.addEventListener('DOMContentLoaded', renderGrid);
