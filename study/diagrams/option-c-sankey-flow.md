# Option C: Weighted Flow Diagram

This diagram shows the proportional flow from lexemes → grammatical forms → themes, with line style representing frequency. Makes clear which connections are DOMINANT vs. RARE.

```mermaid
graph LR
    subgraph Hebrew["Hebrew Lexemes"]
        Q["qāwāh<br/>(קָוָה)"]
        H["ḥākāh<br/>(חָכָה)"]
        Y["yāḥal<br/>(יָחַל)"]
        D["dāmam<br/>(דָּמַם)"]
    end

    subgraph Forms["Grammatical Forms"]
        QP["Qal<br/>Participle"]
        PPf["Piel<br/>Perfect"]
        PPa["Piel<br/>Participle"]
        PImP["Piel<br/>Imperative"]
        HI["Hiphil<br/>Imperfect"]
        QI["Qal<br/>Imperative"]
    end

    subgraph Themes["Theological Themes"]
        SR["Strength &<br/>Renewal"]
        TH["Trust &<br/>Hope"]
        HD["Help &<br/>Deliverance"]
        PE["Patience &<br/>Endurance"]
        BI["Blessing &<br/>Inheritance"]
    end

    %% THICK LINES = Strong Pattern (8+ occurrences)
    Q ====>|"12 occ"| QP
    QP ====>|"8 occ"| SR

    %% MEDIUM LINES = Moderate Pattern (4-7 occurrences)
    Q -->|"8 occ"| PPf
    PPf -->|"6 occ"| TH

    Y -->|"6 occ"| PPa
    PPa -->|"4 occ"| SR

    %% THIN LINES = Weak Pattern (1-3 occurrences)
    Q -.->|"4 occ"| PImP
    PImP -.->|"4 occ"| HD

    H -.->|"4 occ"| PPa
    PPa -.->|"3 occ"| BI

    Y -.->|"3 occ"| HI
    HI -.->|"3 occ"| HD

    D -.->|"2 occ"| QI
    QI -.->|"2 occ"| TH

    style Q fill:#D6E4E5,stroke:#5F7161,stroke-width:2px
    style H fill:#D6E4E5,stroke:#5F7161,stroke-width:2px
    style Y fill:#D6E4E5,stroke:#5F7161,stroke-width:2px
    style D fill:#D6E4E5,stroke:#5F7161,stroke-width:2px

    style QP fill:#E6F3FF,stroke:#1B3B5A,stroke-width:2px
    style PPf fill:#E6F3FF,stroke:#1B3B5A,stroke-width:2px
    style PPa fill:#E6F3FF,stroke:#1B3B5A,stroke-width:2px
    style PImP fill:#E6F3FF,stroke:#1B3B5A,stroke-width:2px
    style HI fill:#E6F3FF,stroke:#1B3B5A,stroke-width:2px
    style QI fill:#E6F3FF,stroke:#1B3B5A,stroke-width:2px

    style SR fill:#FFE6E6,stroke:#DC143C,stroke-width:2px
    style TH fill:#FFE6E6,stroke:#DC143C,stroke-width:2px
    style HD fill:#FFE6E6,stroke:#DC143C,stroke-width:2px
    style PE fill:#FFE6E6,stroke:#DC143C,stroke-width:2px
    style BI fill:#FFE6E6,stroke:#DC143C,stroke-width:2px
```

## Line Style Legend:

- **═══►** THICK (double line): **STRONG PATTERN** (8+ occurrences)
  - These are systematic, well-attested connections
  - Safe to make theological claims based on these

- **───►** MEDIUM (solid line): **MODERATE PATTERN** (4-7 occurrences)
  - Reliable patterns but less dominant
  - Claims should be qualified ("often," "frequently")

- **··· ►** THIN (dotted line): **WEAK PATTERN** (1-3 occurrences)
  - Anecdotal or rare connections
  - Avoid generalizing from these

## Key Insights:

### STRONGEST CONNECTION (12→8 occurrences):
**qāwāh + Qal Participle → Strength & Renewal**
- This is your SIGNATURE finding
- Grammatically solid (participles = identity)
- Frequently attested
- Theologically coherent

### MODERATE CONNECTIONS (4-8 occurrences):
- qāwāh + Piel Perfect → Trust & Hope (8→6)
- yāḥal + Piel Participle → Strength & Renewal (6→4)
- qāwāh + Piel Imperative → Help & Deliverance (4→4)

### WEAK/RARE CONNECTIONS (1-3 occurrences):
- Many lexeme-form-theme paths have only 1-2 instances
- Use caution when generalizing from these
- May be context-specific rather than grammatically determined

## Methodological Implications:

**What this diagram shows:**
1. Some grammar→theme connections are SYSTEMATIC (thick lines)
2. Others are MODERATE (medium lines)
3. Many are ANECDOTAL (thin lines)

**What you should do:**
- Lead with thick-line connections in your writing
- Qualify medium-line connections ("often," "frequently")
- Avoid generalizing from thin-line connections

**Avoids James Barr's critique:**
- Not claiming ALL instances follow same pattern
- Showing frequency distribution
- Acknowledging exceptions and rare cases

**Use when:** You want to show which claims are well-supported vs. over-generalized from limited data.
