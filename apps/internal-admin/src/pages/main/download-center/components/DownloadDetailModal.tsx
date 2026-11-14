import {
  Button,
  FormTable,
  GridPlaceholder,
  Infobox,
  Modal,
  SectionHeading,
  StatusView,
  type GridPlaceholderColumn,
  Stack,
} from '@kiwoompay/design-system';
import { useEffect, useState, type ReactNode } from 'react';
import { fetchDownloadRequestDetail } from '@/api/main/downloadCenter';
import type { DownloadHistory, DownloadRequestDetail } from '@/types/main/downloadCenter';
import { codeLabel } from '@/utils/code';
import { ACTION_LABEL, actionOf, type DownloadAction } from './downloadActions';
import { RequestConditions } from './RequestConditions';
import { DownloadStatusBadge, FileStatusBadge } from './statusBadges';
import { formatCount, orDash } from '@/utils/format';

const { Row, Label, Cell } = FormTable;

const HISTORY_COLUMNS: GridPlaceholderColumn<DownloadHistory>[] = [
  { key: 'at', header: '작업일시', width: 224 },
  { key: 'actor', header: '요청자', width: 150 },
  { key: 'result', header: '작업 결과', width: 155 },
  { key: 'note', header: '비고/재요청 사유', align: 'left' },
];

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Stack as="section" gap={8}>
      <SectionHeading as="h3" title={title} />
      {children}
    </Stack>
  );
}

export interface DownloadDetailModalProps {
  /** 열 요청번호. null이면 닫힘 */
  requestId: string | null;
  onClose: () => void;
  /** Footer 작업 (다운로드 · 재시도 · 재요청). 목록과 같은 처리 흐름을 쓴다 */
  onAction: (detail: DownloadRequestDetail, action: DownloadAction) => void;
}

/** 다운로드 요청 상세 (시안 다운로드요청상세.png) — 파일명을 누르면 연다 */
export function DownloadDetailModal({ requestId, onClose, onAction }: DownloadDetailModalProps) {
  const [detail, setDetail] = useState<DownloadRequestDetail | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!requestId) return;
    let alive = true;
    setDetail(null);
    setFailed(false);
    fetchDownloadRequestDetail(requestId)
      .then((d) => alive && setDetail(d))
      .catch(() => alive && setFailed(true));
    return () => {
      alive = false;
    };
  }, [requestId]);

  const action = detail ? actionOf(detail) : null;

  return (
    <Modal open={requestId !== null} onClose={onClose} width={1056}>
      <Modal.Header title="다운로드 요청 상세" />
      <Modal.Body>
        {!detail ? (
          <StatusView status={failed ? 'error' : 'loading'} />
        ) : (
          <Stack>
            <Infobox>
              <Infobox.Item>
                다운로드 요청 정보와 파일 생성·다운로드 상태를 확인할 수 있으며, 파일은 요청 당시의
                조회조건과 사용자 권한·마스킹 기준에 따라 생성됩니다.
              </Infobox.Item>
            </Infobox>

            <Section title="요청 정보">
              <FormTable pairs={2}>
                <Row>
                  <Label>요청번호</Label>
                  <Cell>{detail.id}</Cell>
                  <Label>업무영역</Label>
                  <Cell>{codeLabel('DOWNLOAD_AREA', detail.area)}</Cell>
                </Row>
                <Row>
                  <Label>요청자</Label>
                  <Cell>{detail.requester}</Cell>
                  <Label>요청일시</Label>
                  <Cell>{detail.requestedAt}</Cell>
                </Row>
                <Row>
                  <Label>원천 화면</Label>
                  <Cell>{detail.sourceScreen}</Cell>
                  <Label>대상 건수</Label>
                  <Cell>{formatCount(detail.targetCount, '건')}</Cell>
                </Row>
              </FormTable>
            </Section>

            <Section title="처리 및 파일 정보">
              <FormTable pairs={2}>
                <Row>
                  <Label>처리상태</Label>
                  <Cell>
                    <DownloadStatusBadge status={detail.status} />
                  </Cell>
                  <Label>파일상태</Label>
                  <Cell>
                    <FileStatusBadge status={detail.fileStatus} />
                  </Cell>
                </Row>
                <Row>
                  <Label>생성 시작일시</Label>
                  <Cell>{orDash(detail.startedAt)}</Cell>
                  <Label>처리 완료일시</Label>
                  <Cell>{orDash(detail.completedAt)}</Cell>
                </Row>
                <Row>
                  <Label>파일명</Label>
                  <Cell>{detail.fileName}</Cell>
                  <Label>파일용량</Label>
                  <Cell>{orDash(detail.fileSize)}</Cell>
                </Row>
                <Row>
                  <Label>만료일시</Label>
                  <Cell>{orDash(detail.expiresAt)}</Cell>
                  <Label>잔여기간</Label>
                  <Cell>{orDash(detail.remaining)}</Cell>
                </Row>
              </FormTable>
            </Section>

            <Section title="요청 조건">
              <RequestConditions items={detail.conditions} />
            </Section>

            <Section title="이력">
              <GridPlaceholder
                columns={HISTORY_COLUMNS}
                rows={detail.history}
                rowKey={(h) => `${h.at}-${h.result}`}
              />
            </Section>
          </Stack>
        )}
      </Modal.Body>
      <Modal.Footer>
        {action ? (
          <>
            <Button size="lg" variant="neutral" appearance="line" onClick={onClose}>
              취소
            </Button>
            <Button size="lg" onClick={() => detail && onAction(detail, action)}>
              {ACTION_LABEL[action]}
            </Button>
          </>
        ) : (
          <Button size="lg" variant="neutral" appearance="line" onClick={onClose}>
            닫기
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}
