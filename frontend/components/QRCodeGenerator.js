'use client';

import { QRCodeSVG } from 'qrcode.react';

export default function QRCodeGenerator({ value, size = 128, className = '' }) {
  return (
    <div className={`inline-block ${className}`}>
      <QRCodeSVG
        value={value}
        size={size}
        bgColor="#ffffff"
        fgColor="#000000"
        level="M"
        includeMargin={true}
      />
    </div>
  );
}