import { getFirebaseDb, getFirebaseStorage, getFirebaseAuth } from "@/lib/firebase";

export const CreateActivity = async (data: { title: string, content: string, image: string }) => {

  try {
    // Firestore 연결 확인
    const db = await getFirebaseDb();
    if (!db) {
      console.error('[CreateActivity] Firestore 초기화 안됨');
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

    const docData = {
      ...data,
      uid: currentUser.uid,
      createdAt: new Date().toISOString()
    };

    const { collection, addDoc } = await import("firebase/firestore");
    const docRef = await addDoc(collection(db, "activity"), docData);
    
    return { status: 200 as const };
  } catch (e) {
    console.error('[CreateActivity] 오류:', e);

    let message = '활동 작성에 실패했습니다.';
    if (e instanceof Error) {
      message = e.message;

      if ('code' in e) {
        const firebaseError = e as { code: string };
        switch (firebaseError.code) {
          case 'permission-denied':
            message = '권한이 없습니다. 관리자 권한을 확인해주세요.';
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

export const uploadImg = async (data: FormData) => {

  try {
    // Storage 연결 확인
    const storage = await getFirebaseStorage();
    if (!storage) {
      console.error('[uploadImg] Storage 초기화 안됨');
      return {
        url: null,
        message: 'Firebase Storage가 초기화되지 않았습니다. 페이지를 새로고침해주세요.'
      };
    }

    const file = data.get('file') as File;
    if (!file) {
      throw new Error("파일이 선택되지 않았습니다.");
    }

    const { ref, uploadBytes, getDownloadURL } = await import("firebase/storage");
    const storageRef = ref(storage, `uploads/${Date.now()}_${file.name}`);

    // 타임아웃 60초
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => {
        reject(new Error("이미지 업로드 시간이 초과되었습니다."));
      }, 60000)
    );

    const uploadPromise = uploadBytes(storageRef, file)
      .then((snapshot) => {
        return getDownloadURL(snapshot.ref);
      })
      .then((downloadURL) => {
        return downloadURL;
      });

    const downloadURL = await Promise.race([uploadPromise, timeoutPromise]);

    return { url: downloadURL };
  } catch (e) {
    console.error('[uploadImg] 오류:', e);

    let message = '이미지 업로드에 실패했습니다.';
    if (e instanceof Error) {
      message = e.message;

      if ('code' in e) {
        const firebaseError = e as { code: string };
        switch (firebaseError.code) {
          case 'storage/unauthorized':
            message = '이미지 업로드 권한이 없습니다.';
            break;
          case 'storage/canceled':
            message = '이미지 업로드가 취소되었습니다.';
            break;
          case 'storage/unknown':
            message = '알 수 없는 오류가 발생했습니다.';
            break;
        }
      }
    }

    return { url: null, message };
  }
};
