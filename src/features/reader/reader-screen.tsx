// Phase 1 fills this with the interactive Mushaf (bundled text, word-by-word
// highlight, tap-a-word sheet). For now it proves the offline shell renders RTL.
export function ReaderScreen() {
  return (
    <section className="screen">
      <h1 className="screen__title">الفرقان</h1>
      <p className="screen__body">
        مصحف تفاعلي يعمل بدون إنترنت. سيظهر هنا نص المصحف مع تفسير ومعاني الكلمات.
      </p>
      <p className="bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
    </section>
  );
}
