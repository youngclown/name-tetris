export const CONTINUE_CLEAR_ROWS = 3;
export const STORE_APP_NAME = 'OO이 테트리스';

export function getDisplayName(name: string): string {
  const trimmed = name.trim();
  return trimmed || '친구';
}

export function getGameTitle(name: string): string {
  return `${getDisplayName(name)} 테트리스`;
}

export function getBadgeLabel(name: string): string {
  return `${getDisplayName(name)} 전용`;
}

export function getGameSubtitle(name: string): string {
  return `${getDisplayName(name)}만을 위한 특별한 게임`;
}

export function getVocative(name: string): string {
  return `${getDisplayName(name)}아`;
}

export function getLineClearMessage(name: string, clearedLines: number): string {
  const displayName = getDisplayName(name);
  const vocative = getVocative(name);

  const pools: Record<number, string[]> = {
    1: [`좋아, ${vocative}!`, '한 줄 깔끔!', '잘했어!'],
    2: ['와! 두 줄이야!', `${displayName} 최고!`, '대단해!'],
    3: ['미쳤다!! 세 줄!!', `${displayName} 천재?`, '완전 고수!'],
  };

  const pool = pools[Math.min(clearedLines, 3)] ?? [`${vocative} 대박!!`, '엄청나!'];
  return pool[Math.floor(Math.random() * pool.length)];
}

export function getHintMessage(name: string): string {
  const vocative = getVocative(name);
  const displayName = getDisplayName(name);
  const hints = [
    `${vocative}, 블록을 끌어서 놓아봐!`,
    '가로·세로 줄을 채우면 점수가 쑥!',
    `${displayName}의 최고 기록에 도전해 보자!`,
  ];
  return hints[Math.floor(Math.random() * hints.length)];
}

export function getGameOverMessage(name: string): string {
  return `${getVocative(name)}, 한 번 더 도전해볼까?`;
}

export function getNewRecordMessage(name: string): string {
  return `${getVocative(name)}, 새 최고 기록이야!`;
}

export function getContinueMessage(): string {
  return `아래 ${CONTINUE_CLEAR_ROWS}줄을 비우고 이어할 수 있어!`;
}

export function getContinueCheerMessage(name: string): string {
  return `${getVocative(name)}, 다시 가보자!`;
}

export function getRankingTitle(name: string): string {
  return `${getDisplayName(name)}의 명예의 전당`;
}

export function getRankingSubtitle(name: string): string {
  return `${getDisplayName(name)}의 최고 기록들`;
}

export function getRankingEmptyMessage(name: string): string {
  return `아직 기록이 없어요.\n${getVocative(name)}, 첫 기록에 도전해 보자!`;
}

export function getPhotoModalDescription(name: string): string {
  return `${getDisplayName(name)}이 좋아하는 사진을 블록에 넣을 수 있어요.\nㄴ, ㄷ, ㅁ, ㅣ 모양에 맞게 자동으로 잘려요!`;
}