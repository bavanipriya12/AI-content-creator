import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownRight, ArrowRight, ArrowUpRight, BadgeCheck, Bell, BriefcaseBusiness,
  Check, ChevronDown, CircleHelp, Clapperboard, Command, Compass, FileText, Filter,
  Image as ImageIcon, Layers3, Menu, MessageCircle, Plus, Search, Sparkles, SlidersHorizontal,
  Video, WandSparkles, X, Zap
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const specialties = ["All specialties", "AI Filmmaking", "Generative Art", "AI Animation", "Creative Direction", "Product Visualization", "World Building"];
const contentTypes = ["All content", "Video", "Images", "Animation", "Campaign Film", "Product Ads", "Social Video"];
const money = (n) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n || 0);

function App() {
  const [creators, setCreators] = useState([]);
  const [briefs, setBriefs] = useState([]);
  const [query, setQuery] = useState("");
  const [specialization, setSpecialization] = useState("All specialties");
  const [contentType, setContentType] = useState("All content");
  const [tool, setTool] = useState("All tools");
  const [activePage, setActivePage] = useState("Discover");
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [showBrief, setShowBrief] = useState(false);
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(true);
  const [mobileNav, setMobileNav] = useState(false);

  async function loadCreators() {
    setLoading(true);
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (specialization !== "All specialties") params.set("specialization", specialization);
    if (contentType !== "All content") params.set("contentType", contentType);
    if (tool !== "All tools") params.set("tool", tool);
    try {
      const response = await fetch(`${API}/creators?${params.toString()}`);
      if (!response.ok) throw new Error("API unavailable");
      setCreators(await response.json());
    } catch {
      setToast("Can't reach API. Start the backend to load creator data.");
      setCreators([]);
    } finally { setLoading(false); }
  }

  async function loadBriefs() {
    try {
      const response = await fetch(`${API}/briefs`);
      if (response.ok) setBriefs(await response.json());
    } catch { /* dashboard shows an empty state until API is running */ }
  }

  useEffect(() => { loadCreators(); }, [query, specialization, contentType, tool]);
  useEffect(() => { loadBriefs(); }, []);
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(""), 3800);
    return () => clearTimeout(id);
  }, [toast]);

  const tools = useMemo(() => ["All tools", ...new Set(creators.flatMap(c => c.tools || []))].sort((a,b) => a === "All tools" ? -1 : b === "All tools" ? 1 : a.localeCompare(b)), [creators]);
  const resetFilters = () => { setQuery(""); setSpecialization("All specialties"); setContentType("All content"); setTool("All tools"); };
  const navigate = (page) => { setActivePage(page); setMobileNav(false); if (page === "Post a brief") setShowBrief(true); if (page === "My briefs") loadBriefs(); };

  return <div className="app-shell">
    <aside className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}>
      <a className="brand" href="#" onClick={(e) => {e.preventDefault(); navigate("Discover");}}>
        <span className="brand-mark"><Command size={20}/></span><span>KAMPUS<span className="brand-dot">.</span>VC</span>
      </a>
      <div className="workspace-label">WORKSPACE</div>
      <nav className="side-nav">
        <button className={activePage === "Discover" ? "nav-item active" : "nav-item"} onClick={() => navigate("Discover")}><Compass size={18}/> Discover <span className="nav-arrow">↗</span></button>
        <button className={activePage === "My briefs" ? "nav-item active" : "nav-item"} onClick={() => navigate("My briefs")}><FileText size={18}/> My briefs <span className="nav-count">{briefs.length}</span></button>
        <button className={activePage === "Saved creators" ? "nav-item active" : "nav-item"} onClick={() => navigate("Saved creators")}><Layers3 size={18}/> Saved creators</button>
      </nav>
      <div className="sidebar-bottom">
        <div className="upgrade-card"><div className="upgrade-icon"><Sparkles size={17}/></div><strong>Make something unreal.</strong><p>Your next campaign starts with the right creative.</p><button onClick={() => setShowBrief(true)}>Create a brief <ArrowUpRight size={15}/></button></div>
        <div className="profile-mini"><div className="brand-avatar">S</div><div><strong>Studio account</strong><span>Brand workspace</span></div><ChevronDown size={15}/></div>
      </div>
    </aside>

    {mobileNav && <button className="mobile-scrim" onClick={() => setMobileNav(false)} aria-label="Close menu"/>}
    <main className="main-area">
      <header className="topbar">
        <button className="icon-button mobile-menu" onClick={() => setMobileNav(!mobileNav)} aria-label="Open navigation"><Menu size={20}/></button>
        <div className="breadcrumb">Workspace <span>/</span> <strong>{activePage}</strong></div>
        <div className="topbar-actions"><span className="availability"><i/> All systems creative</span><button className="icon-button" aria-label="Notifications" onClick={() => setToast("You're all caught up.")}><Bell size={18}/></button><div className="top-avatar">S</div></div>
      </header>

      {activePage === "Discover" && <DiscoverPage {...{creators, query, setQuery, specialization, setSpecialization, contentType, setContentType, tool, setTool, tools, resetFilters, loading, setSelectedCreator, setShowBrief, navigate}} />}
      {activePage === "My briefs" && <BriefsPage briefs={briefs} onCreate={() => setShowBrief(true)} onRefresh={loadBriefs} onToast={setToast}/>}
      {activePage === "Saved creators" && <SavedPage onOpen={setSelectedCreator} />}
      <footer className="footer"><span>© 2026 KAMPUS.VC</span><span>Built for the next generation of creative.</span><span><CircleHelp size={14}/> Need a hand?</span></footer>
    </main>

    {selectedCreator && <CreatorModal creator={selectedCreator} onClose={() => setSelectedCreator(null)} onBrief={() => {setSelectedCreator(null);setShowBrief(true);}} onToast={setToast}/>}
    {showBrief && <BriefModal onClose={() => setShowBrief(false)} onCreated={(brief) => {setBriefs(prev => [brief, ...prev]); setShowBrief(false); setActivePage("My briefs"); setToast("Brief published successfully.");}} onToast={setToast}/>}
    {toast && <div className="toast"><span className="toast-check"><Check size={15}/></span>{toast}<button onClick={() => setToast("")} aria-label="Dismiss"><X size={15}/></button></div>}
  </div>;
}

function DiscoverPage({ creators, query, setQuery, specialization, setSpecialization, contentType, setContentType, tool, setTool, tools, resetFilters, loading, setSelectedCreator, setShowBrief, navigate }) {
  return <div className="page-content">
    <section className="hero-panel">
      <div className="hero-copy"><div className="eyebrow"><span className="eyebrow-line"/> THE NEW CREATIVE ECONOMY</div><h1>Ideas meet<br/><span>artificial</span> imagination<span className="lime-dot">.</span></h1><p>Discover AI-native creators shaping what comes next. Find your people, build your vision, make something unreal.</p><div className="hero-actions"><button className="btn-primary" onClick={() => document.getElementById("discover-creators")?.scrollIntoView({behavior:"smooth"})}>Explore creators <ArrowUpRight size={17}/></button><button className="btn-ghost" onClick={() => setShowBrief(true)}>Post a brief <ArrowRight size={16}/></button></div><div className="hero-proof"><div className="proof-avatars"><span>M</span><span>A</span><span>Z</span><span>+</span></div><div><strong>Creator-first by design</strong><small>Talent, tools & workflows in one place</small></div></div></div>
      <div className="hero-art"><div className="art-glow"/><img src="https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&auto=format&fit=crop" alt="Dreamlike cinematic landscape"/><div className="art-grain"/><div className="floating-tag tag-top"><Sparkles size={14}/> AI-native talent</div><div className="floating-tag tag-bottom"><span className="tag-pulse"/> Ideas in motion <ArrowUpRight size={14}/></div><div className="art-index">01 <span>/</span> 04</div></div>
      <div className="hero-bottom"><span><Zap size={14}/> CREATIVE, REIMAGINED</span><span>SCROLL TO DISCOVER <ArrowDownRight size={15}/></span></div>
    </section>

    <section id="discover-creators" className="discover-section">
      <div className="section-heading"><div><div className="eyebrow muted">THE PEOPLE BEHIND THE PROMPTS</div><h2>Find your <span>creative edge.</span></h2><p>Independent minds. Extraordinary output. Ready for your next brief.</p></div><button className="btn-outline" onClick={() => setShowBrief(true)}><Plus size={16}/> Create a brief</button></div>
      <div className="search-panel"><div className="search-input-wrap"><Search size={19}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search creators, skills, tools..." aria-label="Search creators"/><kbd>⌘ K</kbd></div><div className="filter-divider"/><div className="filter-select"><SlidersHorizontal size={16}/><select value={specialization} onChange={e => setSpecialization(e.target.value)} aria-label="Filter by specialization">{specialties.map(s => <option key={s} value={s === "All specialties" ? s : s}>{s}</option>)}</select></div><div className="filter-select"><ImageIcon size={16}/><select value={contentType} onChange={e => setContentType(e.target.value)} aria-label="Filter by content type">{contentTypes.map(s => <option key={s}>{s}</option>)}</select></div><div className="filter-select"><WandSparkles size={16}/><select value={tool} onChange={e => setTool(e.target.value)} aria-label="Filter by tool">{tools.map(s => <option key={s}>{s}</option>)}</select></div><button className="filter-reset" onClick={resetFilters} title="Reset filters"><X size={16}/></button></div>
      <div className="results-line"><span>{loading ? "Finding creators..." : <><strong>{creators.length.toString().padStart(2,"0")}</strong> creators in the collective</>}</span><button className="sort-label" onClick={resetFilters}><Filter size={14}/> Curated talent <ChevronDown size={14}/></button></div>
      {loading ? <div className="loading-grid">{[1,2,3].map(n => <div className="skeleton" key={n}/>)}</div> : creators.length ? <div className="creator-grid">{creators.map((creator, index) => <CreatorCard creator={creator} key={creator._id || creator.id || creator.handle} index={index} onClick={() => setSelectedCreator(creator)}/>)}</div> : <div className="empty-state"><div className="empty-icon"><Search size={23}/></div><h3>No creators found</h3><p>Try another keyword or remove one of your filters.</p><button className="btn-primary" onClick={resetFilters}>Clear all filters <ArrowRight size={16}/></button></div>}
      <div className="discovery-cta"><div className="cta-orb"><Sparkles size={24}/></div><div><strong>Have a vision in mind?</strong><p>Tell us what you're making. Find the right creative partner.</p></div><button className="btn-primary" onClick={() => setShowBrief(true)}>Start a project <ArrowUpRight size={16}/></button></div>
    </section>
  </div>;
}

function CreatorCard({ creator, index, onClick }) {
  const cover = creator.cover || creator.portfolio?.[0]?.image;
  return <article className="creator-card" onClick={onClick} role="button" tabIndex={0} onKeyDown={e => (e.key === "Enter" || e.key === " ") && onClick()}>
    <div className="creator-cover"><img src={cover} alt={`${creator.name} portfolio preview`} loading="lazy"/><div className="cover-shade"/><span className="creator-index">0{index + 1}</span><button className="card-open" aria-label={`View ${creator.name}`} onClick={e => {e.stopPropagation();onClick();}}><ArrowUpRight size={17}/></button>{creator.verifiedWork && <span className="verified-pill"><BadgeCheck size={13}/> Work checked</span>}</div>
    <div className="creator-info"><div className="creator-heading"><img className="creator-avatar" src={creator.avatar} alt=""/><div className="creator-name-wrap"><h3>{creator.name}</h3><p>{creator.role}</p></div><button className="save-button" title="Save creator" onClick={e => {e.stopPropagation(); const saved=JSON.parse(localStorage.getItem("kampus-saved")||"[]"); const next=saved.includes(creator.handle)?saved.filter(h=>h!==creator.handle):[...saved,creator.handle];localStorage.setItem("kampus-saved",JSON.stringify(next));e.currentTarget.classList.toggle("saved");}}><span>＋</span></button></div><p className="creator-bio">{creator.bio}</p><div className="tag-row">{(creator.tools || []).slice(0,3).map(t => <span className="tool-tag" key={t}>{t}</span>)}</div><div className="creator-card-foot"><span><span className="rating-star">★</span> {creator.rating || "New"} <span className="project-count">· {creator.projects || 0} projects</span></span><span className="rate">{money(creator.rate)}<small>/day</small></span></div></div>
  </article>;
}

function CreatorModal({ creator, onClose, onBrief, onToast }) {
  const [tab, setTab] = useState("Portfolio");
  const [saved, setSaved] = useState(() => JSON.parse(localStorage.getItem("kampus-saved") || "[]").includes(creator.handle));
  const save = () => { const list=JSON.parse(localStorage.getItem("kampus-saved")||"[]"); const next=list.includes(creator.handle)?list.filter(h=>h!==creator.handle):[...list,creator.handle];localStorage.setItem("kampus-saved",JSON.stringify(next));setSaved(!saved);onToast(saved?"Removed from saved creators":"Creator saved to your list"); };
  return <div className="modal-backdrop" onMouseDown={e => e.target===e.currentTarget && onClose()}><div className="creator-modal modal-box"><button className="modal-close" onClick={onClose} aria-label="Close"><X/></button><div className="profile-cover"><img src={creator.cover || creator.portfolio?.[0]?.image} alt="Portfolio cover"/><div className="profile-cover-overlay"/></div><div className="profile-body"><div className="profile-top"><img className="profile-avatar" src={creator.avatar} alt={creator.name}/><div className="profile-title"><h2>{creator.name} {creator.verifiedTools && <BadgeCheck className="verified-icon" size={18}/>}</h2><p>{creator.role} <span>·</span> {creator.location}</p><div className="handle">{creator.handle}</div></div><div className="profile-actions"><button className="btn-outline" onClick={save}>{saved ? <Check size={16}/> : <Plus size={16}/>} {saved?"Saved":"Save"}</button><button className="btn-primary" onClick={onBrief}>Work together <ArrowUpRight size={16}/></button></div></div><p className="profile-bio">{creator.bio}</p><div className="profile-stats"><div><strong>{creator.projects || 0}</strong><span>Projects</span></div><div><strong>★ {creator.rating || "New"}</strong><span>Rating</span></div><div><strong>{money(creator.rate)}</strong><span>Indicative day rate</span></div></div><div className="profile-tabs">{["Portfolio","Workflow & tools"].map(t=><button className={tab===t?"selected":""} onClick={()=>setTab(t)} key={t}>{t}</button>)}</div>
    {tab==="Portfolio" ? <div className="portfolio-grid">{(creator.portfolio||[]).map((work,i)=><div className="portfolio-item" key={work.title}><img src={work.image} alt={work.title}/><div className="portfolio-item-info"><span>{work.category}</span><h4>{work.title}</h4><div className="tag-row">{(work.tools||[]).map(t=><span className="tool-tag" key={t}>{t}</span>)}</div><p>{work.format} · {work.commercialUse?"Commercial use indicated":"Usage to confirm"}</p></div></div>)}</div> : <div className="workflow-panel"><div><h4>Specialization</h4><p>{creator.specialization}</p></div><div><h4>Skills</h4><div className="tag-row">{(creator.skills||[]).map(s=><span className="tool-tag" key={s}>{s}</span>)}</div></div><div><h4>Tools & models</h4><div className="tag-row">{(creator.tools||[]).map(t=><span className="tool-tag" key={t}>{t} {creator.verifiedTools && <BadgeCheck size={12}/>}</span>)}</div><small>Verification badges are demo signals in this prototype.</small></div><div><h4>Workflow</h4><p>{creator.workflow}</p></div><div><h4>Trust signals</h4><p>{creator.verifiedTools?"Tools marked as checked":"Tools self-reported"} · {creator.verifiedWork?"Portfolio work marked as checked":"Portfolio work self-reported"}</p></div></div>}
    </div></div></div>;
}

const emptyForm = { campaignName:"", brandName:"", description:"", contentType:"Video", style:"Cinematic, contemporary", aspectRatio:"9:16", budget:"50000", deadline:"", commercialUse:true, usageDuration:"12 months", revisions:"2" };
function BriefModal({ onClose, onCreated, onToast }) {
  const [form, setForm] = useState(emptyForm);
  const [idea, setIdea] = useState("");
  const [assisting, setAssisting] = useState(false);
  const [error, setError] = useState("");
  const change = (key, value) => setForm(old => ({...old,[key]:value}));
  const assist = async () => {
    setAssisting(true); setError("");
    try {
      const response = await fetch(`${API}/briefs/assist`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({idea}) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Brief assistant failed");
      setForm(old => ({...old,...data, campaignName: old.campaignName || data.campaignName, brandName: old.brandName, budget: old.budget, deadline: old.deadline}));
      onToast("Brief draft created. Review the fields before publishing.");
    } catch (e) { setError(e.message); } finally { setAssisting(false); }
  };
  const submit = async e => {
    e.preventDefault(); setError("");
    try {
      const response = await fetch(`${API}/briefs`, {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...form,budget:Number(form.budget),revisions:Number(form.revisions)})});
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not publish brief");
      onCreated(data);
    } catch (e) { setError(`${e.message}. Is the backend running on port 5000?`); }
  };
  return <div className="modal-backdrop" onMouseDown={e=>e.target===e.currentTarget&&onClose()}><div className="brief-modal modal-box"><div className="brief-modal-head"><div><div className="eyebrow"><Sparkles size={13}/> CAMPAIGN STUDIO</div><h2>Build your <span>brief.</span></h2><p>Give great creators the clarity to make great work.</p></div><button className="modal-close" onClick={onClose} aria-label="Close"><X/></button></div>
    <div className="ai-assist-box"><div className="ai-assist-title"><span className="ai-icon"><WandSparkles size={17}/></span><div><strong>AI brief builder</strong><small>Start with a rough idea. Refine everything after.</small></div><span className="beta-pill">BETA</span></div><div className="assist-input-row"><input value={idea} onChange={e=>setIdea(e.target.value)} placeholder="e.g. A premium skincare launch film with liquid textures..."/><button className="btn-primary" disabled={assisting||idea.trim().length<8} onClick={assist}>{assisting?"Working...":<><Sparkles size={15}/> Generate</>}</button></div></div>
    <form onSubmit={submit} className="brief-form"><div className="form-section-label"><span>01</span> THE PROJECT</div><div className="form-grid"><label className="field full">Campaign name *<input required value={form.campaignName} onChange={e=>change("campaignName",e.target.value)} placeholder="e.g. New season, new perspective"/></label><label className="field">Brand / agency *<input required value={form.brandName} onChange={e=>change("brandName",e.target.value)} placeholder="Your brand name"/></label><label className="field">Content type *<select value={form.contentType} onChange={e=>change("contentType",e.target.value)}>{["Video","Images","Animation","Campaign Film","Product Ads","Social Video"].map(x=><option key={x}>{x}</option>)}</select></label><label className="field full">Creative direction / description *<textarea required rows="3" value={form.description} onChange={e=>change("description",e.target.value)} placeholder="What are we creating? Who is it for? What should people feel?"/></label><label className="field">Visual style *<select value={form.style} onChange={e=>change("style",e.target.value)}>{["Cinematic, contemporary","Premium editorial","Playful and bold","Surreal and experimental","Minimal and clean","Photorealistic"].map(x=><option key={x}>{x}</option>)}</select></label><label className="field">Aspect ratio *<select value={form.aspectRatio} onChange={e=>change("aspectRatio",e.target.value)}>{["9:16","16:9","1:1","4:5","3:2"].map(x=><option key={x}>{x}</option>)}</select></label></div>
    <div className="form-section-label"><span>02</span> SCOPE & USAGE</div><div className="form-grid"><label className="field">Budget (INR)<input type="number" min="0" value={form.budget} onChange={e=>change("budget",e.target.value)}/></label><label className="field">Deadline<input type="date" value={form.deadline} onChange={e=>change("deadline",e.target.value)}/></label><label className="field">Usage duration<select value={form.usageDuration} onChange={e=>change("usageDuration",e.target.value)}>{["3 months","6 months","12 months","24 months","Perpetual — negotiate"].map(x=><option key={x}>{x}</option>)}</select></label><label className="field">Revision rounds<input type="number" min="0" max="10" value={form.revisions} onChange={e=>change("revisions",e.target.value)}/></label></div><label className="rights-toggle"><input type="checkbox" checked={form.commercialUse} onChange={e=>change("commercialUse",e.target.checked)}/><span className="custom-check"><Check size={13}/></span><span><strong>Commercial usage required</strong><small>Creator must confirm rights, model terms and any third-party assets before delivery.</small></span></label>
    {error&&<div className="form-error">{error}</div>}<div className="form-footer"><span><span className="required-dot">*</span> Required fields</span><div><button type="button" className="btn-ghost" onClick={onClose}>Cancel</button><button type="submit" className="btn-primary">Publish brief <ArrowUpRight size={16}/></button></div></div></form>
  </div></div>;
}

function BriefsPage({ briefs, onCreate, onRefresh, onToast }) {
  const [filter, setFilter] = useState("All");
  const shown = briefs.filter(b => filter === "All" || b.status === filter);
  const updateStatus = async (brief, status) => {
    try {
      const response = await fetch(`${API}/briefs/${brief._id}/status`, {method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({status})});
      if (!response.ok) throw new Error();
      onToast(`Brief moved to ${status}.`); onRefresh();
    } catch { onToast("Could not update brief status."); }
  };
  return <div className="page-content inner-page"><div className="page-title-row"><div><div className="eyebrow muted">YOUR BRAND WORKSPACE</div><h1>Campaign <span>briefs.</span></h1><p>Everything you're making, all in one place.</p></div><button className="btn-primary" onClick={onCreate}><Plus size={16}/> New brief</button></div><div className="dashboard-stats"><div><span>Published briefs</span><strong>{briefs.length.toString().padStart(2,"0")}</strong><small>Across your workspace</small></div><div><span>Open opportunities</span><strong>{briefs.filter(b=>b.status==="Open").length.toString().padStart(2,"0")}</strong><small>Ready for creators</small></div><div><span>In production</span><strong>{briefs.filter(b=>["In Progress","In Review"].includes(b.status)).length.toString().padStart(2,"0")}</strong><small>Active engagements</small></div></div><div className="briefs-toolbar"><div><h3>Your projects</h3><p>Manage campaigns from first brief to final delivery.</p></div><select value={filter} onChange={e=>setFilter(e.target.value)}>{["All","Open","In Progress","In Review","Delivered"].map(x=><option key={x}>{x}</option>)}</select></div>{shown.length?<div className="brief-list">{shown.map(b=><article className="brief-row" key={b._id}><div className="brief-type-icon"><Clapperboard size={20}/></div><div className="brief-row-main"><h3>{b.campaignName}</h3><p>{b.brandName} · {b.contentType} · {b.aspectRatio}</p><div className="tag-row"><span className="tool-tag">{b.style}</span><span className="tool-tag">{b.commercialUse?"Commercial use":"Usage to confirm"}</span></div></div><div className="brief-row-meta"><strong>{money(b.budget)}</strong><span>{b.deadline||"No deadline"}</span><select value={b.status} onChange={e=>updateStatus(b,e.target.value)}>{["Open","In Progress","In Review","Delivered"].map(x=><option key={x}>{x}</option>)}</select></div></article>)}</div>:<div className="empty-state"><div className="empty-icon"><FileText size={23}/></div><h3>No briefs yet</h3><p>Start with a rough idea and turn it into a creator-ready brief.</p><button className="btn-primary" onClick={onCreate}>Create your first brief <ArrowRight size={16}/></button></div>}</div>;
}

function SavedPage({ onOpen }) {
  const [saved, setSaved] = useState([]);
  useEffect(() => { const handles=JSON.parse(localStorage.getItem("kampus-saved")||"[]"); fetch(`${API}/creators`).then(r=>r.json()).then(rows=>setSaved(rows.filter(c=>handles.includes(c.handle)))).catch(()=>setSaved([])); }, []);
  return <div className="page-content inner-page"><div className="page-title-row"><div><div className="eyebrow muted">YOUR SHORTLIST</div><h1>Saved <span>creators.</span></h1><p>Keep your favorite creative partners close.</p></div></div>{saved.length?<div className="creator-grid">{saved.map((c,i)=><CreatorCard key={c.handle} creator={c} index={i} onClick={()=>onOpen(c)}/>)}</div>:<div className="empty-state"><div className="empty-icon"><Layers3 size={23}/></div><h3>Your shortlist starts here</h3><p>Save creators from Discover to compare their styles and workflows.</p></div>}</div>;
}

export default App;
