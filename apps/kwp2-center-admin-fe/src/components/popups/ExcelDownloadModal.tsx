/**
 * 화면ID: [KWPC04010107] 엑셀 다운로드 설정 팝업
 * 위치: 거래내역 > 통합 거래 및 예외 관리 > 통합 거래내역 · /transaction/integrated/list (팝업, 여러 화면 공통 — 가맹점 정산 실행/처리)
 */
import {
  Button,
  ConfigField,
  Infobox,
  Modal,
  Radio,
  RadioGroup,
  SelectBox,
  TransferList,
  useAction,
  Stack,
  type TransferItem,
} from '@kiwoompay/design-system';
import { useState } from 'react';

const LABEL_WIDTH = 80;

interface ExcelDownloadModalProps {
  open: boolean;
  /** 출력할 수 있는 항목 (보통 표 열. TODO(API) 엑셀 전용 항목이 따로 있으면 교체) */
  items: TransferItem[];
  /** 처음 고른 항목 · [불러오기] 기준 */
  defaultKeys: string[];
  /** 다운로드 유형 (없으면 줄을 숨긴다) — 예: 일반 거래내역 · 미납자료 추출 */
  typeOptions?: { value: string; label: string }[];
  onClose: () => void;
}

/**
 * 엑셀 다운로드 설정 — 패턴 P07 V02 (선택 · 순서). 여러 조회 화면 공용 — 항목만 화면이 넘긴다.
 * (임의 작업) 템플릿 불러오기 · 저장 · 삭제, 다운로드 요청 결과 문구
 */
export function ExcelDownloadModal({
  open,
  items,
  defaultKeys,
  typeOptions,
  onClose,
}: ExcelDownloadModalProps) {
  const [type, setType] = useState(typeOptions?.[0]?.value ?? '');
  const [columns, setColumns] = useState(defaultKeys);

  const download = useAction({
    validate: () => (columns.length === 0 ? '출력할 항목을 1개 이상 선택해주세요.' : null),
    run: () => new Promise((resolve) => setTimeout(resolve, 500)), // TODO(API) 엑셀 생성 요청
    onSuccess: onClose,
    success: '엑셀 다운로드를 요청했습니다. 대용량 파일은 다운로드 센터에서 받을 수 있습니다.',
  });

  return (
    <Modal open={open} onClose={download.loading ? undefined : onClose} size="lg">
      <Modal.Header title="엑셀 다운로드 설정" closeButton />
      <Modal.Body>
        <Stack gap={12}>
          {typeOptions && (
            <ConfigField label="다운로드 유형" labelWidth={LABEL_WIDTH}>
              <RadioGroup direction="horizontal" value={type} onChange={setType}>
                {typeOptions.map((o) => (
                  <Radio key={o.value} value={o.value} label={o.label} />
                ))}
              </RadioGroup>
            </ConfigField>
          )}
          <ConfigField label="엑셀 템플릿" labelWidth={LABEL_WIDTH}>
            {/* TODO(API) 내 엑셀 템플릿 목록 · 저장 · 삭제 */}
            <SelectBox fullWidth options={[]} />
            <Button variant="neutral" appearance="line" onClick={() => setColumns(defaultKeys)}>
              불러오기
            </Button>
            <Button variant="primary" appearance="line">
              저장
            </Button>
            <Button variant="danger" appearance="line">
              삭제
            </Button>
          </ConfigField>
          <TransferList items={items} value={columns} onChange={setColumns} />
          <Infobox>
            <Infobox.Item>
              개인정보·결제정보는 다운로드 권한에 따라 마스킹 또는 원문으로 제공되며, 모든 Excel
              파일은 암호화되고 대용량 파일은 다운로드센터에서 생성 결과를 확인할 수 있습니다.
            </Infobox.Item>
          </Infobox>
        </Stack>
      </Modal.Body>
      <Modal.Footer>
        <Button
          size="lg"
          variant="neutral"
          appearance="line"
          disabled={download.loading}
          onClick={onClose}
        >
          취소
        </Button>
        <Button size="lg" onClick={() => download.execute()}>
          엑셀 다운로드
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
