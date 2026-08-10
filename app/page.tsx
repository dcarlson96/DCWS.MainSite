const services = [
  {
    number: "01",
    title: "Custom web applications",
    copy: "Purpose-built software that replaces manual work and fits the way your business actually operates.",
  },
  {
    number: "02",
    title: "Customer & internal portals",
    copy: "Secure, intuitive experiences that give customers and teams the information and tools they need.",
  },
  {
    number: "03",
    title: "APIs & integrations",
    copy: "Reliable connections between your applications, data, vendors, and third-party services.",
  },
];

function ArrowIcon() {
  return <span aria-hidden="true">↗</span>;
}

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="DC Web Systems home">
          <span className="brand-mark">DC</span>
          <span>Web Systems</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#services">Services</a>
          <a href="#work">Work</a>
          <a href="#about">About</a>
        </nav>
        <a className="header-cta" href="mailto:hello@dcwebsystems.com">
          Start a project <ArrowIcon />
        </a>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span /> Independent software development · Boise, Idaho</p>
          <h1>Software built around <em>your business.</em></h1>
          <p className="hero-intro">
            DC Web Systems creates custom web applications, portals, and
            integrations that turn complicated processes into dependable,
            easy-to-use software.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="mailto:hello@dcwebsystems.com">
              Discuss your project <ArrowIcon />
            </a>
            <a className="text-link" href="#services">Explore services <span aria-hidden="true">↓</span></a>
          </div>
        </div>

        <div className="system-card" aria-label="What DC Web Systems delivers">
          <div className="card-topline">
            <span>DCWS / CAPABILITIES</span>
            <span className="status"><i /> AVAILABLE</span>
          </div>
          <div className="system-visual" aria-hidden="true">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="core">DC</div>
            <span className="node node-one" />
            <span className="node node-two" />
            <span className="node node-three" />
          </div>
          <div className="card-bottomline">
            <span>WEB APPS</span><span>APIs</span><span>DATA</span>
          </div>
        </div>
      </section>

      <section className="services" id="services">
        <div className="section-heading">
          <p className="eyebrow"><span /> What I build</p>
          <h2>From business problem<br />to working system.</h2>
        </div>
        <div className="service-list">
          {services.map((service) => (
            <article className="service" key={service.number}>
              <span className="service-number">{service.number}</span>
              <div>
                <h3>{service.title}</h3>
                <p>{service.copy}</p>
              </div>
              <span className="service-arrow" aria-hidden="true">↗</span>
            </article>
          ))}
        </div>
      </section>

      <section className="work" id="work">
        <div className="section-kicker">
          <p className="eyebrow"><span /> Selected experience</p>
          <p>Enterprise experience, translated into practical solutions for growing organizations.</p>
        </div>
        <div className="work-grid">
          <article className="work-feature">
            <div className="work-meta"><span>01 / CUSTOMER EXPERIENCE</span><span>WEB + GIS</span></div>
            <div className="map-visual" aria-hidden="true">
              <span className="map-line line-a" /><span className="map-line line-b" />
              <span className="map-line line-c" /><i className="map-pin pin-a" />
              <i className="map-pin pin-b" /><i className="map-pin pin-c" />
            </div>
            <h3>Customer-facing outage map</h3>
            <p>Designed and developed a real-time mapping experience integrating enterprise geographic and outage-management systems.</p>
          </article>
          <div className="work-stack">
            <article className="work-item">
              <div className="work-meta"><span>02 / SYSTEM MODERNIZATION</span><span>APIs + DATA</span></div>
              <h3>Customer information transition</h3>
              <p>Rearchitected application data flows to securely consume real-time customer and billing information through modern APIs.</p>
            </article>
            <article className="work-item">
              <div className="work-meta"><span>03 / INTERNAL TOOLS</span><span>.NET + SQL</span></div>
              <h3>Secure access management</h3>
              <p>Built an internal application and authorization model for managing access to enterprise APIs and metering data.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="about" id="about">
        <div>
          <p className="eyebrow"><span /> About DC Web Systems</p>
          <h2>Enterprise experience.<br /><em>Personal partnership.</em></h2>
        </div>
        <div className="about-copy">
          <p>
            I’m Dylan Carlson, a full-stack software developer with experience
            building dependable applications used by customers and internal teams.
            I bring enterprise-level engineering practices to organizations that
            need a capable, direct development partner.
          </p>
          <div className="skills">
            <span>C# / .NET</span><span>TypeScript</span><span>SQL</span>
            <span>APIs</span><span>Cloud</span><span>System integrations</span>
          </div>
        </div>
      </section>

      <section className="contact">
        <p className="eyebrow"><span /> Have a project in mind?</p>
        <h2>Let’s build a system<br />that works <em>for you.</em></h2>
        <a className="button button-light" href="mailto:hello@dcwebsystems.com">
          hello@dcwebsystems.com <ArrowIcon />
        </a>
      </section>

      <footer>
        <a className="brand" href="#top"><span className="brand-mark">DC</span><span>Web Systems</span></a>
        <p>Custom web applications · Boise, Idaho</p>
        <p>© {new Date().getFullYear()} DC Web Systems</p>
      </footer>
    </main>
  );
}
