// Version: 1.05
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Settings, Play, RefreshCw, Trophy, Volume2, ArrowLeft } from 'lucide-react';


// --- 辞書データと設定 ---
const WORD_DICT = {
  hiragana: {
    'あ': 'あり', 'い': 'いぬ', 'う': 'うさぎ', 'え': 'えんぴつ', 'お': 'おにぎり',
    'か': 'かえる', 'き': 'きつね', 'く': 'くま', 'け': 'けむし', 'こ': 'こま',
    'さ': 'さる', 'し': 'しまうま', 'す': 'すいか', 'せ': 'せみ', 'そ': 'そら',
    'た': 'たぬき', 'ち': 'ちょうちょ', 'つ': 'つくえ', 'て': 'てぶくろ', 'と': 'とけい',
    'な': 'なす', 'に': 'にわとり', 'ぬ': 'ぬいぐるみ', 'ね': 'ねこ', 'の': 'のこぎり',
    'は': 'はさみ', 'ひ': 'ひこうき', 'ふ': 'ふうせん', 'へ': 'へりこぷたー', 'ほ': 'ほうき',
    'ま': 'まど', 'み': 'みかん', 'む': 'むし', 'め': 'めがね', 'も': 'もも',
    'や': 'やま', 'ゆ': 'ゆき', 'よ': 'よっと',
    'ら': 'らっぱ', 'り': 'りんご', 'る': 'るすばん', 'れ': 'れもん', 'ろ': 'ろうそく',
    'わ': 'わに'
  },
  katakana: {
    'ア': 'アイス', 'イ': 'イルカ', 'ウ': 'ウクレレ', 'エ': 'エプロン', 'オ': 'オムライス',
    'カ': 'カメラ', 'キ': 'キウイ', 'ク': 'クッキー', 'ケ': 'ケーキ', 'コ': 'コアラ',
    'サ': 'サンタ', 'シ': 'シャツ', 'ス': 'スプーン', 'セ': 'セーター', 'ソ': 'ソファ',
    'タ': 'タオル', 'チ': 'チーズ', 'ツ': 'ツリー', 'テ': 'テレビ', 'ト': 'トマト',
    'ナ': 'ナイフ', 'ニ': 'ニュース', 'ヌ': 'ヌンチャク', 'ネ': 'ネクタイ', 'ノ': 'ノート',
    'ハ': 'ハンバーグ', 'ヒ': 'ヒーター', 'フ': 'フォーク', 'ヘ': 'ヘルメット', 'ホ': 'ボタン',
    'マ': 'マスク', 'ミ': 'ミルク', 'ム': 'ムース', 'メ': 'メロン', 'モ': 'モーター',
    'ヤ': 'ヤッケ', 'ユ': 'ユニフォーム', 'ヨ': 'ヨーヨー',
    'ラ': 'ライオン', 'リ': 'リボン', 'ル': 'ルーレット', 'レ': 'レタス', 'ロ': 'ロボット',
    'ワ': 'ワイン'
  },
  alphabet: {
    'A': ['Apple', 'Ant', 'Arrow'],
    'B': ['Bear', 'Ball', 'Book'],
    'C': ['Cat', 'Car', 'Camera'],
    'D': ['Dog', 'Duck', 'Door'],
    'E': ['Elephant', 'Egg', 'Eye'],
    'F': ['Fox', 'Fish', 'Fire'],
    'G': ['Gorilla', 'Goat', 'Grape'],
    'H': ['Hat', 'House', 'Horse'],
    'I': ['Ice', 'Igloo', 'Iron'],
    'J': ['Juice', 'Jet', 'Jam'],
    'K': ['Koala', 'Kite', 'Key'],
    'L': ['Lion', 'Lemon', 'Leaf'],
    'M': ['Monkey', 'Mouse', 'Moon'],
    'N': ['Nuts', 'Net', 'Nail'],
    'O': ['Orange', 'Owl', 'Ocean'],
    'P': ['Pig', 'Penguin', 'Piano'],
    'Q': ['Queen', 'Quilt', 'Quiet'],
    'R': ['Rabbit', 'Rocket', 'Ring'],
    'S': ['Sun', 'Snake', 'Star'],
    'T': ['Tiger', 'Tree', 'Train'],
    'U': ['Umbrella', 'Unicorn', 'Up'],
    'V': ['Violin', 'Van', 'Vest'],
    'W': ['Water', 'Wolf', 'Window'],
    'X': ['X-ray', 'Xylophone', 'Xenon'],
    'Y': ['Yacht', 'Yellow', 'Yarn'],
    'Z': ['Zebra', 'Zero', 'Zoo']
  },
  color: [
    { id: 'c_red', char: 'red', displayClass: 'bg-red-500', speechJa: 'あか', speechEn: 'Red' },
    { id: 'c_blue', char: 'blue', displayClass: 'bg-blue-500', speechJa: 'あお', speechEn: 'Blue' },
    { id: 'c_yellow', char: 'yellow', displayClass: 'bg-yellow-400', speechJa: 'きいろ', speechEn: 'Yellow' },
    { id: 'c_green', char: 'green', displayClass: 'bg-green-500', speechJa: 'みどり', speechEn: 'Green' },
    { id: 'c_pink', char: 'pink', displayClass: 'bg-pink-400', speechJa: 'ピンク', speechEn: 'Pink' },
    { id: 'c_black', char: 'black', displayClass: 'bg-gray-900', speechJa: 'くろ', speechEn: 'Black' },
    { id: 'c_white', char: 'white', displayClass: 'bg-white border-4 border-gray-300', speechJa: 'しろ', speechEn: 'White' },
    { id: 'c_orange', char: 'orange', displayClass: 'bg-orange-500', speechJa: 'オレンジ', speechEn: 'Orange' },
    { id: 'c_purple', char: 'purple', displayClass: 'bg-purple-500', speechJa: 'むらさき', speechEn: 'Purple' },
  ],
  shape: [
    { id: 's_circle', char: 'circle', display: '🔴', speechJa: 'まる', speechEn: 'Circle' },
    { id: 's_triangle', char: 'triangle', display: '🔺', speechJa: 'さんかく', speechEn: 'Triangle' },
    { id: 's_square', char: 'square', display: '🟥', speechJa: 'しかく', speechEn: 'Square' },
    { id: 's_star', char: 'star', display: '⭐', speechJa: 'ほし', speechEn: 'Star' },
    { id: 's_heart', char: 'heart', display: '💖', speechJa: 'ハート', speechEn: 'Heart' },
  ]
};

// 日本語モードのカテゴリ
const CATEGORIES_JA = [
  { id: 'hiragana', label: 'ひらがな', icon: '🍎', color: 'bg-rose-500' },
  { id: 'katakana', label: 'カタカナ', icon: '🧅', color: 'bg-emerald-400' },
  { id: 'alphabet', label: 'えいご', icon: '🔤', color: 'bg-indigo-400' },
  { id: 'number', label: 'すうじ', icon: '1️⃣', color: 'bg-amber-400' },
  { id: 'color', label: 'いろ', icon: '🎨', color: 'bg-pink-400' },
  { id: 'shape', label: 'かたち', icon: '⭐', color: 'bg-violet-400' },
  { id: 'mix', label: 'ミックス', icon: '⚡', color: 'bg-fuchsia-400' }
];

// 英語モードのカテゴリ
const CATEGORIES_EN = [
  { id: 'alphabet', label: 'Alphabet', icon: '🔤', color: 'bg-indigo-500' },
  { id: 'number', label: 'Numbers', icon: '1️⃣', color: 'bg-amber-500' },
  { id: 'color', label: 'Colors', icon: '🎨', color: 'bg-pink-500' },
  { id: 'shape', label: 'Shapes', icon: '⭐', color: 'bg-violet-500' },
  { id: 'mix', label: 'Mix', icon: '⚡', color: 'bg-fuchsia-500' }
];

// 判定設定
const TIE_TOLERANCE_MS = 200;
const PENALTY_SECONDS = 5;

// カードサイズの定義 (10%)
const CARD_SIZE_PERCENT = 10;
const TEXT_COLORS = ['text-red-500', 'text-blue-500', 'text-green-500', 'text-orange-500', 'text-purple-500', 'text-pink-500'];

export default function App() {
  const [gameState, setGameState] = useState('menu'); 
  const [isEnglishMode, setIsEnglishMode] = useState(false);
  // ▼ ハンデ用の初期値を追加して上書き ▼
  const [settings, setSettings] = useState({ category: 'hiragana', displayCount: 8, targetScore: 5, p1Handicap: 0, p2Handicap: 0 });
  const [settings, setSettings] = useState({ category: 'hiragana', displayCount: 8, targetScore: 5 });
  
  const [cards, setCards] = useState([]); 
  const [cardPool, setCardPool] = useState([]);
  const [scores, setScores] = useState({ 1: 0, 2: 0 }); 
  const [currentTarget, setCurrentTarget] = useState(null);
  
  const [isQuestioning, setIsQuestioning] = useState(false);
  const [p1Message, setP1Message] = useState('');
  const [p2Message, setP2Message] = useState('');
  
  const [p1Penalty, setP1Penalty] = useState(false);
  const [p2Penalty, setP2Penalty] = useState(false);
  const [p1PenaltyCount, setP1PenaltyCount] = useState(0);
  const [p2PenaltyCount, setP2PenaltyCount] = useState(0);

  // 非同期処理の中で最新のStateを参照するためのRef
  const cardsRef = useRef([]);
  const cardPoolRef = useRef([]);
  const scoresRef = useRef({ 1: 0, 2: 0 });
  const isQuestioningRef = useRef(false);

  useEffect(() => { cardsRef.current = cards; }, [cards]);
  useEffect(() => { cardPoolRef.current = cardPool; }, [cardPool]);
  useEffect(() => { scoresRef.current = scores; }, [scores]);
  useEffect(() => { isQuestioningRef.current = isQuestioning; }, [isQuestioning]);

  const tieTimerRef = useRef(null);
  const firstTapPlayerRef = useRef(null);
  const nextTurnTimerRef = useRef(null);
  const p1IntervalRef = useRef(null);
  const p2IntervalRef = useRef(null);

  // --- メニューに戻る ---
  const handleReturnToMenu = useCallback(() => {
    stopSpeech();
    clearTimeout(tieTimerRef.current);
    clearTimeout(nextTurnTimerRef.current);
    clearInterval(p1IntervalRef.current);
    clearInterval(p2IntervalRef.current);
    setGameState('menu');
  }, []);

  // --- 英語モード切り替え時の自動調整 ---
  useEffect(() => {
    if (isEnglishMode) {
      const validEnCats = ['alphabet', 'number', 'color', 'shape', 'mix'];
      if (!validEnCats.includes(settings.category)) {
        setSettings(prev => ({ ...prev, category: 'alphabet' }));
      }
    }
  }, [isEnglishMode, settings.category]);

  // --- リザルト時の音声褒め ---
  useEffect(() => {
    if (gameState === 'result' && window.speechSynthesis && !isEnglishMode) {
      setTimeout(() => {
        if (scoresRef.current[1] > scoresRef.current[2]) {
          const u = new SpeechSynthesisUtterance('あおちーむの、かち！おめでとう！');
          u.rate = 1.1;
          window.speechSynthesis.speak(u);
        } else if (scoresRef.current[2] > scoresRef.current[1]) {
          const u = new SpeechSynthesisUtterance('あかちーむの、かち！おめでとう！');
          u.rate = 1.1;
          window.speechSynthesis.speak(u);
        }
      }, 500); 
    }
  }, [gameState, isEnglishMode]);

  // --- 音声生成ロジック ---
  const stopSpeech = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, []);

  
  // --- 音声生成ロジック ---
  const stopSpeech = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const playSpeech = useCallback((card, isRepeat = false) => {
    if (!card) return;
    stopSpeech();

    // 英語モード、または日本語モードだけど「えいご」パネルの場合
    const isEnglishCard = isEnglishMode || card.type === 'alphabet';

    if (isEnglishCard) {
      // 1. まず掛け声を喋る（モードに合わせて言語を変える）
      const preamble = new SpeechSynthesisUtterance();
      if (isEnglishMode) {
        preamble.lang = 'en-US';
        preamble.text = isRepeat ? 'Again. ' : 'Ready... ';
        preamble.rate = 0.8;
      } else {
        preamble.lang = 'ja-JP';
        preamble.text = isRepeat ? 'もういちど。' : 'いっせーのーで、';
        preamble.rate = 0.95;
      }
      window.speechSynthesis.speak(preamble);

      // 2. 続けてネイティブの英語を発音する
      const mainSpeech = new SpeechSynthesisUtterance();
      mainSpeech.lang = 'en-US'; // 確実にネイティブエンジンを指定
      mainSpeech.rate = 0.8;
      mainSpeech.pitch = 1.2;
      
      let text = '';
      if (card.type === 'alphabet') {
        const words = WORD_DICT.alphabet[card.char];
        text = `${card.char}... ${words.join(', ')}.`;
      } else if (card.type === 'number') {
        text = `${card.char}.`;
      } else if (card.type === 'color' || card.type === 'shape') {
        text = `${card.speechEn}.`;
      }
      mainSpeech.text = text;
      
      // 掛け声のあとに連続して再生されるように予約
      window.speechSynthesis.speak(mainSpeech);

    } else {
      // 純粋な日本語パネルの時
      const utterance = new SpeechSynthesisUtterance();
      utterance.lang = 'ja-JP';
      utterance.rate = 0.95;
      utterance.pitch = 1.1;
      let text = isRepeat ? 'もういちど。' : 'いっせーのーで、';
      
      if (card.type === 'hiragana' || card.type === 'katakana') {
        text += `${card.word}、の、${card.char}`;
      } else if (card.type === 'number') {
        text += `${card.char}`;
      } else if (card.type === 'color' || card.type === 'shape') {
        text += `${card.speechJa}`;
      }
      utterance.text = text;
      window.speechSynthesis.speak(utterance);
    }
  }, [isEnglishMode, stopSpeech]);

  // --- プール生成ロジック ---
  const generatePool = useCallback((category) => {
    let pool = [];
    let typesToUse = category === 'mix' 
      ? (isEnglishMode ? ['alphabet', 'number', 'color', 'shape'] : ['hiragana', 'katakana', 'alphabet', 'number', 'color', 'shape']) 
      : [category];

    typesToUse.forEach(type => {
      if (type === 'hiragana' || type === 'katakana') {
        Object.entries(WORD_DICT[type]).forEach(([char, word]) => {
          pool.push({ id: `${type}_${char}`, type, char, word, display: char });
        });
      } else if (type === 'alphabet') {
        Object.keys(WORD_DICT.alphabet).forEach((char) => {
          pool.push({ id: `alpha_${char}`, type, char, display: char });
        });
      } else if (type === 'color' || type === 'shape') {
        pool = pool.concat(WORD_DICT[type].map(item => ({ ...item, type })));
      } else if (type === 'number') {
        for (let i = 1; i <= 99; i++) {
          pool.push({ id: `num_${i}`, type, char: i.toString(), display: i.toString() });
        }
      }
    });

    return pool.sort(() => 0.5 - Math.random());
  }, [isEnglishMode]);

  // --- 重ならない座標（AABB） ---
  const findSafePosition = (existingCards) => {
    const marginX = CARD_SIZE_PERCENT + 2; 
    // Y軸はUIが中央に集まったため、縦方向のマージンを少し増やして確実に重ならないようにする
    const marginY = (CARD_SIZE_PERCENT + 2) * 2.5; 
    
    let x, y;
    let attempts = 0;
    
    const isOverlap = (test_x, test_y) => {
      for (const card of existingCards) {
        if (
            test_x < card.x + marginX &&
            test_x + marginX > card.x &&
            test_y < card.y + marginY &&
            test_y + marginY > card.y
        ) {
          return true; 
        }
      }
      return false; 
    };

    do {
      x = Math.random() * (100 - marginX);
      y = Math.random() * (100 - marginY); 
      attempts++;
    } while (isOverlap(x, y) && attempts < 500); 

    return { x, y };
  };

  // --- ゲーム開始 ---
  const startGame = () => {
    handleReturnToMenu(); 
    
    if (window.speechSynthesis) {
      const dummy = new SpeechSynthesisUtterance('');
      dummy.volume = 0;
      window.speechSynthesis.speak(dummy);
    }

    const fullPool = generatePool(settings.category);
    let initialCards = [];
    let remainingPool = [...fullPool];
    
    for (let i = 0; i < settings.displayCount; i++) {
      if (remainingPool.length === 0) break;
      const newCard = remainingPool.pop();
      const pos = findSafePosition(initialCards);
      const colorClass = TEXT_COLORS[i % TEXT_COLORS.length];
      const borderClass = colorClass.replace('text-', 'border-');
      initialCards.push({ ...newCard, ...pos, colorClass, borderClass });
    }

    // 全てのステートを確実に初期化
    setCards(initialCards);
    setCardPool(remainingPool);
    setScores({ 1: 0, 2: 0 });
    scoresRef.current = { 1: 0, 2: 0 }; 
    
    setGameState('playing');
    setP1Message('じゅんびしてね...');
    setP2Message('じゅんびしてね...');
    setCurrentTarget(null);
    setP1Penalty(false);
    setP2Penalty(false);
    setP1PenaltyCount(0);
    setP2PenaltyCount(0);

    nextTurnTimerRef.current = setTimeout(() => {
      startNextTurn(initialCards, remainingPool, false);
    }, 2000);
  };

  // --- 次のターン開始（補充） ---
  const startNextTurn = (currentCards, currentPool, wasPenaltySkip = false) => {
    let nextCards = [...currentCards];
    let nextPool = [...currentPool];

    // --- カード一気補充機能 (ディーラー: 4枚以下なら設定枚数まで補充) ---
    if (nextCards.length <= 4 && nextPool.length > 0) {
        while (nextCards.length < settings.displayCount && nextPool.length > 0) {
            const newCard = nextPool.pop();
            const pos = findSafePosition(nextCards);
            const colorClass = TEXT_COLORS[nextCards.length % TEXT_COLORS.length];
            const borderClass = colorClass.replace('text-', 'border-');
            nextCards.push({ ...newCard, ...pos, colorClass, borderClass });
        }
    }

    if (nextCards.length === 0) {
      setGameState('result');
      return;
    }

    setCards(nextCards);
    setCardPool(nextPool);

    const target = nextCards[Math.floor(Math.random() * nextCards.length)];
    setCurrentTarget(target);
    setP1Message('');
    setP2Message('');
    setIsQuestioning(true);
    firstTapPlayerRef.current = null;
    
    startPenaltyCountdown();

    if (!wasPenaltySkip) {
        playSpeech(target);
    } else {
        setTimeout(() => playSpeech(target), 500);
    }
  };

 
// --- 次のターン開始（補充とハンデ適用） ---
  const startNextTurn = (currentCards, currentPool, wasPenaltySkip = false) => {
    let nextCards = [...currentCards];
    let nextPool = [...currentPool];

    if (nextCards.length <= 4 && nextPool.length > 0) {
        while (nextCards.length < settings.displayCount && nextPool.length > 0) {
            const newCard = nextPool.pop();
            const pos = findSafePosition(nextCards);
            const colorClass = TEXT_COLORS[nextCards.length % TEXT_COLORS.length];
            const borderClass = colorClass.replace('text-', 'border-');
            nextCards.push({ ...newCard, ...pos, colorClass, borderClass });
        }
    }

    if (nextCards.length === 0) {
      setGameState('result');
      return;
    }

    setCards(nextCards);
    setCardPool(nextPool);

    const target = nextCards[Math.floor(Math.random() * nextCards.length)];
    setCurrentTarget(target);
    setIsQuestioning(true);
    firstTapPlayerRef.current = null;
    
    // --- ハンデ適用処理 ---
    if (settings.p1Handicap > 0) {
      setP1Penalty(true);
      setP1Message('ハンデ');
      setP1PenaltyCount(settings.p1Handicap);
      clearInterval(p1IntervalRef.current);
      p1IntervalRef.current = setInterval(() => {
        setP1PenaltyCount(prev => {
          if (prev <= 1) {
            clearInterval(p1IntervalRef.current);
            setP1Penalty(false);
            setP1Message('');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setP1Penalty(false);
      setP1Message('');
      setP1PenaltyCount(0);
      clearInterval(p1IntervalRef.current);
    }

    if (settings.p2Handicap > 0) {
      setP2Penalty(true);
      setP2Message('ハンデ');
      setP2PenaltyCount(settings.p2Handicap);
      clearInterval(p2IntervalRef.current);
      p2IntervalRef.current = setInterval(() => {
        setP2PenaltyCount(prev => {
          if (prev <= 1) {
            clearInterval(p2IntervalRef.current);
            setP2Penalty(false);
            setP2Message('');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setP2Penalty(false);
      setP2Message('');
      setP2PenaltyCount(0);
      clearInterval(p2IntervalRef.current);
    }

    if (!wasPenaltySkip) {
        playSpeech(target);
    } else {
        setTimeout(() => playSpeech(target), 500);
    }
  };



  const resolveScore = (players, cardId) => {
    setIsQuestioning(false);
    
    // 正解した側のみメッセージ表示、相手は空白（ざんねん表示廃止）
    if (players.length > 1) {
      setP1Message('ひきわけ！');
      setP2Message('ひきわけ！');
    } else {
      if (players.includes(1)) {
        setP1Message('せいかい！');
        setP2Message(''); 
      } else {
        setP2Message('せいかい！');
        setP1Message('');
      }
    }
    
    const newScores = { ...scoresRef.current };
    players.forEach(p => newScores[p] += 1);
    setScores(newScores);
    scoresRef.current = newScores; 

    const remainingCards = cardsRef.current.filter(c => c.id !== cardId);
    setCards(remainingCards);

    // 終了判定
    if (newScores[1] >= settings.targetScore || newScores[2] >= settings.targetScore || (remainingCards.length === 0 && cardPoolRef.current.length === 0)) {
      nextTurnTimerRef.current = setTimeout(() => {
        setGameState('result');
      }, 1500);
    } else {
      nextTurnTimerRef.current = setTimeout(() => {
        startNextTurn(remainingCards, cardPoolRef.current, false);
      }, 1500);
    }
  };

const handleCardTap = (player, cardId) => {
    if (gameState !== 'playing' || !isQuestioningRef.current || !currentTarget) return;
    if (player === 1 && (p1Penalty || p1PenaltyCount > 0)) return;
    if (player === 2 && (p2Penalty || p2PenaltyCount > 0)) return;

    if (cardId === currentTarget.id) {
      // 誰かが正解した瞬間に、両者のペナルティを完全リセットして次へ
      setP1Penalty(false);
      setP2Penalty(false);
      setP1PenaltyCount(0);
      setP2PenaltyCount(0);
      clearInterval(p1IntervalRef.current);
      clearInterval(p2IntervalRef.current);
      setP1Message('');
      setP2Message('');

      if (!firstTapPlayerRef.current) {
        firstTapPlayerRef.current = player;
        tieTimerRef.current = setTimeout(() => {
          resolveScore([player], cardId);
          tieTimerRef.current = null;
        }, TIE_TOLERANCE_MS);
      } else if (firstTapPlayerRef.current !== player && tieTimerRef.current) {
        clearTimeout(tieTimerRef.current);
        tieTimerRef.current = null;
        resolveScore([1, 2], cardId); 
      }
    } else {
      // --- おてつき時の処理 ---
      if (player === 1) {
        setP1Penalty(true);
        setP1Message('おてつき！');
        setP1PenaltyCount(PENALTY_SECONDS); // その場ですぐに5秒カウント開始
        clearInterval(p1IntervalRef.current);
        p1IntervalRef.current = setInterval(() => {
          setP1PenaltyCount(prev => {
            if (prev <= 1) {
              clearInterval(p1IntervalRef.current);
              setP1Penalty(false);
              setP1Message('');
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setP2Penalty(true);
        setP2Message('おてつき！');
        setP2PenaltyCount(PENALTY_SECONDS);
        clearInterval(p2IntervalRef.current);
        p2IntervalRef.current = setInterval(() => {
          setP2PenaltyCount(prev => {
            if (prev <= 1) {
              clearInterval(p2IntervalRef.current);
              setP2Penalty(false);
              setP2Message('');
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }

      // 2人とも間違えた場合はペナルティなしで即座に次へ
      const bothPenalized = (player === 1 && (p2Penalty || p2PenaltyCount > 0)) || 
                            (player === 2 && (p1Penalty || p1PenaltyCount > 0));

      if (bothPenalized) {
        clearTimeout(tieTimerRef.current);
        setIsQuestioning(false);

        // 進行中のペナルティを両方ストップしてリセット
        setP1Penalty(false);
        setP2Penalty(false);
        setP1PenaltyCount(0);
        setP2PenaltyCount(0);
        clearInterval(p1IntervalRef.current);
        clearInterval(p2IntervalRef.current);
        
        setP1Message('ドロー！');
        setP2Message('ドロー！');

        setTimeout(() => {
           setP1Message('');
           setP2Message('');
           if (gameState === 'playing') {
             startNextTurn(cardsRef.current, cardPoolRef.current, true);
           }
        }, 1500);
      }
    }
  };

 // --- メニュー画面描画 ---
  if (gameState === 'menu') {
    const displayedCategories = isEnglishMode ? CATEGORIES_EN : CATEGORIES_JA;

    return (
      <div className="min-h-screen w-screen bg-[#0abde3] flex items-center justify-center p-2 sm:p-4 select-none font-sans touch-manipulation">
        {/* max-h-[95vh] と overflow-y-auto で、どんな画面サイズでも確実にはみ出さずスクロール可能にします */}
        <div className="bg-white/95 rounded-[30px] shadow-2xl w-full max-w-6xl max-h-[95vh] flex flex-col lg:flex-row overflow-y-auto border-4 lg:border-8 border-white/50">
          
          {/* 左メニュー（カテゴリ）: 縦画面では上に配置し、2列にして高さを節約 */}
          <div className="w-full lg:w-1/3 bg-[#f0f8ff] p-4 lg:p-6 flex flex-col border-b-4 lg:border-b-0 lg:border-r-4 border-gray-100 shrink-0">
            <div className="flex justify-between items-center mb-3 lg:mb-6">
              <h2 className="text-lg lg:text-2xl font-black text-gray-700 flex items-center">
                🎈 {isEnglishMode ? 'Categories' : 'なにであそぶ？'}
              </h2>
              <button 
                onClick={() => setIsEnglishMode(!isEnglishMode)}
                className={`px-3 py-1 lg:px-4 lg:py-2 rounded-full font-bold text-xs lg:text-sm transition-colors shadow-sm active:scale-95 ${isEnglishMode ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                {isEnglishMode ? '日本語' : 'English Mode'}
              </button>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 lg:gap-3 flex-1">
              {displayedCategories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSettings({ ...settings, category: cat.id })}
                  className={`relative px-3 py-2 lg:px-6 lg:py-4 rounded-xl lg:rounded-2xl font-black text-sm lg:text-2xl text-left transition-all flex items-center ${
                    settings.category === cat.id 
                      ? `${cat.color} text-white shadow-[0_4px_0_rgba(0,0,0,0.2)] translate-y-[-2px]` 
                      : 'bg-white text-gray-600 shadow-[0_2px_0_#e2e8f0] lg:shadow-[0_4px_0_#e2e8f0] hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-2 lg:mr-3 text-lg lg:text-2xl">{cat.icon}</span>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* 右メニュー（設定・スタート） */}
          <div className="w-full lg:w-2/3 p-4 lg:p-12 flex flex-col justify-center bg-white relative">
            
            {/* ▼ バージョン表記 (v1.05) ▼ */}
            <div className="absolute bottom-2 right-4 text-xs font-bold text-gray-400 select-none">
              v1.05
            </div>

            <div className="mb-4 lg:mb-0">
              <h1 className="text-3xl lg:text-6xl font-black text-center mb-2 lg:mb-4 text-[#ff6b6b] drop-shadow-sm">
                はやおし タッチ！
              </h1>
              <p className="text-xs lg:text-base text-center text-gray-500 font-bold mb-4 lg:mb-10">
                おとをきいて、はやく タッチしよう！
              </p>

              <div className="space-y-4 lg:space-y-8 max-w-lg mx-auto w-full">
                <div className="bg-gray-50 p-3 lg:p-6 rounded-2xl lg:rounded-3xl border-2 border-gray-100">
                  <h3 className="text-sm lg:text-xl font-bold text-gray-700 mb-2 lg:mb-4 text-center">がめんに だす まいすう</h3>
                  <div className="flex gap-2 lg:gap-4">
                    {[6, 8, 10].map(num => (
                      <button
                        key={num}
                        onClick={() => setSettings({ ...settings, displayCount: num })}
                        className={`flex-1 py-2 lg:py-3 rounded-xl lg:rounded-2xl font-black text-base lg:text-xl transition-all ${
                          settings.displayCount === num 
                            ? 'bg-[#1dd1a1] text-white shadow-[0_3px_0_#10ac84] lg:shadow-[0_4px_0_#10ac84]' 
                            : 'bg-white text-gray-500 shadow-[0_3px_0_#e2e8f0] lg:shadow-[0_4px_0_#e2e8f0]'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 p-3 lg:p-6 rounded-2xl lg:rounded-3xl border-2 border-gray-100">
                  <h3 className="text-sm lg:text-xl font-bold text-gray-700 mb-2 lg:mb-4 text-center">ゴール (なんまいとる？)</h3>
                  <div className="flex gap-2 lg:gap-4">
                    {[5, 10, 15].map(num => (
                      <button
                        key={num}
                        onClick={() => setSettings({ ...settings, targetScore: num })}
                        className={`flex-1 py-2 lg:py-3 rounded-xl lg:rounded-2xl font-black text-base lg:text-xl transition-all ${
                          settings.targetScore === num 
                            ? 'bg-[#ff9f43] text-white shadow-[0_3px_0_#ee5253] lg:shadow-[0_4px_0_#ee5253]' 
                            : 'bg-white text-gray-500 shadow-[0_3px_0_#e2e8f0] lg:shadow-[0_4px_0_#e2e8f0]'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

{/* --- ハンデ設定 --- */}
                <div className="bg-gray-50 p-3 lg:p-6 rounded-2xl lg:rounded-3xl border-2 border-gray-100">
                  <h3 className="text-sm lg:text-xl font-bold text-gray-700 mb-2 lg:mb-4 text-center">ハンデ (毎ターン待機)</h3>
                  <div className="flex flex-col gap-2 lg:gap-4">
                    {/* あお(下)チーム ハンデ */}
                    <div className="flex items-center gap-2">
                      <span className="w-16 lg:w-24 text-xs lg:text-base font-bold text-[#3498db] text-right">あお(下):</span>
                      <div className="flex-1 flex gap-1 lg:gap-2">
                        {[0, 1, 2, 3].map(num => (
                          <button
                            key={`p1-han-${num}`}
                            onClick={() => setSettings({ ...settings, p1Handicap: num })}
                            className={`flex-1 py-1 lg:py-2 rounded-lg lg:rounded-xl font-bold text-sm lg:text-lg transition-all ${
                              settings.p1Handicap === num 
                                ? 'bg-[#3498db] text-white shadow-[0_3px_0_#2980b9]' 
                                : 'bg-white text-gray-500 shadow-[0_3px_0_#e2e8f0]'
                            }`}
                          >
                            {num}秒
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* あか(上)チーム ハンデ */}
                    <div className="flex items-center gap-2">
                      <span className="w-16 lg:w-24 text-xs lg:text-base font-bold text-[#ff6b6b] text-right">あか(上):</span>
                      <div className="flex-1 flex gap-1 lg:gap-2">
                        {[0, 1, 2, 3].map(num => (
                          <button
                            key={`p2-han-${num}`}
                            onClick={() => setSettings({ ...settings, p2Handicap: num })}
                            className={`flex-1 py-1 lg:py-2 rounded-lg lg:rounded-xl font-bold text-sm lg:text-lg transition-all ${
                              settings.p2Handicap === num 
                                ? 'bg-[#ff6b6b] text-white shadow-[0_3px_0_#ee5253]' 
                                : 'bg-white text-gray-500 shadow-[0_3px_0_#e2e8f0]'
                            }`}
                          >
                            {num}秒
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>


              </div>
            </div>

            <div className="flex justify-center mt-4 lg:mt-8 pb-4 lg:pb-0">
              <button 
                onClick={startGame}
                className="w-full max-w-md py-4 lg:py-6 bg-[#ff6b6b] text-white rounded-2xl lg:rounded-[32px] text-2xl lg:text-4xl font-black shadow-[0_6px_0_#ee5253] lg:shadow-[0_10px_0_#ee5253] active:shadow-none active:translate-y-[6px] lg:active:translate-y-[10px] transition-all flex items-center justify-center hover:bg-[#ff5252]"
              >
                <Play className="w-8 h-8 lg:w-10 lg:h-10 mr-2 lg:mr-4 fill-white" /> スタート！
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- カード描画 ---
  const PlayCard = ({ card, player }) => {
    // プレイヤーによって配置の基準を変える（P1は上から、P2は下から指定することでY軸を完全に対称にする）
    const positionStyle = player === 1 
      ? { left: `${card.x}%`, top: `${card.y}%` } 
      : { left: `${card.x}%`, bottom: `${card.y}%` };

    if (card.type === 'color') {
      return (
        <div 
          onClick={() => handleCardTap(player, card.id)}
          className={`absolute rounded-2xl shadow-[0_4px_0_rgba(0,0,0,0.15)] cursor-pointer transition-all duration-150 active:scale-95 active:shadow-[0_2px_0_rgba(0,0,0,0.15)] active:translate-y-1 flex items-center justify-center border-4 border-white ${card.displayClass}`}
          style={{ 
            ...positionStyle,
            width: `${CARD_SIZE_PERCENT}%`, 
            aspectRatio: '1/1'
          }}
        />
      );
    }

    const rotationClass = player === 2 ? 'rotate-180' : '';
    
    return (
      <div 
        onClick={() => handleCardTap(player, card.id)}
        className={`absolute bg-white rounded-3xl shadow-[0_4px_0_#cbd5e1] border-2 flex items-center justify-center cursor-pointer transition-all duration-150 active:scale-95 active:shadow-[0_2px_0_#cbd5e1] active:translate-y-1 hover:scale-105 ${card.borderClass}`}
        style={{ 
          ...positionStyle,
          width: `${CARD_SIZE_PERCENT}%`, 
          aspectRatio: '1/1'
        }}
      >
        <div className={`w-full h-full flex items-center justify-center p-1 ${rotationClass}`}>
          {card.type === 'shape' ? (
            <span className="text-3xl md:text-5xl drop-shadow-sm">{card.display}</span>
          ) : (
            <span className={`text-2xl md:text-4xl font-black drop-shadow-sm ${card.colorClass}`}>{card.display}</span>
          )}
        </div>
      </div>
    );
  };

  const p1Ratio = Math.min((scores[1] / settings.targetScore) * 60, 60);
  const p2Ratio = Math.min((scores[2] / settings.targetScore) * 60, 60);

  return (
    <div className="h-screen w-screen bg-[#0abde3] flex flex-col overflow-hidden select-none font-sans touch-manipulation p-2 md:p-4 gap-2">
      {/* --- P2 (上側・赤) エリア --- */}
      <div className={`flex-1 relative rounded-3xl overflow-hidden border-4 border-white transition-colors duration-300 ${p2PenaltyCount > 0 ? 'bg-gray-400' : 'bg-[#fff5f5]'}`}>
        {p2Message && !p2PenaltyCount && (
          <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
            {/* 回転用とアニメーション用のdivを分離して上書きを防ぐ */}
            <div className="rotate-180">
              <div className="bg-black/70 text-white px-8 py-4 rounded-full text-3xl font-bold animate-bounce">
                {p2Message}
              </div>
            </div>
          </div>
        )}
        {p2PenaltyCount > 0 && (
          <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
            <div className="text-[#ff6b6b] text-9xl font-black drop-shadow-2xl rotate-180">
              {p2PenaltyCount}
            </div>
          </div>
        )}
        
        <div className="absolute inset-2">
          {cards.map(card => (
            <PlayCard key={`p2-${card.id}`} card={card} player={2} />
          ))}
        </div>
      </div>

      {/* --- 中央帯 (スコア＆UIゾーン) --- */}
      <div className="h-16 md:h-20 w-full bg-slate-800 rounded-2xl flex items-center justify-between relative overflow-hidden shrink-0 border-4 border-white shadow-xl px-2">
        <div className="flex gap-2 z-30">
           <button onClick={handleReturnToMenu} className="bg-gray-200 text-gray-700 p-2 md:px-4 md:py-2 rounded-full font-bold shadow-md flex items-center active:scale-95 text-sm md:text-base">
             <ArrowLeft className="w-5 h-5 md:mr-1" /> <span className="hidden md:inline">もどる</span>
           </button>
           <button onClick={() => playSpeech(currentTarget, true)} className="bg-blue-500 text-white p-2 md:p-3 rounded-full shadow-md active:scale-95 flex items-center">
             <Volume2 className="w-5 h-5" />
           </button>
        </div>

        <div className="flex-1 h-8 md:h-10 mx-4 bg-black/40 rounded-full relative overflow-hidden">
          <div className="absolute left-1/2 top-0 bottom-0 w-2 bg-yellow-300 -translate-x-1/2 z-20 shadow-[0_0_10px_#fde047]" />
          <div 
            className="absolute right-0 top-0 bottom-0 bg-[#ff6b6b] transition-all duration-700 ease-in-out z-10 shadow-[0_0_15px_rgba(255,107,107,0.8)] flex items-center justify-start px-4"
            style={{ width: `${p2Ratio}%`, borderRadius: p2Ratio >= 50 ? '20px' : '0 20px 20px 0' }}
          >
             <span className="text-white font-black text-sm md:text-lg rotate-180 opacity-80">{scores[2]}</span>
          </div>
          <div 
            className="absolute left-0 top-0 bottom-0 bg-[#3498db] transition-all duration-700 ease-in-out z-10 shadow-[0_0_15px_rgba(52,152,219,0.8)] flex items-center justify-end px-4"
            style={{ width: `${p1Ratio}%`, borderRadius: p1Ratio >= 50 ? '20px' : '20px 0 0 20px' }}
          >
             <span className="text-white font-black text-sm md:text-lg opacity-80">{scores[1]}</span>
          </div>
        </div>

        <div className="flex gap-2 z-30 rotate-180">
           <button onClick={handleReturnToMenu} className="bg-gray-200 text-gray-700 p-2 md:px-4 md:py-2 rounded-full font-bold shadow-md flex items-center active:scale-95 text-sm md:text-base">
             <ArrowLeft className="w-5 h-5 md:mr-1" /> <span className="hidden md:inline">もどる</span>
           </button>
           <button onClick={() => playSpeech(currentTarget, true)} className="bg-red-500 text-white p-2 md:p-3 rounded-full shadow-md active:scale-95 flex items-center">
             <Volume2 className="w-5 h-5" />
           </button>
        </div>
      </div>

      {/* --- P1 (下側・青) エリア --- */}
      <div className={`flex-1 relative rounded-3xl overflow-hidden border-4 border-white transition-colors duration-300 ${p1PenaltyCount > 0 ? 'bg-gray-400' : 'bg-[#f0f8ff]'}`}>
        {p1Message && !p1PenaltyCount && (
          <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
            <div className="bg-black/70 text-white px-8 py-4 rounded-full text-3xl font-bold animate-bounce">
              {p1Message}
            </div>
          </div>
        )}
        {p1PenaltyCount > 0 && (
          <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
            <div className="text-[#3498db] text-9xl font-black drop-shadow-2xl">
              {p1PenaltyCount}
            </div>
          </div>
        )}

        <div className="absolute inset-2">
          {cards.map(card => (
            <PlayCard key={`p1-${card.id}`} card={card} player={1} />
          ))}
        </div>
      </div>

      {/* --- 勝利/リザルト画面 --- */}
      {gameState === 'result' && (
        <div className="absolute inset-0 bg-black/60 z-50 flex flex-col backdrop-blur-sm">
          <div className="flex-1 flex flex-col items-center justify-center rotate-180 p-8 border-b-2 border-white/20">
            <h1 className="text-5xl md:text-7xl font-black mb-6 text-white drop-shadow-lg">
              {scores[2] > scores[1] ? <span className="text-[#ff6b6b]">あかチームの かち！</span> : 
               scores[1] > scores[2] ? <span className="text-gray-400">ざんねん...</span> : 
               <span className="text-yellow-400">ひきわけ！</span>}
            </h1>
            <div className="bg-[#ff6b6b] text-white px-8 py-4 rounded-full text-3xl font-bold shadow-lg">
              {scores[2]} てん
            </div>
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-4 z-50">
             <button 
                onClick={handleReturnToMenu}
                className="w-16 h-16 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center shadow-xl active:scale-95"
              >
                <ArrowLeft className="w-8 h-8" />
              </button>
              <button 
                onClick={startGame}
                className="w-24 h-24 bg-yellow-400 text-white rounded-full flex items-center justify-center shadow-[0_8px_0_#ca8a04] active:translate-y-2 active:shadow-none transition-all"
              >
                <RefreshCw className="w-12 h-12" />
              </button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center p-8 border-t-2 border-white/20">
            <h1 className="text-5xl md:text-7xl font-black mb-6 text-white drop-shadow-lg">
              {scores[1] > scores[2] ? <span className="text-[#3498db]">あおチームの かち！</span> : 
               scores[2] > scores[1] ? <span className="text-gray-400">ざんねん...</span> : 
               <span className="text-yellow-400">ひきわけ！</span>}
            </h1>
            <div className="bg-[#3498db] text-white px-8 py-4 rounded-full text-3xl font-bold shadow-lg">
              {scores[1]} てん
            </div>
          </div>
        </div>
      )}
    </div>
  );
}