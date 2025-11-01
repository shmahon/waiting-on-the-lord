# Option A: Grammar-First Decision Tree

This diagram emphasizes the CAUSAL CHAIN from grammatical feature → semantic contribution → theological inference, making the relationship explicit and falsifiable.

```mermaid
graph TD
    Start["GRAMMATICAL ANALYSIS OF 'WAITING' VOCABULARY"]

    Start --> Part["PARTICIPLE FORMS"]
    Start --> Stem["HEBREW STEMS"]
    Start --> Voice["GREEK VOICE/ASPECT"]

    Part --> PartSem["Semantic: Ongoing/Characteristic Action"]
    PartSem --> PartTheo["Theology: Waiting as IDENTITY<br/>not just activity"]
    PartTheo --> PartEx["Ex: 'those who wait' = people<br/>characterized by waiting"]

    Stem --> Qal["QAL: Simple Action"]
    Stem --> Piel["PIEL: Intensive/Factitive"]
    Stem --> Hiphil["HIPHIL: Causative"]

    Qal --> QalSem["Semantic: Basic waiting"]
    QalSem --> QalTheo["Theology: Simple dependence"]

    Piel --> PielSem["Semantic: Intensified/Completed"]
    PielSem --> PielTheo["Theology: Resolved trust,<br/>committed waiting"]

    Hiphil --> HiphilSem["Semantic: Making someone wait"]
    HiphilSem --> HiphilTheo["Theology: God makes people<br/>wait/depend on Him"]

    Voice --> Deponent["DEPONENT VERBS<br/>(apekdechomai)"]
    Voice --> Active["ACTIVE VOICE"]

    Deponent --> DepSem["Semantic: Form=Middle/Passive<br/>Meaning=Active"]
    DepSem --> DepTheo["Theology: DEBATABLE<br/>May not indicate personal investment"]
    DepTheo --> DepCaution["⚠ Pennington 2003:<br/>Deponents have lost<br/>middle voice force"]

    Active --> ActSem["Semantic: Subject acts"]
    ActSem --> ActTheo["Theology: Volitional hope/<br/>active expectation"]

    style Part fill:#D6E4E5,stroke:#5F7161,stroke-width:3px
    style Stem fill:#D6E4E5,stroke:#5F7161,stroke-width:3px
    style Voice fill:#E8D4D8,stroke:#8B3F52,stroke-width:3px

    style PartTheo fill:#90EE90,stroke:#2E8B57,stroke-width:2px
    style QalTheo fill:#90EE90,stroke:#2E8B57,stroke-width:2px
    style PielTheo fill:#90EE90,stroke:#2E8B57,stroke-width:2px
    style HiphilTheo fill:#90EE90,stroke:#2E8B57,stroke-width:2px
    style ActTheo fill:#90EE90,stroke:#2E8B57,stroke-width:2px

    style DepTheo fill:#FFB6C1,stroke:#DC143C,stroke-width:2px
    style DepCaution fill:#FFB6C1,stroke:#DC143C,stroke-width:2px
```

**Strengths:**
- Shows explicit causal chain: Form → Semantics → Theology
- Makes claims falsifiable (can test each step)
- Highlights which connections are strong vs. weak
- Includes scholarly caution where appropriate

**Use when:** You want to defend the grammar→theology connection and show your reasoning
