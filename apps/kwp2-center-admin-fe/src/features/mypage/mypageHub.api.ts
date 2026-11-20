import type { MypageHub } from '@/features/mypage/mypageHub.types';
import { MYPAGE_HUB_EMPTY, MYPAGE_HUB } from '@/mocks/mypage/mypageHub.mock';
import { wait } from '@/mocks/utils';

// TODO(API) 마이페이지 요약 · 알림 읽음 API가 정해지면 axios 호출로 바꾼다.
// 지금은 화면 확인용 예시 (Figma KWPC2000_마이페이지_GUI_최초진입)
/** example: 'empty' → 특수권한 없음 · 알림 없음 예시 (화면 목록에서 `?example=empty`) */
export async function fetchMypageHub(example?: string | null): Promise<MypageHub> {
  await wait(200);
  return example === 'empty' ? MYPAGE_HUB_EMPTY : MYPAGE_HUB;
}

/** 알림 읽음 (id 없으면 모두 읽음) */
export async function markNotificationsRead(id?: string): Promise<void> {
  void id;
  await wait(300);
}
