import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type CSSProperties } from 'react';
import { Button } from '../Button';
import { Field } from '../field/Field';
import { DateField } from '../field/DateField';
import { SearchField } from '../field/SearchField';
import { TextField } from '../field/TextField';
import { Modal } from './Modal';

const row: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 'var(--kp-space-24)',
  alignItems: 'flex-start',
};

const meta = {
  title: 'Components/Modal/Modal',
  component: Modal,
  args: { open: true, inline: true, children: null },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

const infoItems = [
  { label: '가맹점명', value: '키움페이 테스트 가맹점' },
  { label: '상태', value: '정상' },
  { label: '최근 변경일시', value: 'YYYY-MM-DD HH:MM' },
];

function FormContent() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--kp-space-12)' }}>
      <Field label="Label Text">
        <div style={{ display: 'flex', gap: 'var(--kp-space-8)', flex: 1 }}>
          <SearchField fullWidth />
          <Button variant="neutral">조회</Button>
        </div>
      </Field>
      <Field label="입금 금액">
        <TextField placeholder="입력해주세요" />
      </Field>
      <Field label="입금 일자">
        <DateField />
      </Field>
      <Field label="비고">
        <TextField placeholder="입력해주세요" />
      </Field>
    </div>
  );
}

/** Type: Alert · Confirm · Information · Form (미리보기: 딤 없이 패널만) */
export const Types: Story = {
  render: () => (
    <div style={row}>
      <Modal open inline>
        <Modal.Header title="안내" />
        <Modal.Body>
          <Modal.Description>중요한 안내 또는 처리 결과를 확인해주세요.</Modal.Description>
        </Modal.Body>
        <Modal.Footer>
          <Button size="lg">확인</Button>
        </Modal.Footer>
      </Modal>
      <Modal open inline>
        <Modal.Header title="확인" />
        <Modal.Body>
          <Modal.Description>입력한 항목을 저장할까요?</Modal.Description>
        </Modal.Body>
        <Modal.Footer>
          <Button size="lg" variant="neutral" appearance="line">
            취소
          </Button>
          <Button size="lg">저장</Button>
        </Modal.Footer>
      </Modal>
      <Modal open inline>
        <Modal.Header title="상세 정보" closeButton />
        <Modal.Body>
          <Modal.Description>처리 대상의 상세 정보를 확인할 수 있습니다.</Modal.Description>
          <Modal.InfoList items={infoItems} />
        </Modal.Body>
      </Modal>
      <Modal open inline>
        <Modal.Header title="정보 입력" closeButton />
        <Modal.Body>
          <FormContent />
        </Modal.Body>
        <Modal.Footer>
          <Button size="lg" variant="neutral" appearance="line">
            취소
          </Button>
          <Button size="lg">등록</Button>
        </Modal.Footer>
      </Modal>
    </div>
  ),
};

/** Action: None(버튼 없음) · Single · Double */
export const Actions: Story = {
  render: () => (
    <div style={row}>
      <Modal open inline>
        <Modal.Header title="안내" />
        <Modal.Body>
          <Modal.Description>중요한 안내 또는 처리 결과를 확인해주세요.</Modal.Description>
        </Modal.Body>
      </Modal>
      <Modal open inline>
        <Modal.Header title="안내" />
        <Modal.Body>
          <Modal.Description>중요한 안내 또는 처리 결과를 확인해주세요.</Modal.Description>
        </Modal.Body>
        <Modal.Footer>
          <Button size="lg">확인</Button>
        </Modal.Footer>
      </Modal>
      <Modal open inline>
        <Modal.Header title="확인" />
        <Modal.Body>
          <Modal.Description>입력한 항목을 저장할까요?</Modal.Description>
        </Modal.Body>
        <Modal.Footer>
          <Button size="lg" variant="neutral" appearance="line">
            취소
          </Button>
          <Button size="lg">저장</Button>
        </Modal.Footer>
      </Modal>
    </div>
  ),
};

function AlertExample() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Alert 열기</Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Modal.Header title="안내" />
        <Modal.Body>
          <Modal.Description>처리가 완료되었습니다.</Modal.Description>
        </Modal.Body>
        <Modal.Footer>
          <Button size="lg" onClick={() => setOpen(false)}>
            확인
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

function ConfirmExample() {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState('');
  return (
    <>
      <Button variant="neutral" onClick={() => setOpen(true)}>
        Confirm 열기
      </Button>
      <span>{result}</span>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Modal.Header title="확인" />
        <Modal.Body>
          <Modal.Description>입력한 항목을 저장할까요?</Modal.Description>
        </Modal.Body>
        <Modal.Footer>
          <Button size="lg" variant="neutral" appearance="line" onClick={() => setOpen(false)}>
            취소
          </Button>
          <Button
            size="lg"
            onClick={() => {
              setResult('저장됨');
              setOpen(false);
            }}
          >
            저장
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

function FormExample() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="neutral" appearance="line" onClick={() => setOpen(true)}>
        Form 열기
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Modal.Header title="정보 입력" closeButton />
        <Modal.Body>
          <FormContent />
        </Modal.Body>
        <Modal.Footer>
          <Button size="lg" variant="neutral" appearance="line" onClick={() => setOpen(false)}>
            취소
          </Button>
          <Button size="lg" onClick={() => setOpen(false)}>
            등록
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

function ScrollExample() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="dark" appearance="line" onClick={() => setOpen(true)}>
        긴 내용(스크롤) 열기
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Modal.Header title="정보 수정" closeButton />
        <Modal.Body>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--kp-space-12)' }}>
            {Array.from({ length: 30 }, (_, i) => (
              <Field key={i} label={`항목 ${i + 1}`} labelWidth={64}>
                <TextField placeholder="입력해주세요" />
              </Field>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button size="lg" variant="neutral" appearance="line" onClick={() => setOpen(false)}>
            취소
          </Button>
          <Button size="lg" onClick={() => setOpen(false)}>
            저장하기
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

function LookupExample() {
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState('');
  return (
    <>
      <Button variant="neutral" appearance="line" onClick={() => setOpen(true)}>
        Lookup 열기
      </Button>
      <span>{picked}</span>
      <Modal open={open} onClose={() => setOpen(false)} width={560}>
        <Modal.Header title="사업자번호 검색" closeButton />
        <Modal.Body>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--kp-space-12)' }}>
            <SearchField fullWidth />
            {['897-123-00005', '897-123-00006', '897-123-00007'].map((no) => (
              <Button
                key={no}
                variant="neutral"
                appearance="line"
                onClick={() => {
                  setPicked(no);
                  setOpen(false);
                }}
              >
                {no} · (주)ABC테크
              </Button>
            ))}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

/** 실제 동작: 버튼으로 열고, 확인·취소·X·Esc로 닫는다. 열리면 배경 스크롤이 잠기고, 닫히면 연 버튼으로 포커스가 돌아온다. */
export const Interactive: Story = {
  render: () => (
    <div style={{ ...row, alignItems: 'center' }}>
      <AlertExample />
      <ConfirmExample />
      <FormExample />
      <ScrollExample />
      <LookupExample />
    </div>
  ),
};
