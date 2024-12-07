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

  class AnkiJPVoice {
    constructor(options = {}) {
      this.key = options.key || 'e-a9G2o619X372w'
      this.speaker = options.speaker || 14
      this.autoPlayDelay = options.autoPlayDelay || 500
      this.initialized = false
      this.audioCache = new Map()
      this.currentAudio = null
      this.lastPlayTime = 0
      this.cooldown = options.cooldown || 1000 // 播放冷却时间（毫秒）

      // 清理缓存
      this.cleanupCache()

      // 初始化
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.init())
      } else {
        this.init()
      }
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
      // 处理带有 data-tts 属性的元素
      document.querySelectorAll('[data-tts]').forEach((el) => {
        if (!el.nextElementSibling?.classList.contains('tts-button')) {
          const button = this.createButton()
          if (el.getAttribute('data-tts-auto') === 'true') {
            button.setAttribute('data-auto', 'true')
          }
          el.insertAdjacentElement('afterend', button)
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
        if (!textElement?.hasAttribute('data-tts')) return

        const text = textElement.getAttribute('data-tts') || textElement.textContent.trim()
        await this.play(text, trigger)
      })
    }

    handleAutoPlay() {
      document.querySelectorAll('[data-tts][data-tts-auto="true"]').forEach((el) => {
        setTimeout(() => {
          const trigger = el.nextElementSibling
          if (trigger?.classList.contains('tts-button')) {
            const text = el.getAttribute('data-tts') || el.textContent.trim()
            this.play(text, trigger)
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
      if (!text) return

      const now = Date.now()
      if (now - this.lastPlayTime < this.cooldown) {
        return
      }

      try {
        this.stopPlayback()
        this.updateButtonStatus(trigger, STATUS.LOADING)
        this.lastPlayTime = now

        let audioUrl
        if (this.audioCache.has(text)) {
          audioUrl = this.audioCache.get(text)
        } else {
          audioUrl = await this.getAudioUrl(text)
          this.audioCache.set(text, audioUrl)
        }

        const audio = new Audio(audioUrl)
        this.currentAudio = audio

        audio.addEventListener('playing', () => {
          this.updateButtonStatus(trigger, STATUS.PLAYING)
        })

        audio.addEventListener('ended', () => {
          this.updateButtonStatus(trigger, STATUS.IDLE)
          this.currentAudio = null
        })

        audio.addEventListener('error', () => {
          this.updateButtonStatus(trigger, STATUS.ERROR)
          this.currentAudio = null
          this.audioCache.delete(text)
        })

        await audio.play()
      } catch (error) {
        console.error('播放失败:', error)
        this.updateButtonStatus(trigger, STATUS.ERROR)
        this.audioCache.delete(text)
      }
    }

    // 清理缓存
    cleanupCache() {
      const lastCleanup = localStorage.getItem('tts_last_cleanup')
      const now = Date.now()

      if (!lastCleanup || now - parseInt(lastCleanup, 10) > 86400000) {
        // 24小时
        this.audioCache.clear()
        localStorage.setItem('tts_last_cleanup', now.toString())
      }
    }
  }

  // 导出到全局
  window.AnkiJPVoice = AnkiJPVoice
})(window)
