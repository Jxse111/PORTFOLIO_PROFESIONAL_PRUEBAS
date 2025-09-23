"use client";

import { useEffect, useState, useMemo } from "react";
import { Row, Text } from "@once-ui-system/core";
import { ReadingProgressProps, ReadingState } from "@/types/blog-utils.types";

export function ReadingProgress({
  content,
  className,
  showTimeRemaining = true,
  wordsPerMinute = 200
}: ReadingProgressProps) {
  const [readingState, setReadingState] = useState<ReadingState>({
    progress: 0,
    timeElapsed: 0,
    timeRemaining: 0,
    totalTime: 0
  });

  // Calcular estadísticas de lectura
  const readingStats = useMemo(() => {
    const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
    const totalTime = Math.ceil(wordCount / wordsPerMinute); // minutos
    const timeRemaining = Math.max(0, totalTime - readingState.timeElapsed);

    return {
      wordCount,
      totalTime,
      timeRemaining
    };
  }, [content, wordsPerMinute, readingState.timeElapsed]);

  // Actualizar progreso de lectura
  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;

      // Calcular tiempo transcurrido basado en el progreso
      const timeElapsed = Math.round((scrollPercent / 100) * readingStats.totalTime);

      setReadingState({
        progress: Math.min(100, Math.max(0, scrollPercent)),
        timeElapsed,
        timeRemaining: Math.max(0, readingStats.totalTime - timeElapsed),
        totalTime: readingStats.totalTime
      });
    };

    // Actualizar inmediatamente
    updateProgress();

    // Configurar event listener para scroll
    window.addEventListener('scroll', updateProgress, { passive: true });

    // Cleanup
    return () => window.removeEventListener('scroll', updateProgress);
  }, [readingStats.totalTime]);

  // No mostrar si no hay contenido o el progreso es 0
  if (!content || readingState.totalTime === 0 || readingState.progress === 0) {
    return null;
  }

  return (
    <div
      className={className}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 999,
        backgroundColor: 'var(--color-background-alpha-95)',
        borderBottom: '1px solid var(--color-neutral-alpha-weak)',
        padding: 'var(--spacing-4) var(--spacing-16)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <Row fillWidth align="center" gap="16">
        {/* Barra de progreso */}
        <div style={{ flex: 1, maxWidth: '400px' }}>
          <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--color-neutral-alpha-weak)', borderRadius: '2px' }}>
            <div style={{
              width: `${readingState.progress}%`,
              height: '100%',
              backgroundColor: 'var(--color-primary)',
              borderRadius: '2px',
              transition: 'width 0.2s ease'
            }} />
          </div>
        </div>

        {/* Información de lectura */}
        <Row gap="12" align="center">
          <Text variant="body-default-xs" onBackground="neutral-weak">
            {Math.round(readingState.progress)}% completado
          </Text>

          {showTimeRemaining && readingState.totalTime > 1 && (
            <>
              <div
                style={{
                  width: '1px',
                  height: '12px',
                  backgroundColor: 'var(--color-neutral-alpha-medium)'
                }}
              />

              <Text variant="body-default-xs" onBackground="neutral-weak">
                {readingStats.timeRemaining > 0
                  ? `${readingStats.timeRemaining} min restantes`
                  : '¡Completado!'
                }
              </Text>

              <Text variant="body-default-xs" onBackground="neutral-weak">
                ~{readingStats.totalTime} min total
              </Text>
            </>
          )}

          <Text variant="body-default-xs" onBackground="neutral-weak">
            ~{readingStats.wordCount.toLocaleString('es')} palabras
          </Text>
        </Row>
      </Row>
    </div>
  );
}

export default ReadingProgress;
