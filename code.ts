/// <reference types="@figma/plugin-typings" />

figma.showUI(__html__, { width: 300, height: 200 });

interface RGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}

function generateTint(color: RGBA, percentage: number): RGBA {
  return {
    r: Math.min(1, color.r + (1 - color.r) * (percentage / 100)),
    g: Math.min(1, color.g + (1 - color.g) * (percentage / 100)),
    b: Math.min(1, color.b + (1 - color.b) * (percentage / 100)),
    a: color.a
  };
}

function generateShade(color: RGBA, percentage: number): RGBA {
  return {
    r: Math.max(0, color.r * (1 - percentage / 100)),
    g: Math.max(0, color.g * (1 - percentage / 100)),
    b: Math.max(0, color.b * (1 - percentage / 100)),
    a: color.a
  };
}

figma.ui.onmessage = (msg: { type: string; percentage: number }) => {
  if (msg.type === 'generate-colors') {
    const percentage = msg.percentage;
    const selectedNodes = figma.currentPage.selection;

    if (selectedNodes.length === 0) {
      figma.notify('Please select a layer with a fill color.');
      return;
    }

    selectedNodes.forEach((node) => {
      if ('fills' in node && Array.isArray(node.fills) && node.fills.length > 0) {
        const fills = node.fills as Paint[];
        if (fills[0].type === 'SOLID') {
          const originalColor = fills[0].color;
          const tint = generateTint(originalColor, percentage);
          const shade = generateShade(originalColor, percentage);

          const tintRect = figma.createRectangle();
          const shadeRect = figma.createRectangle();

          tintRect.resize(100, 100);
          shadeRect.resize(100, 100);

          tintRect.x = node.x + (node.width as number) + 20;
          tintRect.y = node.y;
          shadeRect.x = node.x + (node.width as number) + 20;
          shadeRect.y = node.y + 120;

          tintRect.fills = [{ type: 'SOLID', color: tint }];
          shadeRect.fills = [{ type: 'SOLID', color: shade }];

          figma.currentPage.appendChild(tintRect);
          figma.currentPage.appendChild(shadeRect);

          const tintLabel = figma.createText();
          const shadeLabel = figma.createText();

          tintLabel.characters = `Tint ${percentage}%`;
          shadeLabel.characters = `Shade ${percentage}%`;

          tintLabel.x = tintRect.x;
          tintLabel.y = tintRect.y + tintRect.height + 10;
          shadeLabel.x = shadeRect.x;
          shadeLabel.y = shadeRect.y + shadeRect.height + 10;

          figma.currentPage.appendChild(tintLabel);
          figma.currentPage.appendChild(shadeLabel);
        }
      }
    });

    figma.notify('Tints and shades generated!');
  }
};