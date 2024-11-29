// 日语TTS功能封装
const AnkiJPVoice = {
  // 基础设置
  key: 'e-a9G2o619X372w', // API密钥
  speaker: 14, // 默认声优ID

  // 添加自动播放
  autoPlay(text) {
    return `<div class="tts-auto">${text}<script>AnkiJPVoice.play("${text}");</script></div>`
  },

  // 添加播放按钮
  addButton(text) {
    return `<div class="tts-manual">
            ${text}
            <button onclick="AnkiJPVoice.play('${text}')" class="play-button">
                <svg class="speaker-icon" viewBox="0 0 24 24">
                    <path d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z"/>
                </svg>
            </button>
        </div>`
  },

  // 播放功能
  async play(text) {
    try {
      // 获取所有播放按钮
      const buttons = document.querySelectorAll('.play-button')

      // 禁用所有按钮
      buttons.forEach((btn) => {
        btn.classList.add('playing')
      })

      // 构建API请求
      const url = `https://api.tts.quest/v3/voicevox/synthesis?key=${this.key}&speaker=${this.speaker}&text=${encodeURIComponent(text)}`

      // 获取音频URL
      const response = await fetch(url)
      const data = await response.json()

      if (data.success) {
        const audio = new Audio(data.mp3StreamingUrl)

        // 播放完成后启用按钮
        audio.onended = () => {
          buttons.forEach((btn) => {
            btn.classList.remove('playing')
          })
        }

        // 播放音频
        await audio.play()
      } else {
        console.error('TTS API error:', data.error)
      }
    } catch (error) {
      console.error('TTS error:', error)
      // 发生错误时也要启用按钮
      const buttons = document.querySelectorAll('.play-button')
      buttons.forEach((btn) => {
        btn.classList.remove('playing')
      })
    }
  },
}

// 添加样式
document.head.insertAdjacentHTML(
  'beforeend',
  `
<style>
.card-content {
    font-family: "Hiragino Sans", "Yu Gothic", "メイリオ", sans-serif;
    max-width: 600px;
    margin: 20px auto;
    padding: 20px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.expression {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
    color: #e73e19;
    display: inline-block;
}

.reading {
    font-size: 14px;
    color: #444;
    margin-bottom: 0px;
}

.meaning {
    font-size: 18px;
    color: #000;
    margin: 15px 0;
    line-height: 1.5;
}

.example-section {
    background: #f5f5f5;
    padding: 15px;
    border-radius: 6px;
    margin-top: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.example {
    font-size: 16px;
    color: #000;
    line-height: 1.2;
    flex: 1;
}

.play-button {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0px;
    margin-left: 8px;
    vertical-align: middle;
    transition: transform 0.2s;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.play-button:hover {
    transform: scale(1.1);
}

.play-button:active {
    transform: scale(0.95);
}

.play-button.playing {
    opacity: 0.5;
    pointer-events: none;
}

.speaker-icon {
    width: 24px;
    height: 24px;
    fill: #4a90e2;
}

.divider {
    border: 0;
    padding-top: 1px;
    background: repeating-linear-gradient(to right, #a2a9b6 0px, #a2a9b6 4px, transparent 0px, transparent 10px);
    margin: 15px 0;
}

/* 夜间模式适配 */
.nightMode .card-content {
    background: #2c2c2c;
}

.nightMode .expression {
    color: #fff;
}

.nightMode .reading {
    color: #ccc;
}

.nightMode .meaning {
    color: #ddd;
}

.nightMode .example-section {
    background: #383838;
}

.nightMode .example {
    color: #bbb;
}

.nightMode .divider {
    border-top-color: #444;
}

.nightMode .speaker-icon {
    fill: #7ab3ff;
}

.tts-manual, .tts-auto {
    display: inline-flex;
    align-items: center;
}
</style>`,
)
