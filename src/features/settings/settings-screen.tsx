import type { ReactNode } from 'react';
import { AudioSettings } from '../audio';
import { TafsirManager } from '../tafsir';
import { AccountPanel } from '../auth';
import { ReaderSettings } from './reader-settings';
import { NotifySettings } from './notify-settings';
import { DataSettings } from './data-settings';
import { TasmiSettings } from './tasmi-settings';

function Section({ title, hint, children }: { title: string; hint: string; children: ReactNode }) {
  return (
    <details className="section">
      <summary className="section__head">
        <span className="section__title">{title}</span>
        <span className="section__hint">{hint}</span>
      </summary>
      <div className="section__body">{children}</div>
    </details>
  );
}

export function SettingsScreen() {
  return (
    <section className="screen">
      <h1 className="screen__title">الإعدادات</h1>
      <Section title="الحساب والمزامنة" hint="حفظ تقدّمك عبر الأجهزة">
        <AccountPanel />
      </Section>
      <Section title="التلاوة والصوت" hint="القارئ وتنزيل السور">
        <AudioSettings />
      </Section>
      <Section title="التفسير" hint="تنزيل الكتب واختيار المعتمد">
        <TafsirManager />
      </Section>
      <Section title="المصحف" hint="السمة وحجم الخط">
        <ReaderSettings />
      </Section>
      <Section title="التنبيهات" hint="الصلاة والأذكار والحفظ">
        <NotifySettings />
      </Section>
      <Section title="التسميع دون إنترنت" hint="محرّك التعرّف على الصوت (متقدّم)">
        <TasmiSettings />
      </Section>
      <Section title="البيانات والتخزين" hint="نسخ احتياطي وإعادة ضبط">
        <DataSettings />
      </Section>
    </section>
  );
}
