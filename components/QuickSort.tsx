"use client";
import React, { useState, useEffect, useRef } from 'react';

const QuickSortAnimation: React.FC = (props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [array, setArray] = useState<number[]>([]);
  const [isSorting, setIsSorting] = useState<boolean>(false);
  const [isSorted, setIsSorted] = useState<boolean>(false);
  const [isInit, setIsInit] = useState<boolean>(true);
  const [counts, setCounts] = useState({
    compare: 0,
    swap: 0
  });

  const [canvasSize, setCanvasSize] = useState({
    width: window.innerWidth * 0.6,
    height: window.innerHeight * 0.4
  });
  // 响应式画布大小
  useEffect(() => {
    const handleResize = () => {
      setCanvasSize({
        width: window.innerWidth * 0.6,
        height: window.innerHeight * 0.4
      });
      console.log('resize');

    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    generateArray();
  }, []);

  useEffect(() => {
    if (array.length > 0 && isInit) {
      setIsInit(false);
      startSorting();
    }
    // 只在第一次渲染时执行
  }, [array]);

  const generateArray = () => {
    setIsSorted(false);
    const newArray = Array.from({ length: 50 }, () => Math.floor(Math.random() * 100) + 1);
    setArray(newArray);
  };

  const shuffleArray = () => {
    if (!isSorting) {
      const newArray = Array.from({ length: 50 }, () => Math.floor(Math.random() * 100) + 1);
      setArray(newArray);
      animateShuffle(newArray);
      setIsSorted(false);
      setCounts({
        compare: 0,
        swap: 0
      });
    }
  };

  const animateShuffle = async (shuffledArray: number[]) => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        const barWidth = canvasRef.current.width / array.length;
        const barHeightRatio = canvasRef.current.height / Math.max(...array);

        for (let i = 0; i < array.length; i++) {
          ctx.clearRect(i * barWidth, 0, barWidth, canvasRef.current.height);
          ctx.fillStyle = '#6495ed';
          ctx.fillRect(i * barWidth, canvasRef.current.height - shuffledArray[i] * barHeightRatio, barWidth, shuffledArray[i] * barHeightRatio);
          await new Promise(resolve => setTimeout(resolve, 20));
        }
      }
    }
  };

  const quickSort = async (arr: number[], left: number, right: number) => {
    if (left < right) {
      const pivotIndex = await partition(arr, left, right);
      await Promise.all([
        quickSort(arr, left, pivotIndex - 1),
        quickSort(arr, pivotIndex + 1, right)
      ]);
    }
  };

  const partition = async (arr: number[], left: number, right: number) => {
    const pivotValue = arr[right];
    let pivotIndex = left;

    for (let i = left; i < right; i++) {
      setCounts(prev => ({ ...prev, compare: prev.compare + 1 }));
      if (arr[i] < pivotValue) {
        [arr[i], arr[pivotIndex]] = [arr[pivotIndex], arr[i]];
        pivotIndex++;
        setCounts(prev => ({ ...prev, swap: prev.swap + 1 }));
        await animateSwap(arr.slice(), i, pivotIndex);
      }
    }

    [arr[right], arr[pivotIndex]] = [arr[pivotIndex], arr[right]];
    setCounts(prev => ({ ...prev, swap: prev.swap + 1 }));
    await animateSwap(arr.slice(), right, pivotIndex);
    return pivotIndex;
  };

  const animateSwap = async (arr: number[], index1: number, index2: number) => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        const barWidth = canvasRef.current.width / array.length;
        const barHeightRatio = canvasRef.current.height / Math.max(...array);

        for (let i = 0; i < array.length; i++) {
          ctx.fillStyle = i === index1 || i === index2 ? '#ff6347' : '#6495ed';
          ctx.fillRect(i * barWidth, canvasRef.current.height - arr[i] * barHeightRatio, barWidth, arr[i] * barHeightRatio);
        }

        await new Promise(resolve => setTimeout(resolve, 30));
      }
    }
  };

  const startSorting = async () => {
    console.log('start sorting');
    setIsSorting(true);
    await quickSort(array, 0, array.length - 1);
    setIsSorting(false);
    setIsSorted(true);
  };

  return (
    <div className="flex flex-col items-center">
      {/* 水平排列,移动端垂直排列 */}
      <div className="flex items-center gap-2 md:flex-row flex-col">
        <div className="text-lg mt-4">
          {/* 不保留小数 */}
          NlogN：{Math.floor(Math.log2(array.length) * array.length)} {"<="}
        </div>
        <div className="text-lg mt-4">
          比较次数: {counts.compare} + 交换次数: {counts.swap} = {counts.compare + counts.swap}
        </div>
        <div className="text-lg mt-4">
          {"<="} N*N {array.length * array.length}
        </div>
      </div>
      <canvas
        ref={canvasRef}
        className="border border-gray-300 mt-4"
        width={canvasSize.width}
        height={canvasSize.height}
      >
      </canvas>
      <div className="mt-4">
        <button onClick={startSorting} disabled={isSorting || isSorted} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
          开始排序
        </button>
        <button onClick={shuffleArray} disabled={isSorting} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
          打乱
        </button>
      </div>
    </div>
  );
};

export default QuickSortAnimation;
