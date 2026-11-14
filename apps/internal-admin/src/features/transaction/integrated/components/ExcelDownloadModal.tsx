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
} from '@kiwoompay/design-system';
import { useState } from 'react';
import { transactionColumns } from './transactionColumns';

const LABEL_WIDTH = 80;
const TEMPLATE_WIDTH = 438;

/** 엑셀 출력 항목 = Grid 열 (TODO(API) 엑셀 전용 항목이 따로 있으면 교체) */
const EXCEL_ITEMS = transactionColumns.map((col) => ({ key: col.key, label: col.header }));
const EXCEL_DEFAULT = EXCEL_ITEMS.slice(3, 13).map((item) => item.key);

interface ExcelDownloadModalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * KWPC04010107 엑셀 다운로드 설정 — 패턴 P07 V02 (선택 · 순서).
 * (임의 작업) 템플릿 불러오기 · 저장 · 삭제, 다운로드 요청 결과 문구
 */
export function ExcelDownloadModal({ open, onClose }: ExcelDownloadModalProps) {
  const [type, setType] = useState('normal');
  const [columns, setColumns] = useState(EXCEL_DEFAULT);

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
          <ConfigField label="다운로드 유형" labelWidth={LABEL_WIDTH}>
            <RadioGroup direction="horizontal" value={type} onChange={setType}>
              <Radio value="normal" label="일반 거래내역" />
              <Radio value="unpaid" label="미납자료 추출" />
            </RadioGroup>
          </ConfigField>
          <ConfigField label="엑셀 템플릿" labelWidth={LABEL_WIDTH}>
            {/* TODO(API) 내 엑셀 템플릿 목록 · 저장 · 삭제 */}
            <SelectBox style={{ width: TEMPLATE_WIDTH }} fullWidth options={[]} />
            <Button variant="neutral" appearance="line" onClick={() => setColumns(EXCEL_DEFAULT)}>
              불러오기
            </Button>
            <Button variant="primary" appearance="line">
              저장
            </Button>
            <Button variant="danger" appearance="line">
              삭제
            </Button>
          </ConfigField>
          <TransferList items={EXCEL_ITEMS} value={columns} onChange={setColumns} />
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
        <Button size="lg" loading={download.loading} onClick={() => download.execute()}>
          엑셀 다운로드
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
