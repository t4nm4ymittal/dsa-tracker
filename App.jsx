import { useState, useMemo } from "react";

const TOPICS = ["All", "Arrays", "Strings", "Linked List", "Trees", "Graphs", "Dynamic Programming", "Recursion", "Sorting", "Binary Search", "Stack & Queue", "Greedy", "Backtracking"];

const STATUS_OPTIONS = ["Todo", "In Progress", "Done", "Revisit"];

const STATUS_STYLES = {
  "Todo": { bg: "#F1EFE8", color: "#5F5E5A", dot: "#888780" },
  "In Progress": { bg: "#E6F1FB", color: "#185FA5", dot: "#378ADD" },
  "Done": { bg: "#EAF3DE", color: "#3B6D11", dot: "#639922" },
  "Revisit": { bg: "#FAEEDA", color: "#854F0B", dot: "#EF9F27" },
};

const DIFFICULTY_STYLES = {
  Easy: { color: "#3B6D11", bg: "#EAF3DE" },
  Medium: { color: "#854F0B", bg: "#FAEEDA" },
  Hard: { color: "#A32D2D", bg: "#FCEBEB" },
};

const INITIAL_QUESTIONS = [
  { id: 1, title: "Two Sum", topic: "Arrays", difficulty: "Easy", status: "Done", notes: "Classic hashmap approach" },
  { id: 2, title: "Longest Substring Without Repeating", topic: "Strings", difficulty: "Medium", status: "Done", notes: "Sliding window" },
  { id: 3, title: "Merge K Sorted Lists", topic: "Linked List", difficulty: "Hard", status: "In Progress", notes: "" },
  { id: 4, title: "Binary Tree Level Order Traversal", topic: "Trees", difficulty: "Medium", status: "Todo", notes: "" },
  { id: 5, title: "Coin Change", topic: "Dynamic Programming", difficulty: "Medium", status: "Revisit", notes: "Revisit bottom-up approach" },
  { id: 6, title: "Number of Islands", topic: "Graphs", difficulty: "Medium", status: "Todo", notes: "" },
  { id: 7, title: "Climbing Stairs", topic: "Recursion", difficulty: "Easy", status: "Done", notes: "" },
  { id: 8, title: "Binary Search", topic: "Binary Search", difficulty: "Easy", status: "Done", notes: "" },
];

let nextId = 9;

export default function App() {
  const [questions, setQuestions] = useState(INITIAL_QUESTIONS);
  const [activeTopic, setActiveTopic] = useState("All");
  const [activeStatus, setActiveStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingQ, setEditingQ] = useState(null);
  const [form, setForm] = useState({ title: "", topic: "Arrays", difficulty: "Easy", status: "Todo", notes: "" });

  const filtered = useMemo(() => {
    return questions.filter(q => {
      const matchTopic = activeTopic === "All" || q.topic === activeTopic;
      const matchStatus = activeStatus === "All" || q.status === activeStatus;
      const matchSearch = q.title.toLowerCase().includes(search.toLowerCase());
      return matchTopic && matchStatus && matchSearch;
    });
  }, [questions, activeTopic, activeStatus, search]);

  const stats = useMemo(() => {
    const total = questions.length;
    const done = questions.filter(q => q.status === "Done").length;
    const inProg = questions.filter(q => q.status === "In Progress").length;
    const revisit = questions.filter(q => q.status === "Revisit").length;
    return { total, done, inProg, revisit, pct: total ? Math.round((done / total) * 100) : 0 };
  }, [questions]);

  const openAdd = () => {
    setEditingQ(null);
    setForm({ title: "", topic: "Arrays", difficulty: "Easy", status: "Todo", notes: "" });
    setShowModal(true);
  };

  const openEdit = (q) => {
    setEditingQ(q.id);
    setForm({ title: q.title, topic: q.topic, difficulty: q.difficulty, status: q.status, notes: q.notes });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.title.trim()) return;
    if (editingQ) {
      setQuestions(qs => qs.map(q => q.id === editingQ ? { ...q, ...form } : q));
    } else {
      setQuestions(qs => [...qs, { id: nextId++, ...form }]);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    setQuestions(qs => qs.filter(q => q.id !== id));
  };

  const cycleStatus = (id) => {
    const order = ["Todo", "In Progress", "Done", "Revisit"];
    setQuestions(qs => qs.map(q => {
      if (q.id !== id) return q;
      const next = order[(order.indexOf(q.status) + 1) % order.length];
      return { ...q, status: next };
    }));
  };

  return (
    <div style={{ minHeight: "100vh", background: "#FAFAF8", fontFamily: "'DM Mono', 'Courier New', monospace" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@600;700;800&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ background: "#1C1B19", padding: "2rem 2.5rem 1.5rem", borderBottom: "3px solid #EF9F27" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, color: "#FAF9F7", letterSpacing: "-0.5px" }}>
                DSA Tracker
              </div>
              <div style={{ fontSize: 12, color: "#888780", marginTop: 2, letterSpacing: "0.05em" }}>
                questions · topics · status
              </div>
            </div>
            <button onClick={openAdd} style={{ background: "#EF9F27", color: "#1C1B19", border: "none", borderRadius: 8, padding: "10px 20px", fontFamily: "'DM Mono', monospace", fontSize: 13, fontWeight: 500, cursor: "pointer", letterSpacing: "0.03em" }}>
              + Add Question
            </button>
          </div>

          {/* Stats bar */}
          <div style={{ display: "flex", gap: 24, marginTop: 24, flexWrap: "wrap" }}>
            {[
              { label: "Total", value: stats.total, color: "#FAF9F7" },
              { label: "Done", value: stats.done, color: "#97C459" },
              { label: "In Progress", value: stats.inProg, color: "#378ADD" },
              { label: "Revisit", value: stats.revisit, color: "#EF9F27" },
              { label: "Progress", value: `${stats.pct}%`, color: "#EF9F27" },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontSize: 11, color: "#888780", letterSpacing: "0.08em", textTransform: "uppercase" }}>{s.label}</div>
                <div style={{ fontSize: 22, fontFamily: "'Syne', sans-serif", fontWeight: 700, color: s.color }}>{s.value}</div>
              </div>
            ))}
            <div style={{ flex: 1, minWidth: 120, display: "flex", alignItems: "flex-end", paddingBottom: 4 }}>
              <div style={{ width: "100%", height: 6, background: "#2C2C2A", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ width: `${stats.pct}%`, height: "100%", background: "#EF9F27", borderRadius: 3, transition: "width 0.4s ease" }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "1.5rem 2.5rem" }}>

        {/* Filters */}
        <div style={{ marginBottom: 16 }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search questions..."
            style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1.5px solid #D3D1C7", background: "#FFFFFF", fontFamily: "'DM Mono', monospace", fontSize: 13, outline: "none", boxSizing: "border-box", marginBottom: 12 }}
          />

          {/* Topic pills */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
            {TOPICS.map(t => (
              <button key={t} onClick={() => setActiveTopic(t)} style={{
                padding: "5px 12px", borderRadius: 20, fontSize: 12, fontFamily: "'DM Mono', monospace", cursor: "pointer", border: "1.5px solid",
                background: activeTopic === t ? "#1C1B19" : "#FFFFFF",
                color: activeTopic === t ? "#FAF9F7" : "#5F5E5A",
                borderColor: activeTopic === t ? "#1C1B19" : "#D3D1C7",
              }}>{t}</button>
            ))}
          </div>

          {/* Status filter */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["All", ...STATUS_OPTIONS].map(s => {
              const style = s !== "All" ? STATUS_STYLES[s] : null;
              const active = activeStatus === s;
              return (
                <button key={s} onClick={() => setActiveStatus(s)} style={{
                  padding: "5px 14px", borderRadius: 20, fontSize: 12, fontFamily: "'DM Mono', monospace", cursor: "pointer", border: "1.5px solid",
                  background: active ? (style?.bg || "#1C1B19") : "#FFFFFF",
                  color: active ? (style?.color || "#FAF9F7") : "#5F5E5A",
                  borderColor: active ? (style?.dot || "#1C1B19") : "#D3D1C7",
                }}>
                  {s !== "All" && <span style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: style?.dot, marginRight: 6, verticalAlign: "middle" }} />}
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        {/* Count */}
        <div style={{ fontSize: 12, color: "#888780", marginBottom: 12, letterSpacing: "0.05em" }}>
          {filtered.length} question{filtered.length !== 1 ? "s" : ""}
        </div>

        {/* Questions list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "3rem", color: "#888780", fontSize: 14 }}>
              No questions found. Add one!
            </div>
          )}
          {filtered.map((q, i) => {
            const st = STATUS_STYLES[q.status];
            const df = DIFFICULTY_STYLES[q.difficulty];
            return (
              <div key={q.id} style={{
                background: "#FFFFFF", border: "1.5px solid #D3D1C7", borderRadius: 10, padding: "14px 18px",
                display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap",
                animation: `fadeSlide 0.2s ease ${i * 0.03}s both`,
              }}>
                <div style={{ fontSize: 12, color: "#B4B2A9", minWidth: 24, fontFamily: "'Syne', sans-serif", fontWeight: 700 }}>
                  {String(i + 1).padStart(2, "0")}
                </div>

                <div style={{ flex: 1, minWidth: 140 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: "#2C2C2A", marginBottom: 4 }}>{q.title}</div>
                  {q.notes && <div style={{ fontSize: 11, color: "#888780" }}>{q.notes}</div>}
                </div>

                <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 12, background: "#F1EFE8", color: "#5F5E5A" }}>
                  {q.topic}
                </span>

                <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 12, background: df.bg, color: df.color, fontWeight: 500 }}>
                  {q.difficulty}
                </span>

                <button onClick={() => cycleStatus(q.id)} title="Click to cycle status" style={{
                  fontSize: 11, padding: "4px 12px", borderRadius: 12, background: st.bg, color: st.color,
                  border: `1.5px solid ${st.dot}`, cursor: "pointer", fontFamily: "'DM Mono', monospace", fontWeight: 500,
                }}>
                  <span style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: st.dot, marginRight: 6, verticalAlign: "middle" }} />
                  {q.status}
                </button>

                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => openEdit(q)} style={{ background: "none", border: "1px solid #D3D1C7", borderRadius: 6, padding: "5px 10px", fontSize: 12, cursor: "pointer", color: "#5F5E5A" }}>Edit</button>
                  <button onClick={() => handleDelete(q.id)} style={{ background: "none", border: "1px solid #F0959A", borderRadius: 6, padding: "5px 10px", fontSize: 12, cursor: "pointer", color: "#A32D2D" }}>✕</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div onClick={() => setShowModal(false)} style={{ position: "fixed", inset: 0, background: "rgba(28,27,25,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#FAFAF8", borderRadius: 14, padding: "2rem", width: "100%", maxWidth: 480, border: "1.5px solid #D3D1C7" }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700, color: "#1C1B19", marginBottom: 20 }}>
              {editingQ ? "Edit Question" : "Add Question"}
            </div>

            <label style={labelStyle}>Title</label>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Two Sum" style={inputStyle} />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={labelStyle}>Topic</label>
                <select value={form.topic} onChange={e => setForm(f => ({ ...f, topic: e.target.value }))} style={inputStyle}>
                  {TOPICS.filter(t => t !== "All").map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Difficulty</label>
                <select value={form.difficulty} onChange={e => setForm(f => ({ ...f, difficulty: e.target.value }))} style={inputStyle}>
                  {["Easy", "Medium", "Hard"].map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
            </div>

            <label style={labelStyle}>Status</label>
            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} style={inputStyle}>
              {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
            </select>

            <label style={labelStyle}>Notes (optional)</label>
            <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Any notes or approach..." rows={3} style={{ ...inputStyle, resize: "vertical" }} />

            <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "flex-end" }}>
              <button onClick={() => setShowModal(false)} style={{ padding: "9px 20px", borderRadius: 8, border: "1px solid #D3D1C7", background: "none", fontFamily: "'DM Mono', monospace", fontSize: 13, cursor: "pointer", color: "#5F5E5A" }}>Cancel</button>
              <button onClick={handleSave} style={{ padding: "9px 20px", borderRadius: 8, border: "none", background: "#1C1B19", color: "#FAF9F7", fontFamily: "'DM Mono', monospace", fontSize: 13, cursor: "pointer", fontWeight: 500 }}>
                {editingQ ? "Save Changes" : "Add Question"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeSlide { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        button:hover { opacity: 0.85; }
        input:focus, select:focus, textarea:focus { outline: 2px solid #EF9F27; border-color: #EF9F27; }
      `}</style>
    </div>
  );
}

const labelStyle = { display: "block", fontSize: 11, color: "#888780", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6, marginTop: 14 };
const inputStyle = { width: "100%", padding: "9px 12px", borderRadius: 8, border: "1.5px solid #D3D1C7", background: "#FFFFFF", fontFamily: "'DM Mono', monospace", fontSize: 13, color: "#2C2C2A", boxSizing: "border-box" };
