import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownRight, ArrowRight, ArrowUpRight, Leaf, Menu, Plus, Recycle,
  Volume2, Wind, Sprout, School, PackageCheck, ShoppingBag, X, CheckCircle2
} from "lucide-react";

const fallbackProducts = [
  { id: "panel-01", name: "AgriWall Acoustic Panel", category: "Concept panel", description: "A proposed bio-based panel concept using processed agricultural residues.", image: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=900&q=85" },
  { id: "panel-02", name: "AgriWall Interior Panel", category: "Potential application", description: "A concept for selected interior and partition applications, subject to testing.", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=85" },
  { id: "panel-03", name: "AgriWall Sample Kit", category: "Prototype enquiry", description: "A sample enquiry concept for schools, designers and potential partners.", image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=85" }
];

const API = "http://localhost:4000";

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [products, setProducts] = useState(fallbackProducts);
  const [cart, setCart] = useState([]);
  const [activeGame, setActiveGame] = useState(false);
  const [gameScore, setGameScore] = useState(0);
  const [gameStep, setGameStep] = useState(0);
  const [impactInput, setImpactInput] = useState(10);
  const [orderForm, setOrderForm] = useState({ name: "", email: "", product: "", message: "" });
  const [schoolForm, setSchoolForm] = useState({ schoolName: "", contactName: "", email: "", location: "" });
  const [orderStatus, setOrderStatus] = useState("");
  const [schoolStatus, setSchoolStatus] = useState("");

  useEffect(() => {
    fetch(`${API}/api/products`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => setProducts(data.products))
      .catch(() => setProducts(fallbackProducts));
  }, []);

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const estimatedUnits = useMemo(() => Math.max(0, Number(impactInput) || 0), [impactInput]);

  const addToCart = (product) => {
    setCart(current => {
      const found = current.find(item => item.id === product.id);
      return found
        ? current.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item)
        : [...current, { ...product, qty: 1 }];
    });
  };

  async function submitOrder(e) {
    e.preventDefault();
    setOrderStatus("Sending…");
    try {
      const response = await fetch(`${API}/api/orders`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...orderForm, product: orderForm.product || cart.map(x => x.name).join(", ") })
      });
      const data = await response.json();
      setOrderStatus(data.message || "Enquiry submitted.");
      if (data.success) { setOrderForm({ name: "", email: "", product: "", message: "" }); setCart([]); }
    } catch {
      setOrderStatus("Backend not connected. Start the server using npm run dev, then try again.");
    }
  }

  async function submitSchool(e) {
    e.preventDefault();
    setSchoolStatus("Sending…");
    try {
      const response = await fetch(`${API}/api/school-connect`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(schoolForm)
      });
      const data = await response.json();
      setSchoolStatus(data.message || "Form submitted.");
      if (data.success) setSchoolForm({ schoolName: "", contactName: "", email: "", location: "" });
    } catch {
      setSchoolStatus("Backend not connected. Start the server using npm run dev, then try again.");
    }
  }

  const questions = [
    { q: "Which material is the starting point for the AgriWall idea?", a: ["Agricultural residues", "Newly mined stone", "Plastic packaging"], correct: 0, explain: "The concept explores using suitable agricultural residues as a resource." },
    { q: "What should happen before making a claim about sound reduction?", a: ["Assume it works", "Test acoustic performance", "Use a bigger logo"], correct: 1, explain: "Acoustic performance must be measured and validated." },
    { q: "Who can help create a collection network?", a: ["Schools and communities", "Only online gamers", "No one"], correct: 0, explain: "School and community partnerships are part of the proposed model." }
  ];
  const answerGame = (index) => {
    if (index === questions[gameStep].correct) setGameScore(s => s + 10);
    setGameStep(s => s + 1);
  };
  const resetGame = () => { setGameScore(0); setGameStep(0); setActiveGame(true); };

  return (
    <>
      <header className="site-header">
        <a className="brand" href="#home" aria-label="AgriWall home">agriwall<span>®</span><small>materials, reimagined</small></a>
        <button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">{menuOpen ? <X/> : <Menu/>}</button>
        <nav className={menuOpen ? "nav nav-open" : "nav"}>
          {[["About","#about"],["Innovation","#innovation"],["Impact","#impact"],["EcoBuild","#game"],["Marketplace","#shop"],["School Connect","#school"]].map(([label, href]) =>
            <a key={label} href={href} onClick={() => setMenuOpen(false)}>{label}</a>
          )}
          <a className="nav-plus" href="#school" aria-label="Join School Connect"><Plus size={23}/></a>
        </nav>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-copy">
            <p className="eyebrow light">A NEW LIFE FOR AGRICULTURAL RESIDUES</p>
            <h1>Waste transformed.<br/><em>Spaces reimagined.</em></h1>
            <p className="hero-description">Exploring bio-based building panels made with agricultural residues — designed with the ambition to support cleaner, quieter and more thoughtful spaces.</p>
            <div className="hero-actions">
              <a className="button button-lime" href="#innovation">Discover our idea <ArrowUpRight size={17}/></a>
              <a className="text-link light-link" href="#about">Our purpose <ArrowDownRight size={17}/></a>
            </div>
            <div className="hero-note"><span className="note-line"></span> A circular idea, rooted in nature.</div>
          </div>
          <div className="hero-visual">
            <div className="hero-photo">
              <img src="https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1200&q=90" alt="Natural architectural materials and modern building" />
            </div>
            <div className="orbit orbit-one"></div><div className="orbit orbit-two"></div>
            <div className="floating-label"><Leaf size={17}/><span>From residue<br/>to resource</span></div>
            <span className="hero-index">01 / A MATERIAL POSSIBILITY</span>
          </div>
          <div className="hero-bottom-wave"></div>
        </section>

        <section className="intro section-pad" id="about">
          <div className="section-kicker"><span>01</span> THE IDEA</div>
          <div className="intro-grid">
            <h2>What if yesterday's<br/><em>agricultural waste</em><br/>could shape tomorrow?</h2>
            <div className="intro-text">
              <p>Every harvest leaves behind residues. AGRIWALL explores a way to give suitable agricultural waste a second purpose: transforming it into bio-based building panels.</p>
              <p>Our idea brings together material innovation, potential pollution-mitigation applications and school-led collection partnerships — connecting local resources with future building possibilities.</p>
              <a className="text-link" href="#innovation">Get to know the concept <ArrowUpRight size={17}/></a>
            </div>
          </div>
          <div className="values-row">
            <div className="value-item"><span className="value-icon"><Sprout/></span><h3>Resourceful by design</h3><p>Exploring useful pathways for agricultural residues.</p></div>
            <div className="value-item"><span className="value-icon"><Volume2/></span><h3>Thoughtful spaces</h3><p>Investigating the potential for improved acoustic comfort.</p></div>
            <div className="value-item"><span className="value-icon"><Recycle/></span><h3>Circular thinking</h3><p>Connecting collection, material development and reuse.</p></div>
          </div>
        </section>

        <section className="innovation section-pad" id="innovation">
          <div className="section-kicker"><span>02</span> OUR INNOVATION</div>
          <div className="section-heading">
            <h2>A material journey,<br/><em>from field to form.</em></h2>
            <p>Our proposed process gives agricultural residues a new role in the built environment. The exact material mix and manufacturing method will be refined through research and prototyping.</p>
          </div>
          <div className="process-grid">
            {[
              ["01","Collect","Partner with schools and local communities to identify and collect suitable agricultural residues.","https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=85"],
              ["02","Prepare","Sort, clean, dry and prepare the selected natural fibres for material development.","https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=85"],
              ["03","Develop","Explore suitable binders, forming methods and panel compositions through prototyping.","https://images.unsplash.com/photo-1516937941344-00b4e0337589?auto=format&fit=crop&w=800&q=85"],
              ["04","Evaluate","Test durability, acoustic behaviour, safety and relevant air-quality performance before application.","https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=800&q=85"]
            ].map(([num,title,desc,img]) => <article className="process-card" key={num}>
              <div className="process-image"><img src={img} alt="Agricultural material process" /><span>{num}</span></div>
              <h3>{title}</h3><p>{desc}</p>
            </article>)}
          </div>
          <div className="science-note"><Leaf size={19}/><p><strong>Built on evidence.</strong> Air-pollution and noise-reduction performance are goals to investigate, not claims of proven results. Testing and validation will guide the next stage.</p></div>
        </section>

        <section className="impact section-pad" id="impact">
          <div className="section-kicker"><span>03</span> OUR INTENDED IMPACT</div>
          <div className="impact-grid">
            <div><h2>Small residues.<br/><em>Big possibilities.</em></h2><p className="impact-lead">We want to rethink what counts as a resource — and make material innovation a shared effort.</p>
              <div className="impact-points"><div><Wind/><span><b>Air-conscious design</b><small>Exploring panel compositions and their potential relationship with indoor air quality.</small></span></div><div><Volume2/><span><b>Acoustic comfort</b><small>Investigating sound absorption and noise-control potential through testing.</small></span></div><div><Recycle/><span><b>Waste valorisation</b><small>Creating a possible use pathway for suitable agricultural residues.</small></span></div></div>
            </div>
            <div className="impact-calculator">
              <span className="mini-label">INTERACTIVE IDEA EXPLORER</span>
              <h3>Imagine the collection network.</h3>
              <p>Adjust the number of participating schools to explore a hypothetical collection scenario.</p>
              <label htmlFor="schools-range">Participating schools <strong>{impactInput}</strong></label>
              <input id="schools-range" type="range" min="1" max="50" value={impactInput} onChange={e => setImpactInput(e.target.value)} />
              <div className="calculator-number">{estimatedUnits}<small> schools</small></div>
              <div className="calculator-result"><School/><span>This is an illustrative scenario only. Actual waste volumes would depend on local availability, collection capacity and material suitability.</span></div>
              <div className="school-dots">{Array.from({length: Math.min(estimatedUnits,25)},(_,i)=><i key={i}></i>)}</div>
            </div>
          </div>
        </section>

        <section className="game-section section-pad" id="game">
          <div className="game-art"><div className="game-circle"><Sprout size={76}/><span>PLAY FOR<br/>A BETTER<br/>TOMORROW</span></div><div className="game-sticker">LEARN<br/>+ PLAY</div></div>
          <div className="game-copy"><div className="section-kicker"><span>04</span> ECOBUILD CHALLENGE</div><h2>Can you build<br/><em>a greener future?</em></h2><p>Take a quick challenge on agricultural residues, material innovation and responsible building. Learn as you play.</p>
            {!activeGame ? <button className="button button-dark" onClick={resetGame}>Start the challenge <ArrowUpRight size={17}/></button> :
              <div className="quiz-box">
                {gameStep < questions.length ? <><div className="quiz-meta">QUESTION {gameStep+1} OF {questions.length} <b>{gameScore} POINTS</b></div><h3>{questions[gameStep].q}</h3><div className="quiz-options">{questions[gameStep].a.map((a,i)=><button key={a} onClick={()=>answerGame(i)}>{a}<ArrowRight size={15}/></button>)}</div></> :
                  <><CheckCircle2 className="success-icon"/><h3>Challenge complete!</h3><p>You scored {gameScore} out of 30 points.</p><button className="button button-dark" onClick={resetGame}>Play again</button></>}
              </div>}
          </div>
        </section>

        <section className="shop section-pad" id="shop">
          <div className="section-kicker"><span>05</span> EXPLORE THE CONCEPT</div>
          <div className="shop-heading"><div><h2>Material ideas,<br/><em>made tangible.</em></h2><p>Explore proposed product directions. These are concept listings, not commercially available products.</p></div><span className="cart-count"><ShoppingBag size={17}/> {totalItems} in enquiry bag</span></div>
          <div className="product-grid">
            {products.map((product,i)=><article className="product-card" key={product.id}>
              <div className="product-image"><img src={product.image} alt={product.name}/><span>CONCEPT 0{i+1}</span></div>
              <div className="product-info"><small>{product.category}</small><h3>{product.name}</h3><p>{product.description}</p><button className="add-button" onClick={()=>addToCart(product)}>Add to enquiry <Plus size={16}/></button></div>
            </article>)}
          </div>
          <div className="enquiry-panel">
            <div><span className="mini-label">LET'S START A CONVERSATION</span><h3>Interested in the idea?</h3><p>Add a concept above or tell us what you'd like to explore.</p></div>
            <form onSubmit={submitOrder} className="enquiry-form">
              <input required placeholder="Your name" value={orderForm.name} onChange={e=>setOrderForm({...orderForm,name:e.target.value})}/>
              <input required type="email" placeholder="Email address" value={orderForm.email} onChange={e=>setOrderForm({...orderForm,email:e.target.value})}/>
              <input placeholder="Product of interest (optional)" value={orderForm.product} onChange={e=>setOrderForm({...orderForm,product:e.target.value})}/>
              <textarea placeholder="Your message (optional)" value={orderForm.message} onChange={e=>setOrderForm({...orderForm,message:e.target.value})}/>
              <button className="button button-lime" type="submit">Send an enquiry <ArrowUpRight size={16}/></button>
              {orderStatus && <p className="form-status" role="status">{orderStatus}</p>}
            </form>
          </div>
          <p className="demo-disclaimer">Stage-one demonstration: this form validates and returns a confirmation only. It does not save information, accept payment or create a commercial order.</p>
        </section>

        <section className="school-section section-pad" id="school">
          <div className="school-copy"><div className="section-kicker"><span>06</span> SCHOOL CONNECT</div><h2>Every school<br/>can be part of<br/><em>the change.</em></h2><p>We envision a network where schools can help spread awareness and connect suitable agricultural residues with future material innovation.</p><div className="school-benefit"><School/><span><b>Learn together</b><small>Bring circular-economy thinking into the community.</small></span></div><div className="school-benefit"><Recycle/><span><b>Connect resources</b><small>Explore responsible collection partnerships.</small></span></div></div>
          <form className="school-form" onSubmit={submitSchool}><span className="mini-label">EXPRESS YOUR INTEREST</span><h3>Join the School Connect network</h3><p>Register an expression of interest for this concept.</p>
            <label>School name<input required value={schoolForm.schoolName} onChange={e=>setSchoolForm({...schoolForm,schoolName:e.target.value})} placeholder="Enter school name"/></label>
            <label>Representative name<input required value={schoolForm.contactName} onChange={e=>setSchoolForm({...schoolForm,contactName:e.target.value})} placeholder="Adult representative"/></label>
            <label>Contact email<input required type="email" value={schoolForm.email} onChange={e=>setSchoolForm({...schoolForm,email:e.target.value})} placeholder="name@school.org"/></label>
            <label>City / location<input required value={schoolForm.location} onChange={e=>setSchoolForm({...schoolForm,location:e.target.value})} placeholder="City, state"/></label>
            <button className="button button-dark" type="submit">Submit interest <ArrowUpRight size={16}/></button>
            {schoolStatus && <p className="form-status" role="status">{schoolStatus}</p>}
            <small className="demo-disclaimer">Demonstration form only. No details are stored.</small>
          </form>
        </section>

        <section className="vision section-pad" id="vision">
          <div className="section-kicker"><span>07</span> LOOKING AHEAD</div>
          <div className="vision-heading"><h2>Rooted in possibility.<br/><em>Built for the future.</em></h2><p>Our vision is to explore practical, tested and scalable ways to turn agricultural residues into useful building materials.</p></div>
          <div className="roadmap">
            {[["01","Research","Study suitable residues, binders and existing material solutions."],["02","Prototype","Develop early panel samples and refine the manufacturing approach."],["03","Validate","Test acoustic performance, air-quality properties, durability and safety."],["04","Pilot","Explore school partnerships and small-scale production opportunities."],["05","Scale","Build responsible supply and market partnerships if validation supports it."]].map(([n,t,d])=><div className="roadmap-item" key={n}><span>{n}</span><div><h3>{t}</h3><p>{d}</p></div></div>)}
          </div>
          <div className="team-placeholder"><div className="team-mark"><Leaf size={30}/></div><div><span className="mini-label">THE PEOPLE BEHIND THE IDEA</span><h3>A team growing an idea into impact.</h3><p>Team names and roles can be added here once confirmed by the students.</p></div></div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-top"><a className="brand footer-brand" href="#home">agriwall<span>®</span><small>materials, reimagined</small></a><p>Giving agricultural residues<br/>a new purpose in the built environment.</p><a className="back-top" href="#home">Back to top ↑</a></div>
        <div className="footer-bottom"><span>© 2026 AGRIWALL — IDEA STAGE</span><span>Made with a circular mindset.</span><span><a href="#innovation">Innovation</a> · <a href="#school">School Connect</a> · <a href="#vision">Our vision</a></span></div>
      </footer>
    </>
  );
}

export default App;
