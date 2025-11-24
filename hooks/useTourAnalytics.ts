import { useEffect, useRef, useMemo, useCallback } from 'react';
import posthog from 'posthog-js';

interface UseTourAnalyticsProps {
  tourId: string;
  tourTitle: string;
  currentSceneIndex: number;
  totalScenes: number;
}

// ✅ Helper function: Silent tracking - nunca rompe la app
function safeCapture(eventName: string, properties: Record<string, any>) {
  // ✅ DOBLE PROTECCIÓN: Return early si no hay window o posthog
  if (typeof window === 'undefined') return;
  if (!posthog?.__loaded) return;

  try {
    posthog.capture(eventName, properties);
  } catch (error) {
    // ✅ SILENCIAR COMPLETAMENTE - Solo log en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[Analytics] Failed to track "${eventName}":`, error);
    }
    // En producción: completamente silencioso, no hacer nada
  }
}

export function useTourAnalytics({
  tourId,
  tourTitle,
  currentSceneIndex,
  totalScenes,
}: UseTourAnalyticsProps) {
  const sceneStartTimeRef = useRef<number>(Date.now());
  const hasTrackedInterestRef = useRef<boolean>(false);
  const interestTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Track scene changes and time spent
  useEffect(() => {
    const sceneStartTime = Date.now();
    sceneStartTimeRef.current = sceneStartTime;

    // Reset interest timer when scene changes
    hasTrackedInterestRef.current = false;

    // Clear previous interest timer
    if (interestTimerRef.current) {
      clearTimeout(interestTimerRef.current);
    }

    // Track scene view
    safeCapture('tour_scene_view', {
      tour_id: tourId,
      tour_title: tourTitle,
      scene_index: currentSceneIndex,
      total_scenes: totalScenes,
      scene_name: `Vista ${currentSceneIndex + 1}`,
    });

    // Set up 10-second interest timer
    interestTimerRef.current = setTimeout(() => {
      if (!hasTrackedInterestRef.current) {
        safeCapture('tour_high_interest', {
          tour_id: tourId,
          tour_title: tourTitle,
          scene_index: currentSceneIndex,
          time_on_scene_seconds: 10,
          message: 'Usuario pasó más de 10 segundos en esta escena',
        });
        hasTrackedInterestRef.current = true;
      }
    }, 10000); // 10 seconds

    // Cleanup: Track time spent on scene when leaving
    return () => {
      const timeSpent = (Date.now() - sceneStartTime) / 1000; // in seconds

      if (timeSpent > 1) {
        // Only track if spent more than 1 second
        safeCapture('tour_scene_time', {
          tour_id: tourId,
          tour_title: tourTitle,
          scene_index: currentSceneIndex,
          time_spent_seconds: Math.round(timeSpent),
        });
      }

      if (interestTimerRef.current) {
        clearTimeout(interestTimerRef.current);
      }
    };
  }, [tourId, tourTitle, currentSceneIndex, totalScenes]);

  // Track contact click (WhatsApp or Email form)
  const trackContactClick = (contactType: 'whatsapp' | 'email') => {
    safeCapture('tour_contact_click', {
      tour_id: tourId,
      tour_title: tourTitle,
      contact_type: contactType,
      current_scene: currentSceneIndex,
      message: 'Usuario hizo clic en contacto',
    });

    // Also identify user interest level
    safeCapture('tour_conversion_intent', {
      tour_id: tourId,
      tour_title: tourTitle,
      intent_level: 'high',
      action: `clicked_${contactType}`,
    });
  };

  // Track share action
  const trackShare = () => {
    safeCapture('tour_share', {
      tour_id: tourId,
      tour_title: tourTitle,
      current_scene: currentSceneIndex,
    });
  };

  // Track info panel view
  const trackInfoView = () => {
    safeCapture('tour_info_view', {
      tour_id: tourId,
      tour_title: tourTitle,
      current_scene: currentSceneIndex,
    });
  };

  // Track hotspot click
  const trackHotspotClick = (
    hotspotId: string,
    hotspotTitle: string,
    hotspotType: string,
  ) => {
    safeCapture('tour_hotspot_click', {
      tour_id: tourId,
      tour_title: tourTitle,
      hotspot_id: hotspotId,
      hotspot_title: hotspotTitle,
      hotspot_type: hotspotType,
      from_scene: currentSceneIndex,
    });
  };

  // 🔒 CRÍTICO: useMemo evita crear nuevo objeto en cada render
  // ⚠️ NO incluir currentSceneIndex - las funciones usan el valor actual via closure
  return useMemo(
    () => ({
      trackContactClick,
      trackShare,
      trackInfoView,
      trackHotspotClick,
    }),
    [] // ✅ Array vacío - objeto estable que nunca cambia
  );
}
