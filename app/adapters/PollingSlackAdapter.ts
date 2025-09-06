import { WebClient } from '@slack/web-api';
import type { SlackAdapter, SlackEvent } from './SlackAdapter';

/**
 * SlackAdapter implementation that polls conversations.history for new
 * messages. This avoids RTM sockets and keeps the client-only nature of the
 * MVP. It stores the latest timestamp per channel and periodically fetches
 * new messages.
 */
export class PollingSlackAdapter implements SlackAdapter {
  private client: WebClient | null = null;
  private teamId: string | null = null;
  private lastTs = new Map<string, string>();
  private timers = new Map<string, ReturnType<typeof setInterval>>();

  async connect(token: string): Promise<void> {
    this.client = new WebClient(token);
    const auth = await this.client.auth.test();
    this.teamId = auth.team_id as string;
  }

  watchChannels(channelIds: string[], onEvent: (e: SlackEvent) => void): void {
    if (!this.client) throw new Error('not connected');
    for (const id of channelIds) {
      this.pollChannel(id, onEvent);
      const timer = setInterval(() => this.pollChannel(id, onEvent), 30000);
      this.timers.set(id, timer);
    }
  }

  private async pollChannel(channel: string, cb: (e: SlackEvent) => void) {
    if (!this.client) return;
    const oldest = this.lastTs.get(channel);
    const res = await this.client.conversations.history({ channel, oldest });
    if (!res.messages) return;
    // messages are returned newest first; process oldest first
    const msgs = [...res.messages].reverse();
    for (const m of msgs) {
      if (!m.ts) continue;
      this.lastTs.set(channel, m.ts as string);
      cb({
        channel,
        user: (m as any).user || '',
        text: (m as any).text || '',
        ts: m.ts as string,
        thread_ts: (m as any).thread_ts,
        files: ((m as any).files || []).map((f: any) => ({
          url: f.url_private as string,
          name: f.name as string
        }))
      });
    }
  }

  resolveMessageUrl(e: SlackEvent): string {
    const ts = e.ts.replace('.', '');
    return `https://app.slack.com/client/${this.teamId}/${e.channel}/p${ts}`;
  }
}
