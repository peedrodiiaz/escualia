"use client";

import { useEffect, useRef } from "react";

interface UseRevealOptions {
  /** Fracción del elemento visible antes de disparar (0–1). Default: 0.12 */
  threshold?: number;
  /** Clase a añadir cuando el elemento entra en viewport. Default: "visible" */
  visibleClass?: string;
  /** Si true, la animación solo ocurre una vez (no se revierte al salir). Default: true */
  once?: boolean;
  /** Retraso adicional en ms antes de añadir la clase. Default: 0 */
  delay?: number;
}

/**
 * Hook que observa un contenedor y añade la clase `visible` a todos sus
 * descendientes con las clases `.reveal`, `.reveal-fade`, `.reveal-scale`
 * o `.stagger-item` cuando entran en el viewport.
 *
 * Uso básico:
 *   const ref = useReveal();
 *   <section ref={ref}>
 *     <h2 className="reveal">Título</h2>
 *     <p className="reveal">Párrafo</p>
 *   </section>
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  options: UseRevealOptions = {}
) {
  const { threshold = 0.12, visibleClass = "visible", once = true, delay = 0 } =
    options;
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respeta prefers-reduced-motion: marca todo visible de inmediato
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      el.querySelectorAll<HTMLElement>(
        ".reveal, .reveal-fade, .reveal-scale, .stagger-item"
      ).forEach((child) => child.classList.add(visibleClass));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const run = () => {
              el.querySelectorAll<HTMLElement>(
                ".reveal, .reveal-fade, .reveal-scale, .stagger-item"
              ).forEach((child) => child.classList.add(visibleClass));
            };
            if (delay > 0) {
              setTimeout(run, delay);
            } else {
              run();
            }
            if (once) observer.disconnect();
          } else if (!once) {
            el.querySelectorAll<HTMLElement>(
              ".reveal, .reveal-fade, .reveal-scale, .stagger-item"
            ).forEach((child) => child.classList.remove(visibleClass));
          }
        });
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, visibleClass, once, delay]);

  return ref;
}

/**
 * Versión simplificada para un único elemento (no un contenedor).
 * Devuelve [ref, isVisible].
 */
export function useRevealElement<T extends HTMLElement = HTMLDivElement>(
  options: UseRevealOptions = {}
) {
  const { threshold = 0.12, once = true } = options;
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      el.classList.add("visible");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add("visible");
            if (once) observer.disconnect();
          } else if (!once) {
            el.classList.remove("visible");
          }
        });
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  return ref;
}
