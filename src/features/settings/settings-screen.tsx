// The hub. Each section is filled in as its feature lands; every downloadable
// or toggleable capability in the app must surface a control here (see CLAUDE.md).
const sections = [
  { key: 'audio', title: 'التلاوة والصوت', hint: 'اختيار القارئ وتنزيل السور' },
  { key: 'tafsir', title: 'التفسير', hint: 'تنزيل كتب التفسير واختيار المعتمد' },
  { key: 'reader', title: 'المصحف', hint: 'حجم الخط، السمة، معاني الكلمات' },
  { key: 'notifications', title: 'التنبيهات', hint: 'الصلاة، الأذكار، الحفظ' },
  { key: 'hifz', title: 'الحفظ', hint: 'الهدف اليومي وجدول المراجعة' },
  { key: 'data', title: 'البيانات والتخزين', hint: 'مسح التنزيلات، تصدير التقدّم' },
];

export function SettingsScreen() {
  return (
    <section className="screen">
      <h1 className="screen__title">الإعدادات</h1>
      <ul className="settings-list">
        {sections.map((s) => (
          <li key={s.key} className="settings-list__item">
            <span className="settings-list__title">{s.title}</span>
            <span className="settings-list__hint">{s.hint}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
