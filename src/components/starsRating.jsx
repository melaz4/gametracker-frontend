import React, { useState, useMemo } from "react";

/**
 * Props:
 *  - value: number (0..5) (float)
 *  - editable: boolean
 *  - size: number (px)
 *  - onChange: function(newValue)
 *  - color: string (hex)
 */
export default function StarsRating({
  value = 0,
  editable = false,
  size = 20,
  onChange,
  color = "#ffb400"
}) {
  const [hoverIndex, setHoverIndex] = useState(null);
  const rounded = Math.round((value + Number.EPSILON) * 10) / 10;

  const stars = useMemo(() => {
    // build array of 5 objects with fill amount 0..1 (support half)
    const arr = [];
    for (let i = 0; i < 5; i++) {
      const diff = rounded - i;
      arr.push(Math.max(0, Math.min(1, diff)));
    }
    return arr;
  }, [rounded]);

  function handleClick(i) {
    if (!editable) return;
    const newVal = i + 1;
    if (onChange) onChange(newVal);
  }

  function handleKey(e, i) {
    if (!editable) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault(); handleClick(i);
    }
  }

  return (
    <div
      role={editable ? "slider" : undefined}
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={5}
      style={{ display: "inline-flex", gap: 6, alignItems: "center", userSelect: "none" }}
    >
      {stars.map((fill, i) => {
        const isHover = hoverIndex !== null && hoverIndex >= i;
        const displayFill = isHover ? (hoverIndex - i >= 1 ? 1 : 0.5) : fill;
        // choose star variant based on displayFill
        return (
          <span
            key={i}
            tabIndex={editable ? 0 : -1}
            onKeyDown={(e) => handleKey(e, i)}
            onMouseEnter={() => editable && setHoverIndex(i)}
            onMouseLeave={() => editable && setHoverIndex(null)}
            onClick={() => handleClick(i)}
            style={{
              cursor: editable ? "pointer" : "default",
              width: size,
              height: size,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-label={`Estrella ${i + 1}`}
            title={`${i + 1} estrellas`}
          >
            <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
              <defs>
                <linearGradient id={`grad-${i}`} x1="0" x2="1">
                  <stop offset={`${displayFill * 100}%`} stopColor={color} />
                  <stop offset={`${displayFill * 100}%`} stopColor="#ffffff22" />
                </linearGradient>
              </defs>
              <path
                fill={`url(#grad-${i})`}
                d="M12 .587l3.668 7.431L23.4 9.75l-5.7 5.555L19.335 24 12 19.897 4.665 24 6.3 15.305 0.6 9.75l7.732-1.732z"
              />
            </svg>
          </span>
        );
      })}
      <span style={{ marginLeft: 6, color: "#bfc7d1", fontSize: 13 }}>
        {value ? Number(value).toFixed(1) : "—"}
      </span>
    </div>
  );
}
