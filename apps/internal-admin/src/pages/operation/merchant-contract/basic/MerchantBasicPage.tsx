import {
  ControlGroup,
  Badge,
  Button,
  ContextChip,
  FormGroup,
  FormSection,
  Icon,
  PageLayout,
  Tab,
  TextButton,
  useDialog,
  SectionHeading,
} from '@kiwoompay/design-system';
import { useEffect, useState } from 'react';
import { emptyBasic, fetchMerchant, newContact, saveMerchant } from '@/api/operation/merchantBasic';
import type { MerchantRecord } from '@/types/operation/merchantBasic';
import { BasicInfoTable } from './components/BasicInfoTable';
import { ContactTable } from './components/ContactTable';
import { CPID_SECTIONS_ALL, CpidBasicPanel, cpidSectionId } from './components/CpidBasicPanel';
import { codeLabel } from '@/utils/code';

/** 선택 CPID 영역 탭 = 섹션 바로가기 (Figma: 한 화면에 이어진 섹션) */
const CPID_TABS = CPID_SECTIONS_ALL;

type Mode = 'create' | 'edit';

const emptyRecord = (): MerchantRecord => ({
  basic: emptyBasic('985-21-47111'),
  contacts: [newContact(), newContact(), newContact(), newContact()],
});

const refresh = <Icon name="refresh" size={20} />;

/**
 * KWPC07010101 가맹점 기본/계약 정보 관리 — 페이지 패턴 P02 Record → Form.
 * create: 신규등록_Collapsed (28459:11020) · edit: 조회수정 (28298:50)
 */
function MerchantBasicPage({ mode }: { mode: Mode }) {
  const dialog = useDialog();
  const [record, setRecord] = useState<MerchantRecord | null>(
    mode === 'create' ? emptyRecord() : null,
  );
  const [selected, setSelected] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState('business');
  const [cpidTab, setCpidTab] = useState(CPID_TABS[0]!);

  useEffect(() => {
    if (mode === 'edit') void fetchMerchant().then(setRecord);
  }, [mode]);

  if (!record) return null;
  const { basic } = record;
  const notReady = (name: string) => dialog.alert(`${name}은(는) 준비 중입니다.`);

  const save = async () => {
    const label = mode === 'create' ? '등록' : '저장';
    // TODO(정책) 필수 입력 검증 · 변경 항목 확인은 화면설계서 확인 후 (임의 작업: 사업자구분만 확인)
    if (!basic.bizType) {
      await dialog.alert('사업자구분을 선택해주세요.');
      return;
    }
    if (!(await dialog.confirm(`가맹점 기본 정보를 ${label}할까요?`, { confirmText: label })))
      return;
    setSaving(true);
    try {
      await saveMerchant(record);
      await dialog.alert(`${label}되었습니다.`);
    } finally {
      setSaving(false);
    }
  };

  const reload = async () => {
    if (mode === 'edit') setRecord(await fetchMerchant());
    else setRecord(emptyRecord());
    setSelected([]);
  };

  const removeContacts = async () => {
    if (selected.length === 0) {
      await dialog.alert('삭제할 담당자를 선택해주세요.');
      return;
    }
    setRecord({ ...record, contacts: record.contacts.filter((c) => !selected.includes(c.key)) });
    setSelected([]);
  };

  const saveButtons = (
    <ControlGroup>
      <Button
        variant="neutral"
        appearance="line"
        iconOnly
        icon={refresh}
        aria-label="새로고침"
        onClick={reload}
      />
      <Button loading={saving} onClick={save}>
        {mode === 'create' ? '등록' : '저장'}
      </Button>
    </ControlGroup>
  );

  return (
    <>
      <PageLayout.Title
        title="가맹점 기본/계약 정보 관리"
        titleAddon={
          mode === 'edit' && (
            <>
              <ContextChip
                items={[
                  { label: '현재 사업자', value: basic.nameKo },
                  { label: '사업자번호', value: basic.bizNo },
                  {
                    label: '사업자구분',
                    value: `${basic.bizType ? codeLabel('BIZ_TYPE', basic.bizType).replace('사업자', '') : ''} (${basic.smeGrade})`,
                  },
                ]}
              />
              <Badge size="sm" tone="success" dot>
                정상
              </Badge>
            </>
          )
        }
      />

      {/* 사업자 정보 관리 (Figma: 제목 탭 + 오른쪽 새로고침 · 등록) */}
      <FormSection
        underTitle
        tabs={
          <Tab variant="title" value={view} onChange={setView}>
            <Tab.Item value="business">사업자 정보 관리</Tab.Item>
            <Tab.Item value="customer">고객 확인 정보</Tab.Item>
            <Tab.Item value="open">결제 오픈 현황</Tab.Item>
          </Tab>
        }
        tabActions={saveButtons}
        collapsible
      >
        <FormGroup>
          <SectionHeading title="기본 정보" actions={<FormSection.Toggle />} />
          {view === 'business' ? (
            <BasicInfoTable
              mode={mode}
              value={basic}
              onChange={(patch) => setRecord({ ...record, basic: { ...basic, ...patch } })}
              onAction={notReady}
            />
          ) : (
            <p>
              (임의 작업) {view === 'customer' ? '고객 확인 정보' : '결제 오픈 현황'} 탭은 시안 확인
              후 작업합니다.
            </p>
          )}
        </FormGroup>
        {view === 'business' && (
          <FormGroup>
            <SectionHeading
              title="담당자 정보"
              description="자금세탁방지 공지용 담당자 정보"
              actions={
                <>
                  <TextButton onClick={() => notReady('담당자 이력조회')}>이력조회</TextButton>
                  <ControlGroup>
                    <Button
                      size="sm"
                      variant="neutral"
                      appearance="line"
                      onClick={() =>
                        setRecord({ ...record, contacts: [...record.contacts, newContact()] })
                      }
                    >
                      추가
                    </Button>
                    <Button size="sm" variant="dark" appearance="line" onClick={removeContacts}>
                      삭제
                    </Button>
                  </ControlGroup>
                </>
              }
            />
            <ContactTable
              rows={record.contacts}
              onChange={(contacts) => setRecord({ ...record, contacts })}
              selected={selected}
              onSelectedChange={setSelected}
            />
          </FormGroup>
        )}
      </FormSection>

      {/* 가맹점 정보관리 — 선택 CPID (Figma: 신규는 접힘 "열기", 조회수정은 펼침) */}
      <FormSection
        tabs={
          <Tab variant="title" value="cpid">
            <Tab.Item value="cpid">가맹점 정보관리</Tab.Item>
          </Tab>
        }
        tabActions={
          mode === 'edit' ? (
            <ControlGroup spacing="lg">
              <ControlGroup>
                <Button
                  variant="neutral"
                  appearance="line"
                  onClick={() => notReady('정보일괄변경')}
                >
                  정보일괄변경
                </Button>
                <Button
                  variant="neutral"
                  appearance="line"
                  onClick={() => notReady('키움저축계좌통지')}
                >
                  키움저축계좌통지
                </Button>
              </ControlGroup>
              {saveButtons}
            </ControlGroup>
          ) : (
            saveButtons
          )
        }
        collapsible
        defaultCollapsed={mode === 'create'}
      >
        <FormGroup>
          <SectionHeading
            label="선택 CPID"
            title={
              record.cpid ? `${record.cpid.id} · ${record.cpid.name}` : '등록된 CPID가 없습니다'
            }
            actions={
              <>
                <Tab
                  size="sm"
                  value={cpidTab}
                  onChange={(name) => {
                    setCpidTab(name);
                    document
                      .getElementById(cpidSectionId(name))
                      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  aria-label="CPID 정보 바로가기"
                >
                  {CPID_TABS.map((t) => (
                    <Tab.Item key={t} value={t}>
                      {t}
                    </Tab.Item>
                  ))}
                </Tab>
                <FormSection.Toggle />
              </>
            }
          >
            {record.cpid && (
              <>
                <ContextChip
                  muted
                  items={[
                    { label: '현재 사업자', value: basic.nameKo },
                    { label: '사업자번호', value: basic.bizNo },
                    { label: '대표자명', value: basic.ceo },
                  ]}
                />
                <Badge size="sm" tone="primary" dot>
                  {record.cpid.contract}
                </Badge>
                <Badge size="sm" tone="success" dot>
                  {record.cpid.service}
                </Badge>
              </>
            )}
          </SectionHeading>
        </FormGroup>
        <CpidBasicPanel onAction={notReady} />
        {/* TODO(시안) 결제수단별 설정 — 다음 단계 */}
        <FormGroup id={cpidSectionId('결제수단별 설정')}>
          <SectionHeading title="결제수단별 설정" />
          <p>(임의 작업) 결제수단별 설정은 다음 단계에서 작업합니다.</p>
        </FormGroup>
      </FormSection>
    </>
  );
}

/** KWPC07010101 신규등록 */
export function MerchantCreatePage() {
  return <MerchantBasicPage mode="create" />;
}

/** KWPC07010101 조회수정 */
export function MerchantEditPage() {
  return <MerchantBasicPage mode="edit" />;
}
