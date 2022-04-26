function solution(message, K) {
  if (message.length <= K) return message;

  let result, label;
  
  for (let i = 0; i < message.length; i++) {
    if (message[i] === ' ') label = i + 1;
    if (i >= K) {
      result = message.slice(0, label);
      break;
    }
  }
  
  return result
}

console.log(solution('Codility We test coders', 14));
console.log(solution('Why not', 100));
console.log(solution('The quick brown fox jumps over the lazy dog', 39));
console.log(solution('To crop or not to crop', 21));