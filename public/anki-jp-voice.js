// AnkiJPVoice - Japanese TTS for Anki
// Version: 1.0.0
// Author: cress
// License: MIT

class AnkiJPVoice {
  constructor(config) {
    this.config = {
      key: config.key || '',
      speaker: config.speaker || 14,
      autoPlayDelay: config.autoPlayDelay || 500,
      cooldown: config.cooldown || 1000,
    }

    this.lastPlayTime = 0
    this.init()
  }

  init() {
    // 添加播放按钮到所有 data-tts 元素
    document.querySelectorAll('[data-tts]').forEach((element) => {
      const button = document.createElement('button')
      button.innerHTML = ''
      button.style.cssText = 'background: none; border: none; cursor: pointer; padding: 0 5px;'
      button.onclick = () => this.speak(element.dataset.tts)
      element.parentNode.insertBefore(button, element)

      // 如果设置了自动播放，添加到队列
      if (element.dataset.ttsAuto) {
        setTimeout(() => this.speak(element.dataset.tts), this.config.autoPlayDelay)
      }
    })
  }

  async speak(text) {
    // 检查冷却时间
    const now = Date.now()
    if (now - this.lastPlayTime < this.config.cooldown) {
      console.log('TTS 冷却中...')
      return
    }
    this.lastPlayTime = now

    try {
      // 构建 API URL
      const apiUrl = `https://api.tts.quest/v3/voicevox/synthesis?key=${this.config.key}&speaker=${this.config.speaker}&text=${encodeURIComponent(text)}`

      // 获取音频 URL
      const response = await fetch(apiUrl)
      const data = await response.json()

      if (data.success && data.mp3StreamingUrl) {
        // 播放音频
        const audio = new Audio(data.mp3StreamingUrl)
        await audio.play()
      } else {
        console.error('TTS API 错误:', data)
      }
    } catch (error) {
      console.error('TTS 播放失败:', error)
    }
  }
}
