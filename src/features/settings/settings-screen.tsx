import { useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AppHeader,Icon } from '../../components';
import { AudioSettings } from '../audio';
import { TafsirManager } from '../tafsir';
import { AccountPanel } from '../auth';
import { InstallButton } from '../install';
import { ReaderSettings } from './reader-settings';
import { ThemeSettings } from './theme-settings';
import { NotifySettings } from './notify-settings';
import { DataSettings } from './data-settings';
import { ModelSettings } from './model-settings';
import { OfflinePack } from './offline-pack';
import { TranslationManager } from './translation-manager';
import { shareApp } from '../share';

function Section({ icon, title, hint, children }: { icon: string; title: string; hint: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={open ? 'section section--open' : 'section'}>
      <button className="section__head" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span className="section__icon"><Icon name={icon} size={20} /></span>
        <span className="section__meta">
          <span className="section__title">{title}</span>
          <span className="section__hint">{hint}</span>
        </span>
        <span className={open ? 'section__chevron section__chevron--open' : 'section__chevron'}><Icon name="up" size={18} /></span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: 'hidden' }}
          >
            <div className="section__body">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const SECTIONS = [
  { icon: 'palette', title: 'المظهر والعرض', hint: 'السمة، الخط، نمط عرض المصحف', body: <ThemeSettings /> },
  { icon: 'user', title: 'الحساب والمزامنة', hint: 'حفظ تقدّمك عبر الأجهزة', body: <AccountPanel /> },
  { icon: 'play', title: 'التلاوة والصوت', hint: 'القارئ وتنزيل السور', body: <AudioSettings /> },
  { icon: 'book', title: 'التفسير', hint: 'تنزيل الكتب واختيار المعتمد', body: <TafsirManager /> },
  { icon: 'book', title: 'الترجمة', hint: 'ترجمات بعدّة لغات', body: <TranslationManager /> },
  { icon: 'book', title: 'المصحف', hint: 'السمة وحجم الخط', body: <ReaderSettings /> },
  { icon: 'bell', title: 'التنبيهات', hint: 'الصلاة والأذكار والحفظ', body: <NotifySettings /> },
  { icon: 'mic', title: 'محرّك التسميع', hint: 'نموذج التعرّف على الصوت وتنزيله', body: <ModelSettings /> },
  { icon: 'download', title: 'العمل دون إنترنت', hint: 'تنزيل الأساسيات دفعة واحدة', body: <OfflinePack /> },
  { icon: 'download', title: 'البيانات والتخزين', hint: 'نسخ احتياطي وإعادة ضبط', body: <DataSettings /> },
];

export function SettingsScreen() {
  return (
    <section className="screen">
      <AppHeader section="الإعدادات" />
      <InstallButton block />
      {SECTIONS.map((s) => (
        <Section key={s.title} icon={s.icon} title={s.title} hint={s.hint}>{s.body}</Section>
      ))}
      <Section icon="share" title="شارك التطبيق" hint="صدقة جارية — انشره لمن تحب">
        <p className="field__hint">كل حرف يُقرأ بسببك أجرٌ لك.</p>
        <button className="btn btn--block" onClick={() => void shareApp()}>
          <span className="btn__row"><Icon name="share" size={18} /> مشاركة التطبيق</span>
        </button>
      </Section>
      <Section icon="info" title="حول التطبيق" hint="المصادر والتراخيص">
        <p className="field__hint" style={{ lineHeight: 2 }}>
          نصّ المصحف: مصحف المدينة النبوية — رواية حفص عن عاصم.<br />
          التفاسير والترجمات مصادر منسوبة لأصحابها.<br />
          الخطوط: Amiri Quran و IBM Plex Sans Arabic (رخصة OFL).<br />
          تطبيق مجاني بلا إعلانات ويعمل بدون إنترنت.
        </p>
      </Section>
    </section>
  );
}
