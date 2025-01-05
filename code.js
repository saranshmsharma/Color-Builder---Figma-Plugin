"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
figma.showUI(__html__, { width: 300, height: 200 });
function generateTint(color, percentage) {
    return {
        r: color.r + (1 - color.r) * (percentage / 100),
        g: color.g + (1 - color.g) * (percentage / 100),
        b: color.b + (1 - color.b) * (percentage / 100),
        a: color.a
    };
}
function generateShade(color, percentage) {
    return {
        r: color.r * (1 - percentage / 100),
        g: color.g * (1 - percentage / 100),
        b: color.b * (1 - percentage / 100),
        a: color.a
    };
}
figma.ui.onmessage = (msg) => __awaiter(void 0, void 0, void 0, function* () {
    if (msg.type === 'generate-colors') {
        const percentage = msg.percentage;
        const selectedNodes = figma.currentPage.selection;
        if (selectedNodes.length === 0) {
            figma.notify('Please select a layer with a fill color.');
            return;
        }
        for (const node of selectedNodes) {
            if ('fills' in node && Array.isArray(node.fills) && node.fills.length > 0) {
                const fills = node.fills;
                if (fills[0].type === 'SOLID') {
                    const originalColor = fills[0].color;
                    const tint = generateTint(originalColor, percentage);
                    const shade = generateShade(originalColor, percentage);
                    // Create new rectangles for tint and shade
                    const tintRect = figma.createRectangle();
                    const shadeRect = figma.createRectangle();
                    tintRect.resize(100, 100);
                    shadeRect.resize(100, 100);
                    tintRect.x = node.x + node.width + 20;
                    tintRect.y = node.y;
                    shadeRect.x = node.x + node.width + 20;
                    shadeRect.y = node.y + 120;
                    tintRect.fills = [{ type: 'SOLID', color: tint }];
                    shadeRect.fills = [{ type: 'SOLID', color: shade }];
                    figma.currentPage.appendChild(tintRect);
                    figma.currentPage.appendChild(shadeRect);
                    // Create text labels
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
        }
        figma.notify('Tints and shades generated!');
    }
});
