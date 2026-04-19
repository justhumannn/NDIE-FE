'use client'

import React, { useState, useEffect } from 'react';
import Listbox from '../layout/Listbox';

type ListProps = {
  name: string;
  data: string;
};

export function List({ name, data }: ListProps) {
  const [item, setitem] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { collection, getDocs } = await import("firebase/firestore");
        const { getFirebaseDb } = await import("@/lib/firebase");

        const db = await getFirebaseDb();
        if (!db) return;

        const querySnapshot = await getDocs(collection(db, data));
        const items = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // 날짜순(최신순) 정렬
        items.sort((a: any, b: any) => {
          const dateA = new Date(a.createdAt || 0).getTime();
          const dateB = new Date(b.createdAt || 0).getTime();
          return dateB - dateA;
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setitem(items as any);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [data]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pt-16 pb-12 md:gap-12 md:pb-24">
      <div className="flex flex-col items-center gap-4">
        <p className="text-3xl font-black md:text-5xl text-gray-900">{name}</p>
        <div className="w-12 h-1.5 bg-[#ED9735] rounded-full" />
      </div>
      <div className="w-full">
        <Listbox item={item} datas={data} name={name} />
      </div>
    </div>
  );
}
