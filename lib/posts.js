/**
 * Blog / resources content.
 *
 * Each post's `body` is a list of blocks:
 *   { type: "p", text }                 paragraph
 *   { type: "h2", text }                section heading (also listed in the table of contents)
 *   { type: "list", items: [] }         bullet list
 *   { type: "steps", items: [{ title, text }] }   numbered steps
 *   { type: "tip", title, text }        highlighted callout
 *   { type: "quote", text }             pull quote
 */

export const CATEGORIES = ["Pain Relief", "Recovery", "Exercise", "Wellness"];

export const POSTS = [
  {
    slug: "desk-habits-lower-back-pain",
    title: "5 desk habits that quietly cause lower back pain",
    excerpt:
      "Long hours at a desk load your spine in ways you rarely notice. Here are the five everyday habits we see most often, and the simple swaps that ease the strain.",
    category: "Pain Relief",
    date: "2026-11-04",
    readMin: 6,
    img: "/images/hero/hero.jpg",
    pos: "object-[center_62%]",
    featured: true,
    body: [
      { type: "p", text: "Most of the lower back pain we treat in T. Nagar doesn't start with a dramatic injury. It builds slowly, one long workday at a time. The good news: because it's built from habits, it can usually be eased by changing them." },
      { type: "h2", text: "1. Sitting for hours without a break" },
      { type: "p", text: "Your spinal discs rely on movement to stay nourished. Staying in one position for two or three hours compresses the same structures again and again. The fix isn't a perfect chair. It's movement." },
      { type: "tip", title: "Try the 30/3 rule", text: "Every 30 minutes, stand up and move for about 3 minutes: walk to refill water, take a call standing, or do a few gentle back extensions." },
      { type: "h2", text: "2. A screen that's too low" },
      { type: "p", text: "When your monitor or laptop sits low, your head drifts forward and your upper back rounds. Your lower back then compensates. Raise the screen so the top third sits at eye level; a stack of books under a laptop with a separate keyboard works well." },
      { type: "h2", text: "3. Perching on the edge of the seat" },
      { type: "p", text: "Sitting forward without using the backrest leaves your back muscles working all day. Sit back fully, keep your feet flat on the floor, and let the chair support you. A small rolled towel behind the lower back can help." },
      { type: "h2", text: "4. Crossing the same leg every time" },
      { type: "p", text: "Habitually crossing one leg tilts the pelvis to one side. Over months this can leave one side of your lower back stiff and overworked. Alternate sides, or better, keep both feet grounded." },
      { type: "h2", text: "5. Skipping movement after work" },
      { type: "p", text: "A tired back often feels like it needs rest, but gentle movement usually helps more. A 15-minute walk after work, a few hip-flexor stretches and some core activation can undo much of the day's stiffness." },
      { type: "list", items: ["Walk 15–20 minutes after work", "Hip-flexor stretch: 30 seconds each side", "Cat–cow: 10 slow repetitions", "Glute bridges: 2 sets of 12"] },
      { type: "h2", text: "When to get it checked" },
      { type: "p", text: "If your pain lasts more than two weeks, wakes you at night, spreads down a leg, or comes with numbness or weakness, book an assessment. A physiotherapist can find the real driver and build a plan around your work routine." },
    ],
  },
  {
    slug: "acl-rehab-first-12-weeks",
    title: "ACL rehab: what the first 12 weeks really look like",
    excerpt:
      "From the first wobbly steps to confident single-leg work, here's an honest, phase-by-phase look at early ACL rehabilitation and why patience pays off.",
    category: "Recovery",
    date: "2026-10-21",
    readMin: 8,
    img: "/images/blogs/pain-relief.webp",
    pos: "object-[center_40%]",
    body: [
      { type: "p", text: "An ACL reconstruction is only the start. The surgery replaces the ligament; rehab rebuilds the strength, control and confidence that keep the new graft safe. Every recovery is different, but the early weeks usually follow a similar path." },
      { type: "h2", text: "Weeks 0–2: calm the knee" },
      { type: "p", text: "The priorities are reducing swelling, getting the knee fully straight and waking up the quadriceps. Expect ice, elevation, gentle range-of-motion work and lots of quad sets." },
      { type: "tip", title: "Full extension first", text: "Getting the knee completely straight early matters more than how far it bends. Lost extension is much harder to win back later." },
      { type: "h2", text: "Weeks 2–6: walk well again" },
      { type: "p", text: "As swelling settles, the focus moves to a normal walking pattern without crutches, bending past 90 degrees and building basic strength with closed-chain exercises like mini squats and step-ups." },
      { type: "steps", items: [
        { title: "Normal gait", text: "Walking without a limp, heel to toe, at a steady pace." },
        { title: "Range of motion", text: "Working toward full bend, comfortably." },
        { title: "Balance", text: "Single-leg standing, first on stable ground, then on cushions." },
      ] },
      { type: "h2", text: "Weeks 6–12: build real strength" },
      { type: "p", text: "This is where the work gets harder: progressive leg press, split squats, hamstring strengthening and controlled single-leg drills. Your physio will track strength between legs to guide progression." },
      { type: "quote", text: "The knee often feels ready before it is. Strength testing, not the calendar, should decide when you progress." },
      { type: "h2", text: "What comes next" },
      { type: "p", text: "Running, jumping and sport-specific drills usually come later, once strength and control targets are met. Returning to sport typically takes nine months or more. Rushing it is the biggest risk for re-injury." },
    ],
  },
  {
    slug: "cupping-therapy-explained",
    title: "Cupping therapy, explained: what it does and what it doesn't",
    excerpt:
      "Those circular marks get plenty of attention. We break down how cupping works, who it can help, and how we use it alongside hands-on physiotherapy.",
    category: "Wellness",
    date: "2026-10-08",
    readMin: 5,
    img: "/images/blogs/cupping.webp",
    pos: "object-[center_35%]",
    body: [
      { type: "p", text: "Cupping uses suction to lift the skin and underlying tissue. Many people find it eases muscle tightness and helps them feel looser after training or long periods of stress." },
      { type: "h2", text: "How it works" },
      { type: "p", text: "Cups are placed on the skin and suction is created, either with a pump or with heat. The lift may increase local blood flow and change how tight tissue feels. Cups can stay still or be glided across oiled skin." },
      { type: "h2", text: "What about the marks?" },
      { type: "p", text: "The round marks are not bruises from impact. They come from blood drawn toward the surface and usually fade within a few days to a week. They're rarely painful." },
      { type: "h2", text: "Who it may help" },
      { type: "list", items: ["Tight shoulders and upper back from desk work", "Post-workout muscle soreness", "Stiffness that hasn't responded to stretching alone", "As part of a wider treatment plan, not a stand-alone cure"] },
      { type: "tip", title: "Our approach", text: "At Physiofit we use cupping as one tool within a physiotherapy plan, combined with exercise and manual therapy, so the benefits last beyond the session." },
      { type: "h2", text: "When to avoid it" },
      { type: "p", text: "Cupping isn't suitable over broken or irritated skin, for people on blood thinners, or during some medical conditions and pregnancy. We always screen you first and will tell you honestly if it isn't right for you." },
    ],
  },
  {
    slug: "10-minute-joint-friendly-warm-up",
    title: "A 10-minute warm-up that protects your joints",
    excerpt:
      "Skip the static stretching before training. This quick, physio-designed sequence raises your temperature, wakes up key muscles and prepares every major joint.",
    category: "Exercise",
    date: "2026-09-26",
    readMin: 4,
    img: "/images/blogs/warmup.jpg",
    pos: "object-[center_30%]",
    body: [
      { type: "p", text: "A good warm-up should leave you a little warmer, a little looser and ready to move. It doesn't need to take long. Follow this sequence before running, gym work or sport." },
      { type: "h2", text: "The sequence" },
      { type: "steps", items: [
        { title: "Easy cardio · 2 min", text: "Brisk walk, light jog or skipping to raise your heart rate." },
        { title: "Leg swings · 1 min", text: "Front-to-back and side-to-side, holding a wall for balance." },
        { title: "World's greatest stretch · 2 min", text: "Lunge, elbow to instep, rotate open. Alternate sides slowly." },
        { title: "Glute bridges · 1 min", text: "Squeeze at the top for two seconds each rep." },
        { title: "Arm circles & band pull-aparts · 2 min", text: "Prepare shoulders, especially before upper-body work." },
        { title: "Build-ups · 2 min", text: "A few progressively faster reps of your main activity." },
      ] },
      { type: "tip", title: "Save long stretches for later", text: "Long static holds are better after training or as a separate session. Before exercise, keep stretches moving." },
      { type: "h2", text: "Make it yours" },
      { type: "p", text: "If a particular joint tends to complain, such as knees on runs or shoulders on bench days, spend an extra minute warming it up. Our team can build a personalised routine around past injuries." },
    ],
  },
  {
    slug: "foot-care-matters",
    title: "Why foot care matters more than you think",
    excerpt:
      "Your feet carry you thousands of steps a day. Simple, regular care keeps skin healthy, supports circulation and can prevent small issues from becoming painful ones.",
    category: "Wellness",
    date: "2026-09-12",
    readMin: 5,
    img: "/images/blogs/footspa.avif",
    body: [
      { type: "p", text: "Feet are easy to ignore until they hurt. Yet they absorb the impact of every step, and small problems like dry skin, tight calves or poor footwear add up over time." },
      { type: "h2", text: "Everyday foot care" },
      { type: "list", items: ["Wash and dry thoroughly, especially between the toes", "Moisturise heels, but not between the toes", "Trim nails straight across", "Rotate shoes and replace worn-out pairs", "Check your feet regularly for cracks, blisters or colour changes"] },
      { type: "h2", text: "Movement for happier feet" },
      { type: "p", text: "Calf raises, toe spreading and rolling the sole over a ball all help keep the small muscles of the foot strong and the tissues supple." },
      { type: "tip", title: "If you have diabetes", text: "Check your feet every day and see a professional promptly about any cut, blister or numbness. Early care prevents complications." },
      { type: "h2", text: "Why a restorative foot spa helps" },
      { type: "p", text: "A therapeutic foot spa combines warm soaks, gentle exfoliation and massage. It relaxes tired feet, supports circulation and is a calming way to finish a treatment session." },
    ],
  },
  {
    slug: "posture-myths",
    title: "Posture myths physios wish you'd stop believing",
    excerpt:
      "Is there really one 'correct' posture? We unpack common beliefs about sitting, standing and slouching, and what the evidence actually suggests.",
    category: "Pain Relief",
    date: "2026-08-30",
    readMin: 6,
    img: "/images/services/studio-rehab.jpg",
    body: [
      { type: "p", text: "Few topics come with as much guilt as posture. The reassuring truth is that your body is more adaptable than the warnings suggest." },
      { type: "h2", text: "Myth: there is one perfect posture" },
      { type: "p", text: "Comfortable postures vary from person to person. The best posture is usually your next one: changing position regularly matters more than holding any single 'ideal' shape." },
      { type: "h2", text: "Myth: slouching will damage your spine" },
      { type: "p", text: "Slouching for a while isn't dangerous. Problems tend to come from staying in any one position for too long, and from low overall activity, rather than from the slouch itself." },
      { type: "quote", text: "Motion is lotion. Variety beats perfection." },
      { type: "h2", text: "Myth: pain always means damage" },
      { type: "p", text: "Pain is real, but it isn't a direct measure of harm. Stress, sleep, activity levels and past experiences all influence how much something hurts. That's why treatment looks at the whole person." },
      { type: "h2", text: "What actually helps" },
      { type: "list", items: ["Move often throughout the day", "Build strength in your back, hips and core", "Set up your workspace for comfort, then stop worrying about it", "Get assessed if pain persists"] },
    ],
  },
];

export const getPost = (slug) => POSTS.find((p) => p.slug === slug);

export const formatDate = (iso) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

/** Turn a heading into an anchor id for the table of contents. */
export const slugify = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
