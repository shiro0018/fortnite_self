/**
 * card.html が読み込まれたら、URLパラメータ→カードに反映→バー位置の設定
 */
window.addEventListener('DOMContentLoaded', () => {
  // 1) URLパラメータ取得
  const urlParams = new URLSearchParams(window.location.search);

  const userName = urlParams.get('userName') || 'NO NAME';
  const epicId   = urlParams.get('epicId')   || '';
  const gender   = urlParams.get('gender')   || 'other';
  const comment  = urlParams.get('comment')  || '';
  const weapon   = urlParams.get('weapon')   || '';
  const playTime = urlParams.get('playTime') || '';
  const voiceChat= urlParams.get('voiceChat')|| 'OK';
  const buildMode= urlParams.get('buildMode')|| '建築';

  const devices  = urlParams.getAll('devices');

  const templateName  = urlParams.get('templateName')  || 'templete1.jpg';
  const characterName = urlParams.get('characterName') || 'chara1.png';

  const enjoyVsVictory     = parseInt(urlParams.get('enjoyVsVictory')     || '5', 10);
  const beginnerVsAdvanced = parseInt(urlParams.get('beginnerVsAdvanced') || '5', 10);

  // 2) カードを更新
  updateCard({
    templateName,
    characterName,
    userName,
    epicId,
    gender,
    comment,
    weapon,
    playTime,
    voiceChat,
    buildMode,
    devices,
    enjoyVsVictory,
    beginnerVsAdvanced
  });

  // 3) ダウンロードボタン
  document.getElementById('downloadBtn').addEventListener('click', () => {
    downloadCard();
  });
});

/**
 * カードを更新 (HTML要素書き換え)
 */
function updateCard({
  templateName,
  characterName,
  userName,
  epicId,
  gender,
  comment,
  weapon,
  playTime,
  voiceChat,
  buildMode,
  devices,
  enjoyVsVictory,
  beginnerVsAdvanced
}) {
  // 背景
  const cardContainer = document.getElementById('cardContainer');
  cardContainer.style.backgroundImage = `url('images/templete/${templateName}')`;

  // キャラクター画像
  const characterImg = document.getElementById('characterImage');
  characterImg.src = `images/chara/${characterName}`;

  // ユーザー名 + EPIC ID + 性別
  const userNameElem = document.getElementById('userName');
  const epicIdElem   = document.getElementById('epicIdText');
  const genderIconElem = document.getElementById('genderIcon');

  userNameElem.textContent = userName;
  epicIdElem.textContent   = ` (EPIC ID: ${epicId}) `;
  genderIconElem.textContent = '';

  if (gender === 'male') {
    genderIconElem.textContent = '♂';
    genderIconElem.style.display = 'inline';
  } else if (gender === 'female') {
    genderIconElem.textContent = '♀';
    genderIconElem.style.display = 'inline';
  } else {
    userNameElem.textContent = `${userName} (性別：その他)`;
  }

  // コメント
  document.getElementById('userComment').textContent = comment;

  // 武器、時間帯、VC、ビルド
  document.getElementById('weapon').textContent    = weapon;
  document.getElementById('playTime').textContent  = playTime;
  document.getElementById('voiceChat').textContent = voiceChat;
  document.getElementById('buildMode').textContent = buildMode;

  // デバイス
  const deviceListElem = document.getElementById('deviceList');
  deviceListElem.innerHTML = '';
  devices.forEach(dev => {
    const box = document.createElement('div');
    box.className = 'device-box';
    box.textContent = dev;
    deviceListElem.appendChild(box);
  });

  // 2本のバーにドットを配置
  setBarPositions(enjoyVsVictory, beginnerVsAdvanced);
}

/**
 * 楽しみたい-ビクロイ, 初心者-上級者 のバーにドットを配置
 *   0=左端, 10=右端
 */
function setBarPositions(enjoyVal, skillVal) {
  // それぞれ 0～10 の値 → バー幅100% として計算
  // left:0% → left端, left:100% → 右端(ただしドットが少しはみ出すので調整可)

  const funDot = document.getElementById('funDot');
  const skillDot = document.getElementById('skillDot');

  // 例えば 0→0%, 10→calc(100% - ドットの幅半分) とする場合は 90% 程度にしてもOK
  // シンプルに 0～10 → 0%～90% にしておきます。
  const funLeftPercent   = (enjoyVal / 10) * 90;  // 0～90
  const skillLeftPercent = (skillVal / 10) * 90;

  funDot.style.left   = funLeftPercent + '%';
  skillDot.style.left = skillLeftPercent + '%';
}

/**
 * カードをJPEG形式でダウンロード
 */
function downloadCard() {
  const cardElement = document.getElementById('cardContainer');
  html2canvas(cardElement, {scale:2}).then(canvas => {
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    const link = document.createElement('a');
    link.download = 'my_card.jpg';
    link.href = dataUrl;
    link.click();
  });
}
