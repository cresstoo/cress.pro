// AnkiJPVoice - Japanese TTS for Anki
// Version: 1.0.0
// Author: cress
// License: MIT
// Repository: https://github.com/cresstoo/AnkiJPVoice

;(function (window) {
  'use strict'

  // 主类定义
  class ankiJPVoice {
    constructor(options = {}) {
      this.key = options.key || 'e-a9G2o619X372w'
      this.speaker = options.speaker || 14
      this.autoPlayDelay = options.autoPlayDelay || 100
      this.initialized = false
      this.init()
    }

    // 初始化
    init() {
      if (this.initialized) return
      this.initialized = true
      this.initStyle()
      this.startObserving()
    }

    // 添加样式
    initStyle() {
      const style = document.createElement('style')
      style.textContent = `
                .play-button {
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    padding: 0;
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

                .nightMode .speaker-icon {
                    fill: #7ab3ff;
                }

                .tts-manual, .tts-auto {
                    display: inline-flex;
                    align-items: center;
                }
            `
      document.head.appendChild(style)
    }

    // 清理HTML标签
    stripHtml(html) {
      const tmp = document.createElement('div')
      tmp.innerHTML = html
      return tmp.textContent || tmp.innerText || ''
    }

    // 创建播放按钮
    createButton(text) {
      const button = document.createElement('button')
      button.className = 'play-button'
      button.innerHTML =
        '<svg class="speaker-icon" viewBox="0 0 24 24"><path d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z"/></svg>'
      button.onclick = () => this.play(text)
      return button
    }

    // 播放功能
    async play(text) {
      try {
        const buttons = document.querySelectorAll('.play-button')
        buttons.forEach((btn) => btn.classList.add('playing'))

        const url = `https://api.tts.quest/v3/voicevox/synthesis?key=${this.key}&speaker=${this.speaker}&text=${encodeURIComponent(text)}`
        const response = await fetch(url)
        const data = await response.json()

        if (data.success) {
          const audio = new Audio(data.mp3StreamingUrl)
          audio.onended = () => {
            buttons.forEach((btn) => btn.classList.remove('playing'))
          }
          await audio.play()
        } else {
          console.error('TTS API error:', data.error)
          alert('语音生成失败，请稍后再试')
          buttons.forEach((btn) => btn.classList.remove('playing'))
        }
      } catch (error) {
        console.error('TTS error:', error)
        alert('播放失败，请检查网络连接')
        const buttons = document.querySelectorAll('.play-button')
        buttons.forEach((btn) => btn.classList.remove('playing'))
      }
    }

    // 处理新元素
    processElement(el) {
      if (!el.querySelector('.play-button')) {
        const text = this.stripHtml(el.textContent.trim())
        const button = this.createButton(text)
        el.appendChild(button)

        if (el.classList.contains('tts-auto')) {
          setTimeout(() => this.play(text), this.autoPlayDelay)
        }
      }
    }

    // 开始观察DOM变化
    startObserving() {
      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.type === 'childList') {
            const elements = document.querySelectorAll('.tts-auto, .tts-manual')
            elements.forEach((el) => this.processElement(el))
          }
        }
      })

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      })

      // 初始处理
      const elements = document.querySelectorAll('.tts-auto, .tts-manual')
      elements.forEach((el) => this.processElement(el))
    }
  }

  // 自动创建实例
  window.ankiJPVoice = new ankiJPVoice()
})(window)
