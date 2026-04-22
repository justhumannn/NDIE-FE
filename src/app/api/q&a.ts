import { getFirebaseDb, getFirebaseAuth } from "@/lib/firebase";

export const CreateQA = async (data: { title: string, content: string, username: string }) => {

  try {
    // Firestore 연결 확인
    const db = await getFirebaseDb();
    if (!db) {
      console.error('[CreateQA] Firestore 초기화 안됨');
      return {
        status: 500 as const,
        message: 'Firebase가 초기화되지 않았습니다. 페이지를 새로고침해주세요.'
      };
    }

    const auth = await getFirebaseAuth();
    const currentUser = auth?.currentUser;
    
    if (!currentUser) {
      return {
        status: 401 as const,
        message: '로그인이 필요합니다. 다시 로그인해주세요.'
      };
    }

    // uid도 함께 저장
    const docData = {
      ...data,
      uid: currentUser.uid,
      createdAt: new Date().toISOString(),
      views: 0
    };

    const { collection, addDoc } = await import("firebase/firestore");
    const docRef = await addDoc(collection(db, "QNA"), docData);
    
    return { status: 200 as const };
  } catch (e) {
    console.error('[CreateQA] 오류:', e);

    // 상세한 에러 메시지
    let message = 'Q&A 작성에 실패했습니다.';
    if (e instanceof Error) {
      message = e.message;

      // Firebase 에러 코드별 메시지
      if ('code' in e) {
        const firebaseError = e as { code: string };
        switch (firebaseError.code) {
          case 'permission-denied':
            message = '권한이 없습니다. 로그인 상태를 확인해주세요.';
            break;
          case 'unavailable':
            message = 'Firebase 서버에 연결할 수 없습니다. 인터넷 연결을 확인해주세요.';
            break;
          case 'unauthenticated':
            message = '인증되지 않았습니다. 다시 로그인해주세요.';
            break;
        }
      }
    }

    return { status: 500 as const, message };
  }
};
