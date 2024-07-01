"use client";
import React, { useRef, useEffect, useState } from 'react';

const FreehandCircleDrawer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [points, setPoints] = useState<number[][]>([]);
  const [highScore, setHighScore] = useState(
    parseFloat(localStorage.getItem("draw_a_pi_high_score") || "9.999999")
  );
  const [scoreTextMetrics, setScoreTextMetrics] = useState<TextMetrics | null>(null);

  const fontFamily = 'MyFont';
  const colors = ['#048ABF', '#BF4215', '#F2B138', '#048ABF', '#455473'];
  const canvasWidth = 800;
  const canvasHeight = 600;
  const canvasSize = Math.min(canvasWidth, canvasHeight * 0.75);

  const titleText = 'π Day Challenge - Draw a Circle Freehand';
  const titleFontSize = canvasSize * 0.04;
  const titleMarginTop = canvasSize * 0.04;
  const titleColor = colors[0];

  const highScoreText = 'High Score: π = $score$';
  const highScoreFontSize = canvasSize * 0.08;
  const highScoreMarginTop = canvasSize * 0.02;
  const highScoreColor = colors[4];
  const highScoreNumberColor = colors[1];
  const highScoreNumberPos = 11;

  const scoreText = 'Based on This Circle π = $score$';
  const invalidText = 'You Call That a Circle? Try Again!';
  const scoreFontSize = canvasSize * 0.05;
  const scoreMarginTopBottom = canvasSize * 0.03;
  const scorePaddingLeftRight = canvasSize * 0.03;
  const scorePaddingTopBottom = canvasSize * 0.02;
  const scoreColor = colors[4];
  const scoreNumberColor = colors[1];
  const scoreNumberPos = 20;
  const scoreBgColor = '#f0f0f0';

  const grade = [[3.15, 'S+'], [3.16, 'S'], [3.17, 'A+'], [3.18, 'A'], [3.2, 'B+'], [3.3, 'B'], [3.4, 'C'], [4, 'D'], [Infinity, 'D-']];
  const gradeText = '$grade$';
  const gradeFontSizeRatio = 0.65;
  const gradeColor = colors[3];

  const newRecordText = 'New High Score!';
  const newRecordFontSize = canvasSize * 0.05;
  const newRecordColor = colors[2];
  const newRecordBgColor = colors[2];

  const lineColor = colors[4];
  const lineWidth = canvasSize * 0.008;

  const fontHeight = 1.2;

  const pixelSize = Math.min(canvasWidth, canvasHeight) / 120;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      if (context) {
        document.fonts.load('20px MyFont').then(() => {
          getScoreTextMetrics(context);
          drawTitleText(context);
          drawHighScoreText(context);
        });
      }
    }
  }, [canvasRef.current]);

  const dist = (p1: number[], p2: number[]) => {
    return Math.sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2);
  };

  const cross = (v1: number[], v2: number[]) => {
    return v1[0] * v2[1] - v1[1] * v2[0];
  };

  const calculateScore = () => {
    if (points.length < 3) return Infinity;

    let circumference = 0;
    let area = 0;
    let areaAbs = 0;
    const firstPoint = points[0];
    const lastPoint = points[points.length - 1];
    const pointTot = points.length;

    for (let i = 0; i < pointTot - 1; i++) {
      circumference += dist(points[i], points[i + 1]);
    }
    circumference += dist(points[0], lastPoint);

    if (dist(firstPoint, lastPoint) / circumference > 0.15) {
      return Infinity;
    }

    for (let i = 1; i < pointTot - 1; i++) {
      const v1 = [points[i][0] - points[0][0], points[i][1] - points[0][1]];
      const v2 = [points[i + 1][0] - points[0][0], points[i + 1][1] - points[0][1]];
      area += cross(v1, v2) / 2;
      areaAbs += Math.abs(cross(v1, v2) / 2);
    }

    area = Math.abs(area);
    if (area / areaAbs < 0.85) {
      return Infinity;
    }

    return circumference * circumference / area / 4;
  };

  const calculateCenter = () => {
    const xCoordinates = points.map(point => point[0]);
    const yCoordinates = points.map(point => point[1]);

    const minX = Math.min(...xCoordinates);
    const maxX = Math.max(...xCoordinates);
    const minY = Math.min(...yCoordinates);
    const maxY = Math.max(...yCoordinates);

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    return [centerX, centerY];
  };

  const calculateDiameter = () => {
    const xCoordinates = points.map(point => point[0]);
    const minX = Math.min(...xCoordinates);
    const maxX = Math.max(...xCoordinates);

    const yCoordinates = points.map(point => point[1]);
    const minY = Math.min(...yCoordinates);
    const maxY = Math.max(...yCoordinates);
    return Math.max(maxX - minX, maxY - minY);
  };

  const drawTitleText = (context: CanvasRenderingContext2D) => {
    context.font = `${titleFontSize}px ${fontFamily}`;
    context.textAlign = 'center';
    context.textBaseline = 'top';
    context.fillStyle = titleColor;
    context.fillText(titleText, canvasWidth / 2, titleMarginTop);
  };

  const drawHighScoreText = (context: CanvasRenderingContext2D) => {
    const text = highScoreText.replace('$score$', highScore.toString());
    context.font = `${highScoreFontSize}px ${fontFamily}`;
    const textWidth = context.measureText(text).width;

    context.textAlign = 'left';
    context.textBaseline = 'top';
    context.fillStyle = highScoreColor;
    let x = canvasWidth / 2 - textWidth / 2;
    // eslint-disable-next-line prefer-const
    let y = titleMarginTop + titleFontSize * fontHeight + highScoreMarginTop;
    context.fillText(text.substring(0, highScoreNumberPos), x, y);

    context.textAlign = 'right';
    context.textBaseline = 'top';
    context.fillStyle = highScoreNumberColor;
    x = canvasWidth / 2 + textWidth / 2;
    context.fillText(text.slice(highScoreNumberPos), x, y);
  };

  const drawScoreText = (context: CanvasRenderingContext2D, scoreStr: string, centerPos: number[], d: number) => {
    context.font = `${scoreFontSize}px ${fontFamily}`;
    const text = scoreStr === 'invalid' ? invalidText : scoreText.replace('$score$', scoreStr);
    const textWidth = context.measureText(text).width;

    context.textAlign = scoreStr === 'invalid' ? 'center' : 'left';
    context.textBaseline = 'middle';
    context.fillStyle = scoreColor;
    let x = centerPos[0];
    x = Math.min(Math.max(x, textWidth / 2), canvasWidth - textWidth / 2);

    let y = centerPos[1] + d * gradeFontSizeRatio * fontHeight / 2 + scoreMarginTopBottom + scoreFontSize * fontHeight / 2 + scorePaddingTopBottom;
    y = Math.min(y, canvasHeight - scoreMarginTopBottom - scoreFontSize * fontHeight / 2 - scorePaddingTopBottom);
    context.fillText(text, x, y);
  };

  const drawScoreBg = (context: CanvasRenderingContext2D, centerPos: number[], d: number) => {
    const textWidth = scoreTextMetrics?.width || 0;
    let x = centerPos[0];
    x = Math.min(Math.max(x, textWidth / 2 + scorePaddingLeftRight), canvasWidth - textWidth / 2 - scorePaddingLeftRight);
    x -= textWidth / 2 + scorePaddingLeftRight;

    let y = centerPos[1] + d * gradeFontSizeRatio * fontHeight / 2 + scoreMarginTopBottom + scoreFontSize * fontHeight / 2;
    y = Math.min(y, canvasHeight - scoreMarginTopBottom - scoreFontSize * fontHeight / 2 - scorePaddingTopBottom);
    y -= scoreFontSize * fontHeight / 2 + scorePaddingTopBottom;

    const w = textWidth + scorePaddingLeftRight * 2;
    const h = scoreFontSize * fontHeight + scorePaddingTopBottom * 2;

    context.fillStyle = scoreBgColor;
    context.fillRect(x, y, w, h);
  };

  const drawGradeText = (context: CanvasRenderingContext2D, gradeStr: string, centerPos: number[], d: number) => {
    context.font = `${scoreFontSize * gradeFontSizeRatio}px ${fontFamily}`;
    const text = gradeText.replace('$grade$', gradeStr);
    const textWidth = context.measureText(text).width;

    context.textAlign = 'left';
    context.textBaseline = 'middle';
    context.fillStyle = gradeColor;

    let x = centerPos[0];
    x = Math.min(Math.max(x, textWidth / 2), canvasWidth - textWidth / 2);
    x -= textWidth / 2;

    let y = centerPos[1] - d * gradeFontSizeRatio * fontHeight / 2 - scoreMarginTopBottom - scoreFontSize * gradeFontSizeRatio * fontHeight / 2 - scorePaddingTopBottom;
    y = Math.max(y, scoreMarginTopBottom + scoreFontSize * gradeFontSizeRatio * fontHeight / 2 + scorePaddingTopBottom);
    y += scoreFontSize * gradeFontSizeRatio * fontHeight / 2;

    context.fillText(text, x, y);
  };

  const drawNewRecordText = (context: CanvasRenderingContext2D, centerPos: number[], d: number) => {
    context.font = `${newRecordFontSize}px ${fontFamily}`;
    const textWidth = context.measureText(newRecordText).width;

    context.textAlign = 'left';
    context.textBaseline = 'middle';
    context.fillStyle = newRecordColor;

    let x = centerPos[0];
    x = Math.min(Math.max(x, textWidth / 2), canvasWidth - textWidth / 2);
    x -= textWidth / 2;

    let y = centerPos[1] + d * gradeFontSizeRatio * fontHeight / 2 + scoreMarginTopBottom + scoreFontSize * fontHeight / 2 + scorePaddingTopBottom;
    y = Math.min(y, canvasHeight - scoreMarginTopBottom - scoreFontSize * fontHeight / 2 - scorePaddingTopBottom);
    y += scoreFontSize * fontHeight * fontHeight + scorePaddingTopBottom * 2;

    context.fillText(newRecordText, x, y);
  };

  const drawNewRecordBg = (context: CanvasRenderingContext2D, centerPos: number[], d: number) => {
    const textWidth = context.measureText(newRecordText).width;
    let x = centerPos[0];
    x = Math.min(Math.max(x, textWidth / 2), canvasWidth - textWidth / 2);
    x -= textWidth / 2;

    let y = centerPos[1] + d * gradeFontSizeRatio * fontHeight / 2 + scoreMarginTopBottom + scoreFontSize * fontHeight / 2 + scorePaddingTopBottom;
    y = Math.min(y, canvasHeight - scoreMarginTopBottom - scoreFontSize * fontHeight / 2 - scorePaddingTopBottom);
    y += scoreFontSize * fontHeight + scorePaddingTopBottom * 2;

    const w = textWidth;
    const h = scoreFontSize * fontHeight;

    context.fillStyle = newRecordBgColor;
    context.fillRect(x, y, w, h);
  };

  const drawCircle = (context: CanvasRenderingContext2D) => {
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    drawTitleText(context);
    drawHighScoreText(context);

    if (points.length === 0) return;

    context.strokeStyle = lineColor;
    context.lineWidth = lineWidth;
    context.beginPath();
    context.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) {
      context.lineTo(points[i][0], points[i][1]);
    }
    context.closePath();
    context.stroke();

    const score = calculateScore();
    const scoreStr = score === Infinity ? 'invalid' : score.toFixed(6);
    const centerPos = calculateCenter();
    const d = calculateDiameter();
    const gradeStr = grade.find(([maxValue, _]) => score <= Number(maxValue))?.[1] || 'D-';

    drawScoreBg(context, centerPos, d);
    drawScoreText(context, scoreStr, centerPos, d);
    drawGradeText(context, String(gradeStr), centerPos, d);

    if (score < highScore) {
      localStorage.setItem("draw_a_pi_high_score", scoreStr);
      setHighScore(score);
      drawNewRecordBg(context, centerPos, d);
      drawNewRecordText(context, centerPos, d);
    }
  };

  const getScoreTextMetrics = (context: CanvasRenderingContext2D) => {
    const text = scoreText.replace('$score$', '3.141592');
    context.font = `${scoreFontSize}px ${fontFamily}`;
    setScoreTextMetrics(context.measureText(text));
  };

  const handleMouseDown = () => {
    setIsDrawing(true);
    setPoints([]);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      setPoints(prevPoints => [...prevPoints, [x, y]]);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      if (context) drawCircle(context);
    }
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        // 黑色模式下，边框颜色为白色
        style={{ 
          border: '1px solid #aaa',
          display: 'block', 
          margin: 'auto' }}
           
      />
    </div>
  );
};

export default FreehandCircleDrawer;
