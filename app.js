/* app.js — خوارزم article data + grid renderer
 *
 * قاعدة هذا الملف: كل مدخل يشير إلى أثر موجود يُفتح ويُتحقّق منه.
 * ممنوع: روابط معلّقة (#) إلى صفحات غير موجودة.
 * ممنوع: حشو كلمات مفتاحية في حقل text — يُفهرسه BM25، فيكون نصّاً حقيقياً.
 * ممنوع: رقم لا يُعاد إنتاجه من المستودع المربوط.
 */

const ARTICLES = [
  {
    id: 'niyah',
    tag: 'مشروع · C11',
    title: 'Niyah.Engine — محرّك استدلال بـ C11 بلا PyTorch',
    excerpt:
      'مفكّك ترميز Transformer مكتوب بـ C11: RoPE، وGQA، وSwiGLU، وتخزين KV. الأوزان تأتي من ملف GGUF محلّي — بلا سحابة ولا API. الحالة المعلنة: 126 فحصاً يعمل، وعيب GQA معروف لم يُصلَح بعد.',
    text:
      'محرّك استدلال مكتوب بلغة C11 بلا PyTorch ولا Docker. مفكّك ترميز Transformer فيه RoPE وGQA وSwiGLU وتخزين KV cache. يقرأ الأوزان من ملف GGUF محلّي فلا يحتاج سحابة ولا خدمة خارجية. يُبنى بـ CMake وgcc. العيوب المعروفة مكتوبة ومنشورة وليست مخفية.',
    href: 'https://github.com/Grar00t/Niyah.Engine',
    date: 'أغسطس 2026',
  },
  {
    id: 'gguf',
    tag: 'تقرير عيوب',
    title: 'ثلاثة عيوب جعلت قراءة أي ملف GGUF حقيقي مستحيلة',
    excerpt:
      'جدول أنواع الميتاداتا كان خاطئاً من الرمز 6 فما بعده، فيُقرأ أوّل مفتاح في كل ملف حقيقي على غير نوعه. وثانيهما: حلّ lm_head قبل النظر في ربط التضمين. والثالث: حساب الأحجام بكتل 32 عنصراً لكل الأنواع، وأنواع K تستخدم 256.',
    text:
      'تقرير عيوب محوّل GGUF. جدول أنواع القيم في الميتاداتا كان مزاحاً فقرأ النصّ على أنّه عشري عائم. ربط التضمين tie word embeddings لم يُراجع قبل حلّ طبقة المخرج. أحجام الكتل للأنواع المكمّمة Q4_K وQ6_K تستخدم كتلة عليا من 256 عنصراً لا 32. الفحوص: 99 ثمّ 27.',
    href: 'https://github.com/Grar00t/Niyah.Engine/tree/main/tools',
    date: 'أغسطس 2026',
  },
  {
    id: 'athar',
    tag: 'مشروع · بحث',
    title: 'Athar.Engine — BM25 مكتوب بـ C',
    excerpt:
      'فهرسة وترتيب بـ BM25 بمعاملات k1 = 1.5 وb = 0.75. ما لم يُنجَز بعد: استمرار الفهرس على القرص — فهو الآن في الذاكرة فقط.',
    text:
      'محرّك بحث محلّي مكتوب بلغة C يستخدم خوارزمية BM25 للترتيب مع معامل k1 يساوي 1.5 ومعامل b يساوي 0.75. الفهرس حالياً في الذاكرة ولا يُحفظ على القرص، وهذا نقص معلن لا مخفيّ.',
    href: 'https://github.com/Grar00t/Athar.Engine',
    date: '2026',
  },
  {
    id: 'search-here',
    tag: 'في هذه الصفحة',
    title: 'البحث فوق يعمل بنفس الخوارزمية — في المتصفّح',
    excerpt:
      'ملف search.js ينقل BM25 إلى جافاسكربت بنفس المعاملات: بلا خادم، وبلا ملف فهرس مُسبق، ويُسقط التشكيل والتطويل قبل المطابقة. الدرجة المعروضة مع كل نتيجة هي درجة BM25 الفعلية.',
    text:
      'بحث داخل المتصفّح بلا خادم ينقل خوارزمية BM25 إلى جافاسكربت. يُسقط التشكيل والتطويل قبل المطابقة فيتطابق النصّ العربي المشكّل وغير المشكّل. العنوان موزون مرّتين في الفهرسة. الدرجة المعروضة حقيقية لا تزيينية.',
    href: 'https://github.com/Grar00t/khz-notes/blob/main/search.js',
    date: 'أغسطس 2026',
  },
  {
    id: 'anthropomorphism',
    tag: 'مقال رأي',
    title: 'The Anthropomorphism Deception',
    excerpt:
      'مقال طويل عن واجهات تتكلّم بصيغة المتكلّم وما تفعله بتقدير المستخدم لقدرة النطام. رأي وتوثيق — ليس ورقة محكّمة، وبعض ما فيه غير مُسند.',
    text:
      'مقال رأي عن التشبيه بالإنسان في واجهات النماذج اللغوية وأثره على معايرة الثقة وتوزيع المسؤولية. رأي لا ورقة محكّمة.',
    href: 'https://khz-two.vercel.app',
    date: '2026',
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
