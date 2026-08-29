// ---------- state ----------
const state = { mood: null, time: null };

const screens = {
  mood: document.getElementById("screen-mood"),
  time: document.getElementById("screen-time"),
  result: document.getElementById("screen-result"),
};
const dots = document.querySelectorAll(".dot");

function showScreen(name, stepIndex){
  Object.values(screens).forEach(s => s.classList.remove("active"));
  screens[name].classList.add("active");
  dots.forEach(d => d.classList.toggle("active", Number(d.dataset.step) === stepIndex));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ---------------------------------------------------------------------
// The to-do list "bank". Each mood/time combination gets its own
// themed reset — not chores, just a handful of small unexpected things.
// This used to live on a Python backend; it now lives right here so
// the whole app runs from static files with no server required.
// ---------------------------------------------------------------------
const TASK_BANK = {
  good: {
    whole: {
      eyebrow: "feeling good · whole day free",
      title: "operation: sunshine amplifier ☀️",
      note: "you're already glowing — let's turn today into the one you'll talk about in December.",
      tasks: [
        { text: "Text one person “thinking of you” — no reason needed",
          note: "it always lands better than you think" },
        { text: "Make birthday cards for the upcoming birthdays of your friends",
          note: "they'll remember it forever" },
        { text: "Go somewhere you've been “meaning to go” for months, like a cafe",
          note: "today's the day it stops being a someday" },
        { text: "Write down 3 things about today you don't want to forget in your diary",
          note: "future-you will thank present-you" },
      ],
    },
    limited: {
      eyebrow: "feeling good · a little time",
      title: "golden hour spark ✨",
      note: "you don't need hours to make today count — just one good five minutes.",
      tasks: [
        { text: "Step outside and just breathe for 3 minutes",
          note: "no phone, just sky" },
        { text: "Send a voice note instead of a text",
          note: "your voice carries more than the words do" },
        { text: "Put on the one song that always makes you dance",
          note: "yes, right now" },
        { text: "Compliment a stranger",
          note: "costs you nothing, might be their whole week" },
      ],
    },
  },
  bad: {
    whole: {
      eyebrow: "feeling low · whole day free",
      title: "the full reset 🌙",
      note: "no to-do list today — just permission to actually rest.",
      tasks: [
        { text: "Put your phone in another room for one hour",
          note: "the world will wait" },
        { text: "Take the longest shower or bath you can justify",
          note: "let the water do some of the feeling for you" },
        { text: "Cook (or order) the most comforting meal you can think of",
          note: "no judgment, just comfort" },
        { text: "Watch or read something that has nothing to do with today",
          note: "let your brain go somewhere else for a while" },
        { text: "Write down what's actually bothering you, then close the notebook",
          note: "you don't have to solve it, just name it" },
      ],
    },
    limited: {
      eyebrow: "feeling low · a little time",
      title: "the five-minute rescue 🧊",
      note: "small, unexpected things can shift a heavy day faster than a plan can.",
      tasks: [
        { text: "Splash cold water on your face",
          note: "an old trick, still works" },
        { text: "Text someone “today's been a lot” — nothing else",
          note: "you don't owe anyone the full story" },
        { text: "Step outside for one minute, no shoes required",
          note: "ground yourself, literally" },
        { text: "Make the smallest possible version of your favorite drink",
          note: "tiny comfort still counts" },
      ],
    },
  },
};

// ---------- picture buttons: upload from desktop ----------
["good", "bad"].forEach(mood => {
  const input = document.getElementById(`upload-${mood}`);
  const card = document.getElementById(`card-${mood}`);
  const chooseBtn = card.querySelector(".choose-btn");

  input.addEventListener("change", () => {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
      card.querySelector(".pic-button").style.backgroundImage = `url(${e.target.result})`;
      card.classList.add("has-image");
      chooseBtn.disabled = false;
    };
    reader.readAsDataURL(file);
  });

  chooseBtn.addEventListener("click", () => {
    state.mood = mood;
    showScreen("time", 1);
  });
});

// ---------- time screen ----------
document.querySelectorAll(".time-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    state.time = btn.dataset.time;
    loadTasks();
    showScreen("result", 2);
  });
});

document.getElementById("back-to-mood").addEventListener("click", () => {
  showScreen("mood", 0);
});

// ---------- build the result screen straight from TASK_BANK ----------
function loadTasks(){
  const listEl = document.getElementById("task-list");
  const data = TASK_BANK[state.mood]?.[state.time];

  if (!data) {
    listEl.innerHTML = `<li><span class="task-text">hmm, couldn't find a plan for that combo</span><span class="task-note">try going back and picking again</span></li>`;
    return;
  }

  document.getElementById("result-eyebrow").textContent = data.eyebrow;
  document.getElementById("result-title").textContent = data.title;
  document.getElementById("result-note").textContent = data.note;

  listEl.innerHTML = "";
  data.tasks.forEach(task => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span class="task-text"></span>
      <span class="task-note"></span>
    `;
    // set as text (not innerHTML) so nothing in the task data is ever
    // parsed as markup — keeps this safe even if text is edited later
    li.querySelector(".task-text").textContent = task.text;
    li.querySelector(".task-note").textContent = task.note;
    listEl.appendChild(li);
  });
}

// ---------- restart ----------
document.getElementById("restart").addEventListener("click", () => {
  state.mood = null;
  state.time = null;

  ["good", "bad"].forEach(mood => {
    document.getElementById(`upload-${mood}`).value = "";
  });

  showScreen("mood", 0);
});
