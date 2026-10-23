import { useEffect, useState, Fragment, type CSSProperties } from "react";
import { Link } from "react-router";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, FileCheck2, Layers3, ShieldCheck } from "lucide-react";
import { guideTheme, useGuideSurface } from "../shared";
import GuideFooter from "./GuideFooter";
import { getGuidePresentation } from "./guidePresentation";
import GuidePreview from "./GuidePreview";
import GuideIllustrations from "./GuideIllustrations";
import type { GuideDefinition } from "./guideTypes";
import "../sunshine_distribution_guide/styles.css";
import "./guidePage.css";
import "./guideNavigation.css";

const cardColors = ["violet", "emerald", "magenta", "blue", "amber", "mint"];
const cardIcons = [Layers3, BookOpen, FileCheck2, CheckCircle2, ArrowRight, ShieldCheck];

export default function GuidePage({ guide, manual }: { guide?: GuideDefinition; manual?: GuideDefinition }) {
  const item = (guide || manual)!;
  const surfaceRef = useGuideSurface(`${item.title} // Guide Vault`);
  const count = item.illustrations.length;
  const presentation = getGuidePresentation(item);
  const Icon = presentation.icon;
  const [activeSection, setActiveSection] = useState("overview");
  const navigation = [{ id: "overview", label: "Overview" }, { id: "modules", label: "System map" }, { id: "flow", label: "Workflow" }, { id: "workflow", label: "Read the guide" }, ...(count ? [{ id: "illustrations", label: "Illustrations" }] : []), { id: "review", label: "Review" }];
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveSection(visible.target.id);
    }, { rootMargin: "-20% 0px -55% 0px", threshold: [0, .1, .4] });
    navigation.forEach(navItem => { const section = surfaceRef.current?.querySelector(`#${navItem.id}`); if (section) observer.observe(section); });
    return () => observer.disconnect();
  }, [count, surfaceRef]);

  return <div ref={surfaceRef} className="sunshine-manual manual-guide manual-navigation blvd-guide-surface" style={guideTheme}>
    <header className="topbar">
      <a className="brand" href="#overview" aria-label={`${item.title} overview`}><span className="guide-brand-mark" aria-hidden="true"><Icon size={20} /></span><span className="brand-text"><b>{presentation.brand[0]}®</b><em>{presentation.brand[1]}</em></span></a>
      <div className="command"><span className="pulse" /><span>FIELD GUIDE</span><Link className="back-catalog" to="/">Back to guide catalog</Link></div>
      <nav className="top-links" aria-label="Guide sections"><a href="#modules" aria-current={activeSection === "modules" ? "location" : undefined}>Modules</a><a href="#flow" aria-current={activeSection === "flow" ? "location" : undefined}>Flow</a><a href="#workflow" aria-current={activeSection === "workflow" ? "location" : undefined}>Guide</a>{count > 0 && <a href="#illustrations" aria-current={activeSection === "illustrations" ? "location" : undefined}>Pages</a>}</nav>
      <div className="manual-header-actions"><Link className="header-catalog-link" to="/">Guide Catalog</Link><a className="launch-btn" aria-label="Open guide" href={count ? "#illustrations" : "#workflow"}><span>OPEN GUIDE</span><b>↗</b></a></div>
      <Link className="guide-mobile-back" to="/" aria-label="Back to guide catalog"><ArrowLeft size={19} /></Link>
    </header>
    <aside className="rail" aria-label="Chapter navigation"><div className="rail-line" />{navigation.map((navItem, i) => <a key={navItem.id} className={activeSection === navItem.id ? "rail-link active" : "rail-link"} href={`#${navItem.id}`} data-label={navItem.label} aria-label={navItem.label} aria-current={activeSection === navItem.id ? "location" : undefined}><span>{String(i).padStart(2, "0")}</span></a>)}<div className="rail-status"><i /><small>FIELD GUIDE</small></div></aside>
    <main>
      <section id="overview" className="hero section blvd-hero-top">
        <div className="hero-copy reveal"><div className="micro-label"><span>{item.category}</span><i /><span>{count ? "ILLUSTRATED GUIDE" : "WORKFLOW GUIDE"}</span></div>
          <p className="guide-product-title">{item.title}</p>
          <h1 id="guide-title"><span className="sr-only">{item.title}: </span>{presentation.headline[0]}<br /><strong>{presentation.headline[1]}</strong></h1>
          <p className="lead">{item.introduction}</p>
          <div className="hero-actions"><a href="#workflow" className="btn btn-energy"><span>READ THE GUIDE</span><b>↗</b></a><a href={count ? "#illustrations" : "#modules"} className="btn btn-glass"><span>{count ? "VIEW GUIDE" : "EXPLORE WORKFLOW"}</span><b>{count ? `${String(count).padStart(2, "0")} VIEWS` : "06 STAGES"}</b></a></div>
          <div className="hero-metrics"><div><small>CHAPTERS</small><strong>06</strong><em>CONNECTED</em></div><div><small>ILLUSTRATIONS</small><strong>{String(count).padStart(2, "0")}</strong><em>{count ? "ORIGINAL ARTWORK" : "TEXT GUIDE"}</em></div><div><small>WORKFLOW</small><strong>GUIDED</strong><em>STEP BY STEP</em></div><div><small>REVIEW</small><strong>HUMAN</strong><em>EVIDENCE FIRST</em></div></div>
        </div>
        <GuidePreview guide={item} stages={presentation.stages} Icon={Icon} />
        <div className="blvd-hero-word" aria-hidden="true">{presentation.brand[0]}</div>
      </section>
      <section className="ticker" aria-label="Guide capabilities"><div className="ticker-track">{[0, 1].map(copy => <Fragment key={copy}>{presentation.stages.map(stage => <Fragment key={stage}><span>{stage.toUpperCase()}</span><i aria-hidden="true">✳</i></Fragment>)}</Fragment>)}</div></section>
      <section id="modules" className="section modules">
        <div className="section-head reveal"><div><span className="eyebrow">01 / SYSTEM MAP</span><h2>Six connected stages.<br /><em>One clear workflow.</em></h2></div><p>{item.subtitle} Explore each stage, then open the chapter for its working steps and completion checks.</p></div>
        <div className="bento-grid guide-module-grid">{item.sections.map((section, i) => { const CardIcon = cardIcons[i]; return <article key={section.id} className={`sys-card ${cardColors[i]} ${i === 0 || i === 3 ? "span-2" : ""} reveal`}>
          <div className="card-top"><span className="chip">{String(i + 1).padStart(2, "0")} / {presentation.stages[i].toUpperCase()}</span><CardIcon size={22} aria-hidden="true" /></div>
          <h3>{section.title}</h3><p>{section.summary}</p>
          {i === 0 ? <div className="guide-stage-strip">{presentation.stages.slice(0, 3).map((stage, index) => <div key={stage}><small>0{index + 1}</small><strong>{stage}</strong></div>)}</div> : i === 3 ? <div className="guide-evidence-lines">{item.highlights.map((highlight, index) => <div key={highlight}><span>{highlight}</span><i style={{ "--w": `${90 - index * 18}%` } as CSSProperties} aria-hidden="true" /><CheckCircle2 size={13} aria-hidden="true" /></div>)}</div> : <div className="guide-card-path" aria-hidden="true"><i /><span /><i /><span /><i /></div>}
          <a className="guide-chapter-link" href={`#${section.id}`}>READ CHAPTER <ArrowRight size={14} /></a>
        </article>; })}</div>
      </section>
      <section id="flow" className="section flow-section">
        <div className="section-head reveal"><div><span className="eyebrow">02 / OPERATIONAL CHAIN</span><h2>Every step visible.<br /><em>Every handoff clear.</em></h2></div><p>{item.subtitle} Follow the chain from the first record to a reviewed, documented outcome.</p></div>
        <div className="pipeline guide-pipeline reveal"><div className="pipeline-line" aria-hidden="true"><span /></div>{item.sections.map((section, i) => { const StageIcon = cardIcons[i]; return <article key={section.id}><b>{String(i + 1).padStart(2, "0")}</b><i><StageIcon size={23} aria-hidden="true" /></i><h3>{presentation.stages[i]}</h3><p>{section.summary}</p><a href={`#${section.id}`}>OPEN CHAPTER <ArrowRight size={12} /></a></article>; })}</div>
      </section>
      <section id="workflow" className="section guide-reading-section">
        <div className="section-head reveal"><div><span className="eyebrow">03 / FIELD GUIDE</span><h2>Read the workflow.<br /><em>Keep the detail close.</em></h2></div><p>Work through the chapters in order or jump to the stage you need. Each chapter finishes with a clear check before continuing.</p></div>
        <div className="guide-layout">
          <aside className="guide-contents"><div className="controller-top"><span>CHAPTER INDEX</span><b>06 STEPS</b></div><nav aria-label="Guide contents">{item.sections.map((section, i) => <a key={section.id} href={`#${section.id}`}><span>{String(i + 1).padStart(2, "0")}</span><div><strong>{presentation.stages[i]}</strong><small>{section.title}</small></div></a>)}{count > 0 && <a href="#illustrations" aria-current={activeSection === "illustrations" ? "location" : undefined}><BookOpen size={18} /><div><strong>Illustrated pages</strong><small>{count} original views</small></div></a>}</nav><div className="manual-readout"><span><i /> WORKING GUIDE</span></div></aside>
          <article className="guide-reader" aria-label={`${item.title} workflow`}>{item.sections.map((section, i) => <section id={section.id} className={`guide-section ${cardColors[i]}`} key={section.id}>
            <div className="guide-chapter-head"><span className="chip">{String(i + 1).padStart(2, "0")} / {presentation.stages[i].toUpperCase()}</span><FileCheck2 size={19} aria-hidden="true" /></div><h2>{section.title}</h2><p>{section.summary}</p><ol>{section.steps.map((step, index) => <li key={step}><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><p>{step}</p></li>)}</ol><div className="guide-outcome"><CheckCircle2 size={19} aria-hidden="true" /><div><b>Ready to continue</b><p>{section.outcome}</p></div></div>
          </section>)}</article>
        </div>
      </section>
      {count > 0 && <GuideIllustrations key={item.title} guide={item} surfaceRef={surfaceRef} />}
      <section id="review" className="section security-section"><div className="security-panel reveal">
        <div className="security-copy"><span className="eyebrow">{count ? "05" : "04"} / REVIEW LAYER</span><h2>Keep the evidence.<br /><em>Own the decision.</em></h2><p>{item.sections.at(-1)?.outcome}</p><div className="security-tags"><span>SOURCE RECORDS</span><span>HUMAN REVIEW</span><span>CLEAR OWNERSHIP</span></div></div>
        <div className="security-orb" aria-hidden="true"><div className="orb-rings"><i /><i /><i /></div><div className="orb-core"><ShieldCheck size={26} /><span>REVIEW</span><small>BEFORE ACTION</small></div></div>
        <div className="security-readouts"><div><span>EVIDENCE</span><strong>Keep the source record</strong><i>●</i></div><div><span>HANDOFF</span><strong>Name the next owner</strong><i>●</i></div><div><span>COMPLETION</span><strong>Check the outcome</strong><i>●</i></div></div>
      </div></section>
      <GuideFooter caption={`${item.title} · FIELD GUIDE`} />
    </main>
  </div>;
}
