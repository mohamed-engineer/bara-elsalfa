let players = [];
let outOfTopicPlayer = "";
let currentPlayerIndex = -1;
let currentPhase = 0; // 0: إعطاء الهاتف، 1: معرفة الحالة (داخل/برا السالفة)
let selectedTopic = "";
let allPlayersNotified = false; // تحديد إذا انتهت فقرة إخبار اللاعبين

// قائمة المواضيع
const Elsalfa_topics = {
  "الطعام": ["كشري", "فول", "فلافل", "كبده", "فته","بطاطس", "لحمه", "فراخ", "بيض", "برجر"],
  "الملابس": ["تيشيرت", "جزمه", "شراب", "بنطلون", "شورت"],
  "الحيوانات": ["باندا", "الكسلان", "نسر", "فار", "اسد", "نمر", "غزال", "السيسي", "فهد", "ثعبان"],
  "لغات برمجة":["Java", "Python", "JavaScript", "C#", "C++", "Roby", "PHP"],
  "كرة قدم": ["ميسي", "رونالدو", "نيمار", "صلاح", "هازارد", "مبابي", "فان دايك", "دي بروين"]
};


// الخطوة 1: الانتقال إلى اختيار عدد اللاعبين
function goToPlayerCount() {
  selectedTopic = document.getElementById("topic").value;
  if (!Elsalfa_topics[selectedTopic]) {
    alert("يرجى اختيار موضوع صحيح!");
    return;
  }
  document.getElementById("topicSelection").classList.add("hidden");
  document.getElementById("step1").classList.remove("hidden");
}

// الخطوة 2: إنشاء حقول إدخال الأسماء بناءً على العدد
function generateNameInputs() {
  const playerCount = parseInt(document.getElementById("playerCount").value);

  if (isNaN(playerCount) || playerCount < 2) {
    alert("يجب إدخال عدد لاعبين صحيح (2 على الأقل)!");
    return;
  }

  document.getElementById("step1").classList.add("hidden");
  document.getElementById("step2").classList.remove("hidden");

  const nameInputsDiv = document.getElementById("nameInputs");
  nameInputsDiv.innerHTML = "";

  for (let i = 1; i <= playerCount; i++) {
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = `اسم اللاعب ${i}`;
    input.id = `player${i}`;
    input.required = true;
    nameInputsDiv.appendChild(input);
    nameInputsDiv.appendChild(document.createElement("br"));
  }
}

// الخطوة 3: بدء اللعبة
function startGame() {
  players = [];
  const nameInputsDiv = document.getElementById("nameInputs");
  const inputs = nameInputsDiv.querySelectorAll("input");

  inputs.forEach((input) => {
    const name = input.value.trim();
    if (name) {
      players.push(name);
    }
  });

  if (players.length < 2) {
    alert("يجب إدخال أسماء لجميع اللاعبين!");
    return;
  }

  outOfTopicPlayer = players[Math.floor(Math.random() * players.length)];

  document.getElementById("step2").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");

  currentPlayerIndex = -1;
  currentPhase = 0;
  allPlayersNotified = false; // إعادة تعيين الحالة
  nextStep();
}

// الخطوة 4: التقدم في اللعبة
// الخطوة 4: التقدم في اللعبة
let selectedSalfa = ""; // متغير لتخزين السالفة المختارة

// الخطوة 4: التقدم في اللعبة
function nextStep() {
  const resultDiv = document.getElementById("result");

  if (!allPlayersNotified) {
    if (currentPhase === 0) {
      currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
      const currentPlayer = players[currentPlayerIndex];
      resultDiv.innerHTML = `<h2>أعطِ الهاتف إلى <strong>${currentPlayer}</strong></h2>`;
      currentPhase = 1;
    } else {
      const currentPlayer = players[currentPlayerIndex];
      
      // اختيار السالفة مرة واحدة فقط في بداية المرحلة
      if (selectedSalfa === "") {
        // توليد قيمة عشوائية من الموضوع المختار
        const topicItems = Elsalfa_topics[selectedTopic]; // جلب العناصر المرتبطة بالموضوع
        selectedSalfa = topicItems[Math.floor(Math.random() * topicItems.length)];
      }
      
      if (currentPlayer === outOfTopicPlayer) {
        resultDiv.innerHTML = `<p><strong>${currentPlayer}</strong> أنت برا السالفة!</p>`;
      } else {
        resultDiv.innerHTML = `<p><strong>${currentPlayer}</strong> أنت داخل السالفة و السالفه هي: ${selectedSalfa}!</p>`;
      }

      // إذا وصلنا لآخر لاعب، نعلن أن جميع اللاعبين تم إخبارهم
      if (currentPlayerIndex === players.length - 1) {
        allPlayersNotified = true; // الانتهاء من إخبار جميع اللاعبين
      }
      currentPhase = 0;
    }
  } else {
    startQuestions(); // الانتقال إلى فقرة الأسئلة
  }
}




// الانتقال إلى فقرة الأسئلة
function startQuestions() {
  document.getElementById("game").classList.add("hidden");
  document.getElementById("questions").classList.remove("hidden");

  questionAskedPlayers = [];
  askQuestion();
}

// اختيار عشوائي لأي لاعب
function getRandomPlayer(exclude = []) {
  const availablePlayers = players.filter(player => !exclude.includes(player));
  const randomIndex = Math.floor(Math.random() * availablePlayers.length);
  return availablePlayers[randomIndex];
}

let questionAskedPlayers = []; // مصفوفة لتخزين اللاعبين الذين سألوا أسئلتهم

// تنفيذ السؤال
let currentRound = 0; // عداد الجولات
const totalRounds = 3; // عدد الجولات الكلي

function askQuestion() {
  if (currentRound >= totalRounds) {
    // عند انتهاء جميع الجولات، ابدأ فقرة التصويت
    document.getElementById("questions").classList.add("hidden");
    startVoting();
    return;
  }

  // إذا تم سؤال الجميع في الجولة الحالية، ابدأ جولة جديدة
  if (questionAskedPlayers.length === players.length) {
    questionAskedPlayers = []; // إعادة تعيين اللاعبين الذين سألوا
    currentRound++;
    if (currentRound >= totalRounds) {
      // عند انتهاء جميع الجولات، ابدأ فقرة التصويت
      document.getElementById("questions").classList.add("hidden");
      startVoting();
      return;
    }
  }

  // اختيار لاعب يسأل لم يطرح سؤاله بعد
  const currentAsker = getRandomPlayer(questionAskedPlayers); 
  questionAskedPlayers.push(currentAsker); // إضافة اللاعب إلى القائمة
  const currentAnswerer = getRandomPlayer([currentAsker]); // اختيار لاعب للإجابة

  document.getElementById("questionPrompt").innerHTML =
    `اللاعب <strong>${currentAsker}</strong> يسأل <strong>${currentAnswerer}</strong>`;
}

  


// تصويت مين بره السالفه
let currentVoterIndex = 0; // مؤشر اللاعب الحالي الذي يصوت
let votes = {}; // كائن لتخزين الأصوات

function startVoting() {
    // تهيئة الأصوات لجميع اللاعبين
    votes = {};
    players.forEach(player => {
      votes[player] = 0;
    });
  
    currentVoterIndex = 0;
    document.getElementById("game").classList.add("hidden");
    document.getElementById("voting").classList.remove("hidden");
  
    showVotingPage();
  }

  function showVotingPage() {
    const voter = players[currentVoterIndex];
    const votingDiv = document.getElementById("votingPrompt");
  
    let options = "";
    players.forEach(player => {
      if (player !== voter) { // لا يمكن التصويت لنفسه
        options += `<button onclick="castVote('${player}')">${player}</button><br>`;
      }
    });
  
    votingDiv.innerHTML = `<h2>${voter}، اختر من تشك أنه برا السالفة:</h2>${options}`;
  }

//إنشاء وظيفة لتسجيل التصويت
  function castVote(votedPlayer) {
    votes[votedPlayer] += 1;
    currentVoterIndex++;
  
    if (currentVoterIndex >= players.length) {
      // انتهاء التصويت
      endVoting();
    } else {
      // عرض صفحة التصويت للاعب التالي
      showVotingPage();
    }
  }
  

  function endVoting() {
    document.getElementById("voting").classList.add("hidden");
  
    // تحديد اللاعب الذي حصل على أكبر عدد من الأصوات
    const mostVotedPlayer = Object.keys(votes).reduce((a, b) => votes[a] > votes[b] ? a : b);
  
    document.getElementById("result").innerHTML = `
      <h2>انتهت اللعبة!</h2>
      <p>اللاعب الذي حصل على أكبر عدد من الأصوات: <strong>${mostVotedPlayer}</strong></p>
      <p>اللاعب الحقيقي الذي كان برا السالفة هو: <strong>${outOfTopicPlayer}</strong></p>
    `;
  
    document.getElementById("game").classList.remove("hidden");
  }
  