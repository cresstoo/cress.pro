// AnkiJPVoice - Japanese TTS for Anki
// Version: 1.0.0
// Author: cress
// License: MIT

// 检查是否已经定义
if (typeof window.AnkiJPVoice === 'undefined') {
  console.log('定义 AnkiJPVoice 类')
  window.AnkiJPVoice = class {
    constructor(config) {
      console.log('初始化 AnkiJPVoice')
      this.config = {
        key: config.key || '',
        speaker: config.speaker || 14,
        autoPlayDelay: config.autoPlayDelay || 500,
        cooldown: config.cooldown || 1000,
        buttonClass: config.buttonClass || 'tts-button',
        disabledClass: config.disabledClass || 'disabled',
      }

      this.lastPlayTime = 0
      this.init()
    }

    init() {
      console.log('开始初始化 TTS 按钮')

      // 首先移除所有现有的 TTS 按钮
      document.querySelectorAll('.' + this.config.buttonClass).forEach((button) => {
        button.remove()
      })

      // 查找所有 data-tts 元素
      const elements = document.querySelectorAll('[data-tts]')
      console.log('找到 TTS 元素数量:', elements.length)

      elements.forEach((element, index) => {
        console.log(`处理第 ${index + 1} 个元素:`, element.dataset.tts)

        // 创建按钮
        const button = document.createElement('button')
        button.className = this.config.buttonClass
        button.setAttribute('aria-label', '播放语音')

        // 添加点击事件
        button.onclick = async (e) => {
          e.preventDefault()
          e.stopPropagation()
          if (button.classList.contains(this.config.disabledClass)) {
            return
          }
          button.classList.add(this.config.disabledClass)
          await this.speak(element.dataset.tts)
          button.classList.remove(this.config.disabledClass)
        }

        // 插入按钮
        element.insertAdjacentElement('afterend', button)
        console.log('按钮已插入')

        // 处理自动播放
        if (element.hasAttribute('data-tts-auto')) {
          console.log('发现自动播放元素，延迟:', this.config.autoPlayDelay)
          setTimeout(() => {
            console.log('执行自动播放:', element.dataset.tts)
            this.speak(element.dataset.tts)
          }, this.config.autoPlayDelay)
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
        console.log('开始播放:', text)
        // 构建 API URL
        const apiUrl = `https://api.tts.quest/v3/voicevox/synthesis?key=${this.config.key}&speaker=${this.config.speaker}&text=${encodeURIComponent(text)}`

        // 获取音频 URL
        const response = await fetch(apiUrl)
        const data = await response.json()

        if (data.success && data.mp3StreamingUrl) {
          // 播放音频
          const audio = new Audio(data.mp3StreamingUrl)
          await audio.play()
          console.log('播放成功')
        } else {
          console.error('TTS API 错误:', data)
        }
      } catch (error) {
        console.error('TTS 播放失败:', error)
      }
    }
  }
}
