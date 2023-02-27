export class Template {
  private source: string = '';
  private keys: Record<string, number> = {};
  private chunks: string[] = [];

  constructor(source: string) {
    this.source = source;
    this.readSource();
  }

  private readSource() {
    const { source, chunks, keys } = this;
    const r = new RegExp('<!--(.*?)-->', 'g');
    let last = 0;
    let i = 0;
    for (let match = r.exec(source); match != null; match = r.exec(source)) {
      const { 0: full, 1: key, index } = match;
      chunks.push(source.substring(last, index).trim());
      chunks.push('');
      keys[key.toLowerCase()] = i + 1;
      last = match.index + full.length;
      i += 2;
    }
    chunks.push(source.substring(last, source.length).trim());
  }

  set(key: string, value: string) {
    const { chunks, keys } = this;
    const keyIndex = keys[key.toLowerCase()];
    if (!keyIndex) {
      throw new Error(
        `failed to set template key, ${key} not found in: ${Object.keys(
          keys,
        ).join(', ')}`,
      );
    }
    chunks[keyIndex] = value;
  }

  render() {
    return this.chunks.join('');
  }
}
