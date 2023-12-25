const chunk = <T>(array: T[], chunkCount: number) => {
  const chunkSize = Math.ceil(array.length / chunkCount);
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize);
    chunks.push(chunk);
  }
  return chunks;
};

export default chunk;
