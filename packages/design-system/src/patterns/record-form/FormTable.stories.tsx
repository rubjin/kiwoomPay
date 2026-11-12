import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../components/Button';
import { DateField, SelectBox, TextField } from '../../components/field';
import { Checkbox, Radio, RadioGroup } from '../../components/selection';
import { FormTable } from './FormTable';

const meta = {
  title: 'Composites/Form/Record Form/FormTable',
  component: FormTable,
  parameters: { layout: 'padded' },
  args: { children: null },
} satisfies Meta<typeof FormTable>;
export default meta;
type Story = StoryObj<typeof meta>;

const { Row, Label, Cell, Head, InlineLabel } = FormTable;
const opts = [{ value: 'a', label: '법인사업자' }];

/** 라벨-값 4쌍 (기본): 라벨 138 · 값 같은 폭 · 줄 52. 필수는 required */
export const Pairs: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <FormTable>
      <Row>
        <Label required>사업자번호</Label>
        <Cell>
          <TextField fullWidth defaultValue="123-45-67890" />
        </Cell>
        <Label required>사업자구분</Label>
        <Cell>
          <SelectBox fullWidth options={opts} defaultValue="a" />
        </Cell>
        <Label>영중소 구분</Label>
        <Cell>중소2</Cell>
        <Label required>신탁 구분</Label>
        <Cell>
          <RadioGroup direction="horizontal" defaultValue="y">
            <Radio value="n" label="해당없음" />
            <Radio value="y" label="해당있음" />
          </RadioGroup>
        </Cell>
      </Row>
      <Row>
        <Label required>설립일자</Label>
        <Cell>
          <DateField defaultValue="2008-01-01" />
        </Cell>
        <Label required>표준산업 분류코드</Label>
        <Cell style={{ gap: 8 }}>
          <TextField fullWidth defaultValue="47911" />
          <Button variant="neutral" appearance="line">
            찾기
          </Button>
        </Cell>
        <Label>회사 이메일</Label>
        <Cell colSpan={3}>
          <TextField fullWidth defaultValue="abccmc@naver.com" />
        </Cell>
      </Row>
    </FormTable>
  ),
};

/** 칸 합치기 colSpan: 값 1칸 = 1, 값 2칸 넓이 = 3, 라벨 뒤 줄 끝까지 = 7 */
export const ColSpan: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <FormTable>
      <Row>
        <Label required>업종</Label>
        <Cell colSpan={3}>
          <TextField fullWidth defaultValue="전자상거래 및 온라인 플랫폼 운영" />
        </Cell>
        <Label required>업태</Label>
        <Cell colSpan={3}>
          <TextField fullWidth defaultValue="정보통신업" />
        </Cell>
      </Row>
      <Row>
        <Label required>사업장 주소</Label>
        <Cell colSpan={7}>
          <Checkbox label="사업장 주소와 동일" />
          <InlineLabel>우편번호</InlineLabel>
          <TextField style={{ width: 200 }} defaultValue="46757" />
          <Button variant="neutral" appearance="line">
            찾기
          </Button>
          <InlineLabel>주소</InlineLabel>
          <TextField fullWidth style={{ flex: '1 1 0' }} defaultValue="부산광역시 강서구" />
        </Cell>
      </Row>
    </FormTable>
  ),
};

/** 목록형 표 (template + Head): 체크 36 + 같은 폭 칸, 머리 44 (Figma 담당자 정보) */
export const Matrix: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <FormTable template="36px repeat(3, minmax(0, 1fr))">
      <Row>
        <Head>
          <Checkbox aria-label="전체 선택" />
        </Head>
        <Head>업무구분</Head>
        <Head>담당자명</Head>
        <Head>이메일</Head>
      </Row>
      {['최계약', '김정산'].map((name) => (
        <Row key={name}>
          <Cell center>
            <Checkbox aria-label="선택" />
          </Cell>
          <Cell>
            <SelectBox fullWidth options={[{ value: '계약', label: '계약' }]} defaultValue="계약" />
          </Cell>
          <Cell>
            <TextField fullWidth defaultValue={name} />
          </Cell>
          <Cell>
            <TextField fullWidth defaultValue="choi@company.com" />
          </Cell>
        </Row>
      ))}
    </FormTable>
  ),
};

/** 조회 전용 값 (페이지 패턴 P-5: 텍스트로 표시) */
export const ReadOnly: Story = {
  parameters: {
    controls: { disable: true },
    tempWork: '조회 전용 화면 시안 없음 — 값 텍스트 표시 규칙만 적용',
  },
  render: () => (
    <FormTable pairs={2}>
      <Row>
        <Label>사업자번호</Label>
        <Cell>123-45-67890</Cell>
        <Label>대표자</Label>
        <Cell>홍길동</Cell>
      </Row>
    </FormTable>
  ),
};
