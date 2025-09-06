export type SlackEvent = {
  channel: string; user: string; text: string; ts: string;
  thread_ts?: string;
  files?: Array<{ url: string; name: string }>;
};

export interface SlackAdapter {
  connect(token: string): Promise<void>;
  watchChannels(channelIds: string[], onEvent: (e: SlackEvent) => void): void;
  resolveMessageUrl(e: SlackEvent): string;
}
