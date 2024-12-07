// AnkiJPVoice - Japanese TTS for Anki
// Version: 1.0.0
// Author: cress
// License: MIT
// Repository: https://github.com/cresstoo/AnkiJPVoice

;(function (window) {
  'use strict'

  // 状态常量
  const STATUS = {
    IDLE: 'idle',
    LOADING: 'loading',
    PLAYING: 'playing',
    ERROR: 'error',
  }

  class ankiJPVoice {
    constructor(options = {}) {
      this.key = options.key || 'e-a9G2o619X372w'
      this.speaker = options.speaker || 14
      this.autoPlayDelay = options.autoPlayDelay || 100
      this.initialized = false
      this.audioCache = new Map()
      this.currentAudio = null
      this.init()
    }

    init() {
      if (this.initialized) return
      this.initialized = true

      // 添加必要的样式
      this.addStyles()

      // 处理所有 TTS 标记
      this.processAllTTSMarks()

      // 设置事件监听
      this.setupEventListeners()

      // 处理自动播放
      this.handleAutoPlay()
    }

    // 添加必要的样式
    addStyles() {
      const style = document.createElement('style')
      style.textContent = `
                .tts-button {
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    padding: 4px;
                    margin-left: 4px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    vertical-align: middle;
                    transition: transform 0.2s;
                }
                .tts-button:hover {
                    transform: scale(1.1);
                }
                .tts-button:active {
                    transform: scale(0.95);
                }
                .tts-button.disabled {
                    opacity: 0.5;
                    pointer-events: none;
                }
                .tts-button svg {
                    width: 20px;
                    height: 20px;
                    fill: #4a90e2;
                }
                .nightMode .tts-button svg {
                    fill: #7ab3ff;
                }
            `
      document.head.appendChild(style)
    }

    // 创建按钮
    createButton() {
      const button = document.createElement('button')
      button.className = 'tts-button'
      button.setAttribute('data-status', STATUS.IDLE)
      button.innerHTML = `
                <svg viewBox="0 0 24 24">
                    <path d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z"/>
                </svg>`
      return button
    }

    // 处理所有 TTS 标记
    processAllTTSMarks() {
      // 处理 {{jp:文本}} 格式的标记
      this.processTTSMarks()

      // 处理 {{jp-auto:文本}} 格式的标记
      this.processAutoTTSMarks()
    }

    // 处理 {{jp:文本}} 标记
    processTTSMarks() {
      const jpRegex = /{{jp:(.*?)}}/g
      document.body.innerHTML = document.body.innerHTML.replace(jpRegex, (match, text) => {
        return `<span class="tts-text">${text}</span>`
      })

      // 为所有 tts-text 添加按钮
      document.querySelectorAll('.tts-text').forEach((el) => {
        if (!el.nextElementSibling?.classList.contains('tts-button')) {
          el.insertAdjacentElement('afterend', this.createButton())
        }
      })
    }

    // 处理 {{jp-auto:文本}} 标记
    processAutoTTSMarks() {
      const jpAutoRegex = /{{jp-auto:(.*?)}}/g
      document.body.innerHTML = document.body.innerHTML.replace(jpAutoRegex, (match, text) => {
        return `<span class="tts-text tts-auto">${text}</span>`
      })

      // 为所有 tts-auto 添加按钮
      document.querySelectorAll('.tts-text.tts-auto').forEach((el) => {
        if (!el.nextElementSibling?.classList.contains('tts-button')) {
          el.insertAdjacentElement('afterend', this.createButton())
        }
      })
    }

    setupEventListeners() {
      document.addEventListener('click', async (e) => {
        const trigger = e.target.closest('.tts-button')
        if (!trigger) return

        const status = trigger.getAttribute('data-status')
        if (status === STATUS.LOADING || status === STATUS.PLAYING) {
          this.stopPlayback()
          return
        }

        const textElement = trigger.previousElementSibling
        if (!textElement?.classList.contains('tts-text')) return

        await this.play(textElement.textContent.trim(), trigger)
      })
    }

    handleAutoPlay() {
      const autoElements = document.querySelectorAll('.tts-auto')
      autoElements.forEach((el) => {
        setTimeout(() => {
          const trigger = el.nextElementSibling
          if (trigger?.classList.contains('tts-button')) {
            this.play(el.textContent.trim(), trigger)
          }
        }, this.autoPlayDelay)
      })
    }

    updateButtonStatus(trigger, status) {
      if (!trigger) return
      trigger.setAttribute('data-status', status)
      trigger.classList.toggle('disabled', status === STATUS.LOADING || status === STATUS.PLAYING)
    }

    stopPlayback() {
      if (this.currentAudio) {
        this.currentAudio.pause()
        this.currentAudio.currentTime = 0
        this.currentAudio = null
      }
      document.querySelectorAll('.tts-button').forEach((trigger) => {
        this.updateButtonStatus(trigger, STATUS.IDLE)
      })
    }

    async getAudioUrl(text) {
      const url = `https://api.tts.quest/v3/voicevox/synthesis?key=${this.key}&speaker=${this.speaker}&text=${encodeURIComponent(text)}`
      const response = await fetch(url)
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || '语音生成失败')
      }

      return data.mp3StreamingUrl
    }

    async play(text, trigger) {
      try {
        this.stopPlayback()
        this.updateButtonStatus(trigger, STATUS.LOADING)

        let audioUrl
        if (this.audioCache.has(text)) {
          audioUrl = this.audioCache.get(text)
        } else {
          audioUrl = await this.getAudioUrl(text)
          this.audioCache.set(text, audioUrl)
        }

        const audio = new Audio(audioUrl)
        this.currentAudio = audio

        audio.onplay = () => {
          this.updateButtonStatus(trigger, STATUS.PLAYING)
        }

        audio.onended = () => {
          this.updateButtonStatus(trigger, STATUS.IDLE)
          this.currentAudio = null
        }

        audio.onerror = () => {
          this.handleError(trigger, '音频播放失败')
        }

        await audio.play()
      } catch (error) {
        this.handleError(trigger, error.message)
      }
    }

    handleError(trigger, message) {
      console.error('TTS error:', message)
      this.updateButtonStatus(trigger, STATUS.ERROR)
      setTimeout(() => {
        this.updateButtonStatus(trigger, STATUS.IDLE)
      }, 2000)
      this.currentAudio = null
    }
  }

  // 自动创建实例
  window.ankiJPVoice = new ankiJPVoice()
})(window)
