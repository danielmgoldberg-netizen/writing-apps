import { useState } from "react";
import MainIdeaTutor from "./apps/MainIdeaTutor.jsx";
import OpinionWriter from "./apps/OpinionWriter.jsx";
import { DS_TOKENS, DS_FONT_STACK } from "./components/DesktopShell.jsx";

// Sign-in and menu screens sit outside DesktopShell, so they pull in the same
// --ds-* tokens to stay visually in step with the tutors.
const appStyles = `
  * { box-sizing: border-box; }
  body { margin: 0; }

  .app-screen {
    ${DS_TOKENS}
    min-height: 100vh;
    background: #F5F5F7;
    padding: 72px 20px 60px;
    font-family: ${DS_FONT_STACK};
    font-size: var(--ds-body);
    color: var(--ds-label);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  .app-panel {
    max-width: 520px;
    margin: 0 auto;
    animation: app-fade-in 0.45s var(--ds-ease) both;
  }
  @keyframes app-fade-in {
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .app-header { text-align: center; margin-bottom: 32px; }
  .app-icon {
    width: 64px;
    height: 64px;
    margin: 0 auto 16px;
    border-radius: 15px;
    background: linear-gradient(180deg, #4AA3FF 0%, #007AFF 100%);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1), 0 6px 16px rgba(0, 122, 255, 0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
  }
  .app-title {
    font-size: var(--ds-large-title);
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1.2;
    margin: 0 0 6px;
  }
  .app-subtitle {
    font-size: var(--ds-title-3);
    color: var(--ds-secondary-label);
    line-height: 1.45;
    margin: 0;
  }

  .app-card {
    background: #FFFFFF;
    border: 0.5px solid rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04), 0 4px 14px rgba(0, 0, 0, 0.04);
    padding: 24px;
  }
  .app-card-title {
    font-size: var(--ds-title-2);
    font-weight: 600;
    letter-spacing: -0.01em;
    margin: 0 0 4px;
  }
  .app-card-subtitle {
    font-size: var(--ds-body);
    color: var(--ds-secondary-label);
    margin: 0 0 20px;
    line-height: 1.5;
  }

  .app-field-row { display: flex; gap: 12px; margin-bottom: 14px; flex-wrap: wrap; }
  .app-field-row > div { flex: 1; min-width: 160px; }
  .app-label {
    display: block;
    font-size: var(--ds-body);
    font-weight: 500;
    color: var(--ds-label);
    margin-bottom: 6px;
  }
  .app-input,
  .app-select {
    width: 100%;
    min-height: 34px;
    padding: 7px 12px;
    border: 0.5px solid rgba(0, 0, 0, 0.18);
    border-radius: 8px;
    font-family: inherit;
    font-size: var(--ds-title-3);
    color: var(--ds-label);
    background: #FFFFFF;
    outline: none;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
  }
  .app-input { box-shadow: inset 0 0.5px 1px rgba(0, 0, 0, 0.06); }
  .app-input::placeholder { color: var(--ds-tertiary-label); }
  .app-select {
    padding-right: 36px;
    box-shadow: 0 0.5px 1.5px rgba(0, 0, 0, 0.08);
    cursor: default;
    appearance: none;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='8' height='12' viewBox='0 0 8 12'><path fill='none' stroke='%23007AFF' stroke-width='1.4' stroke-linecap='round' stroke-linejoin='round' d='M1 4.5 4 1.5l3 3M1 7.5l3 3 3-3'/></svg>");
    background-repeat: no-repeat;
    background-position: right 12px center;
  }
  .app-input:focus,
  .app-select:focus {
    border-color: var(--ds-accent);
    box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.25);
  }

  .app-btn {
    font-family: inherit;
    font-size: var(--ds-body);
    font-weight: 500;
    min-height: 32px;
    padding: 0 20px;
    border: none;
    border-radius: 8px;
    cursor: default;
    color: #FFFFFF;
    background: linear-gradient(180deg, #2B8CFF 0%, #007AFF 100%);
    box-shadow: 0 0.5px 1px rgba(0, 0, 0, 0.15);
    transition: filter 0.15s ease, opacity 0.15s ease;
  }
  .app-btn:hover:not(:disabled) { filter: brightness(1.05); }
  .app-btn:active:not(:disabled) { filter: brightness(0.92); }
  .app-btn:disabled { opacity: 0.4; }
  .app-btn:focus-visible { outline: none; box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.35); }

  .app-hint {
    margin-top: 12px;
    font-size: var(--ds-callout);
    color: #A04100;
    text-align: right;
  }

  /* Exercise menu: list of large, clickable rows */
  .app-exercise {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 12px;
    padding: 18px 20px;
    text-align: left;
    font-family: inherit;
    color: inherit;
    background: #FFFFFF;
    border: 0.5px solid rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04), 0 4px 14px rgba(0, 0, 0, 0.04);
    cursor: default;
    transition: box-shadow 0.2s var(--ds-ease), transform 0.2s var(--ds-ease);
  }
  .app-exercise:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05), 0 10px 24px rgba(0, 0, 0, 0.08);
  }
  .app-exercise:active { transform: scale(0.99); }
  .app-exercise:focus-visible { outline: none; box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.35); }
  .app-exercise-icon {
    width: 48px;
    height: 48px;
    flex-shrink: 0;
    border-radius: 11px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
  }
  .app-exercise-body { flex: 1; min-width: 0; }
  .app-exercise-title {
    font-size: var(--ds-title-2);
    font-weight: 600;
    letter-spacing: -0.01em;
    margin-bottom: 3px;
  }
  .app-exercise-desc {
    font-size: var(--ds-body);
    color: var(--ds-secondary-label);
    line-height: 1.5;
  }
  .app-chevron {
    flex-shrink: 0;
    color: var(--ds-tertiary-label);
    font-size: 22px;
    line-height: 1;
  }

  @media (prefers-reduced-motion: reduce) {
    .app-panel { animation: none; }
    .app-exercise { transition: none; }
  }
`;

export default function App() {
  const [current, setCurrent] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [teacher, setTeacher] = useState("");
  const [welcomed, setWelcomed] = useState(false);

  const goBack = () => setCurrent(null);

  if (current === "main-idea") {
    return <MainIdeaTutor onBack={goBack} firstName={firstName} surname={surname} teacher={teacher} />;
  }
  if (current === "opinion") {
    return <OpinionWriter onBack={goBack} firstName={firstName} surname={surname} teacher={teacher} />;
  }

  if (!welcomed) {
    const ready = firstName.trim() && surname.trim() && teacher;
    return (
      <div className="app-screen">
        <style>{appStyles}</style>

        <div className="app-panel">
          <header className="app-header">
            <div className="app-icon" aria-hidden="true">✍️</div>
            <h1 className="app-title">Writing Practice</h1>
            <p className="app-subtitle">Sign in once to work with both tutors.</p>
          </header>

          <section className="app-card">
            <h2 className="app-card-title">👋 Welcome! Please introduce yourself.</h2>
            <p className="app-card-subtitle">Fill in all three fields to begin. 😊</p>

            <div className="app-field-row">
              <div>
                <label className="app-label" htmlFor="app-first-name">First name</label>
                <input
                  id="app-first-name"
                  type="text"
                  className="app-input"
                  placeholder="e.g. Yuval"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                />
              </div>
              <div>
                <label className="app-label" htmlFor="app-surname">Surname</label>
                <input
                  id="app-surname"
                  type="text"
                  className="app-input"
                  placeholder="e.g. Cohen"
                  value={surname}
                  onChange={e => setSurname(e.target.value)}
                />
              </div>
            </div>

            <div style={{ marginBottom: 22 }}>
              <label className="app-label" htmlFor="app-teacher">My teacher is</label>
              <select
                id="app-teacher"
                className="app-select"
                value={teacher}
                onChange={e => setTeacher(e.target.value)}
              >
                <option value="">Select your teacher...</option>
                <option value="Daniel">Daniel</option>
                <option value="Keren">Keren</option>
              </select>
            </div>

            <div style={{ textAlign: "right" }}>
              <button
                className="app-btn"
                disabled={!ready}
                onClick={() => setWelcomed(true)}
              >
                Start ➜
              </button>
            </div>

            {!ready && (firstName || surname || teacher) && (
              <div className="app-hint">
                Please fill in all three fields to continue.
              </div>
            )}
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="app-screen">
      <style>{appStyles}</style>

      <div className="app-panel">
        <header className="app-header">
          <div className="app-icon" aria-hidden="true">✍️</div>
          <h1 className="app-title">Writing Practice Dashboard</h1>
          <p className="app-subtitle">Choose a tutor to work with.</p>
        </header>

        <button className="app-exercise" onClick={() => setCurrent("main-idea")}>
          <div className="app-exercise-icon" style={{ background: "rgba(0, 122, 255, 0.12)" }} aria-hidden="true">💭</div>
          <div className="app-exercise-body">
            <div className="app-exercise-title">Main Idea Writing Tutor</div>
            <div className="app-exercise-desc">
              Write one sentence describing the main idea of a text. Earn up to 5 points.
            </div>
          </div>
          <span className="app-chevron" aria-hidden="true">›</span>
        </button>

        <button className="app-exercise" onClick={() => setCurrent("opinion")}>
          <div className="app-exercise-icon" style={{ background: "rgba(175, 82, 222, 0.12)" }} aria-hidden="true">🗣️</div>
          <div className="app-exercise-body">
            <div className="app-exercise-title">Opinion Writing Tutor</div>
            <div className="app-exercise-desc">
              Write two sentences sharing your opinion about a text. Earn up to 10 points.
            </div>
          </div>
          <span className="app-chevron" aria-hidden="true">›</span>
        </button>
      </div>
    </div>
  );
}
