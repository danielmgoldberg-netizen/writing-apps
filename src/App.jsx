import { useState } from "react";
import MainIdeaTutor from "./apps/MainIdeaTutor.jsx";
import OpinionWriter from "./apps/OpinionWriter.jsx";

const cardStyle = {
  background: "#FFFFFF",
  border: "1px solid #E8E0D0",
  borderRadius: 14,
  padding: "24px 28px",
  marginBottom: 18,
  cursor: "pointer",
  transition: "box-shadow 0.15s ease, transform 0.1s ease",
};

const stepNumberStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 26,
  height: 26,
  borderRadius: "50%",
  background: "#2D5043",
  color: "#FAF6ED",
  fontSize: 13,
  fontWeight: 600,
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  marginRight: 10,
  flexShrink: 0,
};

const stepTitleStyle = {
  display: "flex",
  alignItems: "center",
  fontFamily: "'Fraunces', serif",
  fontSize: 20,
  fontWeight: 500,
  color: "#1F1B16",
  margin: 0,
  marginBottom: 14,
  letterSpacing: "-0.01em",
};

const labelStyle = {
  display: "block",
  fontSize: 12,
  fontWeight: 600,
  color: "#6B5D54",
  textTransform: "uppercase",
  letterSpacing: "0.07em",
  marginBottom: 6,
};

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
      <div style={{
        minHeight: "100vh",
        background: "#FAF6ED",
        padding: "48px 20px",
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
      }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap');

          * { box-sizing: border-box; }
          body { margin: 0; }

          .mit-select {
            width: 100%;
            padding: 12px 16px;
            border: 1.5px solid #DDD2BC;
            border-radius: 10px;
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-size: 15px;
            color: #1F1B16;
            background: #FDFAF2;
            outline: none;
            cursor: pointer;
            appearance: none;
            background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'><path fill='%236B5D54' d='M6 8L0 0h12z'/></svg>");
            background-repeat: no-repeat;
            background-position: right 16px center;
            padding-right: 40px;
          }
          .mit-select:focus {
            border-color: #2D5043;
            box-shadow: 0 0 0 3px rgba(45, 80, 67, 0.12);
          }

          .mit-btn {
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-size: 15px;
            font-weight: 600;
            padding: 12px 24px;
            border-radius: 10px;
            cursor: pointer;
            transition: transform 0.08s ease, background 0.15s ease, opacity 0.15s ease;
            border: none;
            letter-spacing: 0.01em;
          }
          .mit-btn:active:not(:disabled) { transform: translateY(1px); }
          .mit-btn:disabled { opacity: 0.55; cursor: not-allowed; }
          .mit-btn-primary { background: #2D5043; color: #FAF6ED; }
          .mit-btn-primary:hover:not(:disabled) { background: #234037; }
        `}</style>

        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h1 style={{
            fontFamily: "'Fraunces', serif",
            fontSize: 34,
            fontWeight: 500,
            color: "#1F1B16",
            margin: "0 0 8px 0",
            letterSpacing: "-0.02em"
          }}>
            ✍️ Writing Practice
          </h1>
          <p style={{ fontSize: 15, color: "#6B5D54", marginBottom: 36, lineHeight: 1.6 }}>
            Sign in once to use both exercises.
          </p>

          <section style={{
            background: "#FFFFFF",
            border: "1px solid #E8E0D0",
            borderRadius: 14,
            padding: "22px 26px"
          }}>
            <h2 style={stepTitleStyle}>
              <span style={stepNumberStyle}>👋</span>
              Welcome! Please introduce yourself.
            </h2>
            <p style={{ fontSize: 14.5, color: "#5A4D43", marginBottom: 18, lineHeight: 1.6 }}>
              Fill in all three fields to begin. 😊
            </p>

            <div style={{ display: "flex", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 160 }}>
                <label style={labelStyle}>First name</label>
                <input
                  type="text"
                  className="mit-select"
                  style={{ fontSize: 15, padding: "11px 14px", width: "100%" }}
                  placeholder="e.g. Yuval"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                />
              </div>
              <div style={{ flex: 1, minWidth: 160 }}>
                <label style={labelStyle}>Surname</label>
                <input
                  type="text"
                  className="mit-select"
                  style={{ fontSize: 15, padding: "11px 14px", width: "100%" }}
                  placeholder="e.g. Cohen"
                  value={surname}
                  onChange={e => setSurname(e.target.value)}
                />
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>My teacher is</label>
              <select
                className="mit-select"
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
                className="mit-btn mit-btn-primary"
                disabled={!ready}
                onClick={() => setWelcomed(true)}
              >
                Start ➜
              </button>
            </div>

            {!ready && (firstName || surname || teacher) && (
              <div style={{ marginTop: 12, fontSize: 13, color: "#8A6F30", fontStyle: "italic" }}>
                Please fill in all three fields to continue.
              </div>
            )}
          </section>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#FAF6ED",
      padding: "48px 20px",
      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
    }}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <h1 style={{
          fontFamily: "'Fraunces', serif",
          fontSize: 34,
          fontWeight: 500,
          color: "#1F1B16",
          margin: "0 0 8px 0",
          letterSpacing: "-0.02em"
        }}>
          ✍️ Writing Practice
        </h1>
        <p style={{ fontSize: 15, color: "#6B5D54", marginBottom: 36, lineHeight: 1.6 }}>
          Choose an exercise to begin.
        </p>

        <div
          style={cardStyle}
          onClick={() => setCurrent("main-idea")}
          onMouseEnter={e => {
            e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.boxShadow = "none";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <div style={{ fontSize: 28, marginBottom: 8 }}>💭</div>
          <div style={{
            fontFamily: "'Fraunces', serif",
            fontSize: 22,
            fontWeight: 500,
            color: "#1F1B16",
            marginBottom: 6
          }}>
            Main Idea Writing
          </div>
          <div style={{ fontSize: 14.5, color: "#6B5D54", lineHeight: 1.55 }}>
            Write one sentence describing the main idea of a text. Earn up to 5 points.
          </div>
        </div>

        <div
          style={cardStyle}
          onClick={() => setCurrent("opinion")}
          onMouseEnter={e => {
            e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.boxShadow = "none";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <div style={{ fontSize: 28, marginBottom: 8 }}>🗣️</div>
          <div style={{
            fontFamily: "'Fraunces', serif",
            fontSize: 22,
            fontWeight: 500,
            color: "#1F1B16",
            marginBottom: 6
          }}>
            Opinion Writing
          </div>
          <div style={{ fontSize: 14.5, color: "#6B5D54", lineHeight: 1.55 }}>
            Write two sentences sharing your opinion about a text. Earn up to 10 points.
          </div>
        </div>
      </div>
    </div>
  );
}
