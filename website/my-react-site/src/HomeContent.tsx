import { Layout, Grid, auto, lg, sm } from 'rowscolumns/react';

const mainLayout = Grid.row(
    (auto), /* 1. Hero (Left Text / Right Code) */
    auto,
    auto,                                            /* 2. Title */
    ('400px').col(40, (60).row(1, 1)),               /* 3. Bento Grid */
    auto,                                            /* 4. Visualizer Title */
    ('400px').col(25, (50).row(30, 70), 25),         /* 5. Visualizer Demo */
    auto, auto.row(
        (1).col(8, 8, 8).offset([2]),
        (1).col(6, 6, 6, 6).offset([1, 3]),
        (1).col(6, 12, 6).offset([1, 3])
    ),                                          /* 6. Features Title */
    (auto).row(25, 25, 25, 25),                      /* 7. Features Grid */
    auto,                                             /* 8. Footer */
    auto,
).props({ gap: '5px', paddingTop: '80px', paddingBottom: '40px' }).childProps({ paddingTop: '50px' }, [3, 7, 12])
    .childProps({ height: '130px' }, [8])

const mainLayoutDesktop = Grid.row(
    (auto).col(lg, sm).props({ alignItems: 'center' }), /* 1. Hero (Left Text / Right Code) */
    auto,                                            /* 2. Title */
    ('400px').col(sm, (lg).row(1, 1)),               /* 3. Bento Grid */
    auto,                                            /* 4. Visualizer Title */
    ('400px').col(25, (50).row(30, 70), 25),         /* 5. Visualizer Demo */
    auto, auto.row(
        (1).col(8, 8, 8).offset([2]),
        (1).col(6, 6, 6, 6).offset([1, 3]),
        (1).col(6, 12, 6).offset([1, 3])
    ),                                          /* 6. Features Title */
    (auto),                      /* 7. Features Grid */                                            /* 8. Footer */
    auto.col(1, 1),
).props({ gap: '20px', paddingTop: '80px', paddingBottom: '40px' }).childProps({ padding: '80px 0px' }, [3, 7, 12, 18])
    .childProps({ height: '130px' }, [8])

export default function HomeContent() {
    return (
        <Layout className="container" layout={mainLayout} layout-lg={mainLayoutDesktop}>
            {/* 1. HERO */}
            <div>
                <h5>
                    NATIVE LAYOUT ENGINE
                </h5>
                <h1>
                    Define CSS Grid layouts using native <br /> JavaScript logic.
                </h1>
                <p>
                    A recursive, zero-dependency layout engine. Write geometry using native JavaScript
                    logic.
                </p>
                <div>
                    <a href="docs.html" className="btn">
                        Get Started
                    </a>
                    <div className="code-box">
                        npm install rowscolumns
                    </div>
                </div>
            </div>

            {/* Hero Code Visual */}
            <div className="terminal">
                <div className="terminal-header">
                    <div className="dot" />
                    <div className="dot" />
                    <div className="dot" />
                    <div>
                        App.jsx
                    </div>
                </div>
                <div className="terminal-body">
                    <div>
                        <span className="k">import</span> {` { `}
                        <span className="v">Layout</span>, <span className="v">Grid</span> {` } `}
                        <span className="k">from</span> <span className="s">'rowscolumns/react'</span>;
                    </div>
                    <br />
                    <div>
                        <span className="k">export default</span>{' '}
                        <span className="k">function</span> <span className="f">Dashboard</span>() {'{'}
                    </div>
                    <div style={{ paddingLeft: '20px' }}>
                        <span className="k">return</span> (
                    </div>
                    <div style={{ paddingLeft: '40px' }}>
                        &lt;<span className="t">Layout</span>
                    </div>
                    <div style={{ paddingLeft: '60px' }}>
                        layout=&#123;Grid.col(30, 70)&#125;
                    </div>
                    <div style={{ paddingLeft: '40px' }}>
                        &gt;
                    </div>
                    <div style={{ paddingLeft: '60px' }}>
                        &lt;<span className="t">div</span>&gt; Sidebar &lt;/<span className="t">div</span>&gt;
                    </div>
                    <div style={{ paddingLeft: '60px' }}>
                        &lt;<span className="t">div</span>&gt; Main Content &lt;/<span className="t">div</span>&gt;
                    </div>
                    <div style={{ paddingLeft: '40px' }}>
                        &lt;/<span className="t">Layout</span>&gt;
                    </div>
                    <div style={{ paddingLeft: '20px' }}>)</div>
                    <div>{'}'}</div>
                </div>
            </div>

            {/* 2. TITLE */}
            <div>
                <h2>Built with Logic</h2>
                <p>The layout below is generated recursively.</p>
                <code>
                    Grid.col(40, (60).row(50, 50))
                </code>
            </div>

            {/* 3. BENTO GRID */}
            <div className="card">
                <div>⚡</div>
                <h3>Native Speed</h3>
                <p>
                    Runs on the browser&apos;s JS engine. No regex parsing overhead.
                </p>
            </div>
            <div className="card">
                <div>📐</div>
                <h3>Recursive Geometry</h3>
                <p>
                    Nest rows inside columns infinitely. Just like math.
                </p>
            </div>
            <div className="card">
                <div>👻</div>
                <h3>Ghost Offsets</h3>
                <p>
                    Use <code>.offset()</code> to skip grid slots mathematically.
                </p>
            </div>

            {/* 4. 2D VISUALIZER TITLE */}
            <div>
                <h2>True 2D Layouts</h2>
                <p>Define complex dashboards in a single line. Visualised below.</p>
                <code>
                    Grid.col(25, (50).row(30, 70), 25)
                </code>
            </div>

            {/* 5. 2D VISUALIZER DEMO */}
            <div className="wireframe-box fill">Sidebar (25%)</div>
            <div className="wireframe-box">Header (30%)</div>
            <div className="wireframe-box">Content Body (70%)</div>
            <div className="wireframe-box fill">Widget Panel (25%)</div>

            <div>
                <p>One more example. Visualised below.</p>
                <code>
                    Grid.row(
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;(1).col(8,8,8).offset([2]),
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;(1).col(6,6,6,6).offset([1,3]),
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;(1).col(6,12,6).offset([1,3])
                    <br />
                    )
                </code>
            </div>

            <div className="wireframe-box">col-8</div>
            <div className="wireframe-box">col-8</div>

            <div className="wireframe-box">col-6</div>
            <div className="wireframe-box">col-6</div>

            <div className="wireframe-box">col-12</div>

            <div>
                <h2>Clean &amp; Semantic</h2>
                <p>
                    Build complex components with flat HTML. No &quot;Div Soup&quot;.
                </p>
            </div>

            <Layout layout={Grid.col(1,1).props({ gap: '40px' })}>
                {/* LEFT: VISUAL RESULT */}
                <div>
                    <div>
                        THE RESULT
                    </div>
                    {/* Semantic demo card */}
                    <Layout
                        layout={Grid.row("200px", 1, 'auto', 1).props({
                            gap: '15px',
                            padding: '25px',
                            background: 'var(--surface)',
                            border: '1px solid var(--border)',
                            borderRadius: '16px',
                        })}
                    >
                        <div>
                            Product Image
                        </div>

                        <h3>
                            Neon Chair
                        </h3>
                        <span>
                            $299
                        </span>

                        <p>
                            Ergonomic design with luminescent mesh backing for late night coding sessions.
                        </p>

                        <button className="btn">
                            Buy Now
                        </button>
                        <button
                            className="btn"
                        >
                            Details
                        </button>
                    </Layout>
                </div>

                {/* RIGHT: THE CODE */}

                <div>
                    THE CODE
                </div>
                
                    <div className="terminal-header">
                        <div className="dot" />
                        <div className="dot" />
                        <div className="dot" />
                        <span>
                            card.html
                        </span>
                    </div>
                    <div className="terminal-body">
                        &lt;<span className="t">div</span> <span className="v">layout</span>=
                        "<span className="s">
                            Grid.row(
                            <br />
                            &nbsp; 200,
                            <br />
                            &nbsp; (auto).col(1, auto),
                            <br />
                            &nbsp; auto,
                            <br />
                            &nbsp; (auto).col(1, 1)
                            <br />
                            )
                        </span>
                        "&gt;
                        <br />
                        <br />
                        &nbsp;&nbsp;&lt;!-- Flat Siblings (No wrappers!) --&gt;
                        <br />
                        &nbsp;&nbsp;&lt;<span className="t">img</span> src="..." /&gt;
                        <br />
                        &nbsp;&nbsp;&lt;<span className="t">h3</span>&gt;Neon Chair&lt;/
                        <span className="t">h3</span>&gt;
                        <br />
                        &nbsp;&nbsp;&lt;<span className="t">span</span>&gt;$299&lt;/
                        <span className="t">span</span>&gt;
                        <br />
                        &nbsp;&nbsp;&lt;<span className="t">p</span>&gt;Ergonomic...&lt;/
                        <span className="t">p</span>&gt;
                        <br />
                        &nbsp;&nbsp;&lt;<span className="t">button</span>&gt;Buy&lt;/
                        <span className="t">button</span>&gt;
                        <br />
                        &nbsp;&nbsp;&lt;<span className="t">button</span>&gt;Details&lt;/
                        <span className="t">button</span>&gt;
                        <br />
                        <br />
                        &lt;/<span className="t">div</span>&gt;
                    </div>
                

            </Layout>

        </Layout>
    );
}


