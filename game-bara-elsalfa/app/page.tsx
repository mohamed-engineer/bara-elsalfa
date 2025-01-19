'use client'; // إضافة هذا السطر لجعل المكون يعمل في العميل

import { useState } from "react";

// تعريف نوع للاعب
interface Player {
  id: number;
  name: string;
  isImposter: boolean;
}

const questions: string[] = [
  "ما لون السماء؟",
  "ما هو لون التفاح؟",
  "كم عدد القارات؟"
];

export default function Home() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [imposter, setImposter] = useState<number | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [voteSectionVisible, setVoteSectionVisible] = useState<boolean>(false);

  const numPlayers = players.length;

  const startGame = (numPlayers: number) => {
    let playerList: Player[] = [];
    for (let i = 0; i < numPlayers; i++) {
      playerList.push({ id: i, name: `لاعب ${i + 1}`, isImposter: false });
    }

    const imposterIndex = Math.floor(Math.random() * numPlayers);
    playerList[imposterIndex].isImposter = true;

    setPlayers(playerList);
    setImposter(imposterIndex);
    setIsGameStarted(true);
    setCurrentQuestionIndex(0);
    setVoteSectionVisible(false);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setVoteSectionVisible(true);
    }
  };

  const vote = (selectedPlayerId: number) => {
    const selectedPlayer = players.find(player => player.id === selectedPlayerId);
    if (selectedPlayer) {
      alert(`${selectedPlayer.name} تم التصويت عليه كـ "بره السالفه"`);
      // هنا يمكن إضافة منطق لمعرفة إذا تم اكتشاف "بره السالفه" أو لا
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>لعبة بره السالفه</h1>

      {!isGameStarted && (
        <div>
          <label htmlFor="num-players">عدد اللاعبين:</label>
          <input
            type="number"
            id="num-players"
            min="3"
            max="10"
            onChange={(e) => {
              const num = parseInt(e.target.value);
              setPlayers(Array(num).fill({} as Player));
            }}
          />
          <button onClick={() => startGame(players.length)}>ابدأ اللعبة</button>
        </div>
      )}

      {isGameStarted && (
        <div>
          <h2>الأسئلة</h2>
          <p>{questions[currentQuestionIndex]}</p>
          <button onClick={nextQuestion}>السؤال التالي</button>
        </div>
      )}

      {voteSectionVisible && (
        <div>
          <h2>من برأيك بره السالفه؟</h2>
          {players.map((player) => (
            <div key={player.id}>
              <input
                type="radio"
                id={`vote-${player.id}`}
                name="vote"
                onClick={() => vote(player.id)}
              />
              <label htmlFor={`vote-${player.id}`}>{player.name}</label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
