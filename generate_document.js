const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, 
        LevelFormat, Footer, PageNumber, UnderlineType } = require('docx');

// Lexical data extracted from the table
const lexicalData = {
  hebrew: [
    {
      lexeme: "qāwāh (קָוָה)",
      strongsNum: "H6960",
      twot: "TWOT 1994, 1995",
      theme: "Multiple themes: Strength & Renewal, Trust & Hope, Blessing & Inheritance, Help & Deliverance, Teaching & Guidance, Praise & Worship, Faithfulness & Devotion, Goodness of God",
      rootMeaning: "To wait, to hope, to expect with confident anticipation",
      occurrences: [
        { ref: "Isaiah 40:31", parsing: "Qal, Participle, Masculine Plural Construct", pos: "Verb" },
        { ref: "Psalm 27:14", parsing: "Qal, Imperative, Masculine Singular", pos: "Verb" },
        { ref: "Psalm 130:5", parsing: "Piel, Perfect, 1st Common Singular", pos: "Verb" },
        { ref: "Psalm 39:7", parsing: "Piel, Perfect, 1st Common Singular", pos: "Verb" },
        { ref: "Psalm 40:1", parsing: "Piel, Infinitive Absolute", pos: "Verb" },
        { ref: "Isaiah 33:2", parsing: "Piel, Perfect, 1st Common Plural", pos: "Verb" },
        { ref: "Proverbs 20:22", parsing: "Piel, Imperative, Masculine Singular", pos: "Verb" },
        { ref: "Psalm 37:9", parsing: "Qal, Participle, Masculine Plural Construct", pos: "Verb" },
        { ref: "Psalm 37:34", parsing: "Qal, Imperative, Masculine Singular", pos: "Verb" },
        { ref: "Isaiah 49:23", parsing: "Qal, Participle, Masculine Plural Construct", pos: "Verb" },
        { ref: "Psalm 25:5", parsing: "Piel, Perfect, 1st Common Singular", pos: "Verb" },
        { ref: "Psalm 52:9", parsing: "Piel, Imperfect (cohortative), 1st Common Singular", pos: "Verb" },
        { ref: "Isaiah 25:9", parsing: "Piel, Perfect, 1st Common Plural", pos: "Verb" },
        { ref: "Isaiah 26:8", parsing: "Piel, Perfect, 1st Common Plural", pos: "Verb" },
        { ref: "Hosea 12:6", parsing: "Qal, Imperative, Masculine Singular", pos: "Verb" },
        { ref: "Lamentations 3:25", parsing: "Qal, Participle, Masculine Plural", pos: "Verb" }
      ],
      stems: ["Qal", "Piel"],
      thematicAnalysis: "Qāwāh is the most frequent Hebrew verb for 'waiting on the Lord,' appearing 16 times in the passages analyzed. The thematic diversity reflects the word's semantic range. In the Qal stem (simple active), qāwāh emphasizes the basic act of waiting with expectation—often as a participle describing 'those who wait' as a characteristic posture (Isaiah 40:31, Psalm 37:9, Lamentations 3:25). As an imperative, it becomes a direct command to wait (Psalm 27:14, Hosea 12:6). In the Piel stem (intensive/causative), qāwāh intensifies the waiting—expressing emphatic, sustained, or completed waiting. The Piel perfect forms often mark testimony of past waiting that grounds present hope (Psalm 130:5, Isaiah 25:9). The infinitive absolute construction in Psalm 40:1 creates maximum emphasis: 'waiting I waited' = persistent, patient waiting."
    },
    {
      lexeme: "yāḥal (יָחַל)",
      strongsNum: "H3176",
      twot: "TWOT 858",
      theme: "Strength & Renewal, Trust & Hope, Patience & Endurance, Help & Deliverance",
      rootMeaning: "To wait, to hope, to trust with expectation of favorable outcome",
      occurrences: [
        { ref: "Psalm 31:24", parsing: "Piel, Participle, Masculine Plural", pos: "Verb" },
        { ref: "Lamentations 3:26", parsing: "Piel, Imperfect, 3rd Masculine Singular", pos: "Verb" },
        { ref: "Psalm 69:3", parsing: "Piel, Infinitive Construct, 1st Common Singular", pos: "Verb" },
        { ref: "Micah 7:7", parsing: "Hiphil, Imperfect, 1st Common Singular", pos: "Verb" }
      ],
      stems: ["Piel", "Hiphil"],
      thematicAnalysis: "Yāḥal appears four times in these passages, always in intensive or causative stems. In the Piel stem (intensive), yāḥal emphasizes strong hoping or intense trusting. The participle forms (Psalm 31:24, Lamentations 3:26) describe characteristic hopers—those for whom hope is an ongoing disposition. The infinitive construct in Psalm 69:3 ('in my waiting/hoping') captures the sustained nature of hope amid exhaustion: 'mine eyes fail while I wait for my God.' Notably, Micah 7:7 uses the Hiphil stem (causative): 'I will cause myself to hope' or 'I will actively/determinedly hope'—emphasizing the prophet's volitional decision to hope despite societal collapse. This causative nuance suggests hope as an act of will, not merely passive expectation."
    },
    {
      lexeme: "dāmam (דָּמַם)",
      strongsNum: "H1826",
      twot: "TWOT 439",
      theme: "Trust & Hope",
      rootMeaning: "To be silent, to be still, to cease from activity",
      occurrences: [
        { ref: "Psalm 62:5", parsing: "Qal, Imperative, Feminine Singular", pos: "Verb" }
      ],
      stems: ["Qal"],
      thematicAnalysis: "Dāmam is unique among the waiting verbs—it emphasizes cessation and silence rather than active anticipation. In Psalm 62:5, David commands his own soul (nephesh, feminine) to 'be silent/still' before God exclusively. The feminine imperative matches the grammatical gender of nephesh (soul). Unlike qāwāh or yāḥal which can denote eager expectation, dāmam stresses the internal quieting necessary for trust—silencing anxieties, competing voices, and self-reliance. This waiting involves stopping, not doing. The context ('wait only upon God') makes clear this isn't mere passivity but disciplined exclusivity: refusing multiple securities in favor of singular dependence on God. The verbal root suggests forced cessation, making dāmam the most passive-sounding yet perhaps most disciplined form of waiting."
    },
    {
      lexeme: "ḥûl (חוּל)",
      strongsNum: "H2342",
      twot: "TWOT 623",
      theme: "Trust & Hope, Patience & Endurance",
      rootMeaning: "To writhe, to twist, to whirl; to wait in labor-like pain",
      occurrences: [
        { ref: "Lamentations 3:26", parsing: "Qal, Sequential Imperfect, 3rd Masculine Singular", pos: "Verb" },
        { ref: "Psalm 37:7", parsing: "Hithpolel, Imperative, Masculine Singular", pos: "Verb" }
      ],
      stems: ["Qal", "Hithpolel"],
      thematicAnalysis: "Ḥûl is the most emotionally intense waiting verb. Its basic meaning relates to writhing in childbirth pain, whirling, or twisting—images of agony and struggle. When applied to waiting, ḥûl acknowledges the emotional turmoil inherent in patient endurance. Lamentations 3:26 pairs yāḥal (hope) with ḥûl (writhe/wait quietly) in a Qal sequential imperfect ('and he will wait quietly'), suggesting that genuine hope includes patient endurance through suffering—not denial of pain. Psalm 37:7 uses the intensive Hithpolel stem: 'writhe for yourself' or 'wait patiently for Him.' The Hithpolel reflexive nuance emphasizes the self-directed nature of this patient waiting. The command 'rest/be still' (dāmam) plus 'wait patiently' (ḥûl hithpolel) creates a paradox: be still yet writhe—suggesting internal struggle masked by external trust. The fretting context ('fret not because of evildoers') indicates ḥûl-waiting involves channeling theodicy-related turmoil into trust rather than anxiety."
    },
    {
      lexeme: "ḥākāh (חָכָה)",
      strongsNum: "H2442",
      twot: "TWOT 648",
      theme: "Help & Deliverance, Teaching & Guidance, Goodness of God, Judgment & Justice",
      rootMeaning: "To wait, to tarry, to long for with patience",
      occurrences: [
        { ref: "Psalm 33:20", parsing: "Piel, Perfect, 3rd Feminine Singular", pos: "Verb" },
        { ref: "Isaiah 30:18", parsing: "Piel, Participle, Masculine Plural Construct", pos: "Verb" },
        { ref: "Isaiah 8:17", parsing: "Piel, Sequential Perfect, 1st Common Singular", pos: "Verb" },
        { ref: "Isaiah 64:4", parsing: "Piel, Participle, Masculine Singular", pos: "Verb" },
        { ref: "Zephaniah 3:8", parsing: "Piel, Imperative, Masculine Plural", pos: "Verb" }
      ],
      stems: ["Piel"],
      thematicAnalysis: "Ḥākāh appears exclusively in the Piel stem (intensive) in these passages, always emphasizing sustained, patient waiting. Most remarkably, Isaiah 30:18 presents God Himself as the waiting subject: 'Therefore the LORD waits to be gracious to you.' This divine waiting establishes a pattern for human waiting—God's patient delay in showing mercy mirrors and enables human patient waiting for His mercy. The participial forms (Isaiah 30:18, 64:4) describe characteristic waiters. Isaiah 64:4's affirmation that God acts 'for him who waits' is profound—what God prepares for waiters exceeds human comprehension ('eye has not seen'). Isaiah 8:17 uses the Piel waw-consecutive ('and I will wait') during divine hiddenness, modeling faith when God conceals His face. Zephaniah 3:8 commands waiting for God's eschatological judgment. The Piel stem throughout intensifies the duration and patience required—ḥākāh-waiting is sustained tarrying, not brief pausing."
    }
  ],
  greek: [
    {
      lexeme: "apekdechomai (ἀπεκδέχομαι)",
      strongsNum: "G553",
      theme: "Strength & Renewal, Help & Deliverance, Blessing & Inheritance, Eschatological Hope",
      rootMeaning: "To eagerly await, to expect with intense anticipation (compound: apo + ek + dechomai = 'await from/out-of')",
      occurrences: [
        { ref: "Romans 8:25", parsing: "Present, Middle/Passive Deponent, Indicative, 1st Person Plural", pos: "Verb" },
        { ref: "Romans 8:23", parsing: "Present, Middle/Passive Deponent, Participle, Nominative Plural", pos: "Verb" },
        { ref: "Romans 8:19", parsing: "Present, Middle/Passive Deponent, Indicative, 3rd Person Singular", pos: "Verb" },
        { ref: "Galatians 5:5", parsing: "Present, Middle/Passive Deponent, Indicative, 1st Person Plural", pos: "Verb" },
        { ref: "Philippians 3:20", parsing: "Present, Middle/Passive Deponent, Indicative, 1st Person Plural", pos: "Verb" },
        { ref: "1 Corinthians 1:7", parsing: "Present, Middle/Passive Deponent, Participle, Accusative Plural", pos: "Verb" }
      ],
      voice: "Middle/Passive Deponent",
      thematicAnalysis: "Apekdechomai is Paul's characteristic eschatological waiting verb, appearing six times in analyzed passages. The triple-compound intensifies meaning: apo (from/away) + ek (out of) + dechomai (receive/welcome) = eagerly awaiting something to emerge from a source. The present tense throughout emphasizes ongoing, continuous expectation—Christian life is perpetual eager waiting. The middle/passive deponent voice indicates the subject acts in their own interest while receiving the awaited reality—waiting is both active anticipation and receptive posture. Romans 8 uses apekdechomai three times, creating a cosmic waiting symphony: creation waits for believers' glorification (v. 19), believers wait for bodily redemption (v. 23), and this waiting involves patient endurance amid groaning (v. 25). Galatians 5:5 specifies waiting 'through the Spirit' for righteousness-hope—pneumatologically empowered eschatological expectation. Philippians 3:20 and 1 Corinthians 1:7 both await Christ's revelation/coming. The consistent present tense across all instances establishes apekdechomai-waiting as the normative Christian temporal posture: already justified but not yet glorified, possessing firstfruits while awaiting harvest."
    },
    {
      lexeme: "prosdechomai (προσδέχομαι)",
      strongsNum: "G4327",
      theme: "Messianic Expectation, Eschatological Hope",
      rootMeaning: "To await, to expect, to receive toward oneself (pros = toward + dechomai = receive)",
      occurrences: [
        { ref: "Luke 2:25", parsing: "Present, Middle/Passive Deponent, Participle, Nominative Singular", pos: "Verb" },
        { ref: "Luke 2:38", parsing: "Present, Middle/Passive Deponent, Participle, Dative Plural", pos: "Verb" },
        { ref: "Mark 15:43", parsing: "Present, Middle/Passive Deponent, Participle, Nominative Singular", pos: "Verb" },
        { ref: "Titus 2:13", parsing: "Present, Middle/Passive Deponent, Participle, Nominative Plural", pos: "Verb" }
      ],
      voice: "Middle/Passive Deponent",
      thematicAnalysis: "Prosdechomai is the common LXX translation for Hebrew qāwāh, making it a semantic bridge between Old and New Testaments. In NT usage, it appears as a present participle describing characteristic waiting. Simeon (Luke 2:25) was 'waiting for the consolation of Israel'—messianic expectation based on OT promises. Anna spoke to all 'waiting for redemption in Jerusalem' (Luke 2:38), showing a community of expectant believers. Joseph of Arimathea 'waited for the kingdom of God' (Mark 15:43), with his bold request for Jesus' body demonstrating how kingdom-waiting produces courageous action at critical moments. Titus 2:13 shifts to eschatological waiting: 'looking for the blessed hope and glorious appearing.' The consistent present participial form across all instances establishes prosdechomai-waiting as a defining characteristic of faithful believers—whether Old Testament remnant awaiting Messiah's first advent or New Testament church awaiting His second advent. The middle/passive deponent voice indicates the waiters position themselves to receive what comes toward them (pros = toward)."
    },
    {
      lexeme: "elpizō (ἐλπίζω)",
      strongsNum: "G1679",
      theme: "Trust & Hope",
      rootMeaning: "To hope, to expect with confidence, to trust in",
      occurrences: [
        { ref: "1 Peter 1:13", parsing: "Aorist, Active, Imperative, 2nd Person Plural", pos: "Verb" }
      ],
      voice: "Active",
      thematicAnalysis: "Elpizō is the primary LXX translation for both qāwāh and yāḥal, making it the standard Greek hope-verb. In 1 Peter 1:13, the aorist imperative creates urgency: 'decisively hope' or 'set your hope completely' (the adverb teleíōs = perfectly, completely, modifies the verb). Unlike the present tense of prosdechomai and apekdechomai (ongoing waiting), this aorist imperative demands a definitive act of hope-commitment. The active voice (not deponent) emphasizes the volitional nature of hope—believers must actively choose to hope. The context ('gird up the loins of your mind, be sober') frames hope as requiring mental discipline and preparedness. The object is 'the grace being brought to you at the revelation of Jesus Christ'—eschatological grace already in motion toward believers. This creates a different nuance than apekdechomai (which emphasizes eager awaiting) or prosdechomai (which emphasizes receiving). Elpizō here stresses the decision and discipline of hope, particularly mental/spiritual readiness for Christ's appearing."
    },
    {
      lexeme: "makrothymeō (μακροθυμέω)",
      strongsNum: "G3114",
      theme: "Patience & Endurance",
      rootMeaning: "To be patient, to be long-suffering (makros = long + thymos = passion/anger = 'long-tempered')",
      occurrences: [
        { ref: "James 5:7-8", parsing: "Aorist, Active, Imperative, 2nd Person Plural", pos: "Verb" }
      ],
      voice: "Active",
      thematicAnalysis: "Makrothymeō literally means 'long-passionate' or 'long-tempered'—the opposite of short-tempered. It describes patience that endures provocation or delay without yielding to anger or despair. In James 5:7-8, the triple imperative ('be patient...be patient...establish your hearts') emphasizes urgency despite calling for patience—a paradox. The agricultural metaphor (farmer waiting for early/late rains, precious fruit) illustrates makrothymeō-patience: active cultivation while trusting natural processes beyond control. This isn't passive resignation but engaged endurance. The aorist imperative (like elpizō in 1 Peter 1:13) demands decisive commitment to patience, not gradual cultivation of it. The conceptual parallel to hypomonē (patient endurance) and Hebrew qāwāh/ḥûl situates makrothymeō in the semantic field of sustained waiting. However, makrothymeō specifically emphasizes restraint from premature action or emotional reaction—'long-suffering' that absorbs delay and opposition without retaliating or abandoning hope. The eschatological motivation ('the coming of the Lord draws near') provides the farmer's certainty: harvest is guaranteed, timing is God's."
    },
    {
      lexeme: "hypomonē (ὑπομονή)",
      strongsNum: "G5281",
      theme: "Patience & Endurance",
      rootMeaning: "Patient endurance, steadfastness, perseverance (hypo = under + menō = remain = 'remain under')",
      occurrences: [
        { ref: "Hebrews 10:36", parsing: "Genitive, Feminine, Singular", pos: "Noun" }
      ],
      voice: "N/A (Noun)",
      thematicAnalysis: "Hypomonē is the noun form of hypomenō (the verb 'to endure'), the standard LXX rendering for qāwāh and ḥûl. The etymology reveals its meaning: hypo (under) + menō (remain) = 'remaining under' a burden or trial. It's not merely passive tolerance but active, sustained endurance that doesn't abandon post despite pressure. Hebrews 10:36 states: 'You have need of patient endurance (hypomonē) so that after doing God's will you may receive the promise.' The genitive case ('of patient endurance') indicates necessity—endurance is a required quality for inheritance. The temporal structure is crucial: (1) do God's will, (2) patiently endure, (3) receive promise. Hypomonē fills the gap between obedience and reward. The context warns against apostasy (vv. 26-31, 38-39), making hypomonē the antithesis of 'shrinking back to destruction.' This endurance is pneumatologically grounded (v. 29 refers to 'Spirit of grace') and eschatologically motivated ('He who is coming will come,' v. 37). While makrothymeō emphasizes restraint from premature reaction, hypomonē emphasizes sustained positioning under trial—spiritual staying-power."
    },
    {
      lexeme: "anamenō (ἀναμένω)",
      strongsNum: "G362",
      theme: "Eschatological Hope",
      rootMeaning: "To wait for, to await expectantly (ana = up/again + menō = remain = 'remain in expectation')",
      occurrences: [
        { ref: "1 Thessalonians 1:10", parsing: "Present, Active, Infinitive", pos: "Verb" }
      ],
      voice: "Active",
      thematicAnalysis: "Anamenō is a compound of menō (remain, abide), related to hypomonē. The prefix ana can mean 'up,' 'again,' or 'back,' giving anamenō nuances of 'await the return of' or 'remain in expectation of.' In 1 Thessalonians 1:10, the present active infinitive ('in order to wait') describes the purpose/result of Thessalonian conversion: they turned from idols to serve the living God AND to wait for His Son from heaven. This creates a fundamental Christian reorientation: from idol-worship (past) to God-service (present) to Christ-expectation (future). The eschatological focus is sharp: waiting for Jesus 'whom He raised from the dead,' who 'delivers us from the wrath to come.' The resurrection grounds hope, and the deliverance specifies hope's content—rescue from eschatological judgment. The present tense of the infinitive indicates ongoing, continuous waiting as normative for Christian existence. Unlike apekdechomai (which emphasizes eager intensity) or prosdechomai (which emphasizes receiving), anamenō emphasizes the posture of remaining in expectation—abiding in watchful anticipation of Christ's return."
    }
  ]
};

// Create comprehensive document
const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: "Times New Roman", size: 24 }, // 12pt
        paragraph: { spacing: { line: 360, before: 0, after: 120 } }
      }
    },
    paragraphStyles: [
      {
        id: "Title",
        name: "Title",
        basedOn: "Normal",
        run: { size: 56, bold: true, font: "Times New Roman" },
        paragraph: { spacing: { before: 240, after: 240 }, alignment: AlignmentType.CENTER }
      },
      {
        id: "Heading1",
        name: "Heading 1",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 32, bold: true, font: "Times New Roman" },
        paragraph: { spacing: { before: 360, after: 180 }, outlineLevel: 0 }
      },
      {
        id: "Heading2",
        name: "Heading 2",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 28, bold: true, font: "Times New Roman" },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 }
      },
      {
        id: "Heading3",
        name: "Heading 3",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 26, bold: true, italics: true, font: "Times New Roman" },
        paragraph: { spacing: { before: 180, after: 100 }, outlineLevel: 2 }
      },
      {
        id: "BlockQuote",
        name: "Block Quote",
        basedOn: "Normal",
        run: { italics: true, size: 22 },
        paragraph: { 
          indent: { left: 720, right: 720 },
          spacing: { before: 120, after: 120 }
        }
      }
    ]
  },
  numbering: {
    config: [
      {
        reference: "endnote-list",
        levels: [{
          level: 0,
          format: LevelFormat.DECIMAL,
          text: "%1.",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } }
        }]
      }
    ]
  },
  sections: [{
    properties: {
      page: {
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      }
    },
    footers: {
      default: new Footer({
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun("Page "),
              new TextRun({ children: [PageNumber.CURRENT] }),
              new TextRun(" of "),
              new TextRun({ children: [PageNumber.TOTAL_PAGES] })
            ]
          })
        ]
      })
    },
    children: [
      // Title
      new Paragraph({
        heading: HeadingLevel.TITLE,
        children: [new TextRun("Waiting on the Lord")]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ 
          text: "A Lexical and Morphological Analysis of Hebrew and Greek Terms",
          size: 24,
          italics: true
        })]
      }),
      new Paragraph({ children: [new TextRun("")] }), // Spacing

      // Introduction
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("Introduction")]
      }),
      new Paragraph({
        children: [new TextRun({
          text: "This study examines the Hebrew and Greek lexemes used to describe 'waiting on the Lord' in Scripture. The thematic groupings in the original table emerged from careful analysis of each word's morphology, semantic range, and contextual usage. Understanding how specific verbal stems, aspects, and moods contribute to meaning enriches our comprehension of what it means to wait on the Lord across various contexts."
        })]
      }),
      new Paragraph({
        children: [new TextRun({
          text: "The Hebrew verbal system employs stems (binyanim) that modify the basic meaning of a root, while Greek uses voice, mood, and tense to express nuanced action. Participles in both languages describe characteristic states or ongoing actions. Imperatives express direct commands. Perfect tenses often indicate completed action with continuing results. These grammatical features aren't merely technical—they reveal theological depth about the nature of faithful waiting."
        })]
      }),
      new Paragraph({
        children: [new TextRun({
          text: "Technical terms that may be unfamiliar are explained in learner's notes within each entry, with comprehensive stem explanations provided in the endnotes."
        })]
      }),
      new Paragraph({ children: [new TextRun("")] }), // Spacing

      // Hebrew Section
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("Hebrew Lexemes")]
      }),
      
      ...generateHebrewEntries(lexicalData.hebrew),

      // Greek Section
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("Greek Lexemes")]
      }),
      
      ...generateGreekEntries(lexicalData.greek),

      // Endnotes Section
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("Endnotes: Understanding Hebrew Verb Stems")]
      }),
      
      ...generateHebrewStemEndnotes()
    ]
  }]
});

function generateHebrewEntries(hebrewData) {
  const entries = [];
  
  hebrewData.forEach((lexeme, index) => {
    // Lexeme heading
    entries.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun(`${index + 1}. ${lexeme.lexeme} (${lexeme.strongsNum})`)]
      })
    );

    // Root meaning and references
    entries.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Root Meaning: ", bold: true }),
          new TextRun(lexeme.rootMeaning)
        ]
      })
    );
    entries.push(
      new Paragraph({
        children: [
          new TextRun({ text: "TWOT: ", bold: true }),
          new TextRun(lexeme.twot)
        ]
      })
    );
    entries.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Thematic Range: ", bold: true }),
          new TextRun(lexeme.theme)
        ]
      })
    );

    // Morphological analysis heading
    entries.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("Morphological Analysis")]
      })
    );

    // Stems used
    entries.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Stems Attested: ", bold: true }),
          new TextRun(lexeme.stems.join(", ") + " (see endnotes¹)")
        ]
      })
    );

    // Occurrence details
    entries.push(
      new Paragraph({
        children: [new TextRun({ text: "Occurrences in Analyzed Passages:", bold: true })]
      })
    );

    lexeme.occurrences.forEach(occ => {
      entries.push(
        new Paragraph({
          style: "BlockQuote",
          children: [
            new TextRun({ text: `${occ.ref}: `, bold: true }),
            new TextRun(occ.parsing)
          ]
        })
      );
      entries.push(generateMorphologyBreakdown(occ.parsing, "hebrew"));
    });

    // Learner's notes for specific terms
    const learnerNotes = generateLearnerNotes(lexeme.lexeme, lexeme.occurrences);
    if (learnerNotes.length > 0) {
      entries.push(
        new Paragraph({
          children: [new TextRun({ text: "Learner's Notes:", bold: true, italics: true })]
        })
      );
      learnerNotes.forEach(note => {
        entries.push(
          new Paragraph({
            indent: { left: 360 },
            children: [
              new TextRun({ text: "• ", bold: true }),
              new TextRun(note)
            ]
          })
        );
      });
    }

    // Thematic analysis
    entries.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("Thematic Analysis")]
      })
    );
    entries.push(
      new Paragraph({
        children: [new TextRun(lexeme.thematicAnalysis)]
      })
    );

    // Spacing between entries
    entries.push(new Paragraph({ children: [new TextRun("")] }));
  });

  return entries;
}

function generateGreekEntries(greekData) {
  const entries = [];
  
  greekData.forEach((lexeme, index) => {
    // Lexeme heading
    entries.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun(`${index + 1}. ${lexeme.lexeme} (${lexeme.strongsNum})`)]
      })
    );

    // Root meaning
    entries.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Root Meaning: ", bold: true }),
          new TextRun(lexeme.rootMeaning)
        ]
      })
    );
    entries.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Thematic Range: ", bold: true }),
          new TextRun(lexeme.theme)
        ]
      })
    );

    if (lexeme.voice) {
      entries.push(
        new Paragraph({
          children: [
            new TextRun({ text: "Voice: ", bold: true }),
            new TextRun(lexeme.voice)
          ]
        })
      );
    }

    // Morphological analysis
    entries.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("Morphological Analysis")]
      })
    );

    entries.push(
      new Paragraph({
        children: [new TextRun({ text: "Occurrences in Analyzed Passages:", bold: true })]
      })
    );

    lexeme.occurrences.forEach(occ => {
      entries.push(
        new Paragraph({
          style: "BlockQuote",
          children: [
            new TextRun({ text: `${occ.ref}: `, bold: true }),
            new TextRun(occ.parsing)
          ]
        })
      );
      entries.push(generateMorphologyBreakdown(occ.parsing, "greek"));
    });

    // Greek-specific learner's notes
    const learnerNotes = generateGreekLearnerNotes(lexeme.lexeme, lexeme.occurrences);
    if (learnerNotes.length > 0) {
      entries.push(
        new Paragraph({
          children: [new TextRun({ text: "Learner's Notes:", bold: true, italics: true })]
        })
      );
      learnerNotes.forEach(note => {
        entries.push(
          new Paragraph({
            indent: { left: 360 },
            children: [
              new TextRun({ text: "• ", bold: true }),
              new TextRun(note)
            ]
          })
        );
      });
    }

    // Thematic analysis
    entries.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("Thematic Analysis")]
      })
    );
    entries.push(
      new Paragraph({
        children: [new TextRun(lexeme.thematicAnalysis)]
      })
    );

    // Spacing
    entries.push(new Paragraph({ children: [new TextRun("")] }));
  });

  return entries;
}

function generateMorphologyBreakdown(parsing, language) {
  if (language === "hebrew") {
    const parts = parsing.split(", ");
    let breakdown = [];
    
    parts.forEach(part => {
      const lowerPart = part.toLowerCase();
      if (lowerPart.includes("qal") || lowerPart.includes("piel") || 
          lowerPart.includes("hiphil") || lowerPart.includes("hithpolel") || 
          lowerPart.includes("hithpael")) {
        breakdown.push(`Stem: ${part}`);
      } else if (lowerPart.includes("participle")) {
        breakdown.push(`Type: Participle (describes characteristic state or ongoing action)`);
      } else if (lowerPart.includes("imperative")) {
        breakdown.push(`Type: Imperative (direct command)`);
      } else if (lowerPart.includes("perfect")) {
        breakdown.push(`Type: Perfect (completed action, often with continuing results)`);
      } else if (lowerPart.includes("imperfect")) {
        breakdown.push(`Type: Imperfect (incomplete/ongoing action, or sequential narrative)`);
      } else if (lowerPart.includes("infinitive")) {
        breakdown.push(`Type: Infinitive (verbal noun, expressing purpose or emphasis)`);
      } else if (lowerPart.includes("masculine") || lowerPart.includes("feminine") || lowerPart.includes("common")) {
        breakdown.push(`Gender: ${part}`);
      } else if (lowerPart.includes("singular") || lowerPart.includes("plural")) {
        breakdown.push(`Number: ${part}`);
      } else if (lowerPart.includes("1st") || lowerPart.includes("2nd") || lowerPart.includes("3rd")) {
        breakdown.push(`Person: ${part}`);
      } else if (lowerPart.includes("construct")) {
        breakdown.push(`State: Construct (indicates relationship/possession)`);
      }
    });
    
    return new Paragraph({
      indent: { left: 720 },
      spacing: { before: 60, after: 60 },
      children: [new TextRun({ text: "  → " + breakdown.join("; "), size: 22, italics: true })]
    });
  } else {
    // Greek
    const parts = parsing.split(", ");
    let breakdown = [];
    
    parts.forEach(part => {
      const lowerPart = part.toLowerCase();
      if (lowerPart.includes("present") || lowerPart.includes("aorist") || 
          lowerPart.includes("perfect") || lowerPart.includes("future") ||
          lowerPart.includes("imperfect") || lowerPart.includes("pluperfect")) {
        breakdown.push(`Tense: ${part}`);
      } else if (lowerPart.includes("active") || lowerPart.includes("middle") || 
                 lowerPart.includes("passive") || lowerPart.includes("deponent")) {
        breakdown.push(`Voice: ${part}`);
      } else if (lowerPart.includes("indicative") || lowerPart.includes("subjunctive") ||
                 lowerPart.includes("imperative") || lowerPart.includes("optative") ||
                 lowerPart.includes("infinitive") || lowerPart.includes("participle")) {
        breakdown.push(`Mood: ${part}`);
      } else if (lowerPart.includes("1st") || lowerPart.includes("2nd") || lowerPart.includes("3rd")) {
        breakdown.push(`Person: ${part}`);
      } else if (lowerPart.includes("singular") || lowerPart.includes("plural")) {
        breakdown.push(`Number: ${part}`);
      } else if (lowerPart.includes("masculine") || lowerPart.includes("feminine") || lowerPart.includes("neuter")) {
        breakdown.push(`Gender: ${part}`);
      } else if (lowerPart.includes("nominative") || lowerPart.includes("genitive") ||
                 lowerPart.includes("dative") || lowerPart.includes("accusative") ||
                 lowerPart.includes("vocative")) {
        breakdown.push(`Case: ${part}`);
      }
    });
    
    return new Paragraph({
      indent: { left: 720 },
      spacing: { before: 60, after: 60 },
      children: [new TextRun({ text: "  → " + breakdown.join("; "), size: 22, italics: true })]
    });
  }
}

function generateLearnerNotes(lexeme, occurrences) {
  const notes = [];
  const parsings = occurrences.map(o => o.parsing.toLowerCase()).join(" ");

  if (parsings.includes("sequential imperfect")) {
    notes.push("Sequential Imperfect (also called 'waw-consecutive' or 'wayyiqtol'): A Hebrew construction where a converted imperfect form (with waw prefix) expresses sequential narrative past action. Despite being morphologically imperfect, it functions as a past tense in storytelling or sequential description. This is why 'sequential' appears—the action follows in sequence from previous action.");
  }
  
  if (parsings.includes("infinitive absolute")) {
    notes.push("Infinitive Absolute: A Hebrew verbal form used for emphasis, often paired with a finite verb of the same root to create maximum intensification. 'Qāwāh qiwwîtî' = 'waiting I waited' = 'I waited intently/persistently.' This construction appears in Psalm 40:1, emphasizing David's sustained, emphatic waiting.");
  }

  if (parsings.includes("infinitive construct")) {
    notes.push("Infinitive Construct: A Hebrew verbal noun form that typically appears in construct state (bound form), often with prepositions. It can express purpose ('in order to wait'), time ('while waiting'), or manner ('by waiting'). Unlike the infinitive absolute, it's dependent on other words in the sentence.");
  }

  if (parsings.includes("cohortative")) {
    notes.push("Cohortative: A Hebrew verbal mood (first person) expressing desire, intention, or self-exhortation: 'Let me...', 'I will...', 'May I...'. In Psalm 52:9, 'I will wait' (cohortative) expresses David's determined intention to wait on God's name.");
  }

  if (parsings.includes("construct")) {
    notes.push("Construct State: A Hebrew grammatical form indicating that a noun or participle is in a bound relationship with what follows, showing possession, relationship, or specification. 'Those who wait upon the LORD' uses construct participle—the waiters are bound to/defined by their relationship to YHWH.");
  }

  if (parsings.includes("hithpolel")) {
    notes.push("Hithpolel: A rare Hebrew stem, an intensive reflexive form of the Hithpael. It emphasizes intensive, self-directed action. When ḥûl (writhe/twist) appears in the Hithpolel, it intensifies the reflexive nature: 'writhe yourself,' 'patiently endure for yourself.' This is the most emotionally intense waiting verb.");
  }

  if (lexeme.includes("dāmam")) {
    notes.push("Feminine Imperative: Hebrew imperatives match the gender of their addressee. In Psalm 62:5, David addresses his 'nephesh' (soul)—a grammatically feminine noun—thus requiring a feminine singular imperative form of dāmam.");
  }

  return notes;
}

function generateGreekLearnerNotes(lexeme, occurrences) {
  const notes = [];
  const parsings = occurrences.map(o => o.parsing.toLowerCase()).join(" ");

  if (parsings.includes("deponent")) {
    notes.push("Deponent: A Greek verb that is passive or middle in form but active in meaning. The speaker doesn't 'do' something to themselves (middle) or have something 'done' to them (passive)—they simply act, but the form looks middle/passive. All NT 'waiting' verbs (apekdechomai, prosdechomai, anamenō) are middle/passive deponent, meaning their middle/passive forms carry active meanings.");
  }

  if (parsings.includes("aorist")) {
    notes.push("Aorist Tense: A Greek tense that typically views action as a complete whole without regard to its internal makeup or duration. Often translated as simple past ('I waited') but in imperatives or other moods can express decisive, punctiliar action: 'do this decisively.' The aorist imperative in 1 Peter 1:13 ('hope') emphasizes a definitive commitment to hope.");
  }

  if (parsings.includes("present") && parsings.includes("participle")) {
    notes.push("Present Participle: A Greek verbal adjective expressing continuous or repeated action. When used substantivally ('the one who waits'), it describes a characteristic posture or habitual action, not a one-time event. Luke's use of present participles for Simeon, Anna, and Joseph shows waiting as their defining characteristic.");
  }

  if (lexeme.includes("apekdechomai")) {
    notes.push("Triple Compound: 'Apekdechomai' combines three elements: apo (from/away) + ek (out of) + dechomai (receive/welcome). This creates an intensified meaning of eagerly awaiting something to emerge from its source and arrive. The compound structure suggests heightened anticipation beyond simple waiting.");
  }

  if (parsings.includes("middle/passive")) {
    notes.push("Middle/Passive Voice: Greek distinguishes active voice (subject does action) from middle (subject acts for own benefit or interest) and passive (subject receives action). Middle/passive forms share morphology but differ in meaning. For deponent verbs, the middle/passive form functions actively while suggesting the subject's personal stake in the action.");
  }

  if (parsings.includes("genitive")) {
    notes.push("Genitive Case: A Greek case expressing relationship, often possession or source ('of...'). In Hebrews 10:36, 'of patient endurance' (genitive) indicates necessity—patient endurance is something believers have need of. Genitive often shows what kind of thing is needed or lacking.");
  }

  return notes;
}

function generateHebrewStemEndnotes() {
  return [
    new Paragraph({
      numbering: { reference: "endnote-list", level: 0 },
      children: [new TextRun({ text: "Hebrew Verb Stems (Binyanim): ", bold: true })]
    }),
    new Paragraph({
      indent: { left: 1080 },
      spacing: { after: 120 },
      children: [new TextRun({
        text: "The Hebrew verbal system uses seven major stems (binyanim) that modify the basic meaning of the three-consonant root. These aren't simply tense or aspect markers (Hebrew has separate conjugations for that) but rather semantic modifications of the root idea. Think of them as different 'ways' a root can express action."
      })]
    }),
    new Paragraph({
      indent: { left: 1080 },
      spacing: { after: 120 },
      children: [
        new TextRun({ text: "Qal (Simple Active): ", bold: true }),
        new TextRun("The basic, simple, active form of the verb. If the root means 'wait,' Qal means 'to wait' in its simplest sense—no intensification, no causation, no reflexivity. It's the 'default' stem. Examples: qāwāh (wait), shāmar (guard), 'āmar (say).")
      ]
    }),
    new Paragraph({
      indent: { left: 1080 },
      spacing: { after: 120 },
      children: [
        new TextRun({ text: "Piel (Intensive/Resultative): ", bold: true }),
        new TextRun("Often intensifies the Qal meaning or adds a causative/resultative nuance. For stative roots (describing states), Piel can make them active/causative. For qāwāh, Piel intensifies: 'to wait intently,' 'to wait persistently.' The Piel of dābar (speak) becomes 'speak repeatedly' or 'tell thoroughly.' Piel often doubles the middle root consonant (though this isn't visible in transliteration).")
      ]
    }),
    new Paragraph({
      indent: { left: 1080 },
      spacing: { after: 120 },
      children: [
        new TextRun({ text: "Hiphil (Causative): ", bold: true }),
        new TextRun("Makes the subject cause someone/something else to perform the action. If Qal means 'to rule,' Hiphil means 'to cause to rule' = 'to make king.' For yāḥal (hope), the Hiphil in Micah 7:7 creates a causative-reflexive sense: 'I will cause myself to hope' = 'I will determinedly/actively hope.' Hiphil is formed with a prefixed הִ (hi-).")
      ]
    }),
    new Paragraph({
      indent: { left: 1080 },
      spacing: { after: 120 },
      children: [
        new TextRun({ text: "Hithpael (Reflexive/Reciprocal): ", bold: true }),
        new TextRun("Indicates reflexive action (subject acts upon self) or reciprocal action (subjects act upon each other). The verb qādash (be holy) becomes hitqaddēsh (sanctify oneself, make oneself holy). Hithpael is formed with הִתְ (hit-) prefix.")
      ]
    }),
    new Paragraph({
      indent: { left: 1080 },
      spacing: { after: 120 },
      children: [
        new TextRun({ text: "Hithpolel: ", bold: true }),
        new TextRun("A rare, intensive form of Hithpael, appearing primarily with geminate roots (roots where two consonants are the same, like ḥûl: ח-ו-ל). The Hithpolel of ḥûl (writhe/twist) in Psalm 37:7 creates maximum reflexive intensity: 'writhe yourself for Him' = 'wait patiently with intense internal struggle.'")
      ]
    }),
    new Paragraph({
      indent: { left: 1080 },
      children: [new TextRun({
        text: "The other stems (Niphal, Pual, Hophal) don't appear in our 'waiting' vocabulary but complete the system: Niphal (passive/reflexive of Qal), Pual (passive of Piel), Hophal (passive of Hiphil). Understanding stems reveals that Hebrew doesn't just have different words for waiting—it has different ways of experiencing, performing, and commanding the act of waiting, encoded in the verbal morphology itself."
      })]
    })
  ];
}

// Generate and save document
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("/home/claude/waiting-on-the-lord/waiting_on_the_lord_analysis.docx", buffer);
  console.log("Document generated successfully!");
}).catch(error => {
  console.error("Error generating document:", error);
  process.exit(1);
});
