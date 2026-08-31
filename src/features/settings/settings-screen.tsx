import type { ReactNode } from 'react';
import { AudioSettings } from '../audio';
import { TafsirManager } from '../tafsir';
import { AccountPanel } from '../auth';
import { InstallButton } from '../install';
import { ReaderSettings } from './reader-settings';
import { ThemeSettings } from './theme-settings';
import { NotifySettings } from './notify-settings';
import { DataSettings } from './data-settings';
import { ModelSettings } from './model-settings';

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
      <InstallButton block />
      <Section title="المظهر والعرض" hint="السمة، الخط، نمط عرض المصحف">
        <ThemeSettings />
      </Section>
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
      <Section title="محرّك التسميع" hint="نموذج التعرّف على الصوت وتنزيله">
        <ModelSettings />
      </Section>
      <Section title="البيانات والتخزين" hint="نسخ احتياطي وإعادة ضبط">
        <DataSettings />
      </Section>
    </section>
  );
}
