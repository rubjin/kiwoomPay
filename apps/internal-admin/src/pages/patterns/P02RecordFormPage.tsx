import {
  // 화면 틀 · 화면명 옆 대상 표시
  PageLayout,
  ContextChip,
  Badge,
  // 카드 · 묶음 · 입력 표
  FormSection,
  FormGroup,
  SectionHeading,
  FormTable,
  Tab,
  // 입력 컨트롤
  TextField,
  SelectBox,
  Radio,
  RadioGroup,
  Checkbox,
  // 버튼 · 아이콘
  Button,
  ControlGroup,
  Icon,
  // 확인/안내 창
  useDialog,
} from '@kiwoompay/design-system';
import { useState } from 'react';
import { COMPLAINT_HISTORY, P02ComplaintModal } from './P02ComplaintModal';
import { P02DetailModal } from './P02DetailModal';

/**
 * 레이아웃 패턴 P02 Record → Form 템플릿 (화면 확인용, 임의 작업).
 * 새 등록 · 수정 화면은 이 구성을 복사해 시작한다: 화면명(+ 대상 문맥) → 제목 탭 · 저장 → 카드(FormSection) 안 묶음(FormGroup = SectionHeading + FormTable).
 * 가이드: Storybook Patterns/P02 Record Form
 */

const { Row, Label, Cell, Head } = FormTable;

const TYPE_OPTIONS = [
  { value: 'a', label: '구분 A' },
  { value: 'b', label: '구분 B' },
];

interface Contact {
  id: number;
  name: string;
  email: string;
}

export function P02RecordFormPage() {
  const dialog = useDialog();
  const [tab, setTab] = useState('basic');
  const [contacts, setContacts] = useState<Contact[]>([
    { id: 1, name: '홍길동', email: 'hong@example.com' },
  ]);
  const [checked, setChecked] = useState<number[]>([]);
  const [detailOpen, setDetailOpen] = useState<'normal' | 'error' | null>(null);
  const [complaintOpen, setComplaintOpen] = useState<'empty' | 'history' | null>(null);

  const save = async () => {
    if (!(await dialog.confirm('저장할까요?'))) return;
    await dialog.alert('저장되었습니다.');
  };

  const addContact = () =>
    setContacts((list) => [...list, { id: Date.now(), name: '', email: '' }]);
  const removeChecked = () => {
    setContacts((list) => list.filter((c) => !checked.includes(c.id)));
    setChecked([]);
  };
  const toggle = (id: number, on: boolean) =>
    setChecked((list) => (on ? [...list, id] : list.filter((x) => x !== id)));

  return (
    <>
      <PageLayout.Title
        title="P02 Record → Form (레이아웃 패턴)"
        titleAddon={
          <>
            <ContextChip
              items={[
                { label: '대상', value: '예시 대상' },
                { label: '번호', value: '000-00-00000' },
              ]}
            />
            <Badge size="sm" tone="success" dot>
              정상
            </Badge>
          </>
        }
        actions={
          <>
            <Button variant="neutral" appearance="line" onClick={() => setDetailOpen('normal')}>
              상세 팝업 (조회 전용)
            </Button>
            <Button variant="neutral" appearance="line" onClick={() => setDetailOpen('error')}>
              상세 팝업 (결제 오류)
            </Button>
            <Button variant="neutral" appearance="line" onClick={() => setComplaintOpen('empty')}>
              민원 처리 팝업 (조회 + 입력)
            </Button>
            <Button variant="neutral" appearance="line" onClick={() => setComplaintOpen('history')}>
              민원 처리 팝업 (접수정보 있음)
            </Button>
          </>
        }
      />

      <FormSection
        underTitle
        collapsible
        tabs={
          <Tab variant="title" value={tab} onChange={setTab}>
            <Tab.Item value="basic">기본 정보 관리</Tab.Item>
            <Tab.Item value="extra">부가 정보</Tab.Item>
          </Tab>
        }
        tabActions={
          <>
            <Button
              variant="neutral"
              appearance="line"
              iconOnly
              icon={<Icon name="refresh" size={20} />}
              aria-label="새로고침"
            />
            <Button onClick={save}>저장</Button>
          </>
        }
      >
        <FormGroup>
          <SectionHeading title="기본 정보" actions={<FormSection.Toggle />} />
          <FormTable>
            <Row>
              <Label required>이름</Label>
              <Cell>
                <TextField fullWidth defaultValue="예시 이름" />
              </Cell>
              <Label required>구분</Label>
              <Cell>
                <SelectBox fullWidth options={TYPE_OPTIONS} defaultValue="a" />
              </Cell>
              <Label>조회 전용 값</Label>
              <Cell>텍스트로 표시</Cell>
              <Label required>사용 여부</Label>
              <Cell>
                <RadioGroup direction="horizontal" defaultValue="y">
                  <Radio value="y" label="사용" />
                  <Radio value="n" label="미사용" />
                </RadioGroup>
              </Cell>
            </Row>
            <Row>
              <Label>설명</Label>
              <Cell colSpan={7}>
                <TextField fullWidth placeholder="한 줄을 모두 쓰는 항목은 colSpan" />
              </Cell>
            </Row>
          </FormTable>
        </FormGroup>

        <FormGroup>
          <SectionHeading
            title="담당자 정보"
            description="여러 줄 입력 표 (추가 · 선택 삭제)"
            actions={
              <ControlGroup>
                <Button size="sm" variant="neutral" appearance="line" onClick={addContact}>
                  추가
                </Button>
                <Button
                  size="sm"
                  variant="neutral"
                  appearance="line"
                  disabled={checked.length === 0}
                  onClick={removeChecked}
                >
                  선택 삭제
                </Button>
              </ControlGroup>
            }
          />
          <FormTable template="36px repeat(2, minmax(0, 1fr))">
            <Row>
              <Head>
                <Checkbox
                  aria-label="전체 선택"
                  checked={contacts.length > 0 && checked.length === contacts.length}
                  indeterminate={checked.length > 0 && checked.length < contacts.length}
                  onChange={(e) => setChecked(e.target.checked ? contacts.map((c) => c.id) : [])}
                />
              </Head>
              <Head>담당자명</Head>
              <Head>이메일</Head>
            </Row>
            {contacts.map((c) => (
              <Row key={c.id}>
                <Cell center>
                  <Checkbox
                    aria-label="선택"
                    checked={checked.includes(c.id)}
                    onChange={(e) => toggle(c.id, e.target.checked)}
                  />
                </Cell>
                <Cell>
                  <TextField fullWidth defaultValue={c.name} />
                </Cell>
                <Cell>
                  <TextField fullWidth defaultValue={c.email} />
                </Cell>
              </Row>
            ))}
          </FormTable>
        </FormGroup>
      </FormSection>

      <FormSection collapsible defaultCollapsed>
        <FormGroup>
          <SectionHeading
            label="선택 항목"
            title="접힌 카드 (펼치면 하위 정보)"
            actions={<FormSection.Toggle />}
          />
          <FormTable>
            <Row>
              <Label>항목</Label>
              <Cell colSpan={7}>하위 정보 예시</Cell>
            </Row>
          </FormTable>
        </FormGroup>
      </FormSection>

      <P02DetailModal
        key={detailOpen ?? 'closed'}
        open={detailOpen !== null}
        error={detailOpen === 'error'}
        onClose={() => setDetailOpen(null)}
      />
      <P02ComplaintModal
        open={complaintOpen !== null}
        history={complaintOpen === 'history' ? COMPLAINT_HISTORY : []}
        onClose={() => setComplaintOpen(null)}
      />
    </>
  );
}
