import { AuthInfoRow, AuthVerifyBody, Button, Modal } from '@kiwoompay/design-system';

/** SMS 인증 불가 (P05, Modal sm 400): 등록된 휴대전화번호가 없음 → 안내 + [확인]만 (닫기 X 없음) */
export function SmsUnavailableModal({ onClose }: { onClose: () => void }) {
  return (
    <Modal open onClose={onClose}>
      <Modal.Header title="SMS 인증" />
      <Modal.Body>
        <AuthVerifyBody
          message={
            <>
              휴대전화번호가 등록되어 있지 않아 SMS 인증이 불가합니다.
              <br />
              마스터 관리자에게 문의해 주세요.
            </>
          }
          info={<AuthInfoRow label="등록된 휴대전화번호" value="등록 정보 없음" empty />}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button size="lg" onClick={onClose}>
          확인
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
