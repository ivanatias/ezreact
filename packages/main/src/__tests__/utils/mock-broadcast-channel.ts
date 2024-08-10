// biome-ignore lint/suspicious/noExplicitAny: <ignore>
type Listener = ({ data }: { data: any }) => void

export let allListeners = [] as {
  channelKey: string
  event: 'message' | 'messageerror'
  listener: Listener
  source: string
}[]

export class MockBroadcastChannel {
  private source = window.crypto.randomUUID()
  private isChannelClosed = false

  constructor(private key: string) {}

  addEventListener(event: 'message' | 'messageerror', listener: Listener) {
    if (event !== 'message' && event !== 'messageerror') return
    allListeners.push({
      channelKey: this.key,
      event,
      listener,
      source: this.source
    })
  }

  removeEventListener(listener: Listener) {
    allListeners = allListeners.filter((l) => {
      return !(l.listener === listener && l.source === this.source)
    })
  }

  // biome-ignore lint/suspicious/noExplicitAny: <ignore>
  postMessage(message: any) {
    if (this.isChannelClosed) {
      throw new Error('Can not post a message on a closed channel')
    }

    for (const { channelKey, listener, source } of allListeners) {
      if (channelKey !== this.key || source === this.source) continue
      listener({ data: message })
    }
  }

  close() {
    this.isChannelClosed = true
  }
}
